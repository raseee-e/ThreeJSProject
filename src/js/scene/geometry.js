/**
 * Geometrien Setup
 */

import * as THREE from 'three';

export function createGeometries(stage, materials) {
    let count = 0;

    // 1. Bühnenboden
    const stageBase = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 0.5, 64),
        materials.stage
    );
    stageBase.castShadow = stageBase.receiveShadow = true;
    stage.add(stageBase);
    count++;

    // 2. Innere Plattform
    const innerStage = new THREE.Mesh(
        new THREE.CylinderGeometry(7, 7, 0.3, 32),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5 })
    );
    innerStage.position.y = 0.5;
    innerStage.castShadow = innerStage.receiveShadow = true;
    stage.add(innerStage);
    count++;

    // 3-4. Treppen
    const stairLeft = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 3),
        materials.wood
    );
    stairLeft.position.set(-5, 1.5, 0);
    stairLeft.castShadow = stairLeft.receiveShadow = true;
    stage.add(stairLeft);
    count++;

    const stairRight = stairLeft.clone();
    stairRight.position.set(5, 1.5, 0);
    stairRight.castShadow = stairRight.receiveShadow = true;
    stage.add(stairRight);
    count++;

    // 5. Rampe
    const ramp = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.3, 3),
        materials.stage
    );
    ramp.rotation.z = Math.PI / 8;
    ramp.position.set(0, 2, 8);
    ramp.castShadow = ramp.receiveShadow = true;
    stage.add(ramp);
    count++;

    // 6. Championship Podium
    const championPodest = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 0.5, 32),
        new THREE.MeshStandardMaterial({ color: 0xffe100, metalness: 0.7, roughness: 0.3 })
    );
    championPodest.position.set(0, 1, 0);
    championPodest.castShadow = championPodest.receiveShadow = true;
    stage.add(championPodest);
    count++;

    // 7-8. Säulen
    const columnLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 8, 32),
        materials.metalSilver
    );
    columnLeft.position.set(-8, 4, 0);
    columnLeft.castShadow = columnLeft.receiveShadow = true;
    stage.add(columnLeft);
    count++;

    const columnRight = columnLeft.clone();
    columnRight.position.set(8, 4, 0);
    columnRight.castShadow = columnRight.receiveShadow = true;
    stage.add(columnRight);
    count++;

    // 9. Rahmen oben
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(18, 1, 1, 8),
        materials.metalSilver
    );
    topFrame.position.set(0, 8.5, 0);
    topFrame.castShadow = topFrame.receiveShadow = true;
    stage.add(topFrame);
    count++;

    // 10. Spotlight Rahmen
    const spotlightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(12, 0.5, 0.5, 4),
        materials.black
    );
    spotlightFrame.position.set(0, 9, 0);
    spotlightFrame.castShadow = spotlightFrame.receiveShadow = true;
    stage.add(spotlightFrame);
    count++;

    // 11. Sphäre (beweglich)
    const decorSphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.2, 4),
        materials.crystal
    );
    decorSphere.position.set(-4, 5, -5);
    decorSphere.castShadow = decorSphere.receiveShadow = true;
    stage.add(decorSphere);
    count++;

    // 12. Torus (beweglich)
    const torusRing = new THREE.Mesh(
        new THREE.TorusGeometry(3, 0.3, 16, 100),
        materials.metalGold
    );
    torusRing.position.set(4, 5, -5);
    torusRing.rotation.x = Math.PI / 4;
    torusRing.castShadow = torusRing.receiveShadow = true;
    stage.add(torusRing);
    count++;

    // 13. Tetraeder (beweglich)
    const tetrahedron = new THREE.Mesh(
        new THREE.TetrahedronGeometry(1.5, 0),
        new THREE.MeshStandardMaterial({ color: 0xff6b9d, metalness: 0.3, roughness: 0.6 })
    );
    tetrahedron.position.set(-6, 3, 5);
    tetrahedron.castShadow = tetrahedron.receiveShadow = true;
    stage.add(tetrahedron);
    count++;

    // 14. Octahedron (beweglich)
    const octahedron = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.5, 0),
        materials.red
    );
    octahedron.position.set(6, 3, 5);
    octahedron.castShadow = octahedron.receiveShadow = true;
    stage.add(octahedron);
    count++;

    return {
        count,
        meshes: {
            stageBase, innerStage, stairLeft, stairRight, ramp,
            championPodest, columnLeft, columnRight, topFrame, spotlightFrame,
            decorSphere, torusRing, tetrahedron, octahedron
        }
    };
}
