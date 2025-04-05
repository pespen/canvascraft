"use client";

import { useState, useEffect } from "react";
import ControlPanel from "./components/control-panel";
import Image from "next/image";
import type { CanvasSettings } from "./utils/types";
import Canvas from "./components/canvas";
import Spinner from "./components/spinner";

export default function Home() {
  const [settings, setSettings] = useState<CanvasSettings>({
    shape: "lines" as const,
    color: "#3498db",
    count: 250,
    canvasWidth: 842,
    canvasHeight: 595,
    drawingMethod: {
      type: "rose",
      params: {
        n: 1,
        k: 6, // 6 petals
        scale: 0.85,
      },
    },
  });

  // Track if the layout has been calculated
  const [layoutReady, setLayoutReady] = useState(false);
  // Track sidebar state for mobile view - defaulting to open
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Track if we're on mobile screen
  const [isMobile, setIsMobile] = useState(false);

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
      const mobileBreakpoint = 768; // Typical tablet/mobile breakpoint
      const currentIsMobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(currentIsMobile);

      const sidebarWidth = currentIsMobile ? (sidebarOpen ? 256 : 0) : 256; // 256px = w-64
      const mainAreaWidth =
        window.innerWidth - (currentIsMobile ? 0 : sidebarWidth) - 40;
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
        width: Math.min(settings.canvasWidth, mainAreaWidth),
        height: Math.min(settings.canvasHeight, mainAreaHeight),
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
  }, [settings.canvasWidth, settings.canvasHeight, isMobile, sidebarOpen]);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Toggle Button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className={`fixed z-30 p-2 bg-white rounded-md shadow-md flex items-center justify-center transition-all duration-300 ${
              sidebarOpen
                ? "top-1/2 -translate-y-1/2 left-[248px]" // Position at right edge of sidebar, vertically centered
                : "top-1/2 -translate-y-1/2 left-0 rounded-l-none rounded-r-md"
            }`}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        )}

        {/* Sidebar */}
        <div
          className={`bg-gray-100 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
            isMobile
              ? `fixed top-0 left-0 h-full z-20 shadow-xl ${
                  sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
                }`
              : "w-64"
          }`}
        >
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

        {/* Overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-10"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Canvas Area */}
        <div
          className={`flex-1 flex items-center justify-center bg-gray-50 p-4 overflow-auto ${
            isMobile ? "ml-0" : ""
          }`}
        >
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
