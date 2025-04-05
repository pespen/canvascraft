// Types for canvas settings
export interface CanvasSettings {
  shape: "circles" | "rectangles" | "lines";
  color: string;
  count: number;
  speed?: number;
  canvasWidth: number;
  canvasHeight: number;
  drawingMethod?: {
    type:
      | "grid"
      | "sine"
      | "spiral"
      | "circular"
      | "fibonacci"
      | "lissajous"
      | "rose"
      | "phyllotaxis"
      | "custom";
    params: Record<string, number | string>;
  };
}

// Canvas props interface
export interface CanvasProps {
  width: number;
  height: number;
  settings: CanvasSettings;
  scale?: number;
}

// Element position interface
export interface ElementPosition {
  x: number;
  y: number;
  size: number;
  endX?: number;
  endY?: number;
}

// Control panel props
export interface ControlPanelProps {
  settings: CanvasSettings;
  onSettingsChange: (settings: CanvasSettings) => void;
  onExport?: () => void;
}

// Canvas size presets
export const sizePresets = [
  { name: "A4 Landscape", width: 842, height: 595 },
  { name: "A4 Portrait", width: 595, height: 842 }, // A4 at 72 DPI
  { name: "A3 Landscape", width: 1191, height: 842 },
  { name: "A3 Portrait", width: 842, height: 1191 }, // A3 at 72 DPI
  { name: "Square", width: 800, height: 800 },
  { name: "HD", width: 1280, height: 720 },
  { name: "4K", width: 3840, height: 2160 },
];

// Constants
export const MIN_CANVAS_SIZE = 50;
export const MAX_CANVAS_SIZE = 5000;
