import * as THREE from 'three';
import type { HeldItemType } from '../storyboard/types';


// Pixel art style procedural 3D Minecraft Items
export class ItemLibrary {
  private static sharedMaterials: Record<string, THREE.Material> = {};

  private static getMaterial(colorHex: number, emissive: number = 0): THREE.MeshStandardMaterial {
    const key = `${colorHex}_${emissive}`;
    if (!this.sharedMaterials[key]) {
      this.sharedMaterials[key] = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.8,
        metalness: 0.1,
        emissive: emissive,
      });
    }
    return this.sharedMaterials[key] as THREE.MeshStandardMaterial;
  }

  public static createItem(type: HeldItemType): THREE.Group | null {
    if (type === 'none') return null;

    const group = new THREE.Group();
    group.name = `item_${type}`;

    if (type === 'diamond_sword' || type === 'iron_sword') {
      const isDiamond = type === 'diamond_sword';
      const bladeColor = isDiamond ? 0x2cd8d5 : 0xd8d8d8;
      const bladeDark = isDiamond ? 0x1d9593 : 0xa0a0a0;
      const hiltColor = 0x5a3d28;
      const guardColor = isDiamond ? 0x1d9593 : 0x707070;

      // Hilt / Handle (length 0.5)
      const hiltGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
      const hiltMesh = new THREE.Mesh(hiltGeo, this.getMaterial(hiltColor));
      hiltMesh.position.y = -0.2;
      group.add(hiltMesh);

      // Pommel
      const pommelGeo = new THREE.BoxGeometry(0.14, 0.1, 0.14);
      const pommelMesh = new THREE.Mesh(pommelGeo, this.getMaterial(guardColor));
      pommelMesh.position.y = -0.42;
      group.add(pommelMesh);

      // Guard / Crossguard
      const guardGeo = new THREE.BoxGeometry(0.5, 0.1, 0.14);
      const guardMesh = new THREE.Mesh(guardGeo, this.getMaterial(guardColor));
      guardMesh.position.y = 0.05;
      group.add(guardMesh);

      // Blade Core (length 1.3)
      const bladeGeo = new THREE.BoxGeometry(0.18, 1.2, 0.06);
      const bladeMesh = new THREE.Mesh(bladeGeo, this.getMaterial(bladeColor));
      bladeMesh.position.y = 0.7;
      group.add(bladeMesh);

      // Blade Tip (diamond edge)
      const tipGeo = new THREE.BoxGeometry(0.12, 0.2, 0.06);
      const tipMesh = new THREE.Mesh(tipGeo, this.getMaterial(bladeDark));
      tipMesh.position.y = 1.35;
      group.add(tipMesh);

      // Scale to Minecraft hand proportions
      group.scale.set(0.9, 0.9, 0.9);
      // Pivot offset for hand holding
      group.position.set(0, -0.15, 0.1);
      group.rotation.x = Math.PI / 4; // slight forward ready angle

    } else if (type === 'diamond_pickaxe') {
      const handleColor = 0x5a3d28;
      const diamondColor = 0x2cd8d5;

      // Handle shaft
      const shaftGeo = new THREE.BoxGeometry(0.1, 1.4, 0.1);
      const shaftMesh = new THREE.Mesh(shaftGeo, this.getMaterial(handleColor));
      shaftMesh.position.y = 0.3;
      group.add(shaftMesh);

      // Pickaxe head (curved pick)
      const headCenterGeo = new THREE.BoxGeometry(0.3, 0.16, 0.14);
      const headCenter = new THREE.Mesh(headCenterGeo, this.getMaterial(diamondColor));
      headCenter.position.y = 1.0;
      group.add(headCenter);

      const leftProngGeo = new THREE.BoxGeometry(0.4, 0.14, 0.14);
      const leftProng = new THREE.Mesh(leftProngGeo, this.getMaterial(diamondColor));
      leftProng.position.set(-0.3, 0.95, 0);
      leftProng.rotation.z = 0.2;
      group.add(leftProng);

      const rightProngGeo = new THREE.BoxGeometry(0.4, 0.14, 0.14);
      const rightProng = new THREE.Mesh(rightProngGeo, this.getMaterial(diamondColor));
      rightProng.position.set(0.3, 0.95, 0);
      rightProng.rotation.z = -0.2;
      group.add(rightProng);

      group.scale.set(0.85, 0.85, 0.85);
      group.rotation.x = Math.PI / 3;

    } else if (type === 'bow') {
      const woodColor = 0x5a3d28;
      const stringColor = 0xdddddd;

      // Bow Stave (three segments)
      const centerGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
      const center = new THREE.Mesh(centerGeo, this.getMaterial(woodColor));
      group.add(center);

      const topGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
      const top = new THREE.Mesh(topGeo, this.getMaterial(woodColor));
      top.position.set(0, 0.6, -0.15);
      top.rotation.x = -0.5;
      group.add(top);

      const btmGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
      const btm = new THREE.Mesh(btmGeo, this.getMaterial(woodColor));
      btm.position.set(0, -0.6, -0.15);
      btm.rotation.x = 0.5;
      group.add(btm);

      // Bowstring
      const stringGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4);
      const stringMesh = new THREE.Mesh(stringGeo, this.getMaterial(stringColor));
      stringMesh.position.set(0, 0, -0.3);
      group.add(stringMesh);

      group.scale.set(0.9, 0.9, 0.9);

    } else if (type === 'torch') {
      const woodColor = 0x6e4a27;
      const flameColor = 0xffaa00;

      // Wooden Stick
      const stickGeo = new THREE.BoxGeometry(0.12, 0.8, 0.12);
      const stick = new THREE.Mesh(stickGeo, this.getMaterial(woodColor));
      stick.position.y = 0.2;
      group.add(stick);

      // Glowing flame head
      const flameGeo = new THREE.BoxGeometry(0.14, 0.2, 0.14);
      const flameMat = new THREE.MeshBasicMaterial({ color: flameColor });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 0.65;
      group.add(flame);

      // Local point light
      const torchLight = new THREE.PointLight(0xffaa44, 2, 8);
      torchLight.position.set(0, 0.8, 0);
      group.add(torchLight);

      group.scale.set(0.9, 0.9, 0.9);
      group.rotation.x = Math.PI / 6;

    } else if (type === 'tnt') {
      // Small handheld TNT block (0.6x0.6x0.6)
      const tntGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      const tntMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.9 });
      const tntMesh = new THREE.Mesh(tntGeo, tntMat);
      
      // White TNT band
      const bandGeo = new THREE.BoxGeometry(0.62, 0.2, 0.62);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
      const band = new THREE.Mesh(bandGeo, bandMat);
      
      group.add(tntMesh);
      group.add(band);
      group.position.set(0, 0.1, 0.3);
    }

    return group;
  }
}
