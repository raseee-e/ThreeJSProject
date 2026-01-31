/// <reference path="../../types/dat.gui.d.ts" />


import * as THREE from 'three';
import * as dat from 'dat.gui';
import { setupCamera, updateCameraAspect } from './camera';
import { setupRenderer, updateRendererSize } from './renderer';
import { createGeometries } from './geometry';
import { createLights, type Lights } from './lights';
import { createMaterials, type Materials } from './materials';
import { setupGUI, type AnimationState, type MeshesData } from './gui';
import { setupPokal } from '../utils/pokal';

// Make THREE and dat global for Three.js modules
(window as any).THREE = THREE;
(window as any).dat = dat;

export class BodybuildingStageScene {
    private canvas: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    public controls: any;
    private materials: Materials;
    private stage: THREE.Group;
    private geometryCount: number;
    private meshes: MeshesData;
    private lights: Lights;
    private gui: dat.GUI;
    private animState: AnimationState;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        this.scene.fog = new THREE.Fog(0x1a1a1a, 100, 200);

        // Setup
        this.camera = setupCamera(window.innerWidth, window.innerHeight);
        this.renderer = setupRenderer(canvas);
        this.materials = createMaterials();
        
        // Stage
        this.stage = new THREE.Group();
        this.scene.add(this.stage);
        
        const geomData = createGeometries(this.stage, this.materials);
        this.geometryCount = geomData.count;
        this.meshes = { 
            ...geomData.meshes, 
            scene: this.scene, 
            camera: this.camera 
        } as MeshesData;

        // Lichter
        this.lights = createLights(this.scene);

        // Controls
        this.controls = this.setupControls();
        this.setupKeyboardInput();

        // GUI
        const guiContainer = document.getElementById('gui-container');
        if (!guiContainer) {
            console.warn('GUI container not found');
        }
        this.gui = new dat.GUI({ autoPlace: false });
        if (guiContainer) {
            guiContainer.appendChild(this.gui.domElement);
        }
        this.animState = setupGUI(this.gui, this.lights, this.materials, this.controls, this.meshes);

        // Pokal laden
        setupPokal(this.stage, this.gui);

        // Window Events
        window.addEventListener('resize', () => this.onWindowResize());

        // Animation Loop
        this.animate();
    }

    private setupControls(): any {
        // Using OrbitControls pattern (simplified without import)
        return {
            autoRotate: true,
            autoRotateSpeed: 2,
            enableDamping: true,
            dampingFactor: 0.05
        };
    }

    private setupKeyboardInput(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            const step = 0.5;
            switch (event.key) {
                case 'ArrowUp':
                    this.camera.position.y += step;
                    break;
                case 'ArrowDown':
                    this.camera.position.y -= step;
                    break;
                case 'ArrowLeft':
                    this.camera.position.x -= step;
                    break;
                case 'ArrowRight':
                    this.camera.position.x += step;
                    break;
            }
        });
    }

    private onWindowResize(): void {
        updateCameraAspect(this.camera, window.innerWidth, window.innerHeight);
        updateRendererSize(this.renderer, window.innerWidth, window.innerHeight);
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        // Animationen
        if (this.meshes.decorSphere) {
            this.meshes.decorSphere.rotation.x += this.animState.sphereSpeed;
            this.meshes.decorSphere.rotation.y += this.animState.sphereSpeed * 0.7;
        }

        if (this.meshes.torusRing) {
            this.meshes.torusRing.rotation.y += this.animState.torusSpeed;
            this.meshes.torusRing.rotation.x += this.animState.torusSpeed * 0.5;
        }

        if (this.meshes.tetrahedron) {
            this.meshes.tetrahedron.rotation.x += 0.005;
            this.meshes.tetrahedron.rotation.y += 0.008;
            this.meshes.tetrahedron.position.y = 3 + Math.sin(Date.now() * 0.001) * 0.5;
        }

        if (this.meshes.octahedron) {
            this.meshes.octahedron.rotation.x += 0.006;
            this.meshes.octahedron.rotation.z += 0.007;
            this.meshes.octahedron.position.y = 3 + Math.sin(Date.now() * 0.001 + 1) * 0.5;
        }

        // Auto Rotate
        if (this.controls.autoRotate) {
            this.stage.rotation.y += 0.001 * this.controls.autoRotateSpeed;
        }

        this.renderer.render(this.scene, this.camera);
    };
}
