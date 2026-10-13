import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  public group: THREE.Group;
  private particles: Particle[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'particle_system';
  }

  // Spawns critical hit sparkles
  public spawnCritParticles(position: THREE.Vector3, count = 12) {
    const geo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const mat = new THREE.MeshBasicMaterial({ color: 0x4df2ff });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(position).add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        )
      );

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2.5,
        Math.random() * 2.0 + 0.5,
        (Math.random() - 0.5) * 2.5
      );

      this.group.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
      });
    }
  }

  // Spawns explosion smoke cloud
  public spawnExplosion(position: THREE.Vector3, count = 24) {
    const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const smokeColors = [0xdddddd, 0xbbbbbb, 0x999999, 0xff7722];

    for (let i = 0; i < count; i++) {
      const color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(position).add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.6
        )
      );

      const speed = 2.0 + Math.random() * 3.5;
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * speed,
        Math.random() * speed + 1.0,
        (Math.random() - 0.5) * speed
      );

      this.group.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.5,
      });
    }
  }

  public update(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        this.group.remove(p.mesh);
        p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) {
          p.mesh.material.forEach((m) => m.dispose());
        } else {
          p.mesh.material.dispose();
        }
        this.particles.splice(i, 1);
        continue;
      }

      // Physics update
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= 3.5 * delta; // Gravity

      // Scale down over life
      const scale = 1 - p.life / p.maxLife;
      p.mesh.scale.set(scale, scale, scale);
    }
  }

  public clear() {
    for (const p of this.particles) {
      this.group.remove(p.mesh);
    }
    this.particles = [];
  }
}
