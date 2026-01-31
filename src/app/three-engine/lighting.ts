import * as THREE from 'three';

export class Lighting {
  group: THREE.Group;
  spotLight: THREE.SpotLight;

  constructor(target: THREE.Object3D) {
    this.group = new THREE.Group();

    // 1. Ambient
    const ambient = new THREE.AmbientLight(0xffffff, 0.1);
    this.group.add(ambient);

    // 2. Haupt-Spot
    this.spotLight = new THREE.SpotLight(0xffaa00, 50);
    this.spotLight.position.set(5, 10, 5);
    this.spotLight.angle = 0.5;
    this.spotLight.penumbra = 0.5;
    this.spotLight.castShadow = true;
    this.spotLight.target = target; // Zielt auf den Pokal
    this.group.add(this.spotLight);

    // 3. Dekorative bunte Lichter
    this.createDecorativeLights();
  }

  private createDecorativeLights() {
    const positions = [[-8, -8], [8, -8], [-8, -4], [8, -4]];
    const colors = [0xff0000, 0x0000ff, 0x00ff00, 0xff00ff];
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    positions.forEach((pos, i) => {
        const light = new THREE.PointLight(colors[i], 10, 15);
        light.position.set(pos[0], 7.5, pos[1]);
        
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3), bulbMat);
        bulb.position.copy(light.position);
        
        this.group.add(light, bulb);
    });
  }
}