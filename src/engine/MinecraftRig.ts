import * as THREE from 'three';
import type { CharacterType, HeldItemType } from '../storyboard/types';

import { generateCharacterSkinCanvas, createPixelTexture, loadCustomSkinTexture } from './MinecraftSkinTextures';
import { ItemLibrary } from './ItemLibrary';

// Helper to configure UV coordinates on Three.js BoxGeometry
function setBoxUVs(
  geometry: THREE.BoxGeometry,
  u: number,
  v: number,
  w: number,
  h: number,
  d: number,
  texW = 64,
  texH = 64
) {
  // Face specifications according to Minecraft Skin Spec:
  // 0: +X (Right)  -> [u, v + d, d, h]
  // 1: -X (Left)   -> [u + d + w, v + d, d, h]
  // 2: +Y (Top)    -> [u + d, v, w, d]
  // 3: -Y (Bottom) -> [u + d + w, v, w, d]
  // 4: +Z (Front)  -> [u + d, v + d, w, h]
  // 5: -Z (Back)   -> [u + 2*d + w, v + d, w, h]
  const faces = [
    { x: u, y: v + d, w: d, h: h },             // +X (Right)
    { x: u + d + w, y: v + d, w: d, h: h },     // -X (Left)
    { x: u + d, y: v, w: w, h: d },             // +Y (Top)
    { x: u + d + w, y: v, w: w, h: d },         // -Y (Bottom)
    { x: u + d, y: v + d, w: w, h: h },         // +Z (Front)
    { x: u + 2 * d + w, y: v + d, w: w, h: h }, // -Z (Back)
  ];

  const uvAttr = geometry.attributes.uv;
  let offset = 0;

  for (let i = 0; i < 6; i++) {
    const f = faces[i];
    const u0 = f.x / texW;
    const u1 = (f.x + f.w) / texW;
    const v1 = 1 - f.y / texH;
    const v0 = 1 - (f.y + f.h) / texH;

    // Three.js BoxGeometry vertex order per face:
    // (u0, v1), (u1, v1), (u0, v0), (u1, v0)
    uvAttr.setXY(offset + 0, u0, v1);
    uvAttr.setXY(offset + 1, u1, v1);
    uvAttr.setXY(offset + 2, u0, v0);
    uvAttr.setXY(offset + 3, u1, v0);

    offset += 4;
  }

  uvAttr.needsUpdate = true;
}

export interface CharacterBones {
  root: THREE.Group;
  head: THREE.Group;
  torso: THREE.Group;
  rightArm?: THREE.Group;
  leftArm?: THREE.Group;
  rightLeg?: THREE.Group;
  leftLeg?: THREE.Group;
  // Creeper legs
  legFL?: THREE.Group;
  legFR?: THREE.Group;
  legBL?: THREE.Group;
  legBR?: THREE.Group;
  // Sockets for items
  rightHandSocket?: THREE.Group;
  leftHandSocket?: THREE.Group;
}

export class MinecraftRig {
  public group: THREE.Group;
  public bones: CharacterBones;
  public type: CharacterType;
  public skinTexture: THREE.Texture;
  private material: THREE.MeshStandardMaterial;
  private overlayMaterial: THREE.MeshStandardMaterial;
  private hurtMaterial: THREE.MeshStandardMaterial;
  private isHurtState = false;
  private currentHeldItem: HeldItemType = 'none';

