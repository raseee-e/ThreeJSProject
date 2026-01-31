/**
 * Three.js Bodybuilding Bühne
 * Root level scene initialization
 */

import * as THREE from 'three';
import { BodybuildingStageScene } from './src/ts/scene/main';

// Initialize scene when DOM is ready
export function initializeScene(): BodybuildingStageScene | null {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    
    if (!canvas) {
        console.error('Canvas element not found');
        return null;
    }

    try {
        const scene = new BodybuildingStageScene(canvas);
        console.log('✅ Scene initialized successfully');
        return scene;
    } catch (error) {
        console.error('❌ Error initializing scene:', error);
        return null;
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScene);
} else {
    initializeScene();
}

// Export for manual initialization if needed
export { BodybuildingStageScene } from './src/ts/scene/main';
