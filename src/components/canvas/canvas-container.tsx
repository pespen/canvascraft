"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { CanvasProps, ElementPosition } from "../../utils/types";
import { generatePositions, drawElement } from "../../utils/drawing";

/**
 * Main Canvas component for rendering drawing
 */
const Canvas = ({ width, height, settings, scale = 1 }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Generate positions using the drawing utility
  const generateElementPositions = useCallback(
    (
      count: number,
      methodType: string | undefined = "circular",
      params: Record<string, number | string> = {}
    ): ElementPosition[] => {
      return generatePositions(
        width,
        height,
        count,
        settings.shape,
        settings.color,
        methodType,
        params
      );
    },
    [width, height, settings.shape, settings.color]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set the actual dimensions of the canvas for high quality rendering
    canvas.width = width;
    canvas.height = height;

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
    setProgress(0);

    // Generate elements based on settings and drawing method
    const elements = generateElementPositions(
      settings.count,
      settings.drawingMethod?.type,
      settings.drawingMethod?.params || {}
    );

    // Target drawing time of 5 seconds (5000ms)
    const targetDrawTime = 2500;
    // Target 60 frames per second
    const targetFrameRate = 60;
    // Total frames in 5 seconds
    const totalFrames = targetDrawTime / (1000 / targetFrameRate);

    // Calculate batch size to distribute elements evenly across frames
    // with a minimum of 1 element per frame and maximum of elements.length
    const batchSize = Math.max(1, Math.ceil(elements.length / totalFrames));

    // For very large element counts, increase batch size proportionally
    const adjustedBatchSize =
      elements.length > 1000
        ? batchSize * Math.ceil(elements.length / 1000)
        : batchSize;

    console.log(
      `Drawing ${elements.length} elements with batch size ${adjustedBatchSize}`
    );

    let currentIndex = 0;
    let startTime = performance.now();

    const drawNextBatch = () => {
      // Draw next batch of elements
      const batchSize = Math.min(
        adjustedBatchSize,
        elements.length - currentIndex
      );

      if (currentIndex >= elements.length) {
        // Drawing complete
        const totalTime = performance.now() - startTime;
        console.log(`Drawing completed in ${totalTime.toFixed(0)}ms`);
        setIsDrawing(false);
        setProgress(100);
        return;
      }

      // Update progress indicator - using a functional update to avoid dependency issues
      const newProgress = Math.round((currentIndex / elements.length) * 100);
      setProgress(newProgress);

      for (let i = 0; i < batchSize; i++) {
        if (currentIndex + i >= elements.length) break;

        const element = elements[currentIndex + i];

        // Draw individual element based on shape
        drawElement(ctx, element, settings.shape, settings.color);
      }

      currentIndex += batchSize;

      // Continue drawing in next frame if not complete
      if (currentIndex < elements.length) {
        animationRef.current = requestAnimationFrame(drawNextBatch);
      } else {
        setIsDrawing(false);
        setProgress(100);
      }
    };

    // Start drawing
    startTime = performance.now();
    animationRef.current = requestAnimationFrame(drawNextBatch);

    // Cleanup on unmount or settings change
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, settings, generateElementPositions]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
        }}
        className="border border-gray-300 bg-white"
      />
      {isDrawing && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          Drawing... {progress}%
        </div>
      )}
    </div>
  );
};

export default Canvas;
