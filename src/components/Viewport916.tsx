import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Eye,
  Camera,
} from 'lucide-react';
import type { StoryboardProject, StoryboardScene, CameraPreset } from '../storyboard/types';

import { MinecraftRig } from '../engine/MinecraftRig';
import { AnimationLibrary } from '../engine/AnimationLibrary';
import { VoxelWorld } from '../engine/VoxelWorld';
import { CameraDirector } from '../engine/CameraDirector';
import { ParticleSystem } from '../engine/ParticleSystem';
import { SoundFX } from '../storyboard/SoundFX';

interface Viewport916Props {
  project: StoryboardProject;
  currentSceneIndex: number;
  onSceneChange: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  onCameraPresetChange?: (preset: CameraPreset) => void;
}

export const Viewport916: React.FC<Viewport916Props> = ({
  project,
  currentSceneIndex,
  onSceneChange,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  onCameraPresetChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [showSafeZones, setShowSafeZones] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Three.js internal references
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    cameraDirector: CameraDirector;
    world: VoxelWorld;
    particles: ParticleSystem;
    rigs: Map<string, MinecraftRig>;
    clock: THREE.Clock;
    soundCuesTriggered: Set<string>;
  } | null>(null);

  const totalDuration = project.scenes.reduce((sum, s) => sum + s.duration, 0);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x78abf5); // Minecraft Blue Sky
    scene.fog = new THREE.Fog(0x78abf5, 18, 38);

    const world = new VoxelWorld();
    scene.add(world.group);

    const particles = new ParticleSystem();
    scene.add(particles.group);

    const cameraDirector = new CameraDirector(9 / 16);
    const rigs = new Map<string, MinecraftRig>();
    const clock = new THREE.Clock();
    const soundCuesTriggered = new Set<string>();

    threeRef.current = {
      renderer,
      scene,
      cameraDirector,
      world,
      particles,
      rigs,
      clock,
      soundCuesTriggered,
    };

    // Resize handling
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      renderer.setSize(w, h, false);
      cameraDirector.setAspect(w, h);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      renderer.dispose();
      rigs.forEach((r) => r.dispose());
    };
  }, []);

  // Sync character rigs when project actors change
  useEffect(() => {
    if (!threeRef.current) return;
    const { scene, rigs } = threeRef.current;

    // Collect all actor IDs needed in the project
    const neededActors = new Map<string, { type: any; skin?: string }>();
    project.scenes.forEach((sc) => {
      sc.actors.forEach((a) => {
        neededActors.set(a.id, { type: a.type, skin: a.customSkinUrl });
      });
    });

    // Remove obsolete rigs
    rigs.forEach((rig, id) => {
      if (!neededActors.has(id)) {
        scene.remove(rig.group);
        rig.dispose();
        rigs.delete(id);
      }
    });

    // Create / update required rigs
    neededActors.forEach((info, id) => {
      let rig = rigs.get(id);
      if (!rig || rig.type !== info.type) {
        if (rig) {
          scene.remove(rig.group);
          rig.dispose();
        }
        rig = new MinecraftRig(info.type);
        if (info.skin) {
          rig.setCustomSkin(info.skin);
        }
        scene.add(rig.group);
        rigs.set(id, rig);
      } else if (info.skin && rig.type === info.type) {
        rig.setCustomSkin(info.skin);
      }
    });
  }, [project]);

  // Main playback and render animation loop
  useEffect(() => {
    let animFrameId: number;

    const renderLoop = () => {
      if (!threeRef.current) return;
      const { renderer, scene, cameraDirector, world, particles, rigs, soundCuesTriggered } = threeRef.current;

      let time = currentTime;

      if (isPlaying) {
        time += 1 / 60;
        if (time >= totalDuration) {
          time = 0; // loop
          soundCuesTriggered.clear();
        }
        setCurrentTime(time);
      }

      // 1. Locate active scene and relative scene time
      let accumulated = 0;
      let activeIndex = 0;
      let activeScene: StoryboardScene = project.scenes[0];
      let localSceneTime = 0;

      for (let i = 0; i < project.scenes.length; i++) {
        const sc = project.scenes[i];
        if (time >= accumulated && time < accumulated + sc.duration) {
          activeIndex = i;
          activeScene = sc;
          localSceneTime = time - accumulated;
          break;
        }
        accumulated += sc.duration;
      }

      if (activeIndex !== currentSceneIndex) {
        onSceneChange(activeIndex);
      }

      // 2. Play sound cues
      if (soundEnabled && isPlaying) {
        activeScene.sounds.forEach((cue) => {
          const cueKey = `${activeScene.id}_${cue.id}`;
          if (localSceneTime >= cue.timeOffset && !soundCuesTriggered.has(cueKey)) {
            soundCuesTriggered.add(cueKey);
            SoundFX.play(cue.type);

            // Particle feedback on impact
            if (cue.type === 'sword_slash' || cue.type === 'hit') {
              particles.spawnCritParticles(new THREE.Vector3(0, 1.2, 0), 14);
            } else if (cue.type === 'explosion') {
              particles.spawnExplosion(new THREE.Vector3(0, 0.8, 0), 28);
            }
          }
        });
      }

      // 3. Pose actors in current scene
      rigs.forEach((rig) => {
        rig.group.visible = false;
      });

      let mainActorPos = new THREE.Vector3(0, 0, 0);

      activeScene.actors.forEach((actor) => {
        const rig = rigs.get(actor.id);
        if (rig) {
          rig.group.visible = true;
          rig.group.position.set(actor.position[0], actor.position[1], actor.position[2]);
          rig.group.rotation.y = actor.rotationY;
          rig.equipItem(actor.heldItem);

          AnimationLibrary.applyAnimation(rig, actor.animation, localSceneTime, actor.animSpeed || 1.0);

          if (actor.id === activeScene.targetActorId || !mainActorPos) {
            mainActorPos = rig.group.position.clone();
          }
        }
      });

      // 4. Update Camera Director
      cameraDirector.setPreset(activeScene.cameraPreset);
      if (activeScene.cameraShake && localSceneTime < 0.4) {
        cameraDirector.triggerShake(0.25);
      }
      cameraDirector.update(localSceneTime, mainActorPos);

      // 5. Update World & Particles
      world.update(time);
      particles.update(1 / 60);

      // 6. Render
      renderer.render(scene, cameraDirector.camera);

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isPlaying, currentTime, currentSceneIndex, project, totalDuration, soundEnabled, onSceneChange, setCurrentTime]);

  const activeScene = project.scenes[currentSceneIndex] || project.scenes[0];

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs % 1) * 10);
    return `${s.toString().padStart(2, '0')}.${ms}s`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-3 bg-[#0a0c10] select-none overflow-hidden relative">
      {/* Top Viewport Toolbar */}
      <div className="w-full max-w-sm flex items-center justify-between px-3 py-1.5 bg-[#141824]/90 backdrop-blur rounded-xl border border-[#252c3d] text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" /> 9:16 Mobile
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium truncate max-w-[140px]">
            {activeScene.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Safe Zones Toggle */}
          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            title="Toggle YouTube Shorts & Reels UI Safe Zones"
            className={`p-1.5 rounded-lg border transition-colors ${
              showSafeZones
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-[#1b2131] border-[#2e374d] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-[#1b2131] border-[#2e374d] text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Central 9:16 Phone Canvas Display */}
      <div
        ref={containerRef}
        className="relative my-auto rounded-2xl overflow-hidden border-2 border-[#2b3345] shadow-2xl shadow-black/80 bg-black flex items-center justify-center"
        style={{
          width: 'min(380px, calc(100vh - 190px) * (9 / 16))',
          height: 'min(calc(380px * (16 / 9)), calc(100vh - 190px))',
          aspectRatio: '9 / 16',
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Live Subtitle Overlay */}
        {activeScene.caption && activeScene.caption.text.trim() && (
          <div
            className={`absolute left-0 right-0 px-4 text-center pointer-events-none transition-all duration-200 z-10 ${
              activeScene.caption.positionY === 'top'
                ? 'top-14'
                : activeScene.caption.positionY === 'middle'
                ? 'top-1/2 -translate-y-1/2'
                : 'bottom-20'
            }`}
          >
            {activeScene.caption.style === 'viral_yellow' && (
              <span
                className="text-lg md:text-xl font-black text-[#ffeb3b] uppercase tracking-wide px-3 py-1 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                style={{
                  WebkitTextStroke: '2px #000000',
                  textShadow: '0 3px 0 #000',
                }}
              >
                {activeScene.caption.text}
              </span>
            )}

            {activeScene.caption.style === 'minecraft_pixel' && (
              <span
                className="font-mono text-base md:text-lg font-bold text-[#55ff55] px-3 py-1 bg-black/60 rounded border border-emerald-500/40"
                style={{ textShadow: '2px 2px 0 #1b4d1b' }}
              >
                {activeScene.caption.text}
              </span>
            )}

            {activeScene.caption.style === 'neon_punch' && (
              <span
                className="text-lg md:text-xl font-black text-white uppercase tracking-wider px-3 py-1 drop-shadow-[0_0_12px_#ff007f]"
                style={{
                  WebkitTextStroke: '1.5px #000',
                }}
              >
                {activeScene.caption.text}
              </span>
            )}

            {activeScene.caption.style === 'clean_white' && (
              <span className="text-sm md:text-base font-bold text-white px-3 py-1.5 bg-black/75 rounded-full shadow-lg backdrop-blur-sm">
                {activeScene.caption.text}
              </span>
            )}
          </div>
        )}

        {/* 9:16 Shorts/Reels UI Safe Zone Overlay Guide */}
        {showSafeZones && (
          <div className="absolute inset-0 pointer-events-none border border-emerald-500/20 z-20 flex flex-col justify-between p-3">
            {/* Top Bar Safe Zone */}
            <div className="flex justify-between items-start text-[10px] text-white/50 bg-black/20 p-1 rounded backdrop-blur-[2px]">
              <span>Search / Sounds</span>
              <span className="bg-red-600/70 text-white text-[9px] px-1 rounded font-bold">LIVE PREVIEW</span>
            </div>

            {/* Right Side Shorts Buttons Safe Zone */}
            <div className="self-end flex flex-col gap-3 items-center mr-1 text-[9px] text-white/60">
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[10px]">❤️</div>
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[10px]">💬</div>
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[10px]">↗️</div>
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-[8px]">🎵</div>
            </div>

            {/* Bottom Title & Channel Safe Zone */}
            <div className="bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 rounded-b text-[10px] text-white/60">
              <div className="font-bold text-white/80">@ChannelName • Subscribe</div>
              <div className="text-[9px] truncate">Safe area: keep important text above this zone</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Transport Controls */}
      <div className="w-full max-w-sm bg-[#131620] border border-[#242b3b] rounded-xl p-2.5 flex flex-col gap-2 z-10 shadow-lg">
        {/* Scrubber Bar */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.05}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-[#252c3d] rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
          />
          <span className="font-mono text-[11px] text-slate-300 min-w-[75px] text-right">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
                if (threeRef.current) threeRef.current.soundCuesTriggered.clear();
              }}
              title="Reset Timeline"
              className="p-1.5 rounded-lg bg-[#1c2230] hover:bg-[#252e42] text-slate-300 border border-[#2c364c]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Camera Preset Quick Switch */}
          <div className="flex items-center gap-1 text-[11px]">
            <Camera className="w-3 h-3 text-slate-400" />
            <select
              value={activeScene.cameraPreset}
              onChange={(e) => onCameraPresetChange && onCameraPresetChange(e.target.value as CameraPreset)}
              className="bg-[#1b2131] border border-[#2c374d] text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="FollowActor">Follow Hero</option>
              <option value="LowAngleHero">Hero Low Angle</option>
              <option value="CloseUpFace">Face Close-up</option>
              <option value="Orbit">360° Orbit</option>
              <option value="WideReveal">Wide Reveal</option>
              <option value="TopDownIsometric">Isometric</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
