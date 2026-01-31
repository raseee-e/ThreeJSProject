/**
 * Renderer Setup
 */

import * as THREE from 'three';

export function setupRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    
    return renderer;
}

export function updateRendererSize(renderer, width, height) {
    renderer.setSize(width, height);
}
