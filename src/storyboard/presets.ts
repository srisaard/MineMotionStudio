import type { StoryboardProject } from './types';

export const STORY_TEMPLATES: Record<string, StoryboardProject> = {
  // 1. Inspired by Cash: "You Won, But at What Cost?"
  at_what_cost: {
    title: 'You Won, But at What Cost?',
    aspectRatio: '9:16',
    scenes: [
      {
        id: 'cost_1',
        title: 'Epic Boss Defeated',
        duration: 2.3,
        cameraPreset: 'LowAngleHero',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'sword_slash',
            heldItem: 'diamond_sword',
          },
          {
            id: 'zombie_boss',
            name: 'Zombie Boss',
            type: 'zombie',
            position: [0, 0, 1.4],
            rotationY: Math.PI,
            animation: 'hurt',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'WE FINALLY DEFEATED THE BOSS! 🏆',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'c1', timeOffset: 0.1, type: 'sword_slash' },
          { id: 'c2', timeOffset: 0.5, type: 'hit' },
          { id: 'c3', timeOffset: 1.2, type: 'ding' },
        ],
      },
      {
        id: 'cost_2',
        title: 'Where Is Buddy?',
        duration: 2.2,
        cameraPreset: 'ThirdPersonFront',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'shocked',
            heldItem: 'diamond_sword',
          },
        ],
        caption: {
          text: 'Wait... where is my dog?! 🐶💔',
          style: 'neon_punch',
          positionY: 'middle',
        },
        sounds: [
          { id: 'c4', timeOffset: 0.2, type: 'footstep' },
        ],
      },
      {
        id: 'cost_3',
        title: 'At What Cost...',
        duration: 3.5,
        cameraPreset: 'Orbit',
        cameraShake: false,
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'sad_defeat',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'YOU WON... BUT AT WHAT COST? 💔😢',
          style: 'clean_white',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'c5', timeOffset: 0.2, type: 'sad_piano' },
        ],
      },
    ],
  },

  // 2. Inspired by JahCub: "Minecraft Villagers are CRAZY"
  villagers_crazy: {
    title: 'Minecraft Villagers are CRAZY',
    aspectRatio: '9:16',
    scenes: [
      {
        id: 'v_1',
        title: 'Approaching Villager',
        duration: 2.2,
        cameraPreset: 'OverTheShoulder',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 1.2],
            rotationY: 0,
            animation: 'walk',
            heldItem: 'emerald',
          },
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [0, 0, -0.8],
            rotationY: Math.PI,
            animation: 'villager_talk',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'Trading with a local Villager... 🟢',
          style: 'clean_white',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'vs1', timeOffset: 0.2, type: 'footstep' },
          { id: 'vs2', timeOffset: 1.0, type: 'villager_hrm' },
        ],
      },
      {
        id: 'v_2',
        title: 'Absurd Trade Offer',
        duration: 2.5,
        cameraPreset: 'FirstPersonPOV',
        challengeHud: {
          tradePopup: {
            giveItem: '64x 🟢 Emeralds',
            receiveItem: '1x 🟫 Dirt Block',
          },
        },
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0.8],
            rotationY: 0,
            animation: 'shocked',
            heldItem: 'none',
          },
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [0, 0, -0.6],
            rotationY: Math.PI,
            animation: 'villager_talk',
            heldItem: 'dirt_block',
          },
        ],
        caption: {
          text: 'ARE YOU ACTUALLY SERIOUS?! 💀🟫',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'vs3', timeOffset: 0.2, type: 'villager_hrm' },
          { id: 'vs4', timeOffset: 0.8, type: 'fail_buzzer' },
        ],
      },
      {
        id: 'v_3',
        title: 'Villager Runs For His Life',
        duration: 2.8,
        cameraPreset: 'SideTracking',
        actors: [
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [0.5, 0, 1.2],
            rotationY: 0,
            animation: 'villager_panic',
            heldItem: 'dirt_block',
          },
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, -1.0],
            rotationY: 0,
            animation: 'run',
            heldItem: 'diamond_sword',
          },
        ],
        caption: {
          text: 'GIVE ME MY EMERALDS BACK! ⚔️💨',
          style: 'neon_punch',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'vs5', timeOffset: 0.2, type: 'villager_trade' },
          { id: 'vs6', timeOffset: 0.9, type: 'footstep' },
        ],
      },
    ],
  },

  // 3. Inspired by MTR Mysterios: "มายคราฟ แต่ คุณต้องขุด 1,000,000 ครั้ง..!!!"
  dig_million_times: {
    title: 'มายคราฟ แต่ คุณต้องขุด 1,000,000 ครั้ง',
    aspectRatio: '9:16',
    scenes: [
      {
        id: 'dig_1',
        title: 'เริ่มการขุด (First Dig)',
        duration: 2.2,
        cameraPreset: 'FirstPersonPOV',
        challengeHud: {
          bannerText: '⛏️ ขุด 1,000,000 ครั้ง! / DIG 1,000,000 TIMES!',
          counter: {
            current: 1,
            max: 1000000,
            label: 'ขุด (DIGS)',
          },
        },
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'dig_frantic',
            heldItem: 'diamond_pickaxe',
          },
        ],
        caption: {
          text: 'เริ่มขุดครั้งที่ 1... ไปต่อกันเลย! 🔥⛏️',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'ds1', timeOffset: 0.1, type: 'block_break' },
          { id: 'ds2', timeOffset: 0.5, type: 'block_break' },
          { id: 'ds3', timeOffset: 1.0, type: 'block_break' },
        ],
      },
      {
        id: 'dig_2',
        title: 'ความเร็วแสง 999,999 ครั้ง (Frenzy)',
        duration: 2.4,
        cameraPreset: 'ThirdPersonFront',
        challengeHud: {
          counter: {
            current: 999999,
            max: 1000000,
            label: 'ขุด (DIGS)',
          },
        },
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'dig_frantic',
            heldItem: 'diamond_pickaxe',
          },
        ],
        caption: {
          text: 'อีกแค่ 1 ครั้งเท่านั้น! จะได้อะไร?! 💎😱',
          style: 'neon_punch',
          positionY: 'middle',
        },
        sounds: [
          { id: 'ds4', timeOffset: 0.2, type: 'block_break' },
          { id: 'ds5', timeOffset: 0.6, type: 'block_break' },
          { id: 'ds6', timeOffset: 1.2, type: 'block_break' },
        ],
      },
      {
        id: 'dig_3',
        title: 'ครบ 1,000,000 ครั้ง! (Level Up Win)',
        duration: 3.0,
        cameraPreset: 'Orbit',
        cameraShake: true,
        challengeHud: {
          counter: {
            current: 1000000,
            max: 1000000,
            label: 'ขุด สำเร็จ! 🎉',
          },
        },
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
          text: 'ครบ 1,000,000 ครั้งแล้ว! ได้ของเทพเต็มตัว! 👑✨',
          style: 'minecraft_pixel',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'ds7', timeOffset: 0.1, type: 'explosion' },
          { id: 'ds8', timeOffset: 0.8, type: 'ding' },
        ],
      },
    ],
  },

  // 4. Inspired by MTR Mysterios: "มายคราฟ แต่ คุณห้ามโดนเส้นสีแดง...!!!"
  no_red_line: {
    title: 'มายคราฟ แต่ ห้ามโดนเส้นสีแดง...!!!',
    aspectRatio: '9:16',
    scenes: [
      {
        id: 'red_1',
        title: 'กับดักเส้นสีแดงมรณะ (The Red Line)',
        duration: 2.2,
        cameraPreset: 'FirstPersonPOV',
        hasRedLine: true,
        challengeHud: {
          bannerText: '⚠️ ห้ามโดนเส้นสีแดง! / DO NOT TOUCH RED LINE! ⚠️',
        },
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 2.4],
            rotationY: 0,
            animation: 'sneak',
            heldItem: 'torch',
          },
        ],
        caption: {
          text: 'ถ้าโดนเส้นสีแดง... ตายทันที! 🔴😱',
          style: 'neon_punch',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'rs1', timeOffset: 0.2, type: 'laser_buzz' },
        ],
      },
      {
        id: 'red_2',
        title: 'กระโดดข้ามเลเซอร์ (Parkour Leap)',
        duration: 2.5,
        cameraPreset: 'SideTracking',
        hasRedLine: true,
        challengeHud: {
          bannerText: '⚠️ ห้ามโดนเส้นสีแดง! / JUMP NOW! ⚠️',
        },
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'parkour_leap',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'กระโดดข้ามแบบเฉียดฉิว! 🚀💥',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'rs2', timeOffset: 0.3, type: 'laser_buzz' },
        ],
      },
      {
        id: 'red_3',
        title: 'รอดชีวิตสุดคลัตช์ (Clutch Survival)',
        duration: 2.8,
        cameraPreset: 'ThirdPersonFront',
        hasRedLine: true,
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, -2.4],
            rotationY: 0,
            animation: 'victory',
            heldItem: 'diamond_sword',
          },
        ],
        caption: {
          text: 'รอดชีวิตมาได้! เซฟจัดๆ! 👑😎',
          style: 'minecraft_pixel',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'rs3', timeOffset: 0.2, type: 'ding' },
        ],
      },
    ],
  },

  // Classic templates
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

  // 5. Cinematic 20s Storyboard: "The Emerald Heist" (Player Stole Villager Item)
  emerald_heist: {
    title: 'The Emerald Heist (20s Cinematic)',
    aspectRatio: '9:16',
    scenes: [
      {
        id: 'heist_1',
        title: 'The Unfair Trade (0-3.2s)',
        duration: 3.2,
        cameraPreset: 'OverTheShoulder',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 1.2],
            rotationY: 0,
            animation: 'idle',
            heldItem: 'none',
          },
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [0, 0, -0.8],
            rotationY: Math.PI,
            animation: 'villager_talk',
            heldItem: 'emerald',
          },
        ],
        challengeHud: {
          tradePopup: {
            giveItem: '64x 🟢 Emeralds',
            receiveItem: '1x 🍞 Bread',
          },
        },
        caption: {
          text: 'Villager wants 64 Emeralds for 1 Bread?! 🍞💀',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'hs1', timeOffset: 0.2, type: 'villager_hrm' },
        ],
      },
      {
        id: 'heist_2',
        title: 'The Emerald Yoink (3.2-6.5s)',
        duration: 3.3,
        cameraPreset: 'FirstPersonPOV',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0.4],
            rotationY: 0,
            animation: 'dig_frantic',
            heldItem: 'emerald',
          },
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [0, 0, -0.8],
            rotationY: Math.PI,
            animation: 'villager_talk',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'YOINK! Thanks for the free emerald! 🟢💨',
          style: 'neon_punch',
          positionY: 'middle',
        },
        sounds: [
          { id: 'hs2', timeOffset: 0.1, type: 'ding' },
          { id: 'hs3', timeOffset: 0.8, type: 'sword_slash' },
        ],
      },
      {
        id: 'heist_3',
        title: 'Villager Realizes (6.5-9.5s)',
        duration: 3.0,
        cameraPreset: 'ThirdPersonFront',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'run',
            heldItem: 'emerald',
          },
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [0, 0, 2.2],
            rotationY: 0,
            animation: 'shocked',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'HRMMM?! HEY, HE STOLE MY EMERALD! 🚨😱',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'hs4', timeOffset: 0.2, type: 'villager_hrm' },
          { id: 'hs5', timeOffset: 0.8, type: 'fail_buzzer' },
        ],
      },
      {
        id: 'heist_4',
        title: 'Rooftop Chase (9.5-13.5s)',
        duration: 4.0,
        cameraPreset: 'SideTracking',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [1.6, 0, 0],
            rotationY: -Math.PI / 2,
            animation: 'run',
            heldItem: 'emerald',
          },
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [-0.6, 0, 0],
            rotationY: -Math.PI / 2,
            animation: 'villager_panic',
            heldItem: 'none',
          },
          {
            id: 'zombie_guard',
            name: 'Zombie Guard',
            type: 'zombie',
            position: [-2.0, 0, 0],
            rotationY: -Math.PI / 2,
            animation: 'run',
            heldItem: 'iron_sword',
          },
        ],
        caption: {
          text: 'CALL THE IRON GOLEM! CATCH HIM! ⚔️🏃‍♂️',
          style: 'neon_punch',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'hs6', timeOffset: 0.2, type: 'footstep' },
          { id: 'hs7', timeOffset: 1.2, type: 'laser_buzz' },
          { id: 'hs8', timeOffset: 2.2, type: 'footstep' },
        ],
      },
      {
        id: 'heist_5',
        title: 'Clutch Parkour Leap (13.5-16.8s)',
        duration: 3.3,
        cameraPreset: 'LowAngleHero',
        hasRedLine: true,
        challengeHud: {
          bannerText: '⚠️ CLUTCH PARKOUR ROOFTOP LEAP! ⚠️',
        },
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'parkour_leap',
            heldItem: 'emerald',
          },
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [0, 0, 2.4],
            rotationY: 0,
            animation: 'villager_panic',
            heldItem: 'none',
          },
        ],
        caption: {
          text: 'CLEARED THE ROOFTOP GAP! SEE YA! 🚀💥',
          style: 'viral_yellow',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'hs9', timeOffset: 0.3, type: 'sword_slash' },
          { id: 'hs10', timeOffset: 1.5, type: 'ding' },
        ],
      },
      {
        id: 'heist_6',
        title: 'Rich & Free (16.8-20.0s)',
        duration: 3.2,
        cameraPreset: 'Orbit',
        actors: [
          {
            id: 'steve',
            name: 'Steve',
            type: 'steve',
            position: [0, 0, 0],
            rotationY: 0,
            animation: 'victory',
            heldItem: 'emerald',
          },
          {
            id: 'villager',
            name: 'Villager',
            type: 'villager',
            position: [1.2, 0, 2.4],
            rotationY: 0,
            animation: 'sad_defeat',
            heldItem: 'dirt_block',
          },
        ],
        caption: {
          text: 'Fastest emerald heist in Minecraft history! 🟢👑',
          style: 'minecraft_pixel',
          positionY: 'bottom',
        },
        sounds: [
          { id: 'hs11', timeOffset: 0.2, type: 'ding' },
          { id: 'hs12', timeOffset: 1.0, type: 'sad_piano' },
        ],
      },
    ],
  },
};
