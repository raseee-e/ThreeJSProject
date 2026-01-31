/**
 * Camera Setup
 */

import * as THREE from 'three';

export function setupCamera(width: number, height: number): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
    );
    camera.position.set(0, 8, 15);
    return camera;
}

export function updateCameraAspect(camera: THREE.PerspectiveCamera, width: number, height: number): void {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
