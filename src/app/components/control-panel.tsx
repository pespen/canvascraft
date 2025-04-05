"use client";

import { useState, useEffect } from "react";

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

// Helper function to get default parameters for each drawing method
const getDefaultParamsForMethod = (
  methodType: NonNullable<CanvasSettings["drawingMethod"]>["type"]
): Record<string, number | string> => {
  switch (methodType) {
    case "grid":
      return { columns: 5, rows: 5, offsetX: 0, offsetY: 0 };
    case "sine":
      return { amplitude: 100, frequency: 0.05, phase: 0 };
    case "spiral":
      return { spacing: 10, rotation: 0.1, expansion: 0.2 };
    case "circular":
      return {
        radius: 150,
        radiusVariation: 0,
        angleOffset: 0,
      };
    case "fibonacci":
      return {
        scale: 5,
        turns: 12,
        rotation: 0,
      };
    case "lissajous":
      return {
        a: 3,
        b: 4,
        delta: 0,
        scale: 150,
      };
    case "rose":
      return {
        a: 1,
        b: 1,
        n: 2,
        k: 1,
      };
    case "phyllotaxis":
      return {
        n: 1,
        k: 1,
      };
    case "custom":
      return {
        functionBody: `// Return an array of positions
// Available variables: width, height, count, color

// Create your own mathematical pattern!
// This example creates a circle of elements
return Array.from({length: count}, (_, i) => {
  const angle = i * (2 * Math.PI / count);
  const radius = Math.min(width, height) / 3;
  return {
    x: width/2 + radius * Math.cos(angle),
    y: height/2 + radius * Math.sin(angle),
    size: 10 + 5 * Math.sin(i * 0.5), // Varying size
    color: color // Use the selected color
  };
});`,
      };
    default:
      return {};
  }
};

