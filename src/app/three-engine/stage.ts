import * as THREE from 'three';
import { createNoiseTexture } from './textureUtils';

export class Stage {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
    this.buildFloor();
    this.buildPodium();
    this.buildPillars();
  }

  private buildFloor() {
    const texture = createNoiseTexture();
    const mat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.8,
        bumpMap: texture,
        bumpScale: 0.5
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), mat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.mesh.add(floor);
  }

  private buildPodium() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x880000, roughness: 0.5 });
    const podium = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 6), mat);
    podium.position.y = 0.5;
    podium.receiveShadow = true;
    this.mesh.add(podium);
  }

  private buildPillars() {
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
    const geo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const positions = [[-8, -8], [8, -8], [-8, -4], [8, -4]];

    positions.forEach(pos => {
        const pillar = new THREE.Mesh(geo, mat);
        pillar.position.set(pos[0], 4, pos[1]);
        pillar.castShadow = true;
        this.mesh.add(pillar);
    });
  }
}