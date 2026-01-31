/**
 * Height Map & Normal Map Generator
 * Root level utility for map generation
 */

import * as THREE from 'three';

/**
 * Erstellt eine prozeduale Height Map für ein Terrain
 * @param width - Breite der Textur
 * @param height - Höhe der Textur
 * @returns THREE.CanvasTexture
 */
export function generateHeightMap(width: number = 512, height: number = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get 2D context from canvas');
    
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let value = 0;
            let amplitude = 1;
            let frequency = 1;
            let maxValue = 0;

            for (let i = 0; i < 4; i++) {
                const n = Math.sin(x * frequency * 0.01) * Math.cos(y * frequency * 0.01);
                value += amplitude * ((n + 1) / 2);
                maxValue += amplitude;
                amplitude *= 0.5;
                frequency *= 2;
            }

            value = (value / maxValue) * 255;
            const index = (y * width + x) * 4;

            data[index] = value;
            data[index + 1] = value;
            data[index + 2] = value;
            data[index + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
}

/**
 * Erstellt eine prozeduale Normal Map
 * @param size - Größe der Textur
 * @returns THREE.CanvasTexture
 */
export function generateNormalMap(size: number = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get 2D context from canvas');
    
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const nx = Math.random() * 255;
            const ny = Math.random() * 255;
            const nz = Math.random() * 200 + 55;

            const index = (y * size + x) * 4;
            data[index] = nx;
            data[index + 1] = ny;
            data[index + 2] = nz;
            data[index + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
}

/**
 * Erstellt ein Terrain mit Height Map Displacement
 */
export function createDisplacementTerrain(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(100, 100, 256, 256);
    const heightMap = generateHeightMap(512, 512);
    const displacementScale = 20;

    const material = new THREE.MeshStandardMaterial({
        map: heightMap,
        displacementMap: heightMap,
        displacementScale: displacementScale
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -10;

    return mesh;
}

/**
 * Erstellt eine glänzende Oberfläche mit Normal Map für realistisches Aussehen
 */
export function createShinyMaterial(color: number = 0xffffff): THREE.MeshStandardMaterial {
    const normalMap = generateNormalMap(512);
    
    return new THREE.MeshStandardMaterial({
        color: color,
        normalMap: normalMap,
        metalness: 0.8,
        roughness: 0.2
    });
}

/**
 * Erstellt ein Material mit animated Normal Map
 */
export function createAnimatedNormalMaterial(color: number = 0x0000ff): THREE.MeshStandardMaterial {
    const normalMap = generateNormalMap(512);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshStandardMaterial({
        color: color,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(2, 2),
        metalness: 0.5,
        roughness: 0.4
    });
}

/**
 * Erstellt einen Cube mit verschiedenen Texturen pro Seite
 */
export function createTexturedCube(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const materials: THREE.MeshStandardMaterial[] = [];

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    
    for (const color of colors) {
        const normalMap = generateNormalMap(256);
        materials.push(
            new THREE.MeshStandardMaterial({
                color: color,
                normalMap: normalMap,
                metalness: 0.6,
                roughness: 0.3
            })
        );
    }

    return new THREE.Mesh(geometry, materials);
}

/**
 * Erstellt eine reflektive Oberfläche
 */
export function createReflectiveFloor(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;

    return mesh;
}

console.log('✓ Height Map & Normal Map Module loaded');
console.log('  - generateHeightMap()');
console.log('  - generateNormalMap()');
console.log('  - createDisplacementTerrain()');
console.log('  - createShinyMaterial()');
console.log('  - createAnimatedNormalMaterial()');
console.log('  - createTexturedCube()');
console.log('  - createReflectiveFloor()');
