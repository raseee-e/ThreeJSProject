import * as THREE from 'three';

export class Trophy {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
    
    const goldMat = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, metalness: 1.0, roughness: 0.2 
    });

    // Basis
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 0.5, 32), goldMat);
    // Stiel
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 16), goldMat);
    stem.position.y = 1.25;
    // Schale
    const cup = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI*2, 0, Math.PI/2), goldMat);
    cup.position.y = 2.25;
    cup.rotation.x = Math.PI;
    // Kugel oben
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.3), goldMat);
    orb.position.y = 2.5;

    this.mesh.add(base, stem, cup, orb);
    this.mesh.position.set(0, 1.25, 0); // Startposition auf dem Podest
    this.mesh.castShadow = true;
    
    // Schatten für alle Teile aktivieren
    this.mesh.children.forEach(c => c.castShadow = true);
  }

  animate(time: number, rotationSpeed: number) {
    this.mesh.rotation.y += rotationSpeed;
    this.mesh.position.y = 1.25 + Math.sin(time * 2) * 0.05; // Schweben
  }
}