// =================================
// THREE.JS BODYBUILDING BÜHNE
// =================================

// Scene Setup
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);
scene.fog = new THREE.Fog(0x1a1a1a, 100, 200);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 8, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;

// Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

// =================================
// TEXTUREN UND MATERIALIEN
// =================================

const materials = {
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

// =================================
// BÜHNEN-GEOMETRIEN ERSTELLEN
// =================================

const stage = new THREE.Group();
scene.add(stage);

let geometrieCount = 0;

// 1. Bühnenboden (Hauptplattform)
const stageBase = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 0.5, 64),
    materials.stage
);
stageBase.position.y = 0;
stageBase.castShadow = true;
stageBase.receiveShadow = true;
stage.add(stageBase);
geometrieCount++;

// 2. Innere Bühnenplattform (erhöht)
const innerStage = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 0.3, 32),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5 })
);
innerStage.position.y = 0.5;
innerStage.castShadow = true;
innerStage.receiveShadow = true;
stage.add(innerStage);
geometrieCount++;

// 3. & 4. Zwei seitliche Treppen
const stairLeft = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 3),
    materials.wood
);
stairLeft.position.set(-5, 1.5, 0);
stairLeft.castShadow = true;
stairLeft.receiveShadow = true;
stage.add(stairLeft);
geometrieCount++;

const stairRight = stairLeft.clone();
stairRight.position.set(5, 1.5, 0);
stairRight.castShadow = true;
stairRight.receiveShadow = true;
stage.add(stairRight);
geometrieCount++;

// 5. Rampe (schräge Fläche)
const ramp = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.3, 3),
    materials.stage
);
ramp.rotation.z = Math.PI / 8;
ramp.position.set(0, 2, 8);
ramp.castShadow = true;
ramp.receiveShadow = true;
stage.add(ramp);
geometrieCount++;

// 6. Podest für Champion
const championPodest = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 0.5, 32),
    new THREE.MeshStandardMaterial({ color: 0xffe100, metalness: 0.7, roughness: 0.3 })
);
championPodest.position.set(0, 1, 0);
championPodest.castShadow = true;
championPodest.receiveShadow = true;
stage.add(championPodest);
geometrieCount++;

// =================================
// DEKORATIVE ELEMENTE
// =================================

// 7. Zylindrische Säule links
const columnLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 8, 32),
    materials.metalSilver
);
columnLeft.position.set(-8, 4, 0);
columnLeft.castShadow = true;
columnLeft.receiveShadow = true;
stage.add(columnLeft);
geometrieCount++;

// 8. Zylindrische Säule rechts
const columnRight = columnLeft.clone();
columnRight.position.set(8, 4, 0);
columnRight.castShadow = true;
columnRight.receiveShadow = true;
stage.add(columnRight);
geometrieCount++;

// 9. Oberer Rahmen (Box)
const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(18, 1, 1, 8),
    materials.metalSilver
);
topFrame.position.set(0, 8.5, 0);
topFrame.castShadow = true;
topFrame.receiveShadow = true;
stage.add(topFrame);
geometrieCount++;

// 10. Spotlight-Rahmen oben
const spotlightFrame = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.5, 0.5, 4),
    materials.black
);
spotlightFrame.position.set(0, 9, 0);
spotlightFrame.castShadow = true;
spotlightFrame.receiveShadow = true;
stage.add(spotlightFrame);
geometrieCount++;

// 11. Kugel-Dekoration (bewegbar)
const decorSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 4),
    materials.crystal
);
decorSphere.position.set(-4, 5, -5);
decorSphere.castShadow = true;
decorSphere.receiveShadow = true;
stage.add(decorSphere);
geometrieCount++;
const sphereRotation = { speed: 0.02 }; // Für Animation

// 12. Torus-Ring (bewegbar)
const torusRing = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.3, 16, 100),
    materials.metalGold
);
torusRing.position.set(4, 5, -5);
torusRing.castShadow = true;
torusRing.receiveShadow = true;
torusRing.rotation.x = Math.PI / 4;
stage.add(torusRing);
geometrieCount++;
const torusRotation = { speed: 0.03 };

// 13. Tetraeder (Pyramide)
const tetrahedron = new THREE.Mesh(
    new THREE.TetrahedronGeometry(1.5, 0),
    new THREE.MeshStandardMaterial({ color: 0xff6b9d, metalness: 0.3, roughness: 0.6 })
);
tetrahedron.position.set(-6, 3, 5);
tetrahedron.castShadow = true;
tetrahedron.receiveShadow = true;
stage.add(tetrahedron);
geometrieCount++;

// 14. Octahedron
const octahedron = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.5, 0),
    materials.red
);
octahedron.position.set(6, 3, 5);
octahedron.castShadow = true;
octahedron.receiveShadow = true;
stage.add(octahedron);
geometrieCount++;

console.log(`✓ Geometrien erstellt: ${geometrieCount}`);

// =================================
// LICHTQUELLEN (> 5 erforderlich)
// =================================

