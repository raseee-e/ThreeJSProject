import * as THREE from 'three';
import { NgZone } from '@angular/core';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class World {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private container!: HTMLElement;
  private clock = new THREE.Clock();
  private ngZone: NgZone;

  // Animationsobjekte
  private trophyGroup!: THREE.Group;
  private trussLights: THREE.PointLight[] = [];

  constructor(containerElement: HTMLElement, ngZone?: NgZone) {
    this.container = containerElement;
    this.ngZone = ngZone || new NgZone({});

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    
    this.buildOlympiaStage();
    this.createPlaceholderTrophy(); // Dein Ersatz für die Blender-Datei
    this.setupLighting();

    // Run animation outside Angular zone to avoid change detection loops
    this.ngZone.runOutsideAngular(() => {
      this.animate();
      window.addEventListener('resize', () => this.onWindowResize());
    });
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000); // Pitch Black für Kontrast
    this.scene.fog = new THREE.FogExp2(0x111111, 0.02); // Etwas Rauch
  }

  private initCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 4, 14); // Blick von vorne auf die Bühne
  }

  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.1; // Nicht unter den Boden glitchen
  }

  // --- BÜHNEN DESIGN ---
  private buildOlympiaStage() {
    // 1. Boden (Teppich)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Das Podest
    const podium = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 9, 1, 64),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.4, metalness: 0.5 })
    );
    podium.position.y = 0.5;
    podium.receiveShadow = true;
    this.scene.add(podium);

    // 3. LED Wände (Leuchtende Rechtecke im Hintergrund)
    const screenGeo = new THREE.PlaneGeometry(10, 14);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Mr Olympia Rot
    
    const screenL = new THREE.Mesh(screenGeo, screenMat);
    screenL.position.set(-12, 7, -10);
    screenL.rotation.y = 0.5;
    
    const screenR = new THREE.Mesh(screenGeo, screenMat);
    screenR.position.set(12, 7, -10);
    screenR.rotation.y = -0.5;
    
    const screenC = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), screenMat);
    screenC.position.set(0, 10, -12);

    this.scene.add(screenL, screenR, screenC);

    // 4. Traversen (Truss) an der Decke
    this.createTruss(0, 14, 0);
  }

  private createTruss(x: number, y: number, z: number) {
    // Einfache Wireframe-Box als Traverse
    const geo = new THREE.BoxGeometry(40, 1, 20);
    const wireframe = new THREE.WireframeGeometry(geo);
    const line = new THREE.LineSegments(wireframe);
    (line.material as THREE.LineBasicMaterial).color.set(0x444444);
    (line.material as THREE.LineBasicMaterial).opacity = 0.5;
    (line.material as THREE.LineBasicMaterial).transparent = true;
    line.position.set(x, y, z);
    this.scene.add(line);
  }

  // --- POKAL PLATZHALTER (Bis dein Blender File fertig ist) ---
  private createPlaceholderTrophy() {
    this.trophyGroup = new THREE.Group();

    // Gold Material
    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.3
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.2, 16), goldMat);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8), goldMat);
    stem.position.y = 0.8;
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.6), goldMat);
    top.position.y = 1.6;

    this.trophyGroup.add(base, stem, top);
    this.trophyGroup.position.set(0, 1, 0); // Auf dem Podest
    this.scene.add(this.trophyGroup);
  }

  private setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(ambient);

    // Hauptspot auf den Gewinner
    const spot = new THREE.SpotLight(0xffaa00, 100);
    spot.position.set(0, 20, 10);
    spot.angle = 0.3;
    spot.penumbra = 0.5;
    spot.castShadow = true;
    spot.target = this.trophyGroup;
    this.scene.add(spot);

    // Blaue Backlights
    const blueLight = new THREE.PointLight(0x0000ff, 20, 50);
    blueLight.position.set(0, 5, -5);
    this.scene.add(blueLight);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    const time = this.clock.getElapsedTime();

    // Pokal dreht sich leicht
    if (this.trophyGroup) {
        this.trophyGroup.rotation.y = Math.sin(time) * 0.2;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    if(!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}