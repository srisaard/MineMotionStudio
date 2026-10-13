import type {
  StoryboardProject,
  StoryboardScene,
  ActorState,
  CameraPreset,
  CharacterType,
  HeldItemType,
  AnimationType,
} from './types';


export class ScriptParser {
  /**
   * Convert StoryboardProject to screenplay text representation
   */
  public static projectToScript(project: StoryboardProject): string {
    let script = `# ${project.title}\n\n`;

    let currentTime = 0;
    project.scenes.forEach((scene, index) => {
      const startTime = currentTime.toFixed(1);
      const endTime = (currentTime + scene.duration).toFixed(1);
      currentTime += scene.duration;

      script += `[${startTime}s - ${endTime}s] ${scene.title}\n`;
      script += `Camera: ${scene.cameraPreset}${scene.cameraShake ? ' (Shake)' : ''}\n`;

      scene.actors.forEach((actor) => {
        const itemStr = actor.heldItem !== 'none' ? ` holding ${actor.heldItem}` : '';
        script += `Actor: ${actor.name} (${actor.type}) -> anim: ${actor.animation}${itemStr} at [${actor.position.join(', ')}]\n`;
      });

      if (scene.caption && scene.caption.text.trim()) {
        script += `Caption [${scene.caption.style}]: "${scene.caption.text}"\n`;
      }

      if (scene.sounds.length > 0) {
        script += `Sounds: ${scene.sounds.map((s) => s.type).join(', ')}\n`;
      }

      if (index < project.scenes.length - 1) {
        script += '\n';
      }
    });

    return script;
  }

  /**
   * Parse screenplay or freeform text into a StoryboardProject
   */
  public static scriptToProject(scriptText: string): StoryboardProject {
    const lines = scriptText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    let title = 'My Minecraft Storyboard';
    const scenes: StoryboardScene[] = [];
    let currentScene: Partial<StoryboardScene> | null = null;
    let sceneIndex = 1;

    for (const line of lines) {
      if (line.startsWith('#')) {
        title = line.replace(/^#+\s*/, '').trim() || title;
        continue;
      }

      // Detect timestamp line like [0.0s - 2.5s] Scene Title or [0 - 2.5]
      const timeMatch = line.match(/^\[([0-9.]+)\s*s?\s*-\s*([0-9.]+)\s*s?\]\s*(.*)/i);
      if (timeMatch) {
        if (currentScene && currentScene.duration) {
          scenes.push(this.finalizeScene(currentScene, sceneIndex++));
        }

        const start = parseFloat(timeMatch[1]);
        const end = parseFloat(timeMatch[2]);
        const dur = Math.max(0.5, end - start) || 2.5;
        const sceneTitle = timeMatch[3].trim() || `Scene ${sceneIndex}`;

        currentScene = {
          id: `scene_${Date.now()}_${sceneIndex}`,
          title: sceneTitle,
          duration: dur,
          cameraPreset: 'FollowActor',
          actors: [],
          sounds: [],
        };
        continue;
      }

      // If no current scene, start one
      if (!currentScene) {
        currentScene = {
          id: `scene_${Date.now()}_${sceneIndex}`,
          title: `Scene ${sceneIndex}`,
          duration: 2.5,
          cameraPreset: 'FollowActor',
          actors: [],
          sounds: [],
        };
      }

      // Check Camera line
      if (line.toLowerCase().startsWith('camera:')) {
        const camStr = line.split(':')[1]?.trim() || '';
        currentScene.cameraPreset = this.matchCameraPreset(camStr);
        if (camStr.toLowerCase().includes('shake')) {
          currentScene.cameraShake = true;
        }
        continue;
      }

      // Check Actor line: Actor: Steve (steve) -> anim: walk holding diamond_sword
      if (line.toLowerCase().startsWith('actor:') || line.toLowerCase().includes('-> anim:')) {
        const actor = this.parseActorLine(line);
        if (actor) {
          currentScene.actors = currentScene.actors || [];
          currentScene.actors.push(actor);
        }
        continue;
      }

      // Check Caption line: Caption [viral_yellow]: "Hello world"
      if (line.toLowerCase().startsWith('caption:')) {
        const quoteMatch = line.match(/"([^"]+)"/) || line.match(/Caption:\s*(.*)/i);
        const text = quoteMatch ? quoteMatch[1] : '';
        const styleMatch = line.match(/\[([a-z_]+)\]/i);
        const style = (styleMatch ? styleMatch[1] : 'viral_yellow') as any;

        currentScene.caption = {
          text: text.trim(),
          style: style || 'viral_yellow',
          positionY: 'bottom',
        };
        continue;
      }

      // Check Sounds line
      if (line.toLowerCase().startsWith('sound:') || line.toLowerCase().startsWith('sounds:')) {
        const soundPart = line.split(':')[1]?.trim() || '';
        const soundItems = soundPart.split(',').map((s) => s.trim().toLowerCase());
        currentScene.sounds = currentScene.sounds || [];

        soundItems.forEach((item, idx) => {
          if ([
            'footstep',
            'sword_slash',
            'hit',
            'creeper_hiss',
            'explosion',
            'ding',
            'villager_hrm',
            'villager_trade',
            'laser_buzz',
            'sad_piano',
            'block_break',
            'fail_buzzer',
          ].includes(item)) {
            currentScene!.sounds!.push({
              id: `snd_${Date.now()}_${idx}`,
              timeOffset: 0.2 + idx * 0.4,
              type: item as any,
            });
          }
        });
        continue;
      }

      // Check Hazard line: Hazard: RedLine or Laser
      if (line.toLowerCase().includes('red line') || line.toLowerCase().includes('laser')) {
        currentScene.hasRedLine = true;
      }

      // Natural language fallback: e.g. "Steve walks with diamond sword"
      const lower = line.toLowerCase();
      if (lower.includes('steve') || lower.includes('alex') || lower.includes('zombie') || lower.includes('creeper') || lower.includes('villager')) {
        const actor = this.parseNaturalActor(line);
        if (actor) {
          currentScene.actors = currentScene.actors || [];
          currentScene.actors.push(actor);
        }
      }
    }

    if (currentScene && currentScene.duration) {
      scenes.push(this.finalizeScene(currentScene, sceneIndex));
    }

    // Fallback if empty
    if (scenes.length === 0) {
      return {
        title,
        aspectRatio: '9:16',
        scenes: [
          {
            id: 'scene_1',
            title: 'Intro Scene',
            duration: 3.0,
            cameraPreset: 'FollowActor',
            actors: [
              {
                id: 'steve',
                name: 'Steve',
                type: 'steve',
                position: [0, 0, 0],
                rotationY: 0,
                animation: 'walk',
                heldItem: 'diamond_sword',
              },
            ],
            caption: {
              text: 'Welcome to Minecraft Shorts!',
              style: 'viral_yellow',
              positionY: 'bottom',
            },
            sounds: [{ id: 's1', timeOffset: 0.2, type: 'footstep' }],
          },
        ],
      };
    }

    return {
      title,
      aspectRatio: '9:16',
      scenes,
    };
  }