const lights = {
    main: new THREE.DirectionalLight(0xffffff, 1),
    spotlight1: new THREE.SpotLight(0xff0000, 2),
    spotlight2: new THREE.SpotLight(0x00ff00, 2),
    spotlight3: new THREE.SpotLight(0x0000ff, 2),
    spotlight4: new THREE.SpotLight(0xffff00, 1.5),
    spotlight5: new THREE.SpotLight(0xff00ff, 1.5),
    ambient: new THREE.AmbientLight(0xffffff, 0.3)
};

// Hauptlicht
lights.main.position.set(10, 15, 10);
lights.main.castShadow = true;
lights.main.shadow.mapSize.width = 2048;
lights.main.shadow.mapSize.height = 2048;
lights.main.shadow.camera.far = 50;
scene.add(lights.main);

// Spotlight 1 - Rot
lights.spotlight1.position.set(-10, 12, 0);
lights.spotlight1.target.position.set(0, 1, 0);
lights.spotlight1.angle = Math.PI / 6;
lights.spotlight1.penumbra = 0.5;
lights.spotlight1.decay = 1;
lights.spotlight1.castShadow = true;
scene.add(lights.spotlight1);
scene.add(lights.spotlight1.target);

// Spotlight 2 - Grün
lights.spotlight2.position.set(10, 12, 0);
lights.spotlight2.target.position.set(0, 1, 0);
lights.spotlight2.angle = Math.PI / 6;
lights.spotlight2.penumbra = 0.5;
lights.spotlight2.decay = 1;
lights.spotlight2.castShadow = true;
scene.add(lights.spotlight2);
scene.add(lights.spotlight2.target);

// Spotlight 3 - Blau
lights.spotlight3.position.set(0, 12, 10);
lights.spotlight3.target.position.set(0, 1, 0);
lights.spotlight3.angle = Math.PI / 5;
lights.spotlight3.penumbra = 0.5;
lights.spotlight3.decay = 1;
lights.spotlight3.castShadow = true;
scene.add(lights.spotlight3);
scene.add(lights.spotlight3.target);

// Spotlight 4 - Gelb
lights.spotlight4.position.set(-8, 10, -8);
lights.spotlight4.target.position.set(0, 1, 0);
lights.spotlight4.angle = Math.PI / 5;
lights.spotlight4.penumbra = 0.5;
lights.spotlight4.decay = 1;
scene.add(lights.spotlight4);
scene.add(lights.spotlight4.target);

// Spotlight 5 - Magenta
lights.spotlight5.position.set(8, 10, -8);
lights.spotlight5.target.position.set(0, 1, 0);
lights.spotlight5.angle = Math.PI / 5;
lights.spotlight5.penumbra = 0.5;
lights.spotlight5.decay = 1;
scene.add(lights.spotlight5);
scene.add(lights.spotlight5.target);

// Ambient Light
scene.add(lights.ambient);

console.log(`✓ ${Object.keys(lights).length} Lichtquellen hinzugefügt`);

// =================================
// DAT.GUI STEUERUNG
// =================================

const guiContainer = document.getElementById('gui-container');
const gui = new dat.GUI({ autoPlace: false });
guiContainer.appendChild(gui.domElement);

// Licht-Steuerung
const lightFolder = gui.addFolder('💡 Lichtquellen');
lightFolder.add(lights.main, 'intensity', 0, 2).name('Main Light');
lightFolder.add(lights.spotlight1, 'intensity', 0, 3).name('Red Light');
lightFolder.add(lights.spotlight2, 'intensity', 0, 3).name('Green Light');
lightFolder.add(lights.spotlight3, 'intensity', 0, 3).name('Blue Light');
lightFolder.add(lights.ambient, 'intensity', 0, 1).name('Ambient Light');
lightFolder.open();

// Material-Steuerung
const materialFolder = gui.addFolder('🎨 Materialien');
materialFolder.addColor(materials.metalGold, 'color').name('Trophy Color');
materialFolder.add(materials.metalGold, 'metalness', 0, 1).name('Trophy Metalness');
materialFolder.add(materials.metalGold, 'roughness', 0, 1).name('Trophy Roughness');
materialFolder.open();

// Animation-Steuerung
const animationFolder = gui.addFolder('⚙️ Animationen');
animationFolder.add(sphereRotation, 'speed', 0, 0.1).name('Sphere Rotation Speed');
animationFolder.add(torusRotation, 'speed', 0, 0.1).name('Torus Rotation Speed');
animationFolder.add(controls, 'autoRotate').name('Auto Rotate Camera');
animationFolder.add(controls, 'autoRotateSpeed', 0, 10).name('Rotation Speed');
animationFolder.open();

// Kamera-Steuerung
const cameraFolder = gui.addFolder('📷 Kamera');
cameraFolder.add(camera.position, 'x', -50, 50).name('Camera X');
cameraFolder.add(camera.position, 'y', -50, 50).name('Camera Y');
cameraFolder.add(camera.position, 'z', -50, 50).name('Camera Z');
cameraFolder.open();

