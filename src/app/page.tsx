"use client";

import { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import ControlPanel from "./components/ControlPanel";
import Presets from "./components/Presets";
import Image from "next/image";

// Import the CanvasSettings type from the ControlPanel
import type { CanvasSettings } from "./components/ControlPanel";

export default function Home() {
  const [settings, setSettings] = useState<CanvasSettings>({
    shape: "circles" as const,
    color: "#3498db",
    count: 30,
    speed: 5,
  });

  // Calculate responsive canvas size based on screen height
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateCanvasSize = () => {
      const sidebarWidth = 250; // Width of the sidebar
      const mainAreaWidth = window.innerWidth - sidebarWidth - 40; // Account for paddings
      const mainAreaHeight = window.innerHeight - 60; // Account for footer height

      // Calculate dimensions while preserving aspect ratio
      const width = Math.min(mainAreaWidth, 1600);
      const height = Math.min(mainAreaHeight, 900);

      setCanvasSize({ width, height });
    };

    // Initial size
    updateCanvasSize();

    // Update on resize
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

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
            <Image
              src="/canvascraft_logo.png"
              alt="Canvascraft Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <h1 className="text-2xl font-bold">Canvascraft</h1>
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
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
          <Canvas
            width={canvasSize.width}
            height={canvasSize.height}
            settings={settings}
          />
        </div>
      </div>

      <footer className="py-1 px-4 text-center text-xs text-gray-500 bg-gray-100">
        Peder Espen | © 2025
      </footer>
    </div>
  );
}
