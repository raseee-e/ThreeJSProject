import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import { Stage } from './stage';
import { Trophy } from './trophy';
import { Lighting } from './lighting';

export class World {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock = new THREE.Clock();

  // Unsere Module
  private trophy: Trophy;
  private lighting: Lighting;

  // GUI Parameter
  private params = {
    rotationSpeed: 0.01,
    spotIntensity: 50,
    spotColor: '#ffaa00'
  };

  constructor(container: HTMLElement) {
    // 1. Init
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);
    this.scene.fog = new THREE.Fog(0x111111, 10, 50);

    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    this.camera.position.set(0, 5, 12);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    // 2. Zusammenbauen
    const stage = new Stage();
    this.scene.add(stage.mesh);

    this.trophy = new Trophy();
    this.scene.add(this.trophy.mesh);

    // Licht braucht das Ziel (Pokal), damit der Spot darauf zeigt
    this.lighting = new Lighting(this.trophy.mesh);
    this.scene.add(this.lighting.group);

    // 3. GUI
    this.setupGUI();

    // 4. Start
    this.animate();
    window.addEventListener('resize', () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        this.camera.aspect = nw / nh;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(nw, nh);
    });
  }

  private setupGUI() {
    const gui = new dat.GUI();
    const folder = gui.addFolder('Bühnen Steuerung');
    folder.add(this.params, 'rotationSpeed', 0, 0.1).name('Drehgeschwindigkeit');
    folder.add(this.params, 'spotIntensity', 0, 100).onChange(v => this.lighting.spotLight.intensity = v);
    folder.addColor(this.params, 'spotColor').onChange(v => this.lighting.spotLight.color.set(v));
    folder.open();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    const time = this.clock.getElapsedTime();

    // Animation an das Trophy-Modul delegieren
    this.trophy.animate(time, this.params.rotationSpeed);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}