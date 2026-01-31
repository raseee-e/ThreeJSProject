declare module 'dat.gui' {
  export interface GUIParams {
    autoPlace?: boolean;
    resizable?: boolean;
    width?: number;
    name?: string;
    load?: any;
    preset?: string;
  }

  export class GUI {
    constructor(params?: GUIParams);
    add(object: any, property: string, min?: number, max?: number, step?: number): any;
    addColor(object: any, property: string): any;
    addFolder(name: string): any;
    domElement: HTMLElement;
    open(): void;
    close(): void;
    destroy(): void;
  }
}
