import * as THREE from 'three';
import type { AnimationType } from '../storyboard/types';
import { MinecraftRig } from './MinecraftRig';


export class AnimationLibrary {
  /**
   * Applies an animation pose to a character rig at a given timestamp.
   * Deterministic evaluation: given the same `time` and `anim`, yields exact same pose.
   */
  public static applyAnimation(rig: MinecraftRig, anim: AnimationType, time: number, speedMultiplier = 1.0) {
    const t = time * speedMultiplier;
    const bones = rig.bones;

    // Reset base rotations
    this.resetPose(rig);

    if (rig.type === 'creeper') {
      this.applyCreeperAnimation(rig, anim, t);
      return;
    }

    // Humanoid animations
    switch (anim) {
      case 'idle': {
        const breath = Math.sin(t * 2.5) * 0.04;
        bones.torso.position.y = 0.75 + breath * 0.2;
        if (bones.rightArm) bones.rightArm.rotation.z = 0.08 + breath;
        if (bones.leftArm) bones.leftArm.rotation.z = -0.08 - breath;
        // Subtle head look
        bones.head.rotation.y = Math.sin(t * 1.2) * 0.12;
        bones.head.rotation.x = Math.sin(t * 1.8) * 0.05;
        break;
      }

      case 'walk': {
        const cycle = t * 6.0;
        const swing = Math.sin(cycle) * 0.6;
        const bounce = Math.abs(Math.sin(cycle)) * 0.06;

        bones.torso.position.y = 0.75 + bounce;
        bones.head.rotation.x = Math.sin(cycle * 2) * 0.04;
        bones.head.rotation.y = Math.sin(cycle) * 0.05;

        if (bones.rightLeg) bones.rightLeg.rotation.x = swing;
        if (bones.leftLeg) bones.leftLeg.rotation.x = -swing;

        if (bones.rightArm) {
          bones.rightArm.rotation.x = -swing;
          bones.rightArm.rotation.z = 0.05;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = swing;
          bones.leftArm.rotation.z = -0.05;
        }
        break;
      }

      case 'run': {
        const cycle = t * 10.0;
        const swing = Math.sin(cycle) * 1.0;
        const bounce = Math.abs(Math.sin(cycle)) * 0.12;

        bones.torso.position.y = 0.75 + bounce;
        bones.torso.rotation.x = 0.25; // Forward lean
        bones.head.rotation.x = -0.2; // Keep eyes forward

        if (bones.rightLeg) bones.rightLeg.rotation.x = swing;
        if (bones.leftLeg) bones.leftLeg.rotation.x = -swing;

        if (bones.rightArm) {
          bones.rightArm.rotation.x = -swing * 1.1;
          bones.rightArm.rotation.z = 0.15;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = swing * 1.1;
          bones.leftArm.rotation.z = -0.15;
        }
        break;
      }

      case 'sword_slash': {
        // Repeated sword slash cycle (every 0.9s)
        const cycleTime = t % 0.9;
        const progress = cycleTime / 0.9;

        if (progress < 0.25) {
          // Wind up: arm drawn back overhead
          const p = progress / 0.25;
          if (bones.rightArm) {
            bones.rightArm.rotation.x = THREE.MathUtils.lerp(0, -2.4, p);
            bones.rightArm.rotation.y = THREE.MathUtils.lerp(0, 0.4, p);
            bones.rightArm.rotation.z = THREE.MathUtils.lerp(0, 0.3, p);
          }
          bones.torso.rotation.y = THREE.MathUtils.lerp(0, -0.3, p);
        } else if (progress < 0.6) {
          // Powerful downward slash
          const p = (progress - 0.25) / 0.35;
          if (bones.rightArm) {
            bones.rightArm.rotation.x = THREE.MathUtils.lerp(-2.4, 0.8, p);
            bones.rightArm.rotation.y = THREE.MathUtils.lerp(0.4, -0.6, p);
            bones.rightArm.rotation.z = THREE.MathUtils.lerp(0.3, -0.2, p);
          }
          bones.torso.rotation.y = THREE.MathUtils.lerp(-0.3, 0.5, p);
          bones.torso.rotation.x = THREE.MathUtils.lerp(0, 0.2, p);
        } else {
          // Recovery back to ready pose
          const p = (progress - 0.6) / 0.4;
          if (bones.rightArm) {
            bones.rightArm.rotation.x = THREE.MathUtils.lerp(0.8, -0.8, p);
            bones.rightArm.rotation.y = THREE.MathUtils.lerp(-0.6, 0, p);
            bones.rightArm.rotation.z = THREE.MathUtils.lerp(-0.2, 0, p);
          }
          bones.torso.rotation.y = THREE.MathUtils.lerp(0.5, 0, p);
          bones.torso.rotation.x = THREE.MathUtils.lerp(0.2, 0, p);
        }

        // Left arm balances
        if (bones.leftArm) {
          bones.leftArm.rotation.x = 0.5;
          bones.leftArm.rotation.z = -0.4;
        }
        break;
      }

      case 'jump': {
        const cycle = t % 1.2;
        const progress = cycle / 1.2;
        // Parabolic jump arc
        const jumpHeight = Math.sin(progress * Math.PI) * 0.7;
        bones.root.position.y = jumpHeight;

        // Arms raised slightly
        if (bones.rightArm) bones.rightArm.rotation.x = -1.0;
        if (bones.leftArm) bones.leftArm.rotation.x = -1.0;

        // Legs pulled up
        if (bones.rightLeg) bones.rightLeg.rotation.x = 0.4;
        if (bones.leftLeg) bones.leftLeg.rotation.x = 0.4;
        break;
      }

      case 'sneak': {
        bones.torso.position.y = 0.62;
        bones.torso.rotation.x = 0.4; // crouched
        bones.head.rotation.x = -0.3; // head looks ahead

        if (bones.rightArm) {
          bones.rightArm.rotation.x = 0.4;
          bones.rightArm.rotation.z = 0.2;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = 0.4;
          bones.leftArm.rotation.z = -0.2;
        }
        if (bones.rightLeg) bones.rightLeg.rotation.x = -0.3;
        if (bones.leftLeg) bones.leftLeg.rotation.x = 0.3;
        break;
      }

      case 'hurt': {
        // Red flash & knockback twitch
        rig.setHurtState(true);
        bones.torso.rotation.x = -0.4;
        bones.torso.rotation.z = Math.sin(t * 15) * 0.15;
        bones.head.rotation.y = 0.3;
        bones.head.rotation.z = -0.3;
        if (bones.rightArm) bones.rightArm.rotation.x = 0.6;
        if (bones.leftArm) bones.leftArm.rotation.x = 0.6;
        break;
      }

      case 'fall': {
        bones.root.position.y = Math.max(0, 1.5 - (t % 2) * 1.5);
        bones.torso.rotation.x = 0.8;
        const flail = Math.sin(t * 12) * 0.8;
        if (bones.rightArm) bones.rightArm.rotation.x = -1.2 + flail;
        if (bones.leftArm) bones.leftArm.rotation.x = -1.2 - flail;
        if (bones.rightLeg) bones.rightLeg.rotation.x = flail;
        if (bones.leftLeg) bones.leftLeg.rotation.x = -flail;
        break;
      }

      case 'victory': {
        const cheerCycle = t * 7;
        const jumpY = Math.abs(Math.sin(cheerCycle * 0.5)) * 0.3;
        bones.root.position.y = jumpY;

        // Arms waving high
        const wave = Math.sin(cheerCycle) * 0.4;
        if (bones.rightArm) {
          bones.rightArm.rotation.x = -2.7;
          bones.rightArm.rotation.z = -0.3 + wave;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = -2.7;
          bones.leftArm.rotation.z = 0.3 - wave;
        }
        bones.head.rotation.y = Math.sin(cheerCycle * 0.5) * 0.2;
        break;
      }

      case 'dig_frantic': {
        // High-speed pickaxe mining (MTR 1,000,000 digs style)
        const digSpeed = 16.0;
        const cycle = t * digSpeed;
        const swing = Math.sin(cycle) * 1.1;

        bones.torso.rotation.x = 0.35; // Leaning down into the block
        bones.head.rotation.x = 0.5;   // Staring intently at the target block

        if (bones.rightArm) {
          bones.rightArm.rotation.x = -1.2 + swing;
          bones.rightArm.rotation.y = -0.2;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = 0.3;
          bones.leftArm.rotation.z = -0.2;
        }

        // Slight leg brace
        if (bones.rightLeg) bones.rightLeg.rotation.x = -0.3;
        if (bones.leftLeg) bones.leftLeg.rotation.x = 0.3;
        break;
      }

      case 'parkour_leap': {
        // Huge horizontal parkour jump over red line / gap
        const jumpCycle = (t % 1.6) / 1.6;
        const jumpY = Math.sin(jumpCycle * Math.PI) * 1.1;
        const forwardOffset = (jumpCycle - 0.5) * 2.5;

        bones.root.position.y = jumpY;
        bones.root.position.z = forwardOffset;

        // Superman / hero leap pose
        bones.torso.rotation.x = 0.5;
        bones.head.rotation.x = -0.4;

        if (bones.rightArm) {
          bones.rightArm.rotation.x = -2.4; // reaching forward
          bones.rightArm.rotation.z = -0.2;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = 0.8; // trailing back
          bones.leftArm.rotation.z = -0.3;
        }

        // Legs trailing in flight
        if (bones.rightLeg) bones.rightLeg.rotation.x = 0.6;
        if (bones.leftLeg) bones.leftLeg.rotation.x = 0.9;
        break;
      }

      case 'sad_defeat': {
        // "You won, but at what cost?" dramatic grief pose
        const sadSway = Math.sin(t * 1.5) * 0.04;
        bones.torso.rotation.x = 0.45 + sadSway;
        bones.head.rotation.x = 0.6; // head hangs down
        bones.head.rotation.z = 0.15; // tilted sad

        if (bones.rightArm) {
          bones.rightArm.rotation.x = 0.2;
          bones.rightArm.rotation.z = 0.1;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = 0.2;
          bones.leftArm.rotation.z = -0.1;
        }
        break;
      }

      case 'villager_talk': {
        // Quizzical nodding and "Hrmmm" head tilt
        const nod = Math.sin(t * 5.0) * 0.18;
        const tilt = Math.sin(t * 2.5) * 0.12;
        bones.head.rotation.x = nod;
        bones.head.rotation.y = tilt;

        // Keep arms folded across chest
        if (bones.rightArm) {
          bones.rightArm.rotation.x = -0.7;
          bones.rightArm.rotation.z = -0.35;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = -0.7;
          bones.leftArm.rotation.z = 0.35;
        }
        break;
      }

      case 'villager_panic': {
        // Hilarious Villager running in terror ("Heeeaaah!")
        const runCycle = t * 14.0;
        const swing = Math.sin(runCycle) * 1.1;

        bones.torso.rotation.x = 0.25;
        // Head shaking wildly
        bones.head.rotation.y = Math.sin(t * 15.0) * 0.3;
        bones.head.rotation.z = Math.sin(t * 12.0) * 0.2;

        // Arms thrown up in the air
        if (bones.rightArm) {
          bones.rightArm.rotation.x = -2.8;
          bones.rightArm.rotation.z = Math.sin(runCycle) * 0.4;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = -2.8;
          bones.leftArm.rotation.z = -Math.sin(runCycle) * 0.4;
        }

        if (bones.rightLeg) bones.rightLeg.rotation.x = swing;
        if (bones.leftLeg) bones.leftLeg.rotation.x = -swing;
        break;
      }

      case 'shocked': {
        // Meme shock reaction: step back, hands to head
        bones.root.position.z = -0.3;
        bones.torso.rotation.x = -0.2;
        bones.head.rotation.x = -0.3; // looking up wide-eyed
        bones.head.rotation.z = Math.sin(t * 20.0) * 0.05; // shuddering

        // Hands to face / head
        if (bones.rightArm) {
          bones.rightArm.rotation.x = -2.2;
          bones.rightArm.rotation.z = -0.6;
          bones.rightArm.rotation.y = -0.4;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = -2.2;
          bones.leftArm.rotation.z = 0.6;
          bones.leftArm.rotation.y = 0.4;
        }
        break;
      }

      default:
        break;
    }

    // Restore hurt state if not explicitly in hurt anim
    if (anim !== 'hurt') {
      rig.setHurtState(false);
    }
  }

