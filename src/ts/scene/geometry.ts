/**
 * Geometrien Setup
 */

import * as THREE from 'three';
import type { Materials } from './materials';

interface GeometryData {
    count: number;
    meshes: { [key: string]: THREE.Mesh };
}

export function createGeometries(stage: THREE.Group, materials: Materials): GeometryData {
    let count = 0;
    const meshes: { [key: string]: THREE.Mesh } = {};

    // 1. Bühnenboden
    const stageBase = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 0.5, 64),
        materials.stage
    );
    stageBase.castShadow = stageBase.receiveShadow = true;
    stage.add(stageBase);
    meshes.stageBase = stageBase;
    count++;

    // 2. Innere Plattform
    const innerStage = new THREE.Mesh(
        new THREE.CylinderGeometry(7, 7, 0.3, 32),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5 })
    );
    innerStage.position.y = 0.5;
    innerStage.castShadow = innerStage.receiveShadow = true;
    stage.add(innerStage);
    meshes.innerStage = innerStage;
    count++;

    // 3-4. Treppen
    const stairLeft = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 3),
        materials.wood
    );
    stairLeft.position.set(-5, 1.5, 0);
    stairLeft.castShadow = stairLeft.receiveShadow = true;
    stage.add(stairLeft);
    meshes.stairLeft = stairLeft;
    count++;

    const stairRight = stairLeft.clone();
    stairRight.position.set(5, 1.5, 0);
    stairRight.castShadow = stairRight.receiveShadow = true;
    stage.add(stairRight);
    meshes.stairRight = stairRight;
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
    meshes.ramp = ramp;
    count++;

    // 6. Championship Podium
    const championPodest = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 0.5, 32),
        new THREE.MeshStandardMaterial({ color: 0xffe100, metalness: 0.7, roughness: 0.3 })
    );
    championPodest.position.set(0, 1, 0);
    championPodest.castShadow = championPodest.receiveShadow = true;
    stage.add(championPodest);
    meshes.championPodest = championPodest;
    count++;

    // 7-8. Säulen
    const columnLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 8, 32),
        materials.metalSilver
    );
    columnLeft.position.set(-8, 4, 0);
    columnLeft.castShadow = columnLeft.receiveShadow = true;
    stage.add(columnLeft);
    meshes.columnLeft = columnLeft;
    count++;

    const columnRight = columnLeft.clone();
    columnRight.position.set(8, 4, 0);
    columnRight.castShadow = columnRight.receiveShadow = true;
    stage.add(columnRight);
    meshes.columnRight = columnRight;
    count++;

    // 9. Rahmen oben
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(18, 1, 1, 8),
        materials.metalSilver
    );
    topFrame.position.set(0, 8.5, 0);
    topFrame.castShadow = topFrame.receiveShadow = true;
    stage.add(topFrame);
    meshes.topFrame = topFrame;
    count++;

    // 10. Dekorations-Sphäre (blau, links)
    const decorSphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.5, 4),
        materials.crystal
    );
    decorSphere.position.set(-6, 5, -3);
    decorSphere.castShadow = decorSphere.receiveShadow = true;
    stage.add(decorSphere);
    meshes.decorSphere = decorSphere;
    count++;

    // 11. Torus-Ring (gold, rechts)
    const torusRing = new THREE.Mesh(
        new THREE.TorusGeometry(2, 0.5, 16, 100),
        materials.metalGold
    );
    torusRing.position.set(6, 4, -3);
    torusRing.castShadow = torusRing.receiveShadow = true;
    stage.add(torusRing);
    meshes.torusRing = torusRing;
    count++;

    // 12. Tetraeder (pink, springend)
    const tetrahedron = new THREE.Mesh(
        new THREE.TetrahedronGeometry(1),
        new THREE.MeshStandardMaterial({ color: 0xff1493, metalness: 0.6, roughness: 0.4 })
    );
    tetrahedron.position.set(-3, 3, 5);
    tetrahedron.castShadow = tetrahedron.receiveShadow = true;
    stage.add(tetrahedron);
    meshes.tetrahedron = tetrahedron;
    count++;

    // 13. Octahedron (rot, springend)
    const octahedron = new THREE.Mesh(
        new THREE.OctahedronGeometry(1),
        materials.red
    );
    octahedron.position.set(3, 3, 5);
    octahedron.castShadow = octahedron.receiveShadow = true;
    stage.add(octahedron);
    meshes.octahedron = octahedron;
    count++;

    // 14. Cone (grüner Pokal-Fallback)
    const cone = new THREE.Mesh(
        new THREE.ConeGeometry(1, 2.5, 32),
        new THREE.MeshStandardMaterial({ color: 0x00aa00, metalness: 0.5, roughness: 0.3 })
    );
    cone.position.set(0, 2.5, -5);
    cone.castShadow = cone.receiveShadow = true;
    stage.add(cone);
    meshes.cone = cone;
    count++;

    return { count, meshes };
}
