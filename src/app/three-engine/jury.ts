import * as THREE from 'three';

export class Jury {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
    console.log('🪑 Creating jury seating...');
    this.buildJuryTable();
    this.buildJuryChairs();
    console.log('✅ Jury created with', this.mesh.children.length, 'objects');
  }

  private buildJuryTable() {
    // Main jury table in front of stage (moved forward and down to avoid lights)
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.5,
      metalness: 0.3
    });

    // Table top - moved to z=12 (further forward) and y=0.8 (lower)
    const tableTopGeo = new THREE.BoxGeometry(26, 0.5, 1.5);
    const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
    tableTop.position.set(0, 0.8, 12);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.mesh.add(tableTop);

    // Table front panel (with name/branding area)
    const frontPanelMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3
    });

    const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(26, 0.4, 0.1), frontPanelMat);
    frontPanel.position.set(0, 0.5, 11.85);
    this.mesh.add(frontPanel);

    // Table support legs
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.6,
      roughness: 0.3
    });

    const legPositions = [[-12, 11.5], [12, 11.5], [-12, 12.5], [12, 12.5]];
    legPositions.forEach(pos => {
      const legGeo = new THREE.BoxGeometry(0.4, 0.8, 0.4);
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(pos[0], 0.4, pos[1]);
      leg.castShadow = true;
      this.mesh.add(leg);
    });
  }

  private buildJuryChairs() {
    // Create jury chairs arranged in front of table (moved forward and down)
    const chairCount = 7; // Typical jury size
    const spacing = 26 / (chairCount - 1);

    for (let i = 0; i < chairCount; i++) {
      const xPos = -13 + i * spacing;
      const chair = this.createChair();
      chair.position.set(xPos, 0, 12.8);
      this.mesh.add(chair);

      // Add a small name plate above each chair
      this.addNamePlate(xPos, 1.3, 12.8);
    }
  }

  private createChair(): THREE.Group {
    const chairGroup = new THREE.Group();

    // Chair seat
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.7,
      metalness: 0.1
    });

    const seatGeo = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.y = 1;
    seat.castShadow = true;
    chairGroup.add(seat);

    // Chair back
    const backGeo = new THREE.BoxGeometry(0.5, 0.8, 0.1);
    const back = new THREE.Mesh(backGeo, seatMat);
    back.position.set(0, 1.4, -0.2);
    back.castShadow = true;
    chairGroup.add(back);

    // Chair legs
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.6,
      roughness: 0.3
    });

    const legPositions = [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]];
    legPositions.forEach(pos => {
      const legGeo = new THREE.BoxGeometry(0.08, 1, 0.08);
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(pos[0], 0.5, pos[1]);
      leg.castShadow = true;
      chairGroup.add(leg);
    });

    return chairGroup;
  }

  private addNamePlate(x: number, y: number, z: number) {
    // Simple name plate above chair
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2
    });

    const plateGeo = new THREE.BoxGeometry(0.6, 0.08, 0.4);
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(x, y, z);
    plate.castShadow = true;
    this.mesh.add(plate);

    // Support stand
    const standGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const stand = new THREE.Mesh(standGeo, plateMat);
    stand.position.set(x, y - 0.2, z);
    this.mesh.add(stand);
  }
}
