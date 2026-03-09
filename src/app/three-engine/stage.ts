import * as THREE from 'three';
import { createNoiseTexture } from './textureUtils';
import { createLogoTexture, createLogoCanvasTexture } from './logoLoader';

export class Stage {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
    this.buildFloor();
    this.buildPodium();
    this.buildBackdrop();
    this.buildPillars();
    this.buildLEDPanels();
    this.buildRoof();
    this.closeRoomWalls();
  }

  private buildFloor() {
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.7,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = 0;
    this.mesh.add(floor);
  }

  private buildPodium() {
    const podiumMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a, 
      roughness: 0.5,
      metalness: 0.4
    });
    
    const basePodium = new THREE.Mesh(new THREE.BoxGeometry(20, 0.8, 14), podiumMat);
    basePodium.position.y = 0.4;
    basePodium.castShadow = true;
    basePodium.receiveShadow = true;
    this.mesh.add(basePodium);

    const secondTier = new THREE.Mesh(new THREE.BoxGeometry(18, 0.8, 12), podiumMat);
    secondTier.position.y = 1.3;
    secondTier.castShadow = true;
    secondTier.receiveShadow = true;
    this.mesh.add(secondTier);

    const thirdTier = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 10), podiumMat);
    thirdTier.position.y = 2;
    thirdTier.castShadow = true;
    thirdTier.receiveShadow = true;
    this.mesh.add(thirdTier);

    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 1,
      roughness: 0.2,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3
    });
    
    const edge1 = new THREE.Mesh(new THREE.BoxGeometry(20.3, 0.15, 14.2), edgeMat);
    edge1.position.y = 0.78;
    this.mesh.add(edge1);

    const edge2 = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.15, 12.2), edgeMat);
    edge2.position.y = 1.68;
    this.mesh.add(edge2);
  }

  private buildBackdrop() {
    const backdropMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a3a,
      roughness: 0.7,
      metalness: 0.2,
      emissive: 0x0a1a2a,
      emissiveIntensity: 0.15
    });

    const backdropGeo = new THREE.PlaneGeometry(60, 16);
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.set(0, 8, -10);
    backdrop.castShadow = true;
    backdrop.receiveShadow = true;
    this.mesh.add(backdrop);

    this.addBackdropFrame();

    this.addLogoArea();
  }

  private addBackdropFrame() {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x2a3a4a,
      metalness: 0.5,
      roughness: 0.3
    });

    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(62, 1, 0.5), frameMat);
    topFrame.position.set(0, 14.5, -10);
    this.mesh.add(topFrame);

    const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(62, 1, 0.5), frameMat);
    bottomFrame.position.set(0, 1.5, -10);
    this.mesh.add(bottomFrame);

    const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(1, 16, 0.5), frameMat);
    leftFrame.position.set(-30, 8, -10);
    this.mesh.add(leftFrame);

    const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(1, 16, 0.5), frameMat);
    rightFrame.position.set(30, 8, -10);
    this.mesh.add(rightFrame);
  }

  private addLogoArea() {
    const logoRadius = 5.5;
    
    // Background circle (dark) - reduced from 64 to 32 segments
    const circleGeo = new THREE.CircleGeometry(logoRadius, 32);
    const circleMat = new THREE.MeshStandardMaterial({
      color: 0x0a1520,
      metalness: 0.3,
      roughness: 0.6,
      emissive: 0x0a3050,
      emissiveIntensity: 0.4
    });
    
    const logoBackground = new THREE.Mesh(circleGeo, circleMat);
    logoBackground.position.set(0, 8, -9.8);
    logoBackground.rotation.x = 0;
    this.mesh.add(logoBackground);

    // Glowing ring around logo - reduced from (32, 100) to (8, 40)
    const ringGeo = new THREE.TorusGeometry(logoRadius, 0.5, 8, 40);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0099ff,
      emissiveIntensity: 0.8
    });
    
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 8, -9.7);
    ring.rotation.x = 0;
    this.mesh.add(ring);

    // load picture texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'textures/images.jpg',
      (texture) => {
        // Create canvas to display logo
        const logoMat = new THREE.MeshStandardMaterial({
          map: texture,
          emissive: 0xffffff,
          emissiveIntensity: 0.3,
          metalness: 0.2,
          roughness: 0.5
        });
        
        const logoMesh = new THREE.Mesh(circleGeo, logoMat);
        logoMesh.position.set(0, 8, -9.65);
        logoMesh.scale.set(0.95, 0.95, 1);
        this.mesh.add(logoMesh);
        
        console.log('Romania Muscle Fest logo loaded successfully');
      },
      undefined,
      (error) => {
        console.warn('Logo not found at textures/images.jpg. Using placeholder instead.', error);
        // Use placeholder if logo not found
        const placeholderMat = new THREE.MeshBasicMaterial({
          color: 0xffdd00
        });
        const placeholder = new THREE.Mesh(circleGeo, placeholderMat);
        placeholder.position.set(0, 8, -9.65);
        placeholder.scale.set(0.95, 0.95, 1);
        this.mesh.add(placeholder);
      }
    );

    // Inner glow - reduced from 64 to 32 segments
    const innerGlowGeo = new THREE.CircleGeometry(logoRadius - 0.7, 32);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.2
    });
    
    const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    innerGlow.position.set(0, 8, -9.6);
    this.mesh.add(innerGlow);

    // Point light for logo glow - removed, using ambient + emissive instead
    // Too many point lights kill performance
  }

  private buildPillars() {
    // Stage support pillars with modern look
    const pillarMat = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a2a, 
      metalness: 0.6, 
      roughness: 0.3
    });
    
    const pillarGeo = new THREE.CylinderGeometry(0.8, 0.9, 14, 32);
    const positions = [[-14, -10], [14, -10], [-14, -2], [14, -2], [-22, 0], [22, 0]];

    positions.forEach((pos, idx) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(pos[0], 7, pos[1]);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        this.mesh.add(pillar);

        // Add accent lighting to pillars
        const accentLight = new THREE.PointLight(
          idx % 2 === 0 ? 0xff0080 : 0x0080ff,
          20,
          25
        );
        accentLight.position.set(pos[0], 13, pos[1]);
        this.mesh.add(accentLight);

        // Pillar capital (top decoration)
        const capitalGeo = new THREE.ConeGeometry(1.1, 0.6, 32);
        const capital = new THREE.Mesh(capitalGeo, pillarMat);
        capital.position.set(pos[0], 14.3, pos[1]);
        capital.castShadow = true;
        this.mesh.add(capital);
    });
  }

  private buildLEDPanels() {
    this.createLEDFloor();
    
    this.createLEDSidePanels();
  }

  private createLEDFloor() {
    const dotSpacing = 1.5;
    const dotSize = 0.2;
    const colors = [0xff0080, 0x0080ff, 0x00ff80, 0xffff00];
    
    const floorArea = 70;
    
    for (let x = -floorArea / 2; x < floorArea / 2; x += dotSpacing) {
      for (let z = -floorArea / 2; z < floorArea / 2; z += dotSpacing) {
        if (Math.random() > 0.35) continue;
        
        const dotGeo = new THREE.SphereGeometry(dotSize, 8, 8);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dotMat = new THREE.MeshBasicMaterial({ 
          color: color
        });
        
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(x, 0.05, z);
        this.mesh.add(dot);

        if (Math.random() > 0.92) {
          const pointLight = new THREE.PointLight(color, 8, 6);
          pointLight.position.set(x, 0.5, z);
          this.mesh.add(pointLight);
        }
      }
    }
  }

  private createLEDSidePanels() {
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.2
    });

    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 60), panelMat);
    leftPanel.position.set(-35, 6, 0);
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    this.mesh.add(leftPanel);

    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 60), panelMat);
    rightPanel.position.set(35, 6, 0);
    rightPanel.castShadow = true;
    rightPanel.receiveShadow = true;
    this.mesh.add(rightPanel);

    const sideDotSpacing = 1.2;
    for (let y = 1; y < 12; y += sideDotSpacing) {
      for (let z = -25; z < 25; z += sideDotSpacing) {
        if (Math.random() > 0.4) continue;

        const color = Math.random() > 0.5 ? 0xff0080 : 0x0080ff;
        const dotGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({ color });
        
        const dotLeft = new THREE.Mesh(dotGeo, dotMat);
        dotLeft.position.set(-34.8, y, z);
        this.mesh.add(dotLeft);

        const dotRight = new THREE.Mesh(dotGeo, dotMat);
        dotRight.position.set(34.8, y, z);
        this.mesh.add(dotRight);
      }
    }
  }

  private buildRoof() {
    // Main roof structure - large canopy above the stage
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x1a1a1a,
      emissiveIntensity: 0.2
    });

    // Main roof panel (large overhead structure)
    const roofPanel = new THREE.Mesh(new THREE.BoxGeometry(96, 2, 78), roofMat);
    roofPanel.position.set(0, 19, 0);
    roofPanel.castShadow = true;
    roofPanel.receiveShadow = true;
    this.mesh.add(roofPanel);

    // Roof support beams
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.7,
      roughness: 0.2
    });

    const beamPositions = [
      [-35, 16, -25],
      [-35, 16, 0],
      [-35, 16, 25],
      [35, 16, -25],
      [35, 16, 0],
      [35, 16, 25],
      [0, 16, -30],
      [0, 16, 30]
    ];

    beamPositions.forEach((pos) => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), beamMat);
      beam.position.set(pos[0], pos[1], pos[2]);
      beam.castShadow = true;
      beam.receiveShadow = true;
      this.mesh.add(beam);
    });

    // Roof frame edges
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0099ff,
      emissiveIntensity: 0.3
    });

    const frontEdge = new THREE.Mesh(new THREE.BoxGeometry(90, 0.3, 1), edgeMat);
    frontEdge.position.set(0, 18.8, 34.5);
    this.mesh.add(frontEdge);

    const backEdge = new THREE.Mesh(new THREE.BoxGeometry(90, 0.3, 1), edgeMat);
    backEdge.position.set(0, 18.8, -34.5);
    this.mesh.add(backEdge);

    const leftEdge = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 70), edgeMat);
    leftEdge.position.set(-44.5, 18.8, 0);
    this.mesh.add(leftEdge);

    const rightEdge = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 70), edgeMat);
    rightEdge.position.set(44.5, 18.8, 0);
    this.mesh.add(rightEdge);

    // Add spotlights positioned on the roof
    this.addRoofSpotlights();
  }

  private addRoofSpotlights() {
    // All spotlights are now white
    const allSpotlightPositions = [
      // Center spotlights (bright, illuminate the podium)
      { pos: [-8, 17.5, 5], intensity: 120 },
      { pos: [8, 17.5, 5], intensity: 120 },
      // Side spotlights
      { pos: [-25, 17.5, -5], intensity: 80 },
      { pos: [-25, 17.5, 15], intensity: 80 },
      { pos: [25, 17.5, -5], intensity: 80 },
      { pos: [25, 17.5, 15], intensity: 80 },
      // Back spotlights
      { pos: [0, 17.5, 8], intensity: 60 },
      { pos: [-15, 17.5, 2], intensity: 60 },
      { pos: [15, 17.5, 2], intensity: 60 },
    ];

    allSpotlightPositions.forEach((light, index) => {
      const spotlight = new THREE.SpotLight(0xffffff, light.intensity, 60, Math.PI / 5, 0.4, 1);
      spotlight.position.set(light.pos[0], light.pos[1], light.pos[2]);
      
      // Point spotlights toward the stage center
      spotlight.target.position.set(
        light.pos[0] * 0.3,
        2,
        light.pos[2] * 0.3
      );
      
      // Only enable shadows for center lights to avoid texture unit overflow
      if (index < 2) {
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 1024;
        spotlight.shadow.mapSize.height = 1024;
      }
      
      this.mesh.add(spotlight);
      this.mesh.add(spotlight.target);

      // Create visible white glowing spot
      this.createSpotlightFixture(light.pos);
    });

    // Add some accent point lights on the roof edges for atmosphere (no shadows to preserve texture units)
    const accentPositions = [
      [-40, 18.5, -30],
      [-40, 18.5, 30],
      [40, 18.5, -30],
      [40, 18.5, 30],
    ];

    accentPositions.forEach((pos) => {
      const accentLight = new THREE.PointLight(0x00d4ff, 40, 30);
      accentLight.position.set(pos[0], pos[1], pos[2]);
      accentLight.castShadow = false;
      this.mesh.add(accentLight);
    });
  }

  private createSpotlightFixture(position: number[]) {
    // Create a simple white glowing spot
    const spotMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0xffffff,
      emissiveIntensity: 0.8
    });

    // Simple sphere for the spotlight
    const spotGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const spot = new THREE.Mesh(spotGeo, spotMat);
    spot.position.set(position[0], position[1], position[2]);
    this.mesh.add(spot);

    // Add a point light to enhance the glow effect
    const pointLight = new THREE.PointLight(0xffffff, 50, 40);
    pointLight.position.set(position[0], position[1], position[2]);
    this.mesh.add(pointLight);
  }

  private closeRoomWalls() {
    // Create solid walls to close the room on left and right sides
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.6,
      emissive: 0x0a0a0a,
      emissiveIntensity: 0.1
    });

    // Left wall - closes the left side completely
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2, 20, 75), wallMat);
    leftWall.position.set(-46, 10, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.mesh.add(leftWall);

    // Right wall - closes the right side completely
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2, 20, 75), wallMat);
    rightWall.position.set(46, 10, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    this.mesh.add(rightWall);

    // Front wall - closes the front
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(94, 20, 2), wallMat);
    frontWall.position.set(0, 10, 36);
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;
    this.mesh.add(frontWall);

    // Add accent lighting to walls
    const wallAccentPositions = [
      [-45, 12, -20], [-45, 12, 20],  // Left wall accents
      [45, 12, -20], [45, 12, 20],    // Right wall accents
      [-20, 12, 35], [20, 12, 35],    // Front wall accents
    ];

    wallAccentPositions.forEach((pos, idx) => {
      const accentLight = new THREE.PointLight(
        idx < 4 ? 0xff00ff : 0x00ffff,
        35,
        20
      );
      accentLight.position.set(pos[0], pos[1], pos[2]);
      this.mesh.add(accentLight);
    });
  }
}