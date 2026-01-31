/**
 * Lichter Setup
 */

import * as THREE from 'three';

export interface Lights {
    main: THREE.DirectionalLight;
    spotlight1: THREE.SpotLight;
    spotlight2: THREE.SpotLight;
    spotlight3: THREE.SpotLight;
    spotlight4: THREE.SpotLight;
    spotlight5: THREE.SpotLight;
    ambient: THREE.AmbientLight;
    [key: string]: THREE.Light;
}

export function createLights(scene: THREE.Scene): Lights {
    const lights: Lights = {
        main: new THREE.DirectionalLight(0xffffff, 1),
        spotlight1: new THREE.SpotLight(0xff0000, 2),
        spotlight2: new THREE.SpotLight(0x00ff00, 2),
        spotlight3: new THREE.SpotLight(0x0000ff, 2),
        spotlight4: new THREE.SpotLight(0xffff00, 1.5),
        spotlight5: new THREE.SpotLight(0xff00ff, 1.5),
        ambient: new THREE.AmbientLight(0xffffff, 0.3)
    };

    // Main Light
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

    return lights;
}
