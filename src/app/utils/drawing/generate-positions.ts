import { ElementPosition, CanvasSettings } from "../types";
import { createSpiralPattern } from "./methods/spiral";
import { createCircularPattern } from "./methods/circular";
import { createGridPattern } from "./methods/grid";
import { createSineWavePattern } from "./methods/sine";
import { createFibonacciPattern } from "./methods/fibonacci";
import { createLissajousPattern } from "./methods/lissajous";
import { createRosePattern } from "./methods/rose";
import { createPhyllotaxisPattern } from "./methods/phyllotaxis";
import { createCustomPattern } from "./methods/custom";

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

  // Grid pattern
  if (methodType === "grid") {
    return createGridPattern(width, height, count, shape, params);
  }

  // Sine wave pattern
  else if (methodType === "sine") {
    return createSineWavePattern(width, height, count, shape, params);
  }

  // Spiral pattern
  else if (methodType === "spiral") {
    return createSpiralPattern(width, height, count, shape, params);
  }

  // Circular arrangement
  else if (methodType === "circular") {
    return createCircularPattern(width, height, count, shape, params);
  }

  // Fibonacci spiral (Golden ratio)
  else if (methodType === "fibonacci") {
    return createFibonacciPattern(width, height, count, shape, params);
  }

  // Lissajous curve
  else if (methodType === "lissajous") {
    return createLissajousPattern(width, height, count, shape, params);
  }

  // Rose curve
  else if (methodType === "rose") {
    return createRosePattern(width, height, count, shape, params);
  }

  // Phyllotaxis pattern (sunflower-like arrangement)
  else if (methodType === "phyllotaxis") {
    return createPhyllotaxisPattern(width, height, count, shape, params);
  }

  // Custom function
  else if (methodType === "custom") {
    try {
      const functionBody = (params.functionBody as string) || "";
      return createCustomPattern(
        width,
        height,
        count,
        shape,
        color,
        functionBody
      );
    } catch (error) {
      console.error("Error in custom function:", error);
      return [];
    }
  }

  return [];
};