  private static applyCreeperAnimation(rig: MinecraftRig, anim: AnimationType, t: number) {
    const bones = rig.bones;

    if (anim === 'creeper_walk' || anim === 'walk' || anim === 'run') {
      const cycle = t * (anim === 'run' ? 8.0 : 5.0);
      const swing = Math.sin(cycle) * 0.5;

      // Creeper 4-leg alternating walk
      if (bones.legFL) bones.legFL.rotation.x = swing;
      if (bones.legBR) bones.legBR.rotation.x = swing;
      if (bones.legFR) bones.legFR.rotation.x = -swing;
      if (bones.legBL) bones.legBL.rotation.x = -swing;

      // Creeper curious head tilt
      bones.head.rotation.z = Math.sin(t * 2) * 0.15;
      bones.head.rotation.y = Math.sin(t * 1.5) * 0.2;
    } else if (anim === 'creeper_ignite') {
      // Swelling / pulsating White before explosion
      const pulse = 1.0 + Math.sin(t * 20) * 0.15;
      bones.root.scale.set(pulse, pulse * 1.05, pulse);
      bones.head.rotation.x = -0.2;
      // Vibrate position
      bones.root.position.x = (Math.random() - 0.5) * 0.05;
      bones.root.position.z = (Math.random() - 0.5) * 0.05;
      rig.setHurtState(Math.sin(t * 20) > 0);
    } else {
      // Creeper Idle
      bones.root.scale.set(1, 1, 1);
      bones.head.rotation.y = Math.sin(t * 1.2) * 0.15;
      bones.head.rotation.z = Math.sin(t * 0.8) * 0.08;
      rig.setHurtState(false);
    }
  }

  private static resetPose(rig: MinecraftRig) {
    const bones = rig.bones;
    bones.root.position.set(0, 0, 0);
    bones.root.scale.set(1, 1, 1);
    bones.torso.rotation.set(0, 0, 0);
    bones.head.rotation.set(0, 0, 0);

    if (bones.rightArm) bones.rightArm.rotation.set(0, 0, 0);
    if (bones.leftArm) bones.leftArm.rotation.set(0, 0, 0);
    if (bones.rightLeg) bones.rightLeg.rotation.set(0, 0, 0);
    if (bones.leftLeg) bones.leftLeg.rotation.set(0, 0, 0);

    if (bones.legFL) bones.legFL.rotation.set(0, 0, 0);
    if (bones.legFR) bones.legFR.rotation.set(0, 0, 0);
    if (bones.legBL) bones.legBL.rotation.set(0, 0, 0);
    if (bones.legBR) bones.legBR.rotation.set(0, 0, 0);

    // Keep zombie arms forward
    if (rig.type === 'zombie') {
      if (bones.rightArm) bones.rightArm.rotation.x = -Math.PI / 2;
      if (bones.leftArm) bones.leftArm.rotation.x = -Math.PI / 2;
    }
  }
}
