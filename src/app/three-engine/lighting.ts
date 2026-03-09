import * as THREE from 'three';

export class Lighting {
  group: THREE.Group;
  spotLight: THREE.SpotLight;

  constructor(target: THREE.Object3D) {
    this.group = new THREE.Group();

    // Reduce ambient - we want dramatic lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    this.group.add(ambient);

    // Main stage spotlight (warm)
    this.spotLight = new THREE.SpotLight(0xffaa00, 80);
    this.spotLight.position.set(5, 14, 6);
    this.spotLight.angle = 0.6;
    this.spotLight.penumbra = 0.7;
    this.spotLight.decay = 2;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.target = target;
    this.group.add(this.spotLight);

    // Rim light from behind (cool)
    const rimLight = new THREE.SpotLight(0x00ccff, 60);
    rimLight.position.set(-8, 12, -10);
    rimLight.angle = 0.7;
    rimLight.penumbra = 0.5;
    rimLight.castShadow = false;
    rimLight.target.position.set(0, 2, 0);
    this.group.add(rimLight);
    this.group.add(rimLight.target);

    // Stage fill lights (left and right)
    this.createFillLights();
  }

  private createFillLights() {
    // Left fill (magenta)
    const leftFill = new THREE.SpotLight(0xff0080, 50);
    leftFill.position.set(-20, 13, 5);
    leftFill.angle = 0.8;
    leftFill.penumbra = 0.6;
    leftFill.castShadow = false;
    leftFill.target.position.set(0, 2, 0);
    this.group.add(leftFill);
    this.group.add(leftFill.target);

    // Right fill (cyan)
    const rightFill = new THREE.SpotLight(0x00ffff, 50);
    rightFill.position.set(20, 13, 5);
    rightFill.angle = 0.8;
    rightFill.penumbra = 0.6;
    rightFill.castShadow = false;
    rightFill.target.position.set(0, 2, 0);
    this.group.add(rightFill);
    this.group.add(rightFill.target);

    // Backdrop accent lights
    const backLeft = new THREE.PointLight(0xff0080, 20, 25);
    backLeft.position.set(-15, 10, -15);
    this.group.add(backLeft);

    const backRight = new THREE.PointLight(0x0080ff, 20, 25);
    backRight.position.set(15, 10, -15);
    this.group.add(backRight);

    // Decorative uplights - removed upLight2 for performance
    const upLight1 = new THREE.PointLight(0x00ff80, 15, 20);
    upLight1.position.set(-25, 2, 0);
    this.group.add(upLight1);
  }
}