"use client";

import { useState } from "react";
import {
  ControlPanelProps,
  sizePresets,
  MIN_CANVAS_SIZE,
  MAX_CANVAS_SIZE,
} from "../../utils/types";
import { getDefaultParamsForMethod } from "../../utils/drawing";
import DrawingParameters from "./drawing-params";

const ControlPanel = ({
  settings,
  onSettingsChange,
  onExport,
}: ControlPanelProps) => {
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [showCustomSize, setShowCustomSize] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;
    onSettingsChange({ ...settings, [name]: newValue });
  };

  const handleSizePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "custom") {
      setCustomWidth(settings.canvasWidth.toString());
      setCustomHeight(settings.canvasHeight.toString());
      setShowCustomSize(true);
      return;
    }

    setShowCustomSize(false);

    const selectedIndex = parseInt(selectedValue);
    if (isNaN(selectedIndex)) return;

    const preset = sizePresets[selectedIndex];
    onSettingsChange({
      ...settings,
      canvasWidth: preset.width,
      canvasHeight: preset.height,
    });

    // Reset custom dimension fields
    setCustomWidth("");
    setCustomHeight("");
  };

  const applyCustomSize = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);

    // Validate dimensions
    if (
      isNaN(width) ||
      isNaN(height) ||
      width < MIN_CANVAS_SIZE ||
      height < MIN_CANVAS_SIZE ||
      width > MAX_CANVAS_SIZE ||
      height > MAX_CANVAS_SIZE
    ) {
      alert(
        `Please enter valid dimensions between ${MIN_CANVAS_SIZE} and ${MAX_CANVAS_SIZE}`
      );
      return;
    }

    // Update settings
    onSettingsChange({
      ...settings,
      canvasWidth: width,
      canvasHeight: height,
    });
  };

  // Determine which size preset is currently selected
  const getCurrentSizePreset = () => {
    if (showCustomSize) return "custom";

    const matchingPresetIndex = sizePresets.findIndex(
      (preset) =>
        preset.width === settings.canvasWidth &&
        preset.height === settings.canvasHeight
    );

    return matchingPresetIndex !== -1 ? matchingPresetIndex.toString() : "";
  };

  return (
    <div className="p-4 space-y-4">
      {/* Drawing Method Section - Moved to the top */}
      <div className="mb-3">
        <label className="block mb-1 font-medium text-xs">Drawing Method</label>
        <select
          name="drawingMethodType"
          value={settings.drawingMethod?.type || "spiral"}
          onChange={(e) => {
            const methodType = e.target.value as NonNullable<
              typeof settings.drawingMethod
            >["type"];
            onSettingsChange({
              ...settings,
              drawingMethod: {
                type: methodType,
                params: getDefaultParamsForMethod(methodType),
              },
            });
          }}
          className="w-full p-1 border border-gray-300 rounded text-xs mb-2"
        >
          <option value="spiral">Spiral</option>
          <option value="circular">Circular Arrangement</option>
          <option value="grid">Grid Pattern</option>
          <option value="sine">Sine Wave</option>
          <option value="fibonacci">Fibonacci Spiral</option>
          <option value="lissajous">Lissajous Curve</option>
          <option value="rose">Rose Curve</option>
          <option value="phyllotaxis">Phyllotaxis</option>
        </select>

        {settings.drawingMethod && (
          <div className="border rounded p-2 bg-gray-50">
            <DrawingParameters
              drawingMethod={settings.drawingMethod}
              onSettingsChange={onSettingsChange}
              settings={settings}
            />
          </div>
        )}
      </div>

      {/* Shape Section */}
      <div className="mb-3">
        <label className="block mb-1 font-medium text-xs">Shape</label>
        <div className="grid grid-cols-3 gap-1">
          <button
            className={`p-1 border rounded text-xs ${
              settings.shape === "lines" ? "bg-blue-100 border-blue-500" : ""
            }`}
            onClick={() => onSettingsChange({ ...settings, shape: "lines" })}
          >
            Lines
          </button>
          <button
            className={`p-1 border rounded text-xs ${
              settings.shape === "circles" ? "bg-blue-100 border-blue-500" : ""
            }`}
            onClick={() => onSettingsChange({ ...settings, shape: "circles" })}
          >
            Circles
          </button>
          <button
            className={`p-1 border rounded text-xs ${
              settings.shape === "rectangles"
                ? "bg-blue-100 border-blue-500"
                : ""
            }`}
            onClick={() =>
              onSettingsChange({ ...settings, shape: "rectangles" })
            }
          >
            Rectangles
          </button>
        </div>
      </div>

      {/* Color Section */}
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

      {/* Count Section */}
      <div className="mb-3">
        <label className="block mb-1 font-medium text-xs">Element Count</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="10"
            max="1000"
            name="count"
            value={settings.count}
            onChange={handleChange}
            className="flex-1 h-1.5"
          />
          <input
            type="number"
            min="10"
            max="1000"
            name="count"
            value={settings.count}
            onChange={handleChange}
            className="w-16 p-1 border border-gray-300 rounded text-xs"
          />
        </div>
      </div>

      {/* Canvas Size Section - Moved to the bottom */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-xs">Canvas Size</label>
        <select
          className="w-full p-1 border border-gray-300 rounded text-xs mb-2"
          onChange={handleSizePresetChange}
          value={getCurrentSizePreset()}
        >
          <option value="" disabled>
            Select a preset
          </option>
          {sizePresets.map((preset, i) => (
            <option key={i} value={i.toString()}>
              {preset.name} ({preset.width}×{preset.height})
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>

        {showCustomSize && (
          <>
            <div className="flex space-x-2 mb-2">
              <div>
                <label className="block mb-1 text-xs">Width (px)</label>
                <input
                  type="number"
                  min={MIN_CANVAS_SIZE}
                  max={MAX_CANVAS_SIZE}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  placeholder={settings.canvasWidth.toString()}
                />
              </div>
              <div>
                <label className="block mb-1 text-xs">Height (px)</label>
                <input
                  type="number"
                  min={MIN_CANVAS_SIZE}
                  max={MAX_CANVAS_SIZE}
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  placeholder={settings.canvasHeight.toString()}
                />
              </div>
            </div>

            <button
              onClick={applyCustomSize}
              className="w-full p-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Apply Custom Size
            </button>
          </>
        )}
      </div>

      {/* Export Button */}
      {onExport && (
        <button
          onClick={onExport}
          className="w-full p-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
        >
          Export as PNG
        </button>
      )}
    </div>
  );
};

export default ControlPanel;
