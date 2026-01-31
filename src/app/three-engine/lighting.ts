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
    this.spotLight = new THREE.SpotLight(0xffaa00, 120);
    this.spotLight.position.set(5, 14, 6);
    this.spotLight.angle = 0.6;
    this.spotLight.penumbra = 0.7;
    this.spotLight.decay = 2;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 4096;
    this.spotLight.shadow.mapSize.height = 4096;
    this.spotLight.target = target;
    this.group.add(this.spotLight);

    // Rim light from behind (cool)
    const rimLight = new THREE.SpotLight(0x00ccff, 100);
    rimLight.position.set(-8, 12, -10);
    rimLight.angle = 0.7;
    rimLight.penumbra = 0.5;
    rimLight.castShadow = true;
    rimLight.target.position.set(0, 2, 0);
    this.group.add(rimLight);
    this.group.add(rimLight.target);

    // Stage fill lights (left and right)
    this.createFillLights();
  }

  private createFillLights() {
    // Left fill (magenta)
    const leftFill = new THREE.SpotLight(0xff0080, 90);
    leftFill.position.set(-20, 13, 5);
    leftFill.angle = 0.8;
    leftFill.penumbra = 0.6;
    leftFill.castShadow = true;
    leftFill.target.position.set(0, 2, 0);
    this.group.add(leftFill);
    this.group.add(leftFill.target);

    // Right fill (cyan)
    const rightFill = new THREE.SpotLight(0x00ffff, 90);
    rightFill.position.set(20, 13, 5);
    rightFill.angle = 0.8;
    rightFill.penumbra = 0.6;
    rightFill.castShadow = true;
    rightFill.target.position.set(0, 2, 0);
    this.group.add(rightFill);
    this.group.add(rightFill.target);

    // Backdrop accent lights
    const backLeft = new THREE.PointLight(0xff0080, 50, 40);
    backLeft.position.set(-15, 10, -15);
    this.group.add(backLeft);

    const backRight = new THREE.PointLight(0x0080ff, 50, 40);
    backRight.position.set(15, 10, -15);
    this.group.add(backRight);

    // Decorative uplights
    const upLight1 = new THREE.PointLight(0x00ff80, 40, 30);
    upLight1.position.set(-25, 2, 0);
    this.group.add(upLight1);

    const upLight2 = new THREE.PointLight(0xffff00, 40, 30);
    upLight2.position.set(25, 2, 0);
    this.group.add(upLight2);
  }
}