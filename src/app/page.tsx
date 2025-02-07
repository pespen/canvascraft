"use client";

import { useState } from "react";
import CanvasArea from "./components/canvas-area";
import Sidebar from "./components/sidebar";

export default function Page() {
  // Shape count, max size, and other parameters for generative art
  const [shapeCount, setShapeCount] = useState(50);
  const [maxSize, setMaxSize] = useState(200);
  const [lineWidth, setLineWidth] = useState(3);
  const [opacity, setOpacity] = useState(0.7);
  const [pathLength, setPathLength] = useState(80);
  const [noiseScale, setNoiseScale] = useState(0.02);
  const [colorVariation, setColorVariation] = useState(1);

  return (
    <div className="flex">
      {/* Sidebar for control */}
      <Sidebar
        shapeCount={shapeCount}
        setShapeCount={setShapeCount}
        maxSize={maxSize}
        setMaxSize={setMaxSize}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        opacity={opacity}
        setOpacity={setOpacity}
        pathLength={pathLength}
        setPathLength={setPathLength}
        noiseScale={noiseScale}
        setNoiseScale={setNoiseScale}
        colorVariation={colorVariation}
        setColorVariation={setColorVariation}
      />

      {/* Canvas area for generative art */}
      <CanvasArea
        shapeCount={shapeCount}
        maxSize={maxSize}
        lineWidth={lineWidth}
        opacity={opacity}
        pathLength={pathLength}
        noiseScale={noiseScale}
        colorVariation={colorVariation}
      />
    </div>
  );
}
