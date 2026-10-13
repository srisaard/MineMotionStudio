import * as THREE from 'three';
import type { CameraPreset } from '../storyboard/types';


export class CameraDirector {
  public camera: THREE.PerspectiveCamera;
  private currentPreset: CameraPreset = 'FollowActor';
  private targetPosition: THREE.Vector3 = new THREE.Vector3(0, 1.2, 0);
  private cameraShakeIntensity: number = 0;
  private shakeTime: number = 0;

  constructor(aspect = 9 / 16) {
    // 55 degree vertical FOV for mobile vertical framing
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
    this.camera.position.set(0, 2.0, 4.0);
    this.camera.lookAt(0, 1.0, 0);
  }

  public setPreset(preset: CameraPreset) {
    this.currentPreset = preset;
  }

  public triggerShake(intensity = 0.4) {
    this.cameraShakeIntensity = Math.max(this.cameraShakeIntensity, intensity);
  }

  public update(
    time: number,
    actorPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    isFreeOrbit = false
  ) {
    if (isFreeOrbit) {
      return; // Handled by OrbitControls if enabled
    }

    const targetLookAt = actorPos.clone().add(new THREE.Vector3(0, 1.1, 0));

    switch (this.currentPreset) {
      case 'FollowActor': {
        // Over the shoulder / chase camera
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
      this.cameraShakeIntensity *= 0.90; // Dampen
    } else {
      this.cameraShakeIntensity = 0;
    }
  }

  public setAspect(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
