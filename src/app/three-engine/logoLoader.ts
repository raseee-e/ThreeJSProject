import * as THREE from 'three';

export async function createLogoTexture(imagePath: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(
      imagePath,
      (texture) => {
        // Texture loaded successfully
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        resolve(texture);
      },
      undefined,
      (error) => {
        console.error('Error loading logo texture:', error);
        reject(error);
      }
    );
  });
}

/**
 * Creates a canvas-based logo placeholder (used if image not available)
 */
export function createLogoCanvasTexture(text: string = 'ROMANIA\nMUSCLE FEST'): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark background
  const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 300);
  gradient.addColorStop(0, '#0099ff');
  gradient.addColorStop(0.5, '#0066cc');
  gradient.addColorStop(1, '#003366');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Add border
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.stroke();

  // Add text
  ctx.fillStyle = '#ffff00';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const lines = text.split('\n');
  lines.forEach((line, idx) => {
    ctx.fillText(line, 256, 256 + (idx - lines.length / 2 + 0.5) * 60);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  return texture;
}
