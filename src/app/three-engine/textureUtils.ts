import * as THREE from 'three';

export function createNoiseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Hintergrund schwarz
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 512);
  
  // Zufälliges Rauschen
  for(let i = 0; i < 50000; i++) {
      ctx.fillStyle = `rgba(255,255,255, ${Math.random() * 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  
  return texture;
}