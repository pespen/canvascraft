"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { CanvasSettings } from "./ControlPanel";

interface CanvasProps {
  width: number;
  height: number;
  settings: CanvasSettings;
  scale?: number;
}

const Canvas = ({ width, height, settings, scale = 1 }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Generate positions based on drawing method
  const generatePositions = useCallback(
    (
      count: number,
      methodType: string | undefined = "circular",
      params: Record<string, number | string> = {}
    ): Array<{
      x: number;
      y: number;
      size: number;
      endX?: number;
      endY?: number;
    }> => {
      const elements: Array<{
        x: number;
        y: number;
        size: number;
        endX?: number;
        endY?: number;
      }> = [];

      // Default to circular if no method specified
      if (!methodType) {
        methodType = "circular";
      }

      // Grid pattern
      if (methodType === "grid") {
        const columns = (params.columns as number) || 5;
        const rows = (params.rows as number) || 5;
        const offsetX = (params.offsetX as number) || 0;
        const offsetY = (params.offsetY as number) || 0;

        const cellWidth = width / (columns + 1);
        const cellHeight = height / (rows + 1);

        // Create a grid arrangement
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            elements.push({
              x: (col + 1) * cellWidth + offsetX,
              y: (row + 1) * cellHeight + offsetY,
              size: 10 + Math.random() * 10,
              // For lines, connect to the next point
              ...(settings.shape === "lines" && col < columns - 1
                ? {
                    endX: (col + 2) * cellWidth + offsetX,
                    endY: (row + 1) * cellHeight + offsetY,
                  }
                : {}),
            });
          }
        }
      }

      // Sine wave pattern
      else if (methodType === "sine") {
        const amplitude = (params.amplitude as number) || 100;
        const frequency = (params.frequency as number) || 0.05;
        const phase = (params.phase as number) || 0;

        // Create points along a sine wave
        for (let i = 0; i < count; i++) {
          const x = i * (width / count);
          const y = height / 2 + amplitude * Math.sin(frequency * x + phase);

          elements.push({
            x,
            y,
            size: 8,
            // For lines, connect to the next point
            ...(settings.shape === "lines" && i < count - 1
              ? {
                  endX: (i + 1) * (width / count),
                  endY:
                    height / 2 +
                    amplitude *
                      Math.sin(frequency * ((i + 1) * (width / count)) + phase),
                }
              : {}),
          });
        }
      }

      // Spiral pattern
      else if (methodType === "spiral") {
        const spacing = (params.spacing as number) || 10;
        const rotation = (params.rotation as number) || 0.1;
        const expansion = (params.expansion as number) || 0.2;

        const centerX = width / 2;
        const centerY = height / 2;

        // Create points along a spiral
        for (let i = 0; i < count; i++) {
          const angle = i * rotation;
          const radius = spacing * (i * expansion);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          elements.push({
            x,
            y,
            size: 6 + (i / count) * 10,
            // For lines, connect to the next point
            ...(settings.shape === "lines" && i < count - 1
              ? {
                  endX:
                    centerX +
                    spacing *
                      ((i + 1) * expansion) *
                      Math.cos((i + 1) * rotation),
                  endY:
                    centerY +
                    spacing *
                      ((i + 1) * expansion) *
                      Math.sin((i + 1) * rotation),
                }
              : {}),
          });
        }
      }

      // Circular arrangement
      else if (methodType === "circular") {
        const radius = (params.radius as number) || 150;
        const radiusVariation = (params.radiusVariation as number) || 0;
        const angleOffset = (params.angleOffset as number) || 0;

        const centerX = width / 2;
        const centerY = height / 2;

        // Create points along a circle
        for (let i = 0; i < count; i++) {
          const angle = angleOffset + i * ((2 * Math.PI) / count);
          const currentRadius =
            radius + (Math.random() * 2 - 1) * radiusVariation;
          const x = centerX + currentRadius * Math.cos(angle);
          const y = centerY + currentRadius * Math.sin(angle);

          elements.push({
            x,
            y,
            size: 8 + (radiusVariation > 0 ? Math.random() * 8 : 0),
            // For lines, connect to the next point
            ...(settings.shape === "lines" && i < count - 1
              ? {
                  endX:
                    centerX +
                    currentRadius *
                      Math.cos(angleOffset + (i + 1) * ((2 * Math.PI) / count)),
                  endY:
                    centerY +
                    currentRadius *
                      Math.sin(angleOffset + (i + 1) * ((2 * Math.PI) / count)),
                }
              : {}),
          });
        }
      }

      // Fibonacci spiral (Golden ratio)
      else if (methodType === "fibonacci") {
        const scale = (params.scale as number) || 5;
        const turns = (params.turns as number) || 12;
        const rotation = (params.rotation as number) || 0;

        const centerX = width / 2;
        const centerY = height / 2;
        const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

        // Create points along a Fibonacci spiral
        for (let i = 0; i < count; i++) {
          const ratio = i / count;
          const angle = rotation + 2 * Math.PI * ratio * turns;
          const dist = Math.pow(phi, 2 * ratio) * scale;
          const x = centerX + dist * Math.cos(angle);
          const y = centerY + dist * Math.sin(angle);

          elements.push({
            x,
            y,
            size: 4 + ratio * 12,
            // For lines, connect to the next point
            ...(settings.shape === "lines" && i < count - 1
              ? {
                  endX:
                    centerX +
                    Math.pow(phi, 2 * ((i + 1) / count)) *
                      scale *
                      Math.cos(
                        rotation + 2 * Math.PI * ((i + 1) / count) * turns
                      ),
                  endY:
                    centerY +
                    Math.pow(phi, 2 * ((i + 1) / count)) *
                      scale *
                      Math.sin(
                        rotation + 2 * Math.PI * ((i + 1) / count) * turns
                      ),
                }
              : {}),
          });
        }
      }

      // Lissajous curve
      else if (methodType === "lissajous") {
        const a = (params.a as number) || 3;
        const b = (params.b as number) || 4;
        const delta = (params.delta as number) || 0;
        const scale = (params.scale as number) || 150;

        const centerX = width / 2;
        const centerY = height / 2;

        // Create points along a Lissajous curve
        for (let i = 0; i < count; i++) {
          const t = i * ((2 * Math.PI) / count);
          const x = centerX + scale * Math.sin(a * t + delta);
          const y = centerY + scale * Math.sin(b * t);

          elements.push({
            x,
            y,
            size: 8,
            // For lines, connect to the next point
            ...(settings.shape === "lines" && i < count - 1
              ? {
                  endX:
                    centerX +
                    scale *
                      Math.sin(a * ((i + 1) * ((2 * Math.PI) / count)) + delta),
                  endY:
                    centerY +
                    scale * Math.sin(b * ((i + 1) * ((2 * Math.PI) / count))),
                }
              : {}),
          });
        }
      }

      // Rose curve
      else if (methodType === "rose") {
        const a = (params.a as number) || 1;
        const b = (params.b as number) || 1;
        const n = (params.n as number) || 2;
        const k = (params.k as number) || 1;

        const centerX = width / 2;
        const centerY = height / 2;
        const scale = Math.min(width, height) / 3;

        // Create points along a rose curve
        for (let i = 0; i < count; i++) {
          const theta = i * ((2 * Math.PI * n) / count);
          const r = (scale * (a * Math.cos(k * theta) + b)) / (a + b); // Normalized to keep within scale

          const x = centerX + r * Math.cos(theta);
          const y = centerY + r * Math.sin(theta);

          elements.push({
            x,
            y,
            size: 6 + (i / count) * 6,
            // For lines, connect to the next point
            ...(settings.shape === "lines" && i < count - 1
              ? {
                  endX:
                    centerX +
                    ((scale *
                      (a *
                        Math.cos(k * ((i + 1) * ((2 * Math.PI * n) / count))) +
                        b)) /
                      (a + b)) *
                      Math.cos((i + 1) * ((2 * Math.PI * n) / count)),
                  endY:
                    centerY +
                    ((scale *
                      (a *
                        Math.cos(k * ((i + 1) * ((2 * Math.PI * n) / count))) +
                        b)) /
                      (a + b)) *
                      Math.sin((i + 1) * ((2 * Math.PI * n) / count)),
                }
              : {}),
          });
        }
      }

      // Phyllotaxis pattern (sunflower-like arrangement)
      else if (methodType === "phyllotaxis") {
        const n = (params.n as number) || 1;
        const k = (params.k as number) || 1;

        const centerX = width / 2;
        const centerY = height / 2;
        const scale = Math.min(width, height) / 25; // Scale factor

        // Golden angle in radians (approximated by (3-√5)π ≈ 137.5°)
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));

        // Create points in a phyllotaxis arrangement
        for (let i = 0; i < count; i++) {
          // The angle increases by the golden angle each iteration
          const theta = i * goldenAngle * n;

          // The radius increases as the square root of i, creating an expanding spiral
          // Multiply by k to adjust density
          const r = scale * Math.sqrt(i) * k;

          const x = centerX + r * Math.cos(theta);
          const y = centerY + r * Math.sin(theta);

          elements.push({
            x,
            y,
            size: 4 + 8 * Math.sqrt(i / count), // Size increases gradually
            // No lines for phyllotaxis as they can be messy
            ...(settings.shape === "lines" && i < count - 1 && i % 5 === 0 // Only connect every 5th point
              ? {
                  endX:
                    centerX +
                    scale *
                      Math.sqrt(i + 1) *
                      k *
                      Math.cos((i + 1) * goldenAngle * n),
                  endY:
                    centerY +
                    scale *
                      Math.sqrt(i + 1) *
                      k *
                      Math.sin((i + 1) * goldenAngle * n),
                }
              : {}),
          });
        }
      }

      // Custom function
      else if (methodType === "custom") {
        const functionBody = (params.functionBody as string) || "";

        try {
          // Create a function from the custom code
          // eslint-disable-next-line no-new-func
          const customFunc = new Function(
            "width",
            "height",
            "count",
            "color",
            functionBody
          );

          // Execute the function to get positions
          const positions = customFunc(width, height, count, settings.color);

          // Process the returned positions
          if (Array.isArray(positions)) {
            positions.forEach((pos, i) => {
              if (
                pos &&
                typeof pos.x === "number" &&
                typeof pos.y === "number"
              ) {
                elements.push({
                  x: pos.x,
                  y: pos.y,
                  size: pos.size || 8,
                  ...(settings.shape === "lines" && i < positions.length - 1
                    ? {
                        endX: positions[i + 1]?.x,
                        endY: positions[i + 1]?.y,
                      }
                    : {}),
                });
              }
            });
          }
        } catch (error) {
          console.error("Error in custom function:", error);
        }
      }

      return elements;
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
    const elements = generatePositions(
      settings.count,
      settings.drawingMethod?.type,
      settings.drawingMethod?.params || {}
    );

    // Target drawing time of 5 seconds (5000ms)
    const targetDrawTime = 5000;
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
        drawElement(ctx, element, settings.shape);
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
  }, [width, height, settings, generatePositions]);

  const drawElement = (
    ctx: CanvasRenderingContext2D,
    element: {
      x: number;
      y: number;
      size: number;
      endX?: number;
      endY?: number;
    },
    shape: CanvasSettings["shape"]
  ) => {
    // Use the single color from settings
    ctx.fillStyle = settings.color;
    ctx.strokeStyle = settings.color;

    switch (shape) {
      case "circles":
        // Draw a simple circle with the settings color
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "rectangles":
        // Draw a simple rectangle with the settings color
        ctx.fillRect(
          element.x - element.size / 2,
          element.y - element.size / 2,
          element.size,
          element.size
        );
        break;

      case "lines":
        if (element.endX !== undefined && element.endY !== undefined) {
          // Draw a simple line with the settings color
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.endX, element.endY);
          ctx.lineWidth = element.size / 3;
          ctx.stroke();
        }
        break;
    }
  };

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
