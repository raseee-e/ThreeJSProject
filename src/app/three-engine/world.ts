import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';

import { Stage } from './stage';
import { Trophy } from './trophy';
import { Lighting } from './lighting';
import { Jury } from './jury';

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
    spotIntensity: 100,
    spotColor: '#ffaa00',
    ambientIntensity: 0.3,
    fogDensity: 0.05
  };

  constructor(container: HTMLElement) {
    // 1. Init Scene
    this.scene = new THREE.Scene();
    
    // Add gradient background
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
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = false;
    
    // 2. Build Scene
    const stage = new Stage();
    this.scene.add(stage.mesh);

    // Trophy placeholder - will be loaded from Blender later
    this.trophy = new Trophy(); // Placeholder for lighting reference only
    // this.scene.add(this.trophy.mesh); // Hidden for now - to be replaced with Blender model

    // Add jury seating - load from Blender model
    this.loadJuryModel();

    // Enhanced Lighting
    this.lighting = new Lighting(this.trophy.mesh);
    this.scene.add(this.lighting.group);
    
    // Add extra stage lights
    this.addStageSpotlights();

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

  private loadJuryModel() {
    const loader = new GLTFLoader();
    loader.load(
      'models/jury.glb',
      (gltf) => {
        const juryMesh = gltf.scene;
        // Position the jury model
        juryMesh.position.set(0, 0, 12);
        juryMesh.scale.set(1, 1, 1);
        
        // Rotate to match Three.js axes (Y axis rotation)
        juryMesh.rotation.y = Math.PI;
        
        // Enable shadows for all meshes in the model
        juryMesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        this.scene.add(juryMesh);
        console.log('✅ Jury model loaded from Blender successfully');
      },
      undefined,
      (error) => {
        console.warn('⚠️ Jury.glb not found, falling back to procedural jury seating');
        // Fallback to procedural jury if model not found
        const jury = new Jury();
        this.scene.add(jury.mesh);
      }
    );
  }

  private createBackground() {
    // Create atmospheric gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Radial gradient for depth effect
    const radialGradient = ctx.createRadialGradient(512, 300, 100, 512, 512, 1000);
    radialGradient.addColorStop(0, '#5a8fc7');  // Bright blue center
    radialGradient.addColorStop(0.3, '#3d6b9e'); // Medium blue
    radialGradient.addColorStop(0.6, '#254570'); // Darker blue
    radialGradient.addColorStop(1, '#0f2845');   // Very dark blue
    
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Linear overlay for depth
    const linearGradient = ctx.createLinearGradient(0, 0, 0, 1024);
    linearGradient.addColorStop(0, 'rgba(120, 200, 255, 0.25)');  // Top
    linearGradient.addColorStop(0.5, 'rgba(60, 130, 200, 0.05)');
    linearGradient.addColorStop(1, 'rgba(20, 50, 100, 0.3)');     // Bottom
    
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Add stars
    for (let i = 0; i < 250; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 2.5;
      const opacity = Math.random() * 0.9;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle film grain
    const imageData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 25;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    
    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    this.scene.background = texture;
  }

  private addStageSpotlights() {
    // Front stage lights (warm tones)
    const frontLights = [
      { pos: [-10, 12, 8], color: 0xff8800, name: 'Front Left' },
      { pos: [10, 12, 8], color: 0xff8800, name: 'Front Right' },
    ];

    // Side stage lights (cool tones)
    const sideLights = [
      { pos: [-15, 10, 0], color: 0x00ccff, name: 'Side Left' },
      { pos: [15, 10, 0], color: 0x00ccff, name: 'Side Right' },
    ];

    // Back lights (purple/magenta for depth)
    const backLights = [
      { pos: [-8, 8, -10], color: 0xff00ff, name: 'Back Left' },
      { pos: [8, 8, -10], color: 0xff00ff, name: 'Back Right' },
    ];

    [...frontLights, ...sideLights, ...backLights].forEach(light => {
      const spot = new THREE.SpotLight(light.color, 80, 50, Math.PI / 6, 0.5, 1);
      spot.position.set(light.pos[0], light.pos[1], light.pos[2]);
      spot.target.position.set(0, 2, 0);
      spot.castShadow = true;
      spot.shadow.mapSize.width = 2048;
      spot.shadow.mapSize.height = 2048;
      this.scene.add(spot);
      this.scene.add(spot.target);
    });

    // Add rim lights (highlights)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 15, -20);
    rimLight.castShadow = true;
    this.scene.add(rimLight);

    // Enhance ambient light for better fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
  }

  private setupGUI() {
    const gui = new dat.GUI();
    const folder = gui.addFolder('� Romania Muscle Fest');
    
    folder.add(this.params, 'rotationSpeed', 0, 0.1)
      .name('Trophy Rotation')
      .onChange(() => {});
    
    folder.add(this.params, 'spotIntensity', 0, 150)
      .name('Main Light Intensity')
      .onChange(v => {
        this.lighting.spotLight.intensity = v;
      });
    
    folder.addColor(this.params, 'spotColor')
      .name('Main Light Color')
      .onChange(v => {
        this.lighting.spotLight.color.set(v);
      });

    folder.add(this.scene.fog as THREE.Fog, 'far', 10, 100)
      .name('Fog Distance')
      .onChange(() => {});

    folder.open();
  }

  private animate = () => {
    const time = this.clock.getElapsedTime();

    // Animation an das Trophy-Modul delegieren
    this.trophy.animate(time, this.params.rotationSpeed);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    
    // Schedule the next frame AFTER rendering
    requestAnimationFrame(this.animate);
  }
}