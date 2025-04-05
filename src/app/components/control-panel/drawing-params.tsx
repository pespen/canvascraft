"use client";

import { CanvasSettings } from "../../utils/types";

// Helper function to render parameters for each drawing method
export const DrawingParameters = ({
  drawingMethod,
  onSettingsChange,
  settings,
}: {
  drawingMethod: NonNullable<CanvasSettings["drawingMethod"]>;
  onSettingsChange: (settings: CanvasSettings) => void;
  settings: CanvasSettings;
}) => {
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
              max="400"
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
            <label className="block text-xs mb-1">Angle Offset</label>
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
            <label className="block text-xs mb-1">Rotation</label>
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
            <label className="block text-xs mb-1">A Frequency</label>
            <input
              type="range"
              min="1"
              max="10"
              value={(drawingMethod.params.a as number) || 3}
              onChange={(e) => updateParam("a", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.a || 3}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">B Frequency</label>
            <input
              type="range"
              min="1"
              max="10"
              value={(drawingMethod.params.b as number) || 4}
              onChange={(e) => updateParam("b", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.b || 4}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Delta Phase</label>
            <input
              type="range"
              min="0"
              max="6.28"
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
            <label className="block text-xs mb-1">N (petals)</label>
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
            <label className="block text-xs mb-1">K (petal shape)</label>
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
          <div>
            <label className="block text-xs mb-1">A (scaling)</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={(drawingMethod.params.a as number) || 1}
              onChange={(e) => updateParam("a", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.a || 1}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">B (offset)</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={(drawingMethod.params.b as number) || 1}
              onChange={(e) => updateParam("b", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.b || 1}
            </div>
          </div>
        </div>
      );
    case "phyllotaxis":
      return (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs mb-1">N (rotation factor)</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={(drawingMethod.params.n as number) || 1}
              onChange={(e) => updateParam("n", Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="text-right text-xs">
              {drawingMethod.params.n || 1}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">K (density factor)</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
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
          <textarea
            className="w-full p-2 border border-gray-300 rounded text-xs font-mono"
            rows={10}
            value={(drawingMethod.params.functionBody as string) || ""}
            onChange={(e) => updateParam("functionBody", e.target.value)}
            spellCheck={false}
          />
          <div className="text-xs text-gray-500 mt-1">
            <p>
              Create a function that returns an array of element positions.
              Available variables: width, height, count, color.
            </p>
            <p>
              Each element should have x, y, and size properties. Example:
              <br />
              {`return Array.from({ length: count }, (_, i) => ({
  x: width/2 + 100 * Math.cos(i * 0.1),
  y: height/2 + 100 * Math.sin(i * 0.1),
  size: 10
}))`}
            </p>
          </div>
        </div>
      );
    default:
      return <div className="text-xs">No parameters needed</div>;
  }
};

export default DrawingParameters;
