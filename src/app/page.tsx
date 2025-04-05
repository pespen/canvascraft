"use client";

import { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import ControlPanel from "./components/ControlPanel";
import Presets from "./components/Presets";
import Image from "next/image";
import type { CanvasSettings } from "./components/ControlPanel";

export default function Home() {
  const [settings, setSettings] = useState<CanvasSettings>({
    shape: "circles" as const,
    color: "#3498db",
    count: 30,
    speed: 5,
    canvasWidth: 800,
    canvasHeight: 600,
  });

  // Calculate container size for the canvas to fit within the available space
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateContainerSize = () => {
      const sidebarWidth = 250;
      const mainAreaWidth = window.innerWidth - sidebarWidth - 40;
      const mainAreaHeight = window.innerHeight - 60;

      // Calculate the scale to fit the canvas within the container
      const horizontalScale = mainAreaWidth / settings.canvasWidth;
      const verticalScale = mainAreaHeight / settings.canvasHeight;
      const newScale = Math.min(horizontalScale, verticalScale, 1); // Cap scale at 1 to avoid enlarging small canvases

      setContainerSize({
        width: settings.canvasWidth * newScale,
        height: settings.canvasHeight * newScale,
      });
      setScale(newScale);
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [settings.canvasWidth, settings.canvasHeight]);

  const handleExport = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `canvascraft-${settings.shape}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 flex items-center">
            <h1 className="text-2xl font-bold mr-2">Canvascraft</h1>
            <Image
              src="/canvascraft_logo.png"
              alt="Canvascraft Logo"
              width={32}
              height={32}
              className="mr-2"
            />
          </div>

          <div className="p-3">
            <h2 className="text-sm font-bold mb-2">Presets</h2>
            <Presets onSelectPreset={setSettings} />
          </div>

          <div className="flex-1 overflow-auto">
            <ControlPanel
              settings={settings}
              onSettingsChange={setSettings}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 overflow-auto">
          <div
            className="relative bg-white shadow-md"
            style={{
              width: containerSize.width,
              height: containerSize.height,
            }}
          >
            <Canvas
              width={settings.canvasWidth}
              height={settings.canvasHeight}
              settings={settings}
              scale={scale}
            />
            {scale < 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {Math.round(scale * 100)}% of actual size
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="py-1 px-4 text-center text-xs text-gray-500 bg-gray-100">
        Peder Espen | © 2025
      </footer>
    </div>
  );
}
