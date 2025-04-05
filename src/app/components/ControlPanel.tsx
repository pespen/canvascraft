"use client";

export interface CanvasSettings {
  shape: "circles" | "rectangles" | "lines" | "fractals";
  color: string;
  count: number;
  speed: number;
}

interface ControlPanelProps {
  settings: CanvasSettings;
  onSettingsChange: (settings: CanvasSettings) => void;
  onExport?: () => void;
}

const ControlPanel = ({
  settings,
  onSettingsChange,
  onExport,
}: ControlPanelProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    onSettingsChange({
      ...settings,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  return (
    <div className="p-3">
      <h2 className="text-sm font-bold mb-3">Canvas Controls</h2>

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