  private static finalizeScene(s: Partial<StoryboardScene>, index: number): StoryboardScene {
    // If no actors specified in scene, add default Steve
    const actors = s.actors && s.actors.length > 0
      ? s.actors
      : [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve' as CharacterType,
            position: [0, 0, 0] as [number, number, number],
            rotationY: 0,
            animation: 'walk' as AnimationType,
            heldItem: 'diamond_sword' as HeldItemType,
          },
        ];

    return {
      id: s.id || `scene_${index}`,
      title: s.title || `Scene ${index}`,
      duration: s.duration || 2.5,
      cameraPreset: s.cameraPreset || 'FollowActor',
      cameraShake: s.cameraShake || false,
      actors,
      caption: s.caption,
      sounds: s.sounds || [],
    };
  }

  private static matchCameraPreset(str: string): CameraPreset {
    const s = str.toLowerCase();
    if (s.includes('low') || s.includes('hero')) return 'LowAngleHero';
    if (s.includes('close') || s.includes('face')) return 'CloseUpFace';
    if (s.includes('orbit')) return 'Orbit';
    if (s.includes('wide') || s.includes('reveal')) return 'WideReveal';
    if (s.includes('iso') || s.includes('top')) return 'TopDownIsometric';
    return 'FollowActor';
  }

  private static parseActorLine(line: string): ActorState | null {
    const lower = line.toLowerCase();
    let type: CharacterType = 'steve';
    if (lower.includes('alex')) type = 'alex';
    else if (lower.includes('zombie')) type = 'zombie';
    else if (lower.includes('creeper')) type = 'creeper';
    else if (lower.includes('villager')) type = 'villager';

    let anim: AnimationType = 'idle';
    if (lower.includes('walk')) anim = type === 'creeper' ? 'creeper_walk' : 'walk';
    else if (lower.includes('run') || lower.includes('sprint')) anim = 'run';
    else if (lower.includes('slash') || lower.includes('sword') || lower.includes('attack')) anim = 'sword_slash';
    else if (lower.includes('dig') || lower.includes('mine') || lower.includes('pickaxe')) anim = 'dig_frantic';
    else if (lower.includes('parkour') || lower.includes('leap')) anim = 'parkour_leap';
    else if (lower.includes('sad') || lower.includes('cost') || lower.includes('defeat') || lower.includes('grief')) anim = 'sad_defeat';
    else if (lower.includes('talk') || lower.includes('hrmm') || lower.includes('trade')) anim = 'villager_talk';
    else if (lower.includes('panic') || lower.includes('scream') || lower.includes('terror')) anim = 'villager_panic';
    else if (lower.includes('shock') || lower.includes('disbelief')) anim = 'shocked';
    else if (lower.includes('jump')) anim = 'jump';
    else if (lower.includes('sneak')) anim = 'sneak';
    else if (lower.includes('hurt')) anim = 'hurt';
    else if (lower.includes('victory') || lower.includes('celebrate') || lower.includes('win')) anim = 'victory';
    else if (lower.includes('ignite') || lower.includes('explode')) anim = 'creeper_ignite';

    let heldItem: HeldItemType = 'none';
    if (lower.includes('diamond_sword') || lower.includes('diamond sword')) heldItem = 'diamond_sword';
    else if (lower.includes('iron_sword') || lower.includes('iron sword')) heldItem = 'iron_sword';
    else if (lower.includes('pickaxe')) heldItem = 'diamond_pickaxe';
    else if (lower.includes('emerald')) heldItem = 'emerald';
    else if (lower.includes('dirt')) heldItem = 'dirt_block';
    else if (lower.includes('bow')) heldItem = 'bow';
    else if (lower.includes('torch')) heldItem = 'torch';
    else if (lower.includes('tnt')) heldItem = 'tnt';

    // Position match [x, y, z]
    const posMatch = line.match(/\[([0-9.-]+)\s*,\s*([0-9.-]+)\s*,\s*([0-9.-]+)\]/);
    const position: [number, number, number] = posMatch
      ? [parseFloat(posMatch[1]), parseFloat(posMatch[2]), parseFloat(posMatch[3])]
      : [0, 0, 0];

    return {
      id: `${type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      position,
      rotationY: 0,
      animation: anim,
      heldItem,
    };
  }

  private static parseNaturalActor(line: string): ActorState {
    return this.parseActorLine(line)!;
  }
}
