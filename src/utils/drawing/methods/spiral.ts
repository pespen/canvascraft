import { ElementPosition } from "../../types";
import { getSizeScaleFactor } from "../generate-positions";

/**
 * Creates a spiral pattern
 */
export const createSpiralPattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
  params: Record<string, number | string>
) => {
  const elements: ElementPosition[] = [];

  const spacing = (params.spacing as number) || 10;
  const rotation = (params.rotation as number) || 0.1;
  const expansion = (params.expansion as number) || 0.2;

  const centerX = width / 2;
  const centerY = height / 2;

  // Get base element size with some scaling based on canvas size
  const baseSizeScale = getSizeScaleFactor(width, height);
  const baseSize = 6 * baseSizeScale;
  const sizeVariation = 10 * baseSizeScale;

  // Create points along a spiral
  for (let i = 0; i < count; i++) {
    const angle = i * rotation;
    const radius = spacing * (i * expansion);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    elements.push({
      x,
      y,
      size: baseSize + (i / count) * sizeVariation,
      // For lines, connect to the next point (spirals typically don't close back to first point)
      ...(shape === "lines"
        ? {
            endX:
              i < count - 1
                ? centerX +
                  spacing * ((i + 1) * expansion) * Math.cos((i + 1) * rotation)
                : x, // For spirals, we don't connect back to first point as they're not closed curves
            endY:
              i < count - 1
                ? centerY +
                  spacing * ((i + 1) * expansion) * Math.sin((i + 1) * rotation)
                : y, // For spirals, we don't connect back to first point as they're not closed curves
          }
        : {}),
    });
  }

  return elements;
};