// Helper function to render parameters for each drawing method
const renderMethodParameters = (
  drawingMethod: NonNullable<CanvasSettings["drawingMethod"]>,
  onSettingsChange: (settings: CanvasSettings) => void,
  settings: CanvasSettings
) => {
  const updateParam = (paramName: string, value: number | string) => {
    onSettingsChange({
      ...settings,
      drawingMethod: {
        ...drawingMethod,
        params: {
          ...drawingMethod.params,
          [paramName]: value,
        },
      },
    });
  };

  switch (drawingMethod.type) {
    case "grid":
      return (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs mb-1">Columns</label>
            <input
              type="number"
              min="1"
              max="20"
              value={(drawingMethod.params.columns as number) || 5}
              onChange={(e) => updateParam("columns", Number(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Rows</label>
            <input
              type="number"
              min="1"
              max="20"
              value={(drawingMethod.params.rows as number) || 5}
              onChange={(e) => updateParam("rows", Number(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Offset X</label>
            <input
              type="number"
              min="-100"
              max="100"
              value={(drawingMethod.params.offsetX as number) || 0}
              onChange={(e) => updateParam("offsetX", Number(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Offset Y</label>
            <input
              type="number"
              min="-100"
              max="100"
              value={(drawingMethod.params.offsetY as number) || 0}
              onChange={(e) => updateParam("offsetY", Number(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>
      );
    case "sine":
      return (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs mb-1">Amplitude</label>
            <input
              type="range"
              min="10"
              max="300"
              value={(drawingMethod.params.amplitude as number) || 100}
              onChange={(e) => updateParam("amplitude", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.amplitude || 100}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Frequency</label>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.01"
              value={(drawingMethod.params.frequency as number) || 0.05}
              onChange={(e) => updateParam("frequency", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.frequency || 0.05}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Phase</label>
            <input
              type="range"
              min="0"
              max="6.28"
              step="0.1"
              value={(drawingMethod.params.phase as number) || 0}
              onChange={(e) => updateParam("phase", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.phase || 0}
            </div>
          </div>
        </div>
      );
    case "spiral":
      return (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs mb-1">Spacing</label>
            <input
              type="range"
              min="1"
              max="50"
              value={(drawingMethod.params.spacing as number) || 10}
              onChange={(e) => updateParam("spacing", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.spacing || 10}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Rotation</label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={(drawingMethod.params.rotation as number) || 0.1}
              onChange={(e) => updateParam("rotation", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.rotation || 0.1}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Expansion</label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={(drawingMethod.params.expansion as number) || 0.2}
              onChange={(e) => updateParam("expansion", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.expansion || 0.2}
            </div>
          </div>
        </div>
      );
    case "circular":
      return (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs mb-1">Radius</label>
            <input
              type="range"
              min="10"
              max="300"
              value={(drawingMethod.params.radius as number) || 150}
              onChange={(e) => updateParam("radius", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.radius || 150}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Radius Variation</label>
            <input
              type="range"
              min="0"
              max="100"
              value={(drawingMethod.params.radiusVariation as number) || 0}
              onChange={(e) =>
                updateParam("radiusVariation", Number(e.target.value))
              }
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.radiusVariation || 0}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Angle Offset (radians)</label>
            <input
              type="range"
              min="0"
              max="6.28"
              step="0.1"
              value={(drawingMethod.params.angleOffset as number) || 0}
              onChange={(e) =>
                updateParam("angleOffset", Number(e.target.value))
              }
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.angleOffset || 0}
            </div>
          </div>
        </div>
      );
    case "fibonacci":
      return (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs mb-1">Scale</label>
            <input
              type="range"
              min="1"
              max="20"
              value={(drawingMethod.params.scale as number) || 5}
              onChange={(e) => updateParam("scale", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.scale || 5}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Turns</label>
            <input
              type="range"
              min="1"
              max="20"
              value={(drawingMethod.params.turns as number) || 12}
              onChange={(e) => updateParam("turns", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.turns || 12}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Rotation (radians)</label>
            <input
              type="range"
              min="0"
              max="6.28"
              step="0.1"
              value={(drawingMethod.params.rotation as number) || 0}
              onChange={(e) => updateParam("rotation", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.rotation || 0}
            </div>
          </div>
        </div>
      );
    case "lissajous":
      return (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs mb-1">A Parameter</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={(drawingMethod.params.a as number) || 3}
              onChange={(e) => updateParam("a", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.a || 3}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">B Parameter</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={(drawingMethod.params.b as number) || 4}
              onChange={(e) => updateParam("b", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.b || 4}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">
              Phase Difference (delta)
            </label>
            <input
              type="range"
              min="0"
              max="3.14"
              step="0.1"
              value={(drawingMethod.params.delta as number) || 0}
              onChange={(e) => updateParam("delta", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.delta || 0}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Scale</label>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={(drawingMethod.params.scale as number) || 150}
              onChange={(e) => updateParam("scale", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.scale || 150}
            </div>
          </div>
        </div>
      );
    case "rose":
      return (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs mb-1">A Parameter</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={(drawingMethod.params.a as number) || 1}
              onChange={(e) => updateParam("a", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.a || 1}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">B Parameter</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={(drawingMethod.params.b as number) || 1}
              onChange={(e) => updateParam("b", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.b || 1}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">N Parameter</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={(drawingMethod.params.n as number) || 2}
              onChange={(e) => updateParam("n", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.n || 2}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">K Parameter</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={(drawingMethod.params.k as number) || 1}
              onChange={(e) => updateParam("k", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.k || 1}
            </div>
          </div>
        </div>
      );
    case "phyllotaxis":
      return (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs mb-1">N Parameter</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={(drawingMethod.params.n as number) || 1}
              onChange={(e) => updateParam("n", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.n || 1}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">K Parameter</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={(drawingMethod.params.k as number) || 1}
              onChange={(e) => updateParam("k", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.k || 1}
            </div>
          </div>
        </div>
      );
    case "custom":
      return (
        <div>
          <label className="block text-xs mb-1">Custom Function</label>
          <div className="text-xs text-gray-600 mb-1">
            Variables: width, height, count, color
          </div>
          <textarea
            value={(drawingMethod.params.functionBody as string) || ""}
            onChange={(e) => updateParam("functionBody", e.target.value)}
            className="w-full p-1 border border-gray-300 rounded text-xs font-mono"
            rows={10}
          />
        </div>
      );
    default:
      return <div className="text-xs">No parameters needed</div>;
  }
};

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
      {/* Drawing Method Section - Now at the top */}
      <div className="mb-3">
        <label className="block mb-1 font-medium text-xs">Drawing Method</label>
        <select
          name="drawingMethodType"
          value={settings.drawingMethod?.type || "circular"}
          onChange={(e) => {
            const methodType = e.target.value as NonNullable<
              CanvasSettings["drawingMethod"]
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
          <option value="grid">Grid Pattern</option>
          <option value="circular">Circular Arrangement</option>
          <option value="sine">Sine Wave</option>
          <option value="spiral">Spiral</option>
          <option value="fibonacci">Fibonacci Spiral</option>
          <option value="lissajous">Lissajous Curve</option>
          <option value="rose">Rose Curve</option>
          <option value="phyllotaxis">Phyllotaxis</option>
          <option value="custom">Custom Function</option>
        </select>

        {/* Parameters for the selected drawing method */}
        {settings.drawingMethod && (
          <div className="bg-gray-50 p-2 rounded border border-gray-200 mb-4">
            <h3 className="text-xs font-bold mb-2">Parameters</h3>
            {renderMethodParameters(
              settings.drawingMethod,
              onSettingsChange,
              settings
            )}
          </div>
        )}
      </div>

      {/* Shape Section */}
      <div className="mb-3">
        <label className="block mb-1 font-medium text-xs">Visual Style</label>
        <select
          name="shape"
          value={settings.shape}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded text-xs"
        >
          <option value="circles">Circles</option>
          <option value="rectangles">Rectangles</option>
          <option value="lines">Lines</option>
        </select>
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
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium text-xs">Element Count</label>
          <span className="text-xs font-bold">{settings.count}</span>
        </div>
        <input
          type="range"
          name="count"
          min="1"
          max="500"
          value={settings.count}
          onChange={handleChange}
          className="w-full h-1.5"
        />
      </div>

      {/* Canvas Size Section - Moved to the bottom */}
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
