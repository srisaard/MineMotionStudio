import * as THREE from 'three';

export class VoxelWorld {
  public group: THREE.Group;
  private clouds: THREE.Group[] = [];
  private sunMesh: THREE.Mesh;
  private moonMesh: THREE.Mesh;
  public dirLight: THREE.DirectionalLight;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'voxel_world';

    // 1. Terrain Ground
    this.buildTerrain();

    // 2. Oak Trees & Scenery Foliage
    this.buildTrees();

    // 3. Torches with ambient glow
    this.buildTorches();

    // 4. Cubic Clouds
    this.buildClouds();

    // 5. Sun and Moon
    const { sun, moon, dirLight } = this.buildCelestialAndLighting();
    this.sunMesh = sun;
    this.moonMesh = moon;
    this.dirLight = dirLight;
  }

  private buildTerrain() {
    const blockSize = 1.0;
    const terrainGroup = new THREE.Group();
    terrainGroup.name = 'terrain_blocks';

    // Create grass canvas texture (16x16 pixelated)
    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = 16;
    grassCanvas.height = 16;
    const gctx = grassCanvas.getContext('2d')!;
    const greens = ['#5e9b38', '#538a32', '#64a63b', '#487c2b'];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        gctx.fillStyle = greens[(x * 3 + y * 7) % greens.length];
        gctx.fillRect(x, y, 1, 1);
      }
    }
    const grassTopTex = new THREE.CanvasTexture(grassCanvas);
    grassTopTex.magFilter = THREE.NearestFilter;
    grassTopTex.minFilter = THREE.NearestFilter;

    // Grass side canvas (green top fringe + dirt)
    const sideCanvas = document.createElement('canvas');
    sideCanvas.width = 16;
    sideCanvas.height = 16;
    const sctx = sideCanvas.getContext('2d')!;
    const browns = ['#866043', '#725138', '#63442e', '#916b4a'];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        if (y < 3 || (y === 3 && (x % 3 === 0 || x % 5 === 0))) {
          sctx.fillStyle = greens[(x * 3 + y * 7) % greens.length];
        } else {
          sctx.fillStyle = browns[(x * 5 + y * 11) % browns.length];
        }
        sctx.fillRect(x, y, 1, 1);
      }
    }
    const grassSideTex = new THREE.CanvasTexture(sideCanvas);
    grassSideTex.magFilter = THREE.NearestFilter;
    grassSideTex.minFilter = THREE.NearestFilter;

    // Stone path canvas
    const stoneCanvas = document.createElement('canvas');
    stoneCanvas.width = 16;
    stoneCanvas.height = 16;
    const scCtx = stoneCanvas.getContext('2d')!;
    const grays = ['#777777', '#888888', '#666666', '#555555'];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        scCtx.fillStyle = grays[(x * 7 + y * 13) % grays.length];
        scCtx.fillRect(x, y, 1, 1);
      }
    }
    const stoneTex = new THREE.CanvasTexture(stoneCanvas);
    stoneTex.magFilter = THREE.NearestFilter;
    stoneTex.minFilter = THREE.NearestFilter;

    const grassMat = [
      new THREE.MeshStandardMaterial({ map: grassSideTex, roughness: 0.9 }), // Right
      new THREE.MeshStandardMaterial({ map: grassSideTex, roughness: 0.9 }), // Left
      new THREE.MeshStandardMaterial({ map: grassTopTex, roughness: 0.9 }),  // Top
      new THREE.MeshStandardMaterial({ color: 0x63442e, roughness: 0.9 }),   // Bottom
      new THREE.MeshStandardMaterial({ map: grassSideTex, roughness: 0.9 }), // Front
      new THREE.MeshStandardMaterial({ map: grassSideTex, roughness: 0.9 }), // Back
    ];

    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.9 });

    const boxGeo = new THREE.BoxGeometry(blockSize, blockSize, blockSize);

    // Build a 16x16 platform with a central dirt/stone path
    const size = 16;
    const half = size / 2;

    for (let x = -half; x < half; x++) {
      for (let z = -half; z < half; z++) {
        const isPath = Math.abs(x) <= 1 && z >= -half && z <= half;
        const mesh = new THREE.Mesh(boxGeo, isPath ? stoneMat : grassMat);
        mesh.position.set(x + 0.5, -0.5, z + 0.5);
        mesh.receiveShadow = true;
        terrainGroup.add(mesh);
      }
    }

    this.group.add(terrainGroup);
  }

  private buildTrees() {
    const treeGroup = new THREE.Group();
    treeGroup.name = 'trees';

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e28, roughness: 0.9 });
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x3d7e28, roughness: 0.8 });

    const blockGeo = new THREE.BoxGeometry(1, 1, 1);

    const makeTree = (baseX: number, baseZ: number, height = 4) => {
      const tree = new THREE.Group();
      // Trunk
      for (let y = 0; y < height; y++) {
        const trunk = new THREE.Mesh(blockGeo, trunkMat);
        trunk.position.set(baseX, y + 0.5, baseZ);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        tree.add(trunk);
      }

      // Leaf crown (3x3x2)
      for (let lx = -2; lx <= 2; lx++) {
        for (let lz = -2; lz <= 2; lz++) {
          for (let ly = height - 1; ly <= height + 1; ly++) {
            // Cut corners for rounded voxel tree canopy
            if (Math.abs(lx) === 2 && Math.abs(lz) === 2 && ly === height + 1) continue;
            if (lx === 0 && lz === 0 && ly < height) continue; // inside trunk

            const leaf = new THREE.Mesh(blockGeo, leavesMat);
            leaf.position.set(baseX + lx, ly + 0.5, baseZ + lz);
            leaf.castShadow = true;
            leaf.receiveShadow = true;
            tree.add(leaf);
          }
        }
      }
      return tree;
    };

    // Plant 4 decorative trees around the perimeter
    treeGroup.add(makeTree(-5, -4, 4));
    treeGroup.add(makeTree(5, -5, 5));
    treeGroup.add(makeTree(-6, 4, 4));
    treeGroup.add(makeTree(6, 3, 4));

    this.group.add(treeGroup);
  }

  private buildTorches() {
    const torchGroup = new THREE.Group();
    torchGroup.name = 'torches';

    const addTorch = (x: number, z: number) => {
      const poleGeo = new THREE.BoxGeometry(0.12, 0.7, 0.12);
      const pole = new THREE.Mesh(poleGeo, new THREE.MeshStandardMaterial({ color: 0x5a3d28 }));
      pole.position.set(x, 0.35, z);
      torchGroup.add(pole);

      const headGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
      const head = new THREE.Mesh(headGeo, new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
      head.position.set(x, 0.75, z);
      torchGroup.add(head);

      const light = new THREE.PointLight(0xff9922, 1.5, 6);
      light.position.set(x, 0.85, z);
      torchGroup.add(light);
    };

    addTorch(-2, -2);
    addTorch(2, 2);

    this.group.add(torchGroup);
  }

  private buildClouds() {
    const cloudsContainer = new THREE.Group();
    cloudsContainer.name = 'clouds';
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });

    // 5 drifting rectangular cubic clouds
    for (let i = 0; i < 6; i++) {
      const w = 4 + Math.random() * 6;
      const d = 3 + Math.random() * 4;
      const cloudGeo = new THREE.BoxGeometry(w, 0.6, d);
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set((Math.random() - 0.5) * 30, 9 + (i % 2) * 1.5, (Math.random() - 0.5) * 30);
      cloudsContainer.add(cloud);
      this.clouds.push(cloudsContainer);
    }

    this.group.add(cloudsContainer);
  }

  private buildCelestialAndLighting() {
    // Ambient Light (subtle daylight fill)
    const ambient = new THREE.AmbientLight(0xd5e3f5, 1.2);
    this.group.add(ambient);

    // Sun Directional Light with soft shadows
    const dirLight = new THREE.DirectionalLight(0xfff3d6, 2.2);
    dirLight.position.set(8, 16, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    const d = 10;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.001;
    this.group.add(dirLight);

    // Minecraft Sun (square billboard)
    const sunGeo = new THREE.PlaneGeometry(3, 3);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffcd4, side: THREE.DoubleSide });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(16, 22, -14);
    sun.lookAt(0, 0, 0);
    this.group.add(sun);

    // Moon
    const moonGeo = new THREE.PlaneGeometry(2.5, 2.5);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xf0f3f8, side: THREE.DoubleSide });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-16, 22, 14);
    moon.lookAt(0, 0, 0);
    this.group.add(moon);

    return { sun, moon, dirLight };
  }

  public update(time: number) {
    // Slowly drift clouds across sky
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i].position.x = (time * 0.3) % 40 - 20;
    }
  }
}
