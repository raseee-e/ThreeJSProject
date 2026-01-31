/**
 * Controls Setup
 */

import * as THREE from 'three';

export interface ControlsConfig {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableDamping: boolean;
    dampingFactor: number;
}

export function setupControls(): ControlsConfig {
    return {
        autoRotate: true,
        autoRotateSpeed: 2,
        enableDamping: true,
        dampingFactor: 0.05
    };
}
