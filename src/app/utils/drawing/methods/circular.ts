import { ElementPosition } from "../../types";

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

  // Create points along a circle
  for (let i = 0; i < count; i++) {
    const angle = angleOffset + i * ((2 * Math.PI) / count);
    const currentRadius = radius + (Math.random() * 2 - 1) * radiusVariation;
    const x = centerX + currentRadius * Math.cos(angle);
    const y = centerY + currentRadius * Math.sin(angle);

    elements.push({
      x,
      y,
      size: 8 + (radiusVariation > 0 ? Math.random() * 8 : 0),
      // For lines, connect to the next point
      ...(shape === "lines" && i < count - 1
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

  return elements;
};
