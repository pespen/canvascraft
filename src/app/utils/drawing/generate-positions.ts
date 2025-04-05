import { ElementPosition, CanvasSettings } from "../types";
import { createSpiralPattern } from "./methods/spiral";
import { createCircularPattern } from "./methods/circular";
import { createGridPattern } from "./methods/grid";
import { createSineWavePattern } from "./methods/sine";
import { createFibonacciPattern } from "./methods/fibonacci";
import { createLissajousPattern } from "./methods/lissajous";
import { createRosePattern } from "./methods/rose";
import { createPhyllotaxisPattern } from "./methods/phyllotaxis";

// Base resolution for scaling (standard HD size)
const BASE_RESOLUTION = { width: 1280, height: 720 };

/**
 * Helper function to calculate size scaling factor based on canvas dimensions
 */
export const getSizeScaleFactor = (width: number, height: number): number => {
  // Calculate the diagonal length of both the current canvas and the base resolution
  const currentDiagonal = Math.sqrt(width * width + height * height);
  const baseDiagonal = Math.sqrt(
    BASE_RESOLUTION.width * BASE_RESOLUTION.width +
      BASE_RESOLUTION.height * BASE_RESOLUTION.height
  );

  // Return the ratio of the diagonals as the scaling factor
  return currentDiagonal / baseDiagonal;
};

/**
 * Factory function that creates element positions based on the selected drawing method
 */
export const generatePositions = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  color: string,
  methodType: string | undefined = "spiral",
  params: Record<string, number | string> = {}
): ElementPosition[] => {
  // Default to spiral if no method specified
  if (!methodType) {
    methodType = "spiral";
  }

  // Calculate size scale factor based on canvas dimensions
  const scaleFactor = getSizeScaleFactor(width, height);

  // Scale parameters and apply to methods
  const scaledParams = { ...params };

  // Grid pattern
  if (methodType === "grid") {
    return createGridPattern(width, height, count, shape, scaledParams);
  }

  // Sine wave pattern
  else if (methodType === "sine") {
    // Scale amplitude for sine wave
    if (typeof scaledParams.amplitude === "number") {
      scaledParams.amplitude = scaledParams.amplitude * scaleFactor;
    }
    return createSineWavePattern(width, height, count, shape, scaledParams);
  }

  // Spiral pattern
  else if (methodType === "spiral") {
    // Scale spacing for spiral
    if (typeof scaledParams.spacing === "number") {
      scaledParams.spacing = scaledParams.spacing * scaleFactor;
    }
    return createSpiralPattern(width, height, count, shape, scaledParams);
  }

  // Circular arrangement
  else if (methodType === "circular") {
    // Scale radius for circular
    if (typeof scaledParams.radius === "number") {
      scaledParams.radius = scaledParams.radius * scaleFactor;
    }
    if (typeof scaledParams.radiusVariation === "number") {
      scaledParams.radiusVariation = scaledParams.radiusVariation * scaleFactor;
    }
    return createCircularPattern(width, height, count, shape, scaledParams);
  }

  // Fibonacci spiral (Golden ratio)
  else if (methodType === "fibonacci") {
    // Scale depends on canvas size already via scale parameter
    if (typeof scaledParams.scale === "number") {
      scaledParams.scale = scaledParams.scale * scaleFactor;
    }
    return createFibonacciPattern(width, height, count, shape, scaledParams);
  }

  // Lissajous curve
  else if (methodType === "lissajous") {
    // Scale the Lissajous scale parameter
    if (typeof scaledParams.scale === "number") {
      scaledParams.scale = scaledParams.scale * scaleFactor;
    }
    return createLissajousPattern(width, height, count, shape, scaledParams);
  }

  // Rose curve
  else if (methodType === "rose") {
    // Rose curve naturally scales with canvas size
    return createRosePattern(width, height, count, shape, scaledParams);
  }

  // Phyllotaxis pattern (sunflower-like arrangement)
  else if (methodType === "phyllotaxis") {
    // Phyllotaxis also scales with canvas size
    return createPhyllotaxisPattern(width, height, count, shape, scaledParams);
  }

  return [];
};
