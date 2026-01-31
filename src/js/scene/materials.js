/**
 * Materialien Setup
 */

import * as THREE from 'three';

export function createMaterials() {
    return {
        stage: new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.3,
            roughness: 0.4
        }),
        wood: new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            metalness: 0.2,
            roughness: 0.7
        }),
        metalGold: new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.8,
            roughness: 0.2
        }),
        metalSilver: new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.1
        }),
        crystal: new THREE.MeshStandardMaterial({
            color: 0x64b5f6,
            metalness: 0.5,
            roughness: 0.3,
            transparent: true,
            opacity: 0.8
        }),
        red: new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0.4,
            roughness: 0.5
        }),
        black: new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.6,
            roughness: 0.3
        })
    };
}
