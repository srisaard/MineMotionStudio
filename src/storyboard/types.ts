export type CharacterType = 'steve' | 'alex' | 'zombie' | 'creeper';

export type HeldItemType = 'none' | 'diamond_sword' | 'iron_sword' | 'diamond_pickaxe' | 'bow' | 'torch' | 'tnt';

export type AnimationType = 
  | 'idle'
  | 'walk'
  | 'run'
  | 'sword_slash'
  | 'jump'
  | 'sneak'
  | 'hurt'
  | 'fall'
  | 'victory'
  | 'creeper_walk'
  | 'creeper_ignite';

export type CameraPreset = 
  | 'FollowActor'
  | 'LowAngleHero'
  | 'CloseUpFace'
  | 'Orbit'
  | 'WideReveal'
  | 'TopDownIsometric'
  | 'FreeOrbit';

export type CaptionStyle = 'viral_yellow' | 'minecraft_pixel' | 'neon_punch' | 'clean_white';

export interface ActorState {
  id: string;
  name: string;
  type: CharacterType;
  customSkinUrl?: string;
  position: [number, number, number];
  rotationY: number; // in radians or degrees
  animation: AnimationType;
  animSpeed?: number;
  heldItem: HeldItemType;
  isHurt?: boolean;
}

export interface SoundCue {
  id: string;
  timeOffset: number; // relative to scene start, in seconds
  type: 'footstep' | 'sword_slash' | 'hit' | 'creeper_hiss' | 'explosion' | 'ding';
}

export interface StoryboardScene {
  id: string;
  title: string;
  duration: number; // seconds (e.g. 2.5)
  cameraPreset: CameraPreset;
  cameraShake?: boolean;
  targetActorId?: string;
  actors: ActorState[];
  caption?: {
    text: string;
    style: CaptionStyle;
    positionY?: 'top' | 'middle' | 'bottom';
  };
  sounds: SoundCue[];
}

export interface StoryboardProject {
  title: string;
  author?: string;
  aspectRatio: '9:16';
  scenes: StoryboardScene[];
}

export interface ExportSettings {
  resolution: '1080x1920' | '720x1280' | '540x960';
  fps: 30 | 60;
  format: 'mp4' | 'webm';
  includeCaptions: boolean;
  includeAudio: boolean;
  showSafeZonesDuringPreview: boolean;
}
