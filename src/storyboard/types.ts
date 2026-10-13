export type CharacterType = 'steve' | 'alex' | 'zombie' | 'creeper' | 'villager';

export type HeldItemType = 
  | 'none' 
  | 'diamond_sword' 
  | 'iron_sword' 
  | 'diamond_pickaxe' 
  | 'bow' 
  | 'torch' 
  | 'tnt'
  | 'emerald'
  | 'dirt_block';

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
  | 'creeper_ignite'
  | 'dig_frantic'
  | 'parkour_leap'
  | 'sad_defeat'
  | 'villager_talk'
  | 'villager_panic'
  | 'shocked';

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
  rotationY: number;
  animation: AnimationType;
  animSpeed?: number;
  heldItem: HeldItemType;
  isHurt?: boolean;
}

export type SoundEffectType = 
  | 'footstep' 
  | 'sword_slash' 
  | 'hit' 
  | 'creeper_hiss' 
  | 'explosion' 
  | 'ding'
  | 'villager_hrm'
  | 'villager_trade'
  | 'laser_buzz'
  | 'sad_piano'
  | 'block_break'
  | 'fail_buzzer';

export interface SoundCue {
  id: string;
  timeOffset: number; // in seconds relative to scene start
  type: SoundEffectType;
}

export interface ChallengeHudConfig {
  bannerText?: string; // e.g. "⚠️ ห้ามโดนเส้นสีแดง! / DO NOT TOUCH RED LINE"
  counter?: {
    current: number;
    max: number;
    label: string; // e.g. "DIGS" or "ขุด"
  };
  tradePopup?: {
    giveItem: string; // e.g. "64x Emeralds"
    receiveItem: string; // e.g. "1x Dirt Block"
  };
}

export interface StoryboardScene {
  id: string;
  title: string;
  duration: number; // seconds
  cameraPreset: CameraPreset;
  cameraShake?: boolean;
  hasRedLine?: boolean; // Renders the glowing dangerous Red Line
  targetActorId?: string;
  actors: ActorState[];
  caption?: {
    text: string;
    style: CaptionStyle;
    positionY?: 'top' | 'middle' | 'bottom';
  };
  challengeHud?: ChallengeHudConfig;
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
