/**
 * Haupt-Szenen-Koordination
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

import { setupCamera, updateCameraAspect } from './camera.js';
import { setupRenderer, updateRendererSize } from './renderer.js';
import { createMaterials } from './materials.js';
import { createGeometries } from './geometry.js';
import { createLights } from './lights.js';
import { setupControls, setupKeyboardInput } from './controls.js';
import { setupGUI } from './gui.js';
import { setupPokal } from '../utils/pokal.js';

// Make THREE and dat global for Three.js modules
window.THREE = THREE;
window.dat = dat;

export class BodybuildingStageScene {
    constructor(canvas) {
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
        this.meshes = { ...geomData.meshes, scene: this.scene, camera: this.camera };

        // Lichter
        this.lights = createLights(this.scene);

        // Controls
        this.controls = setupControls(this.camera, canvas);
        setupKeyboardInput(this.camera);

        // GUI
        const guiContainer = document.getElementById('gui-container');
        if (!guiContainer) {
            console.error('GUI Container not found!');
            return;
        }
        this.gui = new dat.GUI({ autoPlace: false });
        guiContainer.appendChild(this.gui.domElement);
        this.animState = setupGUI(this.gui, this.lights, this.materials, this.controls, this.meshes);

        // Pokal laden
        setupPokal(this.stage, this.gui);

        // Window Events
        window.addEventListener('resize', () => this.onWindowResize());

        // Animation Loop
        this.animate();

        this.logStatus();
    }

    onWindowResize() {
        updateCameraAspect(this.camera, window.innerWidth, window.innerHeight);
        updateRendererSize(this.renderer, window.innerWidth, window.innerHeight);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // Animationen
        this.meshes.decorSphere.rotation.x += this.animState.sphereSpeed;
        this.meshes.decorSphere.rotation.y += this.animState.sphereSpeed * 0.7;

        this.meshes.torusRing.rotation.y += this.animState.torusSpeed;
        this.meshes.torusRing.rotation.x += this.animState.torusSpeed * 0.5;

        this.meshes.tetrahedron.rotation.x += 0.005;
        this.meshes.tetrahedron.rotation.y += 0.008;
        this.meshes.tetrahedron.position.y = 3 + Math.sin(Date.now() * 0.001) * 0.5;

        this.meshes.octahedron.rotation.x += 0.006;
        this.meshes.octahedron.rotation.z += 0.007;
        this.meshes.octahedron.position.y = 3 + Math.cos(Date.now() * 0.001) * 0.5;

        this.meshes.championPodest.scale.y = 1 + Math.sin(Date.now() * 0.002) * 0.1;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };

    logStatus() {
        console.log('='.repeat(50));
        console.log('🏋️ BODYBUILDING BÜHNE - LOADED');
        console.log('='.repeat(50));
        console.log(`✓ Geometrien: ${this.geometryCount}`);
        console.log('✓ Materialien: 7');
        console.log('✓ Lichter: 8');
        console.log('✓ Dat.GUI: Aktiviert');
        console.log('✓ Controls: Aktiviert');
        console.log('='.repeat(50));
    }
}