  constructor(type: CharacterType = 'steve', customSkinTexture?: THREE.Texture) {
    this.type = type;
    this.group = new THREE.Group();
    this.group.name = `character_${type}`;

    // Base skin texture
    if (customSkinTexture) {
      this.skinTexture = customSkinTexture;
    } else {
      const canvas = generateCharacterSkinCanvas(type);
      this.skinTexture = createPixelTexture(canvas);
    }

    // Material with pixel sharpness
    this.material = new THREE.MeshStandardMaterial({
      map: this.skinTexture,
      roughness: 0.9,
      metalness: 0.05,
    });

    this.overlayMaterial = new THREE.MeshStandardMaterial({
      map: this.skinTexture,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      alphaTest: 0.1,
      depthWrite: true,
    });

    this.hurtMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3333,
      roughness: 0.5,
      emissive: 0xaa1111,
    });

    if (type === 'creeper') {
      this.bones = this.buildCreeperRig();
    } else {
      this.bones = this.buildHumanoidRig();
    }
  }

  private buildHumanoidRig(): CharacterBones {
    const root = new THREE.Group();
    this.group.add(root);

    // Humanoid scale: 1 pixel = 0.0625 Three units
    // Torso: 8x12x4 (0.5 x 0.75 x 0.25)
    // Head: 8x8x8 (0.5 x 0.5 x 0.5)
    // Arm: 4x12x4 (0.25 x 0.75 x 0.25) [Alex: 3x12x4]
    // Leg: 4x12x4 (0.25 x 0.75 x 0.25)
    const P = 0.0625; // 1 pixel
    const armW = this.type === 'alex' ? 3 * P : 4 * P;

    // --- Torso Bone ---
    const torso = new THREE.Group();
    torso.position.y = 12 * P; // Hip height = 0.75
    root.add(torso);

    const torsoGeo = new THREE.BoxGeometry(8 * P, 12 * P, 4 * P);
    setBoxUVs(torsoGeo, 16, 16, 8, 12, 4);
    const torsoMesh = new THREE.Mesh(torsoGeo, this.material);
    torsoMesh.position.y = 6 * P;
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    // Torso Jacket (2nd layer)
    const jacketGeo = new THREE.BoxGeometry(8.5 * P, 12.5 * P, 4.5 * P);
    setBoxUVs(jacketGeo, 16, 32, 8, 12, 4);
    const jacketMesh = new THREE.Mesh(jacketGeo, this.overlayMaterial);
    jacketMesh.position.y = 6 * P;
    torso.add(jacketMesh);

    // --- Head Bone ---
    const head = new THREE.Group();
    head.position.y = 12 * P; // Neck top of torso
    torso.add(head);

    const headGeo = new THREE.BoxGeometry(8 * P, 8 * P, 8 * P);
    setBoxUVs(headGeo, 0, 0, 8, 8, 8);
    const headMesh = new THREE.Mesh(headGeo, this.material);
    headMesh.position.y = 4 * P;
    headMesh.castShadow = true;
    head.add(headMesh);

    // Hat / Hair (2nd layer)
    const hatGeo = new THREE.BoxGeometry(8.8 * P, 8.8 * P, 8.8 * P);
    setBoxUVs(hatGeo, 32, 0, 8, 8, 8);
    const hatMesh = new THREE.Mesh(hatGeo, this.overlayMaterial);
    hatMesh.position.y = 4 * P;
    head.add(hatMesh);

    // --- Right Arm Bone ---
    const rightArm = new THREE.Group();
    rightArm.position.set(-4 * P - armW / 2, 11 * P, 0); // Shoulder
    torso.add(rightArm);

    const rightArmGeo = new THREE.BoxGeometry(armW, 12 * P, 4 * P);
    setBoxUVs(rightArmGeo, 40, 16, 4, 12, 4);
    const rightArmMesh = new THREE.Mesh(rightArmGeo, this.material);
    rightArmMesh.position.y = -5 * P;
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);

    // Right Arm Sleeve (2nd layer)
    const rightSleeveGeo = new THREE.BoxGeometry(armW + 0.4 * P, 12.4 * P, 4.4 * P);
    setBoxUVs(rightSleeveGeo, 40, 32, 4, 12, 4);
    const rightSleeveMesh = new THREE.Mesh(rightSleeveGeo, this.overlayMaterial);
    rightSleeveMesh.position.y = -5 * P;
    rightArm.add(rightSleeveMesh);

    // Right Hand Socket for held items
    const rightHandSocket = new THREE.Group();
    rightHandSocket.position.set(0, -10 * P, 1 * P);
    rightArm.add(rightHandSocket);

    // --- Left Arm Bone ---
    const leftArm = new THREE.Group();
    leftArm.position.set(4 * P + armW / 2, 11 * P, 0); // Shoulder
    torso.add(leftArm);

    const leftArmGeo = new THREE.BoxGeometry(armW, 12 * P, 4 * P);
    setBoxUVs(leftArmGeo, 32, 48, 4, 12, 4);
    const leftArmMesh = new THREE.Mesh(leftArmGeo, this.material);
    leftArmMesh.position.y = -5 * P;
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);

    // Left Arm Sleeve (2nd layer)
    const leftSleeveGeo = new THREE.BoxGeometry(armW + 0.4 * P, 12.4 * P, 4.4 * P);
    setBoxUVs(leftSleeveGeo, 48, 48, 4, 12, 4);
    const leftSleeveMesh = new THREE.Mesh(leftSleeveGeo, this.overlayMaterial);
    leftSleeveMesh.position.y = -5 * P;
    leftArm.add(leftSleeveMesh);

    const leftHandSocket = new THREE.Group();
    leftHandSocket.position.set(0, -10 * P, 1 * P);
    leftArm.add(leftHandSocket);

    // --- Right Leg Bone ---
    const rightLeg = new THREE.Group();
    rightLeg.position.set(-2 * P, 0, 0); // Hip
    root.add(rightLeg);

    const rightLegGeo = new THREE.BoxGeometry(4 * P, 12 * P, 4 * P);
    setBoxUVs(rightLegGeo, 0, 16, 4, 12, 4);
    const rightLegMesh = new THREE.Mesh(rightLegGeo, this.material);
    rightLegMesh.position.y = 6 * P;
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);

    // Right Pant (2nd layer)
    const rightPantGeo = new THREE.BoxGeometry(4.4 * P, 12.4 * P, 4.4 * P);
    setBoxUVs(rightPantGeo, 0, 32, 4, 12, 4);
    const rightPantMesh = new THREE.Mesh(rightPantGeo, this.overlayMaterial);
    rightPantMesh.position.y = 6 * P;
    rightLeg.add(rightPantMesh);

    // --- Left Leg Bone ---
    const leftLeg = new THREE.Group();
    leftLeg.position.set(2 * P, 0, 0); // Hip
    root.add(leftLeg);

    const leftLegGeo = new THREE.BoxGeometry(4 * P, 12 * P, 4 * P);
    setBoxUVs(leftLegGeo, 16, 48, 4, 12, 4);
    const leftLegMesh = new THREE.Mesh(leftLegGeo, this.material);
    leftLegMesh.position.y = 6 * P;
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);

    // Left Pant (2nd layer)
    const leftPantGeo = new THREE.BoxGeometry(4.4 * P, 12.4 * P, 4.4 * P);
    setBoxUVs(leftPantGeo, 0, 48, 4, 12, 4);
    const leftPantMesh = new THREE.Mesh(leftPantGeo, this.overlayMaterial);
    leftPantMesh.position.y = 6 * P;
    leftLeg.add(leftPantMesh);

    // Special pose for Zombie: arms permanently raised forward
    if (this.type === 'zombie') {
      rightArm.rotation.x = -Math.PI / 2;
      leftArm.rotation.x = -Math.PI / 2;
    }

    return {
      root,
      head,
      torso,
      rightArm,
      leftArm,
      rightLeg,
      leftLeg,
      rightHandSocket,
      leftHandSocket,
    };
  }

  private buildCreeperRig(): CharacterBones {
    const root = new THREE.Group();
    this.group.add(root);

    const P = 0.0625;

    // Creeper Torso (8x12x4)
    const torso = new THREE.Group();
    torso.position.y = 6 * P;
    root.add(torso);

    const torsoGeo = new THREE.BoxGeometry(8 * P, 12 * P, 4 * P);
    setBoxUVs(torsoGeo, 16, 16, 8, 12, 4);
    const torsoMesh = new THREE.Mesh(torsoGeo, this.material);
    torsoMesh.position.y = 6 * P;
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    // Creeper Head (8x8x8)
    const head = new THREE.Group();
    head.position.y = 12 * P;
    torso.add(head);

    const headGeo = new THREE.BoxGeometry(8 * P, 8 * P, 8 * P);
    setBoxUVs(headGeo, 0, 0, 8, 8, 8);
    const headMesh = new THREE.Mesh(headGeo, this.material);
    headMesh.position.y = 4 * P;
    headMesh.castShadow = true;
    head.add(headMesh);

    // 4 Creeper Legs (4x6x4 each)
    const legGeo = new THREE.BoxGeometry(4 * P, 6 * P, 4 * P);
    setBoxUVs(legGeo, 0, 16, 4, 6, 4);

    const createLeg = (x: number, z: number) => {
      const leg = new THREE.Group();
      leg.position.set(x, 0, z);
      root.add(leg);

      const legMesh = new THREE.Mesh(legGeo, this.material);
      legMesh.position.y = 3 * P;
      legMesh.castShadow = true;
      leg.add(legMesh);
      return leg;
    };

    const legFL = createLeg(-2 * P, 2 * P);
    const legFR = createLeg(2 * P, 2 * P);
    const legBL = createLeg(-2 * P, -2 * P);
    const legBR = createLeg(2 * P, -2 * P);

    return {
      root,
      head,
      torso,
      legFL,
      legFR,
      legBL,
      legBR,
    };
  }

  // Update skin texture with custom image
  public async setCustomSkin(dataUrl: string) {
    try {
      const texture = await loadCustomSkinTexture(dataUrl);
      this.skinTexture = texture;
      this.material.map = texture;
      this.material.needsUpdate = true;
      this.overlayMaterial.map = texture;
      this.overlayMaterial.needsUpdate = true;
    } catch (err) {
      console.error('Failed to load custom skin:', err);
    }
  }

  // Equip held weapon / item in right hand socket
  public equipItem(type: HeldItemType) {
    this.currentHeldItem = type;
    if (!this.bones.rightHandSocket) return;

    // Clear previous items
    while (this.bones.rightHandSocket.children.length > 0) {
      this.bones.rightHandSocket.remove(this.bones.rightHandSocket.children[0]);
    }

    if (type !== 'none') {
      const itemMesh = ItemLibrary.createItem(type);
      if (itemMesh) {
        this.bones.rightHandSocket.add(itemMesh);
      }
    }
  }

  // Flash character red for damage/hit reaction
  public setHurtState(isHurt: boolean) {
    if (this.isHurtState === isHurt) return;
    this.isHurtState = isHurt;

    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (isHurt) {
          obj.material = this.hurtMaterial;
        } else {
          // restore
          if (obj.geometry.parameters?.width > 0.51) {
            obj.material = this.overlayMaterial;
          } else {
            obj.material = this.material;
          }
        }
      }
    });
  }

  // Dispose materials and textures
  public dispose() {
    this.material.dispose();
    this.overlayMaterial.dispose();
    this.hurtMaterial.dispose();
    this.skinTexture.dispose();
  }
}
