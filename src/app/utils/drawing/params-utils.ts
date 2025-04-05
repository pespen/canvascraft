import { CanvasSettings } from "../types";

/**
 * Returns the default parameters for a given drawing method
 */
export const getDefaultParamsForMethod = (
  methodType: NonNullable<CanvasSettings["drawingMethod"]>["type"]
): Record<string, number | string> => {
  switch (methodType) {
    case "grid":
      return { columns: 5, rows: 5, offsetX: 0, offsetY: 0 };
    case "sine":
      return { amplitude: 100, frequency: 0.05, phase: 0 };
    case "spiral":
      return { spacing: 10, rotation: 0.1, expansion: 0.2 };
    case "circular":
      return {
        radius: 150,
        radiusVariation: 0,
        angleOffset: 0,
      };
    case "fibonacci":
      return {
        scale: 5,
        turns: 12,
        rotation: 0,
      };
    case "lissajous":
      return {
        a: 3,
        b: 4,
        delta: 0,
        scale: 150,
      };
    case "rose":
      return {
        a: 1,
        b: 1,
        n: 2,
        k: 1,
      };
    case "phyllotaxis":
      return {
        n: 1,
        k: 1,
      };
    default:
      return {};
  }
};
