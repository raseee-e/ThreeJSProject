/**
 * Kamera Controls & Tastatur Input
 */

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    return controls;
}

export function setupKeyboardInput(camera) {
    const keys = {};
    
    window.addEventListener('keydown', (e) => keys[e.key.toUpperCase()] = true);
    window.addEventListener('keyup', (e) => keys[e.key.toUpperCase()] = false);

    setInterval(() => {
        const speed = 0.5;
        if (keys['W']) camera.position.z -= speed;
        if (keys['S']) camera.position.z += speed;
        if (keys['A']) camera.position.x -= speed;
        if (keys['D']) camera.position.x += speed;
    }, 1000 / 60);
}
