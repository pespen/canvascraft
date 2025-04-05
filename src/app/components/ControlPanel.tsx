"use client";

import { useState, useEffect } from "react";

export interface CanvasSettings {
  shape: "circles" | "rectangles" | "lines" | "fractals";
  color: string;
  count: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
}

interface ControlPanelProps {
  settings: CanvasSettings;
  onSettingsChange: (settings: CanvasSettings) => void;
  onExport?: () => void;
}

// Constants
const MIN_CANVAS_SIZE = 50;
const MAX_CANVAS_SIZE = 5000;

// Canvas size presets in pixels
const sizePresets = [
  { name: "A4 Landscape", width: 842, height: 595 },
  { name: "A4 Portrait", width: 595, height: 842 }, // A4 at 72 DPI
  { name: "A3 Landscape", width: 1191, height: 842 },
  { name: "A3 Portrait", width: 842, height: 1191 }, // A3 at 72 DPI
  { name: "Square", width: 800, height: 800 },
  { name: "HD", width: 1280, height: 720 },
  { name: "4K", width: 3840, height: 2160 },
];

const ControlPanel = ({
  settings,
  onSettingsChange,
  onExport,
}: ControlPanelProps) => {
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState(
    settings.canvasWidth.toString()
  );
  const [customHeight, setCustomHeight] = useState(
    settings.canvasHeight.toString()
  );
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Validate size inputs whenever they change
  useEffect(() => {
    const width = parseInt(customWidth, 10);
    const height = parseInt(customHeight, 10);

    if (isNaN(width) || isNaN(height)) {
      setSizeError("Please enter valid numbers");
    } else if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
      setSizeError(
        `Maximum size is ${MAX_CANVAS_SIZE}×${MAX_CANVAS_SIZE} pixels`
      );
    } else if (width < MIN_CANVAS_SIZE || height < MIN_CANVAS_SIZE) {
      setSizeError(
        `Minimum size is ${MIN_CANVAS_SIZE}×${MIN_CANVAS_SIZE} pixels`
      );
    } else {
      setSizeError(null);
    }
  }, [customWidth, customHeight]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    onSettingsChange({
      ...settings,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSizePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = e.target.value;

    if (selectedSize === "custom") {
      setCustomWidth(settings.canvasWidth.toString());
      setCustomHeight(settings.canvasHeight.toString());
      setShowCustomSize(true);
      return;
    }

    const preset = sizePresets.find((p) => p.name === selectedSize);
    if (preset) {
      onSettingsChange({
        ...settings,
        canvasWidth: preset.width,
        canvasHeight: preset.height,
      });
      setShowCustomSize(false);
    }
  };

  const applyCustomSize = () => {
    const width = parseInt(customWidth, 10);
    const height = parseInt(customHeight, 10);

    if (
      isNaN(width) ||
      width < MIN_CANVAS_SIZE ||
      width > MAX_CANVAS_SIZE ||
      isNaN(height) ||
      height < MIN_CANVAS_SIZE ||
      height > MAX_CANVAS_SIZE
    ) {
      return; // Don't apply invalid values
    }

    onSettingsChange({
      ...settings,
      canvasWidth: width,
      canvasHeight: height,
    });
    setSizeError(null);
  };

  // Calculate if Apply button should be disabled
  const isApplyDisabled = sizeError !== null;

  return (
    <div className="p-3">
      <h2 className="text-sm font-bold mb-3">Canvas Controls</h2>

      {/* Canvas Size Section */}
      <div className="mb-3">
        <label className="block mb-1 font-medium text-xs">Canvas Size</label>
        <select
          value={
            showCustomSize
              ? "custom"
              : sizePresets.find(
                  (p) =>
                    p.width === settings.canvasWidth &&
                    p.height === settings.canvasHeight
                )?.name || "custom"
          }
          onChange={handleSizePresetChange}
          className="w-full p-1 border border-gray-300 rounded text-xs mb-2"
        >
          {sizePresets.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name} ({preset.width}×{preset.height})
            </option>
          ))}
          <option value="custom">Custom Size</option>
        </select>

        {showCustomSize && (
          <div className="mb-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs mb-1">Width (px)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className={`w-full p-1 border rounded text-xs ${
                    sizeError ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Height (px)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className={`w-full p-1 border rounded text-xs ${
                    sizeError ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            {sizeError && (
              <div className="text-red-500 text-xs mb-2">{sizeError}</div>
            )}

            <button
              onClick={applyCustomSize}
              disabled={isApplyDisabled}
              className={`w-full py-1 text-white rounded text-xs ${
                isApplyDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Apply Size
            </button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium text-xs">Shape</label>
        <select
          name="shape"
          value={settings.shape}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded text-xs"
        >
          <option value="circles">Circles</option>
          <option value="rectangles">Rectangles</option>
          <option value="lines">Lines</option>
          <option value="fractals">Fractals</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium text-xs">Color</label>
        <input
          type="color"
          name="color"
          value={settings.color}
          onChange={handleChange}
          className="w-full p-0.5 border border-gray-300 rounded h-6"
        />
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium text-xs">Count</label>
          <span className="text-xs font-bold">{settings.count}</span>
        </div>
        <input
          type="range"
          name="count"
          min="1"
          max="100"
          value={settings.count}
          onChange={handleChange}
          className="w-full h-1.5"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium text-xs">Speed</label>
          <span className="text-xs font-bold">{settings.speed}</span>
        </div>
        <input
          type="range"
          name="speed"
          min="1"
          max="10"
          value={settings.speed}
          onChange={handleChange}
          className="w-full h-1.5"
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={() => {
            const randomColor =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
            onSettingsChange({
              ...settings,
              color: randomColor,
            });
          }}
          className="py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
        >
          Random Color
        </button>

        {onExport && (
          <button
            onClick={onExport}
            className="py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
          >
            Export Image
          </button>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
