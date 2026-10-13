import * as THREE from 'three';
import type { CameraPreset } from '../storyboard/types';

export class CameraDirector {
  public camera: THREE.PerspectiveCamera;
  private currentPreset: CameraPreset = 'FollowActor';
  private targetPosition: THREE.Vector3 = new THREE.Vector3(0, 1.2, 0);
  private cameraShakeIntensity: number = 0;
  private shakeTime: number = 0;

  constructor(aspect = 9 / 16) {
    // 60 degree vertical FOV for authentic Minecraft view
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.05, 100);
    this.camera.position.set(0, 2.0, 4.0);
    this.camera.lookAt(0, 1.0, 0);
  }

  public setPreset(preset: CameraPreset) {
    this.currentPreset = preset;
  }

  public getPreset(): CameraPreset {
    return this.currentPreset;
  }

  public triggerShake(intensity = 0.4) {
    this.cameraShakeIntensity = Math.max(this.cameraShakeIntensity, intensity);
  }

  public update(
    time: number,
    actorPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    actorRotY: number = 0,
    isFreeOrbit = false
  ) {
    if (isFreeOrbit) {
      return;
    }

    const targetLookAt = actorPos.clone().add(new THREE.Vector3(0, 1.1, 0));

    switch (this.currentPreset) {
      case 'FirstPersonPOV': {
        // Authentic Minecraft First-Person view (Eye height = 1.62)
        // Add subtle view-bobbing (like in real Minecraft game settings)
        const bob = Math.sin(time * 10) * 0.035;
        const eyePos = actorPos.clone().add(new THREE.Vector3(0, 1.62 + bob, 0));
        this.camera.position.copy(eyePos);

        // Look forward in the direction actor is facing, slightly downward toward crosshair
        const forwardX = Math.sin(actorRotY);
        const forwardZ = Math.cos(actorRotY);
        const lookTarget = eyePos.clone().add(new THREE.Vector3(forwardX * 4, -0.4, forwardZ * 4));
        this.camera.lookAt(lookTarget);
        break;
      }

      case 'ThirdPersonBack': {
        // Authentic Minecraft F5 rear camera
        const forwardX = Math.sin(actorRotY);
        const forwardZ = Math.cos(actorRotY);
        const idealCamPos = actorPos.clone().add(
          new THREE.Vector3(-forwardX * 3.2, 1.85, -forwardZ * 3.2)
        );
        this.camera.position.lerp(idealCamPos, 0.15);
        const lookTarget = actorPos.clone().add(new THREE.Vector3(forwardX * 3, 1.3, forwardZ * 3));
        this.targetPosition.lerp(lookTarget, 0.18);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'ThirdPersonFront': {
        // Reverse F5 selfie / reaction face view (Cash & MTR reaction shots)
        const forwardX = Math.sin(actorRotY);
        const forwardZ = Math.cos(actorRotY);
        const idealCamPos = actorPos.clone().add(
          new THREE.Vector3(forwardX * 2.5, 1.6, forwardZ * 2.5)
        );
        this.camera.position.lerp(idealCamPos, 0.18);
        const lookTarget = actorPos.clone().add(new THREE.Vector3(0, 1.45, 0));
        this.targetPosition.lerp(lookTarget, 0.2);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'SideTracking': {
        // Side-view tracking angle (MTR red line parkour jump / JahCub chase)
        const idealCamPos = new THREE.Vector3(actorPos.x + 4.2, actorPos.y + 1.3, actorPos.z);
        this.camera.position.lerp(idealCamPos, 0.15);
        this.targetPosition.lerp(actorPos.clone().add(new THREE.Vector3(0, 1.0, 0)), 0.18);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'OverTheShoulder': {
        // Over right shoulder dialogue angle (trading with Villager)
        const idealCamPos = actorPos.clone().add(new THREE.Vector3(0.55, 1.5, 1.8));
        this.camera.position.lerp(idealCamPos, 0.14);
        this.targetPosition.lerp(actorPos.clone().add(new THREE.Vector3(-0.2, 1.3, -2.5)), 0.16);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'FollowActor': {
        // Smooth over-the-shoulder chase
        const idealCamPos = actorPos.clone().add(new THREE.Vector3(0, 1.4, 3.4));
        this.camera.position.lerp(idealCamPos, 0.12);
        this.targetPosition.lerp(targetLookAt, 0.15);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'LowAngleHero': {
        // Dramatic low angle looking upward
        const idealCamPos = actorPos.clone().add(new THREE.Vector3(0.5, 0.35, 2.4));
        this.camera.position.lerp(idealCamPos, 0.15);
        this.targetPosition.lerp(targetLookAt.clone().add(new THREE.Vector3(0, 0.4, 0)), 0.15);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'CloseUpFace': {
        // Tight face portrait framing
        const idealCamPos = actorPos.clone().add(new THREE.Vector3(0, 1.45, 1.7));
        this.camera.position.lerp(idealCamPos, 0.18);
        this.targetPosition.lerp(actorPos.clone().add(new THREE.Vector3(0, 1.45, 0)), 0.18);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'Orbit': {
        // Cinematic rotating sweep
        const radius = 4.2;
        const angle = time * 0.8;
        const camX = actorPos.x + Math.sin(angle) * radius;
        const camZ = actorPos.z + Math.cos(angle) * radius;
        const idealCamPos = new THREE.Vector3(camX, actorPos.y + 1.8, camZ);
        this.camera.position.lerp(idealCamPos, 0.1);
        this.targetPosition.lerp(targetLookAt, 0.15);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'WideReveal': {
        // Wide establishing shot
        const idealCamPos = new THREE.Vector3(0, 3.8, 7.5);
        this.camera.position.lerp(idealCamPos, 0.1);
        this.targetPosition.lerp(new THREE.Vector3(0, 1.0, 0), 0.1);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      case 'TopDownIsometric': {
        const idealCamPos = actorPos.clone().add(new THREE.Vector3(4.0, 6.0, 4.0));
        this.camera.position.lerp(idealCamPos, 0.1);
        this.targetPosition.lerp(actorPos.clone().add(new THREE.Vector3(0, 0.5, 0)), 0.15);
        this.camera.lookAt(this.targetPosition);
        break;
      }

      default:
        this.camera.lookAt(targetLookAt);
        break;
    }

    // Apply Camera Shake decay
    if (this.cameraShakeIntensity > 0.005) {
      this.shakeTime += 0.2;
      const shakeX = (Math.sin(this.shakeTime * 45) + Math.cos(this.shakeTime * 67)) * 0.5 * this.cameraShakeIntensity;
      const shakeY = (Math.cos(this.shakeTime * 53) + Math.sin(this.shakeTime * 79)) * 0.5 * this.cameraShakeIntensity;
      this.camera.position.x += shakeX;
      this.camera.position.y += shakeY;
      this.cameraShakeIntensity *= 0.90;
    } else {
      this.cameraShakeIntensity = 0;
    }
  }

  public setAspect(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
