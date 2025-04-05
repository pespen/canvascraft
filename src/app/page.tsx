"use client";

import { useState, useEffect } from "react";
import ControlPanel from "./components/control-panel";
import Image from "next/image";
import type { CanvasSettings } from "./utils/types";
import Canvas from "./components/canvas";
import Spinner from "./components/spinner";

export default function Home() {
  const [settings, setSettings] = useState<CanvasSettings>({
    shape: "circles" as const,
    color: "#3498db",
    count: 250,
    canvasWidth: 842,
    canvasHeight: 595,
    drawingMethod: {
      type: "spiral",
      params: {
        spacing: 10,
        rotation: 0.1,
        expansion: 0.2,
      },
    },
  });

  // Track if the layout has been calculated
  const [layoutReady, setLayoutReady] = useState(false);

  // Calculate container size for the canvas to fit within the available space
  const [containerSize, setContainerSize] = useState({
    width: settings.canvasWidth,
    height: settings.canvasHeight,
  });
  const [scale, setScale] = useState(1);

  // Initial placeholder size for loading state
  const [placeholderSize, setPlaceholderSize] = useState({
    width: settings.canvasWidth,
    height: settings.canvasHeight,
  });

  useEffect(() => {
    const updateSizes = () => {
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

      // Also update the placeholder size
      setPlaceholderSize({
        width: Math.min(settings.canvasWidth, window.innerWidth - 300),
        height: Math.min(settings.canvasHeight, window.innerHeight - 100),
      });

      setScale(newScale);
      setLayoutReady(true);
    };

    // Only run in browser
    if (typeof window !== "undefined") {
      updateSizes();
      window.addEventListener("resize", updateSizes);
      return () => window.removeEventListener("resize", updateSizes);
    }
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
          <div className="py-5 flex items-center justify-center">
            <div className="flex items-center">
              <h1
                className="text-2xl font-bold mr-2"
                style={{ fontFamily: "var(--font-miriam-libre)" }}
              >
                Canvascraft
              </h1>
              <Image
                src="/canvascraft_logo.png"
                alt="Canvascraft Logo"
                width={40}
                height={40}
              />
            </div>
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
          {layoutReady ? (
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
          ) : (
            <div
              className="flex items-center justify-center bg-white shadow-md p-8"
              style={placeholderSize}
            >
              <Spinner size={50} color={settings.color} />
            </div>
          )}
        </div>
      </div>

      <footer className="py-1 px-4 text-center text-xs text-gray-500 bg-gray-100">
        Peder Espen | © 2025
      </footer>
    </div>
  );
}
