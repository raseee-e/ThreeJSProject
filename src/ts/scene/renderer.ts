/**
 * Renderer Setup
 */

import * as THREE from 'three';

export function setupRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    return renderer;
}

export function updateRendererSize(renderer: THREE.WebGLRenderer, width: number, height: number): void {
    renderer.setSize(width, height);
}
