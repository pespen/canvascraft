import { ElementPosition } from "../../types";
import { getSizeScaleFactor } from "../generate-positions";

/**
 * Creates a circular pattern
 */
export const createCircularPattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
  params: Record<string, number | string>
) => {
  const elements: ElementPosition[] = [];

  const radius = (params.radius as number) || 150;
  const radiusVariation = (params.radiusVariation as number) || 0;
  const angleOffset = (params.angleOffset as number) || 0;

  const centerX = width / 2;
  const centerY = height / 2;

  // Get base element size with scaling based on canvas size
  const sizeScale = getSizeScaleFactor(width, height);
  const baseSize = 8 * sizeScale;
  const sizeVariation = 8 * sizeScale;

  // Create points along a circle
  for (let i = 0; i < count; i++) {
    const angle = angleOffset + i * ((2 * Math.PI) / count);
    const currentRadius = radius + (Math.random() * 2 - 1) * radiusVariation;
    const x = centerX + currentRadius * Math.cos(angle);
    const y = centerY + currentRadius * Math.sin(angle);

    elements.push({
      x,
      y,
      size:
        baseSize + (radiusVariation > 0 ? Math.random() * sizeVariation : 0),
      // For lines, connect to the next point or back to first for the last point
      ...(shape === "lines"
        ? {
            endX:
              i < count - 1
                ? centerX +
                  currentRadius *
                    Math.cos(angleOffset + (i + 1) * ((2 * Math.PI) / count))
                : centerX +
                  currentRadius *
                    Math.cos(angleOffset + 0 * ((2 * Math.PI) / count)), // Connect back to first point
            endY:
              i < count - 1
                ? centerY +
                  currentRadius *
                    Math.sin(angleOffset + (i + 1) * ((2 * Math.PI) / count))
                : centerY +
                  currentRadius *
                    Math.sin(angleOffset + 0 * ((2 * Math.PI) / count)), // Connect back to first point
          }
        : {}),
    });
  }

  return elements;
};
