import * as THREE from 'three';
import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4Target } from 'mp4-muxer';
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmTarget } from 'webm-muxer';
import type { StoryboardProject, ExportSettings } from '../storyboard/types';

import { MinecraftRig } from '../engine/MinecraftRig';
import { AnimationLibrary } from '../engine/AnimationLibrary';
import { VoxelWorld } from '../engine/VoxelWorld';
import { CameraDirector } from '../engine/CameraDirector';
import { ParticleSystem } from '../engine/ParticleSystem';

export class VideoExporter {
  public static async exportVideo(
    project: StoryboardProject,
    settings: ExportSettings,
    onProgress: (percent: number, frame: number, totalFrames: number) => void
  ): Promise<Blob> {
    const [widthStr, heightStr] = settings.resolution.split('x');
    const width = parseInt(widthStr, 10);
    const height = parseInt(heightStr, 10);
    const fps = settings.fps;

    // Calculate total duration across all scenes
    const totalDuration = project.scenes.reduce((sum, s) => sum + s.duration, 0);
    const totalFrames = Math.max(1, Math.ceil(totalDuration * fps));

    // Create offscreen canvas for rendering
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // 2D Overlay canvas for captions
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = width;
    overlayCanvas.height = height;
    const overlayCtx = overlayCanvas.getContext('2d')!;

    // Composite canvas for final frame
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = width;
    finalCanvas.height = height;
    const finalCtx = finalCanvas.getContext('2d')!;

    // Set up dedicated export Three.js scene & renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x78abf5); // Minecraft Sky

    const world = new VoxelWorld();
    scene.add(world.group);

    const particles = new ParticleSystem();
    scene.add(particles.group);

    const cameraDirector = new CameraDirector(width / height);

    // Actor rig instances pool
    const rigs = new Map<string, MinecraftRig>();
    // Pre-create rigs for all actors in the project
    for (const sc of project.scenes) {
      for (const actor of sc.actors) {
        if (!rigs.has(actor.id)) {
          const rig = new MinecraftRig(actor.type);
          if (actor.customSkinUrl) {
            await rig.setCustomSkin(actor.customSkinUrl);
          }
          scene.add(rig.group);
          rigs.set(actor.id, rig);
        }
      }
    }

    // Check if WebCodecs VideoEncoder is supported
    const hasWebCodecs = typeof window.VideoEncoder !== 'undefined';

    if (hasWebCodecs && settings.format === 'mp4') {
      return this.exportWithMp4Muxer(
        project,
        settings,
        width,
        height,
        fps,
        totalFrames,
        totalDuration,
        renderer,
        scene,
        cameraDirector,
        world,
        particles,
        rigs,
        canvas,
        overlayCanvas,
        overlayCtx,
        finalCanvas,
        finalCtx,
        onProgress
      );
    } else if (hasWebCodecs && settings.format === 'webm') {
      return this.exportWithWebmMuxer(
        project,
        settings,
        width,
        height,
        fps,
        totalFrames,
        totalDuration,
        renderer,
        scene,
        cameraDirector,
        world,
        particles,
        rigs,
        canvas,
        overlayCanvas,
        overlayCtx,
        finalCanvas,
        finalCtx,
        onProgress
      );
    } else {
      // MediaRecorder fallback
      return this.exportWithMediaRecorder(
        project,
        settings,
        width,
        height,
        fps,
        totalFrames,
        totalDuration,
        renderer,
        scene,
        cameraDirector,
        world,
        particles,
        rigs,
        canvas,
        overlayCanvas,
        overlayCtx,
        finalCanvas,
        finalCtx,
        onProgress
      );
    }
  }

