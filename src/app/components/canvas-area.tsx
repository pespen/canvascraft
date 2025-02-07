"use client";

import { useEffect, useRef } from "react";

interface CanvasProps {
  shapeCount: number;
  maxSize: number;
  lineWidth: number;
  opacity: number;
  pathLength: number;
  noiseScale: number;
  colorVariation: number;
}

export default function CanvasArea({
  shapeCount,
  maxSize,
  lineWidth,
  opacity,
  pathLength,
  noiseScale,
  colorVariation,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function noise(x: number, y: number): number {
      return Math.sin(x * noiseScale) * Math.cos(y * noiseScale);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";

    for (let i = 0; i < shapeCount; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let j = 0; j < pathLength; j++) {
        const angle = noise(x, y) * Math.PI * 4;
        const newX = x + Math.cos(angle) * maxSize * 0.01;
        const newY = y + Math.sin(angle) * maxSize * 0.01;

        ctx.lineTo(newX, newY);
        x = newX;
        y = newY;
      }

      ctx.strokeStyle = `hsla(${
        (i / shapeCount) * 360 * colorVariation
      }, 100%, 70%, ${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }, [
    shapeCount,
    maxSize,
    lineWidth,
    opacity,
    pathLength,
    noiseScale,
    colorVariation,
  ]);

  return (
    <div className="flex-1 flex items-center justify-center bg-black">
      <canvas ref={canvasRef} className="border border-white"></canvas>
    </div>
  );
}
