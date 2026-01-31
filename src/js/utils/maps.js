/**
 * Height Map & Normal Map Generator
 */

import * as THREE from 'three';

export function generateHeightMap(width = 512, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

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

export function generateNormalMap(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

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
