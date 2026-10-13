import type { StoryboardProject } from './types';


export const STORY_TEMPLATES: Record<string, StoryboardProject> = {
  creeper_jumpscare: {
    title: 'The Creeper Jump Scare',
    aspectRatio: '9:16',
    scenes: [
      {
        id: 'scene_1',
        title: 'Peaceful Stroll',
        duration: 2.2,
        cameraPreset: 'FollowActor',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 1.5],
            rotationY: 0,
            animation: 'walk',
            heldItem: 'torch',
          },
        ],
        caption: {
          text: 'Heading home with my loot...',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 's1', timeOffset: 0.1, type: 'footstep' },
          { id: 's2', timeOffset: 0.9, type: 'footstep' },
          { id: 's3', timeOffset: 1.7, type: 'footstep' },
        ],
      },
      {
        id: 'scene_2',
        title: 'The Sneak',
        duration: 2.0,
        cameraPreset: 'LowAngleHero',
        cameraShake: false,
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 1.2],
            rotationY: 0,
            animation: 'sneak',
            heldItem: 'torch',
          },
          {
            id: 'creeper',
            name: 'Creeper',
            type: 'creeper',
            position: [0, 0, -1.0],
            rotationY: 0,
            animation: 'creeper_walk',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'WAIT WHAT IS THAT SOUND?! 💀',
          style: 'neon_punch',
          positionY: 'middle',
        },
        sounds: [
          { id: 's4', timeOffset: 0.2, type: 'creeper_hiss' },
        ],
      },
      {
        id: 'scene_3',
        title: 'Counter Strike',
        duration: 2.0,
        cameraPreset: 'CloseUpFace',
        cameraShake: true,
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: Math.PI,
            animation: 'sword_slash',
            heldItem: 'diamond_sword',
          },
          {
            id: 'creeper',
            name: 'Creeper',
            type: 'creeper',
            position: [0, 0, 1.2],
            rotationY: 0,
            animation: 'creeper_ignite',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'GET AWAY FROM ME! ⚔️',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 's5', timeOffset: 0.1, type: 'sword_slash' },
          { id: 's6', timeOffset: 0.6, type: 'hit' },
        ],
      },
      {
        id: 'scene_4',
        title: 'Victory Detonation',
        duration: 2.5,
        cameraPreset: 'Orbit',
        cameraShake: true,
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'victory',
            heldItem: 'diamond_sword',
          },
        ],
        caption: {
          text: 'THAT WAS TOO CLOSE! 🔥👑',
          style: 'minecraft_pixel',
          positionY: 'bottom',
        },
        sounds: [
          { id: 's7', timeOffset: 0.1, type: 'explosion' },
          { id: 's8', timeOffset: 1.2, type: 'ding' },
        ],
      },
    ],
  },

  diamond_rush: {
    title: 'Found Diamonds!',
    aspectRatio: '9:16',
    scenes: [
      {
        id: 'scene_d1',
        title: 'Tired Mining',
        duration: 2.0,
        cameraPreset: 'FollowActor',
        actors: [
          {
            id: 'alex',
            name: 'Alex',
            type: 'alex',
            position: [0, 0, 1],
            rotationY: 0,
            animation: 'walk',
            heldItem: 'diamond_pickaxe',
          },
        ],
        caption: {
          text: 'Mining at Y=-58 for 2 hours...',
          style: 'clean_white',
          positionY: 'bottom',
        },
        sounds: [{ id: 'sd1', timeOffset: 0.1, type: 'footstep' }],
      },
      {
        id: 'scene_d2',
        title: 'The Discovery',
        duration: 2.2,
        cameraPreset: 'CloseUpFace',
        actors: [
          {
            id: 'alex',
            name: 'Alex',
            type: 'alex',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'jump',
            heldItem: 'diamond_pickaxe',
          },
        ],
        caption: {
          text: 'WAIT... IS THAT BLUE?! 💎💎',
          style: 'neon_punch',
          positionY: 'middle',
        },
        sounds: [{ id: 'sd2', timeOffset: 0.2, type: 'ding' }],
      },
      {
        id: 'scene_d3',
        title: 'Celebration Dance',
        duration: 2.5,
        cameraPreset: 'Orbit',
        actors: [
          {
            id: 'alex',
            name: 'Alex',
            type: 'alex',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'victory',
            heldItem: 'diamond_sword',
          },
        ],
        caption: {
          text: '8 VEIN OF DIAMONDS! EZ GG! ✨',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [{ id: 'sd3', timeOffset: 0.3, type: 'ding' }],
      },
    ],
  },

  zombie_ambush: {
    title: 'Midnight Zombie Siege',
    aspectRatio: '9:16',
    scenes: [
      {
        id: 'scene_z1',
        title: 'Zombie Approaches',
        duration: 2.2,
        cameraPreset: 'LowAngleHero',
        actors: [
          {
            id: 'zombie',
            name: 'Zombie',
            type: 'zombie',
            position: [0, 0, 1.5],
            rotationY: Math.PI,
            animation: 'walk',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'A wild Zombie appears...',
          style: 'clean_white',
          positionY: 'bottom',
        },
        sounds: [{ id: 'sz1', timeOffset: 0.2, type: 'footstep' }],
      },
      {
        id: 'scene_z2',
        title: 'Steve Takes Stand',
        duration: 2.2,
        cameraPreset: 'FollowActor',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, -1.0],
            rotationY: 0,
            animation: 'sword_slash',
            heldItem: 'diamond_sword',
          },
          {
            id: 'zombie',
            name: 'Zombie',
            type: 'zombie',
            position: [0, 0, 0.8],
            rotationY: Math.PI,
            animation: 'hurt',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'CRITICAL HIT! 💥',
          style: 'neon_punch',
          positionY: 'middle',
        },
        sounds: [
          { id: 'sz2', timeOffset: 0.1, type: 'sword_slash' },
          { id: 'sz3', timeOffset: 0.5, type: 'hit' },
        ],
      },
      {
        id: 'scene_z3',
        title: 'Victory',
        duration: 2.5,
        cameraPreset: 'Orbit',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'victory',
            heldItem: 'diamond_sword',
          },
        ],
        caption: {
          text: 'Drop that Rotten Flesh! 🍖',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [{ id: 'sz4', timeOffset: 0.2, type: 'ding' }],
      },
    ],
  },
};
