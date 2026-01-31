import * as THREE from 'three';
import { createNoiseTexture } from './textureUtils';

export class Stage {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
    this.buildFloor();
    this.buildPodium();
    this.buildBackdrop();
    this.buildPillars();
    this.buildLEDPanels();
  }

  private buildFloor() {
    // Main stage floor with dark material
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
    // Main central podium - elevated stage
    const podiumMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a, 
      roughness: 0.5,
      metalness: 0.4
    });
    
    // Base tier
    const basePodium = new THREE.Mesh(new THREE.BoxGeometry(20, 0.8, 14), podiumMat);
    basePodium.position.y = 0.4;
    basePodium.castShadow = true;
    basePodium.receiveShadow = true;
    this.mesh.add(basePodium);

    // Second tier
    const secondTier = new THREE.Mesh(new THREE.BoxGeometry(18, 0.8, 12), podiumMat);
    secondTier.position.y = 1.3;
    secondTier.castShadow = true;
    secondTier.receiveShadow = true;
    this.mesh.add(secondTier);

    // Third tier (front stage)
    const thirdTier = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 10), podiumMat);
    thirdTier.position.y = 2;
    thirdTier.castShadow = true;
    thirdTier.receiveShadow = true;
    this.mesh.add(thirdTier);

    // Golden edge accent
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
    // Flat backdrop wall instead of curved - fixes rendering bug
    const backdropMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a3a,
      roughness: 0.7,
      metalness: 0.2,
      emissive: 0x0a1a2a,
      emissiveIntensity: 0.15
    });

    // Main backdrop panel
    const backdropGeo = new THREE.PlaneGeometry(60, 16);
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.set(0, 8, -10);
    backdrop.castShadow = true;
    backdrop.receiveShadow = true;
    this.mesh.add(backdrop);

    // Add frame/border for dramatic effect
    this.addBackdropFrame();

    // Add the logo area (Romania Muscle Fest circular area)
    this.addLogoArea();
  }

  private addBackdropFrame() {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x2a3a4a,
      metalness: 0.5,
      roughness: 0.3
    });

    // Top frame
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(62, 1, 0.5), frameMat);
    topFrame.position.set(0, 14.5, -10);
    this.mesh.add(topFrame);

    // Bottom frame
    const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(62, 1, 0.5), frameMat);
    bottomFrame.position.set(0, 1.5, -10);
    this.mesh.add(bottomFrame);

    // Left frame
    const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(1, 16, 0.5), frameMat);
    leftFrame.position.set(-30, 8, -10);
    this.mesh.add(leftFrame);

    // Right frame
    const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(1, 16, 0.5), frameMat);
    rightFrame.position.set(30, 8, -10);
    this.mesh.add(rightFrame);
  }

  private addLogoArea() {
    // Central glowing circle for logo area (Romania Muscle Fest)
    const logoRadius = 5.5;
    
    // Background circle (dark)
    const circleGeo = new THREE.CircleGeometry(logoRadius, 64);
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

    // Glowing ring around logo
    const ringGeo = new THREE.TorusGeometry(logoRadius, 0.5, 32, 100);
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

    // Logo texture (loads the Romania Muscle Fest logo)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'textures/logo.png',
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
        
        console.log('✅ Logo texture loaded successfully');
      },
      undefined,
      (error) => {
        console.warn('⚠️ Logo not found at textures/logo.png. Using placeholder instead.');
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

    // Inner glow
    const innerGlowGeo = new THREE.CircleGeometry(logoRadius - 0.7, 64);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.2
    });
    
    const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    innerGlow.position.set(0, 8, -9.6);
    this.mesh.add(innerGlow);

    // Point light for logo glow
    const logoLight = new THREE.PointLight(0x0099ff, 80, 25);
    logoLight.position.set(0, 8, -3);
    this.mesh.add(logoLight);
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
    // LED floor panels - dotted pattern
    this.createLEDFloor();
    
    // LED side panels
    this.createLEDSidePanels();
  }

  private createLEDFloor() {
    // Create dotted LED floor pattern
    const dotSpacing = 1.5;
    const dotSize = 0.2;
    const colors = [0xff0080, 0x0080ff, 0x00ff80, 0xffff00];
    
    const floorArea = 70;
    
    for (let x = -floorArea / 2; x < floorArea / 2; x += dotSpacing) {
      for (let z = -floorArea / 2; z < floorArea / 2; z += dotSpacing) {
        // Skip some dots for pattern
        if (Math.random() > 0.35) continue;
        
        const dotGeo = new THREE.SphereGeometry(dotSize, 8, 8);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dotMat = new THREE.MeshBasicMaterial({ 
          color: color
        });
        
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(x, 0.05, z);
        this.mesh.add(dot);

        // Add point lights for glow effect (sparse)
        if (Math.random() > 0.92) {
          const pointLight = new THREE.PointLight(color, 8, 6);
          pointLight.position.set(x, 0.5, z);
          this.mesh.add(pointLight);
        }
      }
    }
  }

  private createLEDSidePanels() {
    // Left and right LED panel walls
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.2
    });

    // Left panel
    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 60), panelMat);
    leftPanel.position.set(-35, 6, 0);
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    this.mesh.add(leftPanel);

    // Right panel
    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 60), panelMat);
    rightPanel.position.set(35, 6, 0);
    rightPanel.castShadow = true;
    rightPanel.receiveShadow = true;
    this.mesh.add(rightPanel);

    // Add LED dots to side panels
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
}