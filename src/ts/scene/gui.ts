/// <reference path="../../types/dat.gui.d.ts" />
/**
 * Dat.GUI Setup
 */

import * as THREE from 'three';
import * as dat from 'dat.gui';
import type { Lights } from './lights';
import type { Materials } from './materials';

export interface AnimationState {
    sphereSpeed: number;
    torusSpeed: number;
}

export interface MeshesData {
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    [key: string]: any;
}

export function setupGUI(
    gui: dat.GUI,
    lights: Lights,
    materials: Materials,
    controls: any,
    meshes: MeshesData
): AnimationState {
    // Lichter
    const lightFolder = gui.addFolder('💡 Lichtquellen');
    lightFolder.add(lights.main, 'intensity', 0, 2).name('Main Light');
    lightFolder.add(lights.spotlight1, 'intensity', 0, 3).name('Red Light');
    lightFolder.add(lights.spotlight2, 'intensity', 0, 3).name('Green Light');
    lightFolder.add(lights.spotlight3, 'intensity', 0, 3).name('Blue Light');
    lightFolder.add(lights.ambient, 'intensity', 0, 1).name('Ambient Light');
    lightFolder.open();

    // Materialien
    const materialFolder = gui.addFolder('🎨 Materialien');
    materialFolder.addColor(materials.metalGold, 'color').name('Trophy Color');
    materialFolder.add(materials.metalGold, 'metalness', 0, 1).name('Trophy Metalness');
    materialFolder.add(materials.metalGold, 'roughness', 0, 1).name('Trophy Roughness');
    materialFolder.open();

    // Animationen
    const animationFolder = gui.addFolder('⚙️ Animationen');
    const animState: AnimationState = { sphereSpeed: 0.02, torusSpeed: 0.03 };
    animationFolder.add(animState, 'sphereSpeed', 0, 0.1).name('Sphere Rotation Speed');
    animationFolder.add(animState, 'torusSpeed', 0, 0.1).name('Torus Rotation Speed');
    animationFolder.add(controls, 'autoRotate').name('Auto Rotate Camera');
    animationFolder.add(controls, 'autoRotateSpeed', 0, 10).name('Rotation Speed');
    animationFolder.open();

    // Kamera
    const cameraFolder = gui.addFolder('📷 Kamera');
    cameraFolder.add(meshes.camera.position, 'x', -50, 50).name('Camera X');
    cameraFolder.add(meshes.camera.position, 'y', -50, 50).name('Camera Y');
    cameraFolder.add(meshes.camera.position, 'z', -50, 50).name('Camera Z');
    cameraFolder.open();

    // Szene
    const sceneFolder = gui.addFolder('🌍 Szene');
    sceneFolder.addColor(meshes.scene, 'background').name('Background Color');
    if (meshes.scene.fog) {
        sceneFolder.add(meshes.scene.fog, 'far', 1, 500).name('Fog Distance');
    }
    sceneFolder.open();

    return animState;
}
