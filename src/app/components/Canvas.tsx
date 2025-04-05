"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasSettings } from "./ControlPanel";

interface CanvasProps {
  width: number;
  height: number;
  settings: CanvasSettings;
}

const Canvas = ({ width, height, settings }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set drawing state to true to show loading indicator
    setIsDrawing(true);

    // Create static positions for all elements
    const elements: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      // For lines
      endX?: number;
      endY?: number;
    }> = [];

    // Create elements based on settings
    for (let i = 0; i < settings.count; i++) {
      elements.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 5 + Math.random() * 20,
        color: settings.color,
        // For lines
        ...(settings.shape === "lines"
          ? {
              endX: Math.random() * width,
              endY: Math.random() * height,
            }
          : {}),
      });
    }

    // Drawing speed (elements per frame)
    const drawSpeed = Math.max(1, Math.floor(settings.speed / 2));
    let currentIndex = 0;

    const drawNextBatch = () => {
      // Draw next batch of elements
      const batchSize = Math.min(drawSpeed, elements.length - currentIndex);

      if (currentIndex >= elements.length) {
        // Drawing complete
        setIsDrawing(false);
        return;
      }

      for (let i = 0; i < batchSize; i++) {
        const element = elements[currentIndex + i];

        if (settings.shape === "fractals") {
          // For fractals, we draw the entire fractal at once
          // since it's recursive and difficult to break down
          if (currentIndex === 0) {
            drawFractals(ctx, settings.count, settings.color);
          }
          currentIndex = elements.length; // Skip to end
          break;
        } else {
          // Draw individual element based on shape
          drawElement(ctx, element, settings.shape);
        }
      }

      currentIndex += batchSize;

      // Continue drawing in next frame if not complete
      if (currentIndex < elements.length) {
        animationRef.current = requestAnimationFrame(drawNextBatch);
      } else {
        setIsDrawing(false);
      }
    };

    // Start drawing
    animationRef.current = requestAnimationFrame(drawNextBatch);

    // Cleanup on unmount or settings change
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, settings]);

  const drawElement = (
    ctx: CanvasRenderingContext2D,
    element: {
      x: number;
      y: number;
      size: number;
      color: string;
      endX?: number;
      endY?: number;
    },
    shape: CanvasSettings["shape"]
  ) => {
    ctx.fillStyle = element.color;
    ctx.strokeStyle = element.color;

    switch (shape) {
      case "circles":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
        ctx.globalAlpha = 0.6;
        ctx.fill();
        break;
      case "rectangles":
        ctx.globalAlpha = 0.6;
        ctx.fillRect(
          element.x - element.size / 2,
          element.y - element.size / 2,
          element.size,
          element.size
        );
        break;
      case "lines":
        if (element.endX !== undefined && element.endY !== undefined) {
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.endX, element.endY);
          ctx.lineWidth = element.size / 5;
          ctx.globalAlpha = 0.6;
          ctx.stroke();
        }
        break;
    }
  };

  const drawFractals = (
    ctx: CanvasRenderingContext2D,
    count: number,
    color: string
  ) => {
    ctx.strokeStyle = color;

    // For fractals, we'll draw them incrementally by depth
    const drawFractalWithDelay = (depth: number) => {
      if (depth <= 0) return;

      // Clear previous drawing for clean look
      ctx.clearRect(0, 0, width, height);

      const drawBranchToDepth = (
        x: number,
        y: number,
        length: number,
        angle: number,
        currentDepth: number,
        maxDepth: number
      ) => {
        if (currentDepth > maxDepth) return;

        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = currentDepth;
        ctx.globalAlpha = 0.7;
        ctx.stroke();

        // Recursive branches
        drawBranchToDepth(
          endX,
          endY,
          length * 0.7,
          angle - 0.3,
          currentDepth + 1,
          maxDepth
        );
        drawBranchToDepth(
          endX,
          endY,
          length * 0.7,
          angle + 0.3,
          currentDepth + 1,
          maxDepth
        );
      };

      // Draw fractal up to current depth
      drawBranchToDepth(width / 2, height, height / 4, -Math.PI / 2, 1, depth);

      // Schedule next depth if not complete
      if (depth < (count > 10 ? 10 : count)) {
        setTimeout(() => drawFractalWithDelay(depth + 1), 300);
      }
    };

    // Start drawing fractal from depth 1
    drawFractalWithDelay(1);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-md bg-white"
      />
      {isDrawing && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          Drawing...
        </div>
      )}
    </div>
  );
};

export default Canvas;
