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
  | 'FirstPersonPOV'    // Authentic Minecraft 1st Person view (F5 1st person)
  | 'ThirdPersonBack'   // Classic Minecraft F5 behind-the-head view
  | 'ThirdPersonFront'  // Reverse F5 selfie / reaction face view
  | 'SideTracking'      // 2D side profile tracking jump/chase (MTR & JahCub style)
  | 'OverTheShoulder'   // Dialogue over shoulder
  | 'LowAngleHero'      // Dramatic upward hero angle
  | 'CloseUpFace'       // Tight face portrait
  | 'FollowActor'       // Smooth tracking chase
  | 'Orbit'             // 360 degree drone sweep
  | 'WideReveal'        // Establishing wide scenery
  | 'TopDownIsometric'  // Tactical top view
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
  bannerText?: string;
  counter?: {
    current: number;
    max: number;
    label: string;
  };
  tradePopup?: {
    giveItem: string;
    receiveItem: string;
  };
}

export interface CaptionConfig {
  text: string;
  style: CaptionStyle;
  positionY?: 'top' | 'middle' | 'bottom';
  enabled?: boolean;
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
  caption?: CaptionConfig;
  challengeHud?: ChallengeHudConfig;
  sounds: SoundCue[];
}

export interface StoryboardProject {
  title: string;
  author?: string;
  aspectRatio: '9:16';
  globalCaptionsEnabled?: boolean;
  gameHudEnabled?: boolean;
  scenes: StoryboardScene[];
}

export interface ExportSettings {
  resolution: '1080x1920' | '720x1280' | '540x960';
  fps: 30 | 60;
  format: 'mp4' | 'webm';
  includeCaptions: boolean;
  includeGameHud: boolean;
  includeAudio: boolean;
  showSafeZonesDuringPreview: boolean;
}
