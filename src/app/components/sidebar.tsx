"use client";

interface SidebarProps {
  shapeCount: number;
  setShapeCount: (value: number) => void;
  maxSize: number;
  setMaxSize: (value: number) => void;
  lineWidth: number;
  setLineWidth: (value: number) => void;
  opacity: number;
  setOpacity: (value: number) => void;
  pathLength: number;
  setPathLength: (value: number) => void;
  noiseScale: number;
  setNoiseScale: (value: number) => void;
  colorVariation: number;
  setColorVariation: (value: number) => void;
}

export default function Sidebar({
  shapeCount,
  setShapeCount,
  maxSize,
  setMaxSize,
  lineWidth,
  setLineWidth,
  opacity,
  setOpacity,
  pathLength,
  setPathLength,
  noiseScale,
  setNoiseScale,
  colorVariation,
  setColorVariation,
}: SidebarProps) {
  return (
    <aside className="w-96 bg-gray-900 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">Controls</h2>

      {/* Shape Count */}
      <label className="block">
        <span>Shape Count: {shapeCount}</span>
        <input
          type="range"
          min="1"
          max="100"
          value={shapeCount}
          onChange={(e) => setShapeCount(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {/* Max Shape Size */}
      <label className="block">
        <span>Max Shape Size: {maxSize}px</span>
        <input
          type="range"
          min="50"
          max="500"
          value={maxSize}
          onChange={(e) => setMaxSize(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {/* Line Width */}
      <label className="block">
        <span>Line Width: {lineWidth}</span>
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {/* Opacity */}
      <label className="block">
        <span>Opacity: {opacity}</span>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {/* Path Length */}
      <label className="block">
        <span>Path Length: {pathLength}</span>
        <input
          type="range"
          min="10"
          max="200"
          value={pathLength}
          onChange={(e) => setPathLength(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {/* Noise Scale */}
      <label className="block">
        <span>Noise Scale: {noiseScale.toFixed(2)}</span>
        <input
          type="range"
          min="0.001"
          max="0.1"
          step="0.001"
          value={noiseScale}
          onChange={(e) => setNoiseScale(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {/* Color Variation */}
      <label className="block">
        <span>Color Variation: {colorVariation}</span>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={colorVariation}
          onChange={(e) => setColorVariation(Number(e.target.value))}
          className="w-full"
        />
      </label>
    </aside>
  );
}
