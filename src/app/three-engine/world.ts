import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';

import { Stage } from './stage';
import { Trophy } from './trophy';
import { Lighting } from './lighting';
// import { Jury } ... <- RAUS DAMIT!

export class World {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock = new THREE.Clock();

  private trophy: Trophy;
  private lighting: Lighting;

  private params = {
    rotationSpeed: 0.01,
    spotIntensity: 100,
    spotColor: '#ffaa00',
    ambientIntensity: 0.3,
    fogDensity: 0.05
  };

  constructor(container: HTMLElement) {
    // 1. Init Scene
    this.scene = new THREE.Scene();
    
    this.createBackground();
    this.scene.fog = new THREE.Fog(0x0a0a0a, 15, 60);

    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    this.camera.position.set(0, 6, 15);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    (this.renderer as any).outputColorSpace = THREE.SRGBColorSpace; 
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = false;
    
    // 2. Build Scene
    const stage = new Stage();
    this.scene.add(stage.mesh);

    this.trophy = new Trophy(); 
    // this.scene.add(this.trophy.mesh); 

    // 3. JURY LADEN (Nur Blender!)
    this.loadJuryModel();

    this.lighting = new Lighting(this.trophy.mesh);
    this.scene.add(this.lighting.group);
    
    this.addStageSpotlights();

    this.setupGUI();
    this.animate();
    
    window.addEventListener('resize', () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        this.camera.aspect = nw / nh;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(nw, nh);
    });
  }

  private loadJuryModel() {
    const loader = new GLTFLoader();
    
    // Load jury from public/models folder
    loader.load(
      'models/jury.glb', 
      (gltf) => {
        // Create 3 jury instances
        const juryPositions = [
          { x: -10, label: 'Left Jury' },
          { x: 0, label: 'Center Jury' },
          { x: 10, label: 'Right Jury' }
        ];

        juryPositions.forEach((pos) => {
          const juryMesh = gltf.scene.clone();
          
          // Positionierung (Vor der Bühne, erhöht)
          juryMesh.position.set(pos.x, 1.7, 20);
          
          // Drehung - Reset to test
          juryMesh.rotation.y = 55;
          juryMesh.rotation.x = 0;
          juryMesh.rotation.z = 0;
          
          // Skalierung (falls nötig anpassen)
          juryMesh.scale.set(1, 1, 1);
          
          // Schatten
          juryMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          this.scene.add(juryMesh);
          console.log(`✅ ${pos.label} loaded at position (${pos.x}, 1.2, 12)`);
        });
      },
      (xhr) => {
          // Optional: Ladefortschritt loggen
          // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('❌ FEHLER: Konnte jury.glb nicht laden. Prüfe ob die Datei in public/models/ liegt!', error);
      }
    );
  }

  // --- HILFSMETHODEN (Unverändert) ---

  private createBackground() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const radialGradient = ctx.createRadialGradient(512, 300, 100, 512, 512, 1000);
    radialGradient.addColorStop(0, '#5a8fc7');
    radialGradient.addColorStop(0.3, '#3d6b9e');
    radialGradient.addColorStop(0.6, '#254570');
    radialGradient.addColorStop(1, '#0f2845');
    ctx.fillStyle = radialGradient; ctx.fillRect(0, 0, 1024, 1024);

    const linearGradient = ctx.createLinearGradient(0, 0, 0, 1024);
    linearGradient.addColorStop(0, 'rgba(120, 200, 255, 0.25)');
    linearGradient.addColorStop(0.5, 'rgba(60, 130, 200, 0.05)');
    linearGradient.addColorStop(1, 'rgba(20, 50, 100, 0.3)');
    ctx.fillStyle = linearGradient; ctx.fillRect(0, 0, 1024, 1024);

    for (let i = 0; i < 250; i++) {
      const x = Math.random() * 1024; const y = Math.random() * 1024;
      const size = Math.random() * 2.5; const opacity = Math.random() * 0.9;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
    }
    
    const imageData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 25;
      data[i] += noise; data[i + 1] += noise; data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
    this.scene.background = new THREE.CanvasTexture(canvas);
  }

  private addStageSpotlights() {
    const frontLights = [
      { pos: [-10, 12, 8], color: 0xff8800 },
      { pos: [10, 12, 8], color: 0xff8800 },
    ];
    const sideLights = [
      { pos: [-15, 10, 0], color: 0x00ccff },
      { pos: [15, 10, 0], color: 0x00ccff },
    ];
    const backLights = [
      { pos: [-8, 8, -10], color: 0xff00ff },
      { pos: [8, 8, -10], color: 0xff00ff },
    ];

    [...frontLights, ...sideLights, ...backLights].forEach(light => {
      const spot = new THREE.SpotLight(light.color, 80, 50, Math.PI / 6, 0.5, 1);
      spot.position.set(light.pos[0], light.pos[1], light.pos[2]);
      spot.target.position.set(0, 2, 0);
      spot.castShadow = true;
      spot.shadow.mapSize.width = 2048; spot.shadow.mapSize.height = 2048;
      this.scene.add(spot); this.scene.add(spot.target);
    });

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 15, -20);
    rimLight.castShadow = true;
    this.scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
  }

  private setupGUI() {
    const gui = new dat.GUI();
    const folder = gui.addFolder('🇷🇴 Romania Muscle Fest');
    
    folder.add(this.params, 'rotationSpeed', 0, 0.1).name('Trophy Rotation');
    folder.add(this.params, 'spotIntensity', 0, 150).name('Main Light Intensity')
      .onChange(v => { this.lighting.spotLight.intensity = v; });
    folder.addColor(this.params, 'spotColor').name('Main Light Color')
      .onChange(v => { this.lighting.spotLight.color.set(v); });

    if (this.scene.fog) {
        folder.add(this.scene.fog as THREE.Fog, 'far', 10, 100).name('Fog Distance');
    }
    folder.open();
  }

  private animate = () => {
    const time = this.clock.getElapsedTime();
    if (this.trophy) {
        this.trophy.animate(time, this.params.rotationSpeed);
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }
}