// Scene-Steuerung
const sceneFolder = gui.addFolder('🌍 Szene');
sceneFolder.addColor(scene, 'background').name('Background Color');
sceneFolder.add(scene.fog, 'far', 1, 500).name('Fog Distance');
sceneFolder.open();

// =================================
// ANIMATIONSLOOP
// =================================

function animate() {
    requestAnimationFrame(animate);

    // Sphäre rotieren lassen
    decorSphere.rotation.x += sphereRotation.speed;
    decorSphere.rotation.y += sphereRotation.speed * 0.7;

    // Torus rotieren lassen
    torusRing.rotation.y += torusRotation.speed;
    torusRing.rotation.x += torusRotation.speed * 0.5;

    // Tetraeder animieren
    tetrahedron.rotation.x += 0.005;
    tetrahedron.rotation.y += 0.008;
    tetrahedron.position.y = 3 + Math.sin(Date.now() * 0.001) * 0.5;

    // Octahedron animieren
    octahedron.rotation.x += 0.006;
    octahedron.rotation.z += 0.007;
    octahedron.position.y = 3 + Math.cos(Date.now() * 0.001) * 0.5;

    // Champion Podest pulsieren
    championPodest.scale.y = 1 + Math.sin(Date.now() * 0.002) * 0.1;

    // Controls aktualisieren
    controls.update();

    // Rendern
    renderer.render(scene, camera);
}

animate();

// =================================
// RESPONSIVE DESIGN
// =================================

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// =================================
// TASTATUR-STEUERUNG
// =================================

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

// =================================
// BLENDER POKAL LADEN (Optional)
// =================================

const gltfLoader = new THREE.GLTFLoader();

gltfLoader.load('models/trophy.glb', (gltf) => {
    const trophy = gltf.scene;
    
    // Skalierung und Position
    trophy.scale.set(2, 2, 2);
    trophy.position.set(0, 1.5, 0);
    trophy.rotation.y = Math.PI / 4;
    
    // Schatten aktivieren
    trophy.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    stage.add(trophy);
    
    // Trophy zu Dat.GUI hinzufügen
    const trophyFolder = gui.addFolder('🏆 Pokal');
    trophyFolder.add(trophy.position, 'y', -5, 10, 0.1).name('Höhe');
    trophyFolder.add(trophy.rotation, 'y', 0, Math.PI * 2, 0.01).name('Rotation');
    trophyFolder.add(trophy.scale, 'x', 0.1, 5, 0.1).name('Skalierung');
    trophyFolder.open();
    
    console.log('✓ Pokal erfolgreich geladen!');
    
}, undefined, (error) => {
    console.log('⚠ Pokal-Modell nicht gefunden (normal wenn nicht aus Blender exportiert)');
    console.log('  Erstelle stattdessen einen prozeduralen Trophy...');
    
    // Fallback: Procedurales Pokal-Mesh
    const trophyGroup = new THREE.Group();
    
    // Basis
    const trophyBase = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 2, 0.4, 32),
        materials.metalGold
    );
    trophyBase.position.y = 0;
    trophyGroup.add(trophyBase);
    
    // Schaft
    const trophyShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32),
        materials.metalGold
    );
    trophyShaft.position.y = 1;
    trophyGroup.add(trophyShaft);
    
    // Kelch
    const trophyBowl = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 1, 32),
        materials.metalGold
    );
    trophyBowl.position.y = 2.2;
    trophyGroup.add(trophyBowl);
    
    // Henkel
    const trophyHandle = new THREE.Mesh(
        new THREE.TorusGeometry(0.8, 0.15, 16, 100),
        materials.metalGold
    );
    trophyHandle.position.set(-0.9, 1.8, 0);
    trophyHandle.rotation.z = Math.PI / 4;
    trophyGroup.add(trophyHandle);
    
    trophyGroup.position.set(0, 1, 0);
    trophyGroup.scale.set(1.5, 1.5, 1.5);
    
    trophyGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    stage.add(trophyGroup);
    
    const trophyFolder = gui.addFolder('🏆 Pokal (Procedural)');
    trophyFolder.add(trophyGroup.position, 'y', -5, 10, 0.1).name('Höhe');
    trophyFolder.add(trophyGroup.rotation, 'y', 0, Math.PI * 2, 0.01).name('Rotation');
    trophyFolder.add(trophyGroup.scale, 'x', 0.1, 5, 0.1).name('Skalierung');
    trophyFolder.open();
    
    geometrieCount += 4; // Zusätzliche Geometrien für proceduralen Trophy
    console.log('✓ Proceduraler Trophy erstellt! (Aktualisierung: Trophy.glb aus Blender hinzufügen)');
});

console.log('🎬 Bodybuilding Bühne erfolgreich geladen!');
console.log(`✓ Geometrien: ${geometrieCount}`);
console.log('✓ Lichtquellen: 6');
console.log('✓ Materialien: 7');
console.log('✓ Dat.GUI Steuerung: Aktiviert');
console.log('✓ Pokal-Lade-System: Aktiv');