  private static async exportWithMp4Muxer(
    project: StoryboardProject,
    settings: ExportSettings,
    width: number,
    height: number,
    fps: number,
    totalFrames: number,
    totalDuration: number,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    cameraDirector: CameraDirector,
    world: VoxelWorld,
    particles: ParticleSystem,
    rigs: Map<string, MinecraftRig>,
    canvas: HTMLCanvasElement,
    overlayCanvas: HTMLCanvasElement,
    overlayCtx: CanvasRenderingContext2D,
    finalCanvas: HTMLCanvasElement,
    finalCtx: CanvasRenderingContext2D,
    onProgress: (percent: number, frame: number, totalFrames: number) => void
  ): Promise<Blob> {
    const muxerTarget = new Mp4Target();
    const muxer = new Mp4Muxer({
      target: muxerTarget,
      video: {
        codec: 'avc',
        width,
        height,
      },
      fastStart: 'in-memory',
    });

    const videoEncoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (e) => console.error('VideoEncoder error:', e),
    });

    // Configure H.264
    videoEncoder.configure({
      codec: 'avc1.64002a', // High profile Level 4.2
      width,
      height,
      bitrate: width >= 1080 ? 12_000_000 : 6_000_000,
    });

    // Render frame by frame
    for (let frame = 0; frame < totalFrames; frame++) {
      const time = frame / fps;
      this.renderFrameAtTime(
        project,
        time,
        renderer,
        scene,
        cameraDirector,
        world,
        particles,
        rigs,
        width,
        height,
        overlayCanvas,
        overlayCtx,
        finalCanvas,
        finalCtx,
        canvas,
        settings.includeCaptions
      );

      const timestampMicros = Math.round((frame / fps) * 1_000_000);
      const videoFrame = new VideoFrame(finalCanvas, {
        timestamp: timestampMicros,
        duration: Math.round((1 / fps) * 1_000_000),
      });

      videoEncoder.encode(videoFrame, { keyFrame: frame % (fps * 2) === 0 });
      videoFrame.close();

      onProgress(Math.round(((frame + 1) / totalFrames) * 100), frame + 1, totalFrames);

      // Yield event loop every 5 frames so UI stays responsive
      if (frame % 5 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    await videoEncoder.flush();
    muxer.finalize();
    renderer.dispose();

    return new Blob([muxerTarget.buffer], { type: 'video/mp4' });
  }

  private static async exportWithWebmMuxer(
    project: StoryboardProject,
    settings: ExportSettings,
    width: number,
    height: number,
    fps: number,
    totalFrames: number,
    totalDuration: number,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    cameraDirector: CameraDirector,
    world: VoxelWorld,
    particles: ParticleSystem,
    rigs: Map<string, MinecraftRig>,
    canvas: HTMLCanvasElement,
    overlayCanvas: HTMLCanvasElement,
    overlayCtx: CanvasRenderingContext2D,
    finalCanvas: HTMLCanvasElement,
    finalCtx: CanvasRenderingContext2D,
    onProgress: (percent: number, frame: number, totalFrames: number) => void
  ): Promise<Blob> {
    const muxerTarget = new WebmTarget();
    const muxer = new WebmMuxer({
      target: muxerTarget,
      video: {
        codec: 'V_VP9',
        width,
        height,
      },
    });

    const videoEncoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (e) => console.error('VideoEncoder error:', e),
    });

    videoEncoder.configure({
      codec: 'vp09.00.10.08',
      width,
      height,
      bitrate: width >= 1080 ? 10_000_000 : 5_000_000,
    });

    for (let frame = 0; frame < totalFrames; frame++) {
      const time = frame / fps;
      this.renderFrameAtTime(
        project,
        time,
        renderer,
        scene,
        cameraDirector,
        world,
        particles,
        rigs,
        width,
        height,
        overlayCanvas,
        overlayCtx,
        finalCanvas,
        finalCtx,
        canvas,
        settings.includeCaptions
      );

      const timestampMicros = Math.round((frame / fps) * 1_000_000);
      const videoFrame = new VideoFrame(finalCanvas, {
        timestamp: timestampMicros,
        duration: Math.round((1 / fps) * 1_000_000),
      });

      videoEncoder.encode(videoFrame, { keyFrame: frame % (fps * 2) === 0 });
      videoFrame.close();

      onProgress(Math.round(((frame + 1) / totalFrames) * 100), frame + 1, totalFrames);

      if (frame % 5 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    await videoEncoder.flush();
    muxer.finalize();
    renderer.dispose();

    return new Blob([muxerTarget.buffer], { type: 'video/webm' });
  }

  private static async exportWithMediaRecorder(
    project: StoryboardProject,
    settings: ExportSettings,
    width: number,
    height: number,
    fps: number,
    totalFrames: number,
    totalDuration: number,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    cameraDirector: CameraDirector,
    world: VoxelWorld,
    particles: ParticleSystem,
    rigs: Map<string, MinecraftRig>,
    canvas: HTMLCanvasElement,
    overlayCanvas: HTMLCanvasElement,
    overlayCtx: CanvasRenderingContext2D,
    finalCanvas: HTMLCanvasElement,
    finalCtx: CanvasRenderingContext2D,
    onProgress: (percent: number, frame: number, totalFrames: number) => void
  ): Promise<Blob> {
    const stream = finalCanvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    return new Promise(async (resolve) => {
      recorder.onstop = () => {
        renderer.dispose();
        resolve(new Blob(chunks, { type: 'video/webm' }));
      };

      recorder.start();

      for (let frame = 0; frame < totalFrames; frame++) {
        const time = frame / fps;
        this.renderFrameAtTime(
          project,
          time,
          renderer,
          scene,
          cameraDirector,
          world,
          particles,
          rigs,
          width,
          height,
          overlayCanvas,
          overlayCtx,
          finalCanvas,
          finalCtx,
          canvas,
          settings.includeCaptions
        );

        onProgress(Math.round(((frame + 1) / totalFrames) * 100), frame + 1, totalFrames);
        await new Promise((r) => setTimeout(r, 1000 / fps));
      }

      recorder.stop();
    });
  }

  private static renderFrameAtTime(
    project: StoryboardProject,
    currentTime: number,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    cameraDirector: CameraDirector,
    world: VoxelWorld,
    particles: ParticleSystem,
    rigs: Map<string, MinecraftRig>,
    width: number,
    height: number,
    overlayCanvas: HTMLCanvasElement,
    overlayCtx: CanvasRenderingContext2D,
    finalCanvas: HTMLCanvasElement,
    finalCtx: CanvasRenderingContext2D,
    webglCanvas: HTMLCanvasElement,
    includeCaptions: boolean
  ) {
    // 1. Find active scene and local scene time
    let accumulated = 0;
    let activeScene = project.scenes[0];
    let localTime = 0;

    for (const sc of project.scenes) {
      if (currentTime >= accumulated && currentTime < accumulated + sc.duration) {
        activeScene = sc;
        localTime = currentTime - accumulated;
        break;
      }
      accumulated += sc.duration;
    }

    if (!activeScene) {
      activeScene = project.scenes[project.scenes.length - 1];
      localTime = activeScene.duration;
    }

    // 2. Hide all actors first, then activate and pose actors in current scene
    rigs.forEach((rig) => {
      rig.group.visible = false;
    });

    let mainActorPos = new THREE.Vector3(0, 0, 0);

    for (const actor of activeScene.actors) {
      const rig = rigs.get(actor.id);
      if (rig) {
        rig.group.visible = true;
        rig.group.position.set(actor.position[0], actor.position[1], actor.position[2]);
        rig.group.rotation.y = actor.rotationY;
        rig.equipItem(actor.heldItem);

        // Apply pose
        AnimationLibrary.applyAnimation(rig, actor.animation, localTime, actor.animSpeed || 1.0);

        if (actor.id === activeScene.targetActorId || !mainActorPos) {
          mainActorPos = rig.group.position.clone();
        }
      }
    }

    // 3. Update Camera
    cameraDirector.setPreset(activeScene.cameraPreset);
    if (activeScene.cameraShake) {
      cameraDirector.triggerShake(0.3);
    }
    cameraDirector.update(localTime, mainActorPos);

    // 4. Update World and Particles
    world.update(currentTime);
    particles.update(1 / 60);

    // 5. Render 3D WebGL Scene
    renderer.render(scene, cameraDirector.camera);

    // 6. Draw 3D scene to final canvas
    finalCtx.clearRect(0, 0, width, height);
    finalCtx.drawImage(webglCanvas, 0, 0, width, height);

    // 7. Render Styled Captions if enabled
    if (includeCaptions && activeScene.caption && activeScene.caption.text.trim()) {
      overlayCtx.clearRect(0, 0, width, height);
      this.drawViralCaption(
        overlayCtx,
        activeScene.caption.text,
        activeScene.caption.style,
        activeScene.caption.positionY || 'bottom',
        width,
        height,
        localTime
      );
      finalCtx.drawImage(overlayCanvas, 0, 0, width, height);
    }
  }

  // Draw viral TikTok / Shorts stylized captions onto canvas
  public static drawViralCaption(
    ctx: CanvasRenderingContext2D,
    text: string,
    style: string,
    positionY: 'top' | 'middle' | 'bottom',
    width: number,
    height: number,
    localTime: number
  ) {
    const baseFontSize = Math.round(width * 0.058); // Responsive font size
    ctx.save();

    let yPos = height * 0.78;
    if (positionY === 'middle') yPos = height * 0.48;
    if (positionY === 'top') yPos = height * 0.22;

    // Subtle scale pop entrance during first 0.3s
    const scale = localTime < 0.25 ? THREE.MathUtils.lerp(0.8, 1.0, localTime / 0.25) : 1.0;
    ctx.translate(width / 2, yPos);
    ctx.scale(scale, scale);

    if (style === 'viral_yellow') {
      // Bold Viral YouTube Shorts Yellow
      ctx.font = `900 ${baseFontSize}px "Impact", "Arial Black", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Thick black stroke
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = baseFontSize * 0.25;
      ctx.strokeText(text, 0, 0);

      // Yellow fill
      ctx.fillStyle = '#ffdf00';
      ctx.fillText(text, 0, 0);

    } else if (style === 'minecraft_pixel') {
      // Retro Minecraft style
      ctx.font = `bold ${Math.round(baseFontSize * 0.85)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Drop shadow
      ctx.fillStyle = '#3f3f00';
      ctx.fillText(text, 4, 4);

      ctx.fillStyle = '#55ff55'; // Minecraft light green
      ctx.fillText(text, 0, 0);

    } else if (style === 'neon_punch') {
      // Vibrant Magenta / Cyan punch
      ctx.font = `900 ${baseFontSize}px "Impact", "Arial Black", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = baseFontSize * 0.22;
      ctx.strokeText(text, 0, 0);

      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 0, 0);

    } else {
      // Clean modern white with dark backing pill
      ctx.font = `700 ${Math.round(baseFontSize * 0.8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const metrics = ctx.measureText(text);
      const paddingX = 24;
      const paddingY = 16;
      const boxW = metrics.width + paddingX * 2;
      const boxH = baseFontSize + paddingY * 2;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 0, 0);
    }

    ctx.restore();
  }
}
