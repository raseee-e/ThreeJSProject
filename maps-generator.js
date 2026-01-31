// =================================
// HEIGHT MAP & NORMAL MAP GENERATOR
// =================================

/**
 * Erstellt eine prozeduale Height Map für ein Terrain
 * @param {number} width - Breite der Textur
 * @param {number} height - Höhe der Textur
 * @returns {THREE.CanvasTexture}
 */
function generateHeightMap(width = 512, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Perlin Noise simulieren (vereinfacht)
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Mehrschichtige Rausch-Funktionen
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let value = 0;
            let amplitude = 1;
            let frequency = 1;
            let maxValue = 0;
            
            // Fractional Brownian Motion (FBM)
            for (let i = 0; i < 4; i++) {
                const n = Math.sin(x * frequency * 0.01) * Math.cos(y * frequency * 0.01);
                value += amplitude * ((n + 1) / 2);
                maxValue += amplitude;
                amplitude *= 0.5;
                frequency *= 2;
            }
            
            value = (value / maxValue) * 255;
            const index = (y * width + x) * 4;
            
            data[index] = value;     // R
            data[index + 1] = value; // G
            data[index + 2] = value; // B
            data[index + 3] = 255;   // A
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
}

/**
 * Erstellt eine prozeduale Normal Map
 * @param {number} size - Größe der Textur
 * @returns {THREE.CanvasTexture}
 */
function generateNormalMap(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    // Einfache Normal Map aus Rauschen
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // Random normal-like values
            const nx = Math.random() * 255; // Normalenrichtung X
            const ny = Math.random() * 255; // Normalenrichtung Y
            const nz = Math.random() * 200 + 55; // Z (meist nach oben)
            
            const index = (y * size + x) * 4;
            data[index] = nx;     // R (X-Komponente)
            data[index + 1] = ny; // G (Y-Komponente)
            data[index + 2] = nz; // B (Z-Komponente)
            data[index + 3] = 255; // A
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
}

/**
 * Erstellt ein Terrain mit Height Map Displacement
 */
function createDisplacementTerrain() {
    const heightMap = generateHeightMap(256, 256);
    const normalMap = generateNormalMap(256, 256);
    
    const geometry = new THREE.PlaneGeometry(30, 30, 256, 256);
    
    const material = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        map: heightMap,
        normalMap: normalMap,
        displacementMap: heightMap,
        displacementScale: 5,
        metalness: 0.3,
        roughness: 0.8
    });
    
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -3;
    terrain.castShadow = true;
    terrain.receiveShadow = true;
    
    return terrain;
}

/**
 * Erstellt eine glänzende Oberfläche mit Normal Map für realistisches Aussehen
 */
function createShinyMaterial(color = 0xffffff) {
    const normalMap = generateNormalMap(512);
    
    return new THREE.MeshStandardMaterial({
        color: color,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(1, 1),
        metalness: 0.8,
        roughness: 0.15,
        envMapIntensity: 1.5
    });
}

/**
 * Erstellt ein Material mit animated Normal Map
 */
function createAnimatedNormalMaterial(color = 0x0000ff) {
    const normalMap = generateNormalMap(256);
    
    return {
        material: new THREE.MeshStandardMaterial({
            color: color,
            normalMap: normalMap,
            metalness: 0.5,
            roughness: 0.4
        }),
        time: 0,
        speed: 0.001,
        update: function() {
            this.time += this.speed;
            // Normal Map kann basierend auf Zeit animiert werden
        }
    };
}

/**
 * Erstellt einen Cube mit verschiedenen Texturen pro Seite
 */
function createTexturedCube() {
    const materials = [];
    
    // Jede Seite bekommt eine andere Textur
    for (let i = 0; i < 6; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Verschiedene Farben pro Seite
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        ctx.fillStyle = colors[i];
        ctx.fillRect(0, 0, 256, 256);
        
        // Muster hinzufügen
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        for (let j = 0; j < 256; j += 32) {
            ctx.strokeRect(j, 0, 32, 256);
            ctx.strokeRect(0, j, 256, 32);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        materials.push(new THREE.MeshStandardMaterial({ map: texture }));
    }
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    return cube;
}

/**
 * Erstellt eine reflektive Oberfläche
 */
function createReflectiveFloor() {
    const reflectionMap = generateNormalMap(1024);
    
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        new THREE.MeshStandardMaterial({
            color: 0x444444,
            normalMap: reflectionMap,
            metalness: 1.0,
            roughness: 0.05,
            side: THREE.DoubleSide
        })
    );
    
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    
    return floor;
}

// =================================
// EXPORT FUNKTIONEN
// =================================

// Diese Funktionen können in scene.js aufgerufen werden:

/*
// In scene.js nach der Bühne hinzufügen:

// Optional: Terrain mit Height Map
// const terrain = createDisplacementTerrain();
// scene.add(terrain);

// Optional: Reflektive Oberfläche
// const reflectiveFloor = createReflectiveFloor();
// scene.add(reflectiveFloor);

// Optional: Textured Cube
// const texturedCube = createTexturedCube();
// texturedCube.position.set(0, 6, -5);
// stage.add(texturedCube);
*/

console.log('✓ Height Map & Normal Map Module geladen');
console.log('  - generateHeightMap()');
console.log('  - generateNormalMap()');
console.log('  - createDisplacementTerrain()');
console.log('  - createShinyMaterial()');
console.log('  - createAnimatedNormalMaterial()');
console.log('  - createTexturedCube()');
console.log('  - createReflectiveFloor()');
