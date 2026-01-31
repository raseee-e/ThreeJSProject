/// <reference path="../../types/dat.gui.d.ts" />
/**
 * Pokal aus Blender laden oder Fallback
 */

import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function setupPokal(stage: THREE.Group, gui: dat.GUI): void {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load('public/models/trophy.glb', (gltf) => {
        const trophy = gltf.scene;
        trophy.scale.set(2, 2, 2);
        trophy.position.set(0, 1.5, 0);
        trophy.rotation.y = Math.PI / 4;

        trophy.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        stage.add(trophy);

        const trophyFolder = gui.addFolder('🏆 Pokal');
        trophyFolder.add(trophy.position, 'y', -5, 10, 0.1).name('Höhe');
        trophyFolder.add(trophy.rotation, 'y', 0, Math.PI * 2, 0.01).name('Rotation');
        trophyFolder.add(trophy.scale, 'x', 0.1, 5, 0.1).name('Skalierung');
        trophyFolder.open();
    }, undefined, (error) => {
        console.warn('Trophy model not found, using fallback:', error);
        createFallbackTrophy(stage, gui);
    });
}

function createFallbackTrophy(stage: THREE.Group, gui: dat.GUI): void {
    const THREE_MODULE = window.THREE || THREE;
    
    const materials = {
        gold: new THREE.MeshStandardMaterial({ 
            color: 0xffd700, 
            metalness: 0.8, 
            roughness: 0.2 
        })
    };

    const trophyGroup = new THREE.Group();

    // Basis
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 2, 0.4, 32),
        materials.gold
    );
    base.castShadow = base.receiveShadow = true;
    trophyGroup.add(base);

    // Schaft
    const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32),
        materials.gold
    );
    shaft.position.y = 1;
    shaft.castShadow = shaft.receiveShadow = true;
    trophyGroup.add(shaft);

    // Kelch
    const bowl = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 1, 32),
        materials.gold
    );
    bowl.position.y = 2.2;
    bowl.castShadow = bowl.receiveShadow = true;
    trophyGroup.add(bowl);

    // Henkel
    const handle = new THREE.Mesh(
        new THREE.TorusGeometry(0.8, 0.15, 16, 100),
        materials.gold
    );
    handle.position.set(-0.9, 1.8, 0);
    handle.rotation.z = Math.PI / 4;
    handle.castShadow = handle.receiveShadow = true;
    trophyGroup.add(handle);

    trophyGroup.position.set(0, 1, 0);
    trophyGroup.scale.set(1.5, 1.5, 1.5);
    stage.add(trophyGroup);

    const trophyFolder = gui.addFolder('🏆 Pokal (Fallback)');
    trophyFolder.add(trophyGroup.position, 'y', -5, 10, 0.1).name('Höhe');
    trophyFolder.add(trophyGroup.rotation, 'y', 0, Math.PI * 2, 0.01).name('Rotation');
    trophyFolder.add(trophyGroup.scale, 'x', 0.1, 5, 0.1).name('Skalierung');
    trophyFolder.open();
}
