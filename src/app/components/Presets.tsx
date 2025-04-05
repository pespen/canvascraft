"use client";

import { CanvasSettings } from "./ControlPanel";

interface PresetsProps {
  onSelectPreset: (settings: CanvasSettings) => void;
}

// Predefined art presets
const presets: { name: string; settings: CanvasSettings }[] = [
  {
    name: "Bubbles",
    settings: {
      shape: "circles",
      color: "#3498db",
      count: 30,
      speed: 5,
      canvasWidth: 800,
      canvasHeight: 600,
    },
  },
  {
    name: "Neon Grid",
    settings: {
      shape: "rectangles",
      color: "#ff00ff",
      count: 50,
      speed: 2,
      canvasWidth: 800,
      canvasHeight: 600,
    },
  },
  {
    name: "Lasers",
    settings: {
      shape: "lines",
      color: "#ff3300",
      count: 70,
      speed: 8,
      canvasWidth: 800,
      canvasHeight: 600,
    },
  },
  {
    name: "Fractal Tree",
    settings: {
      shape: "fractals",
      color: "#00cc66",
      count: 8,
      speed: 1,
      canvasWidth: 800,
      canvasHeight: 600,
    },
  },
  {
    name: "Starfield",
    settings: {
      shape: "circles",
      color: "#ffffff",
      count: 100,
      speed: 3,
      canvasWidth: 800,
      canvasHeight: 600,
    },
  },
];

const Presets = ({ onSelectPreset }: PresetsProps) => {
  return (
    <div className="flex flex-wrap gap-1">
      {presets.map((preset) => (
        <button
          key={preset.name}
          onClick={() => onSelectPreset(preset.settings)}
          className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-xs"
          style={{ borderLeft: `3px solid ${preset.settings.color}` }}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};

export default Presets;
