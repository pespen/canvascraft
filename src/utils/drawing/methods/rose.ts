import { ElementPosition } from "../../types";

/**
 * Creates a Rose curve pattern
 */
export const createRosePattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
  params: Record<string, number | string>
) => {
  const elements: ElementPosition[] = [];

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
      // For lines, connect to the next point or back to first point if it's the last
      ...(shape === "lines"
        ? {
            endX:
              i < count - 1
                ? centerX +
                  ((scale *
                    (a * Math.cos(k * ((i + 1) * ((2 * Math.PI * n) / count))) +
                      b)) /
                    (a + b)) *
                    Math.cos((i + 1) * ((2 * Math.PI * n) / count))
                : centerX +
                  ((scale * (a * Math.cos(k * 0) + b)) / (a + b)) * Math.cos(0), // Connect back to first point
            endY:
              i < count - 1
                ? centerY +
                  ((scale *
                    (a * Math.cos(k * ((i + 1) * ((2 * Math.PI * n) / count))) +
                      b)) /
                    (a + b)) *
                    Math.sin((i + 1) * ((2 * Math.PI * n) / count))
                : centerY +
                  ((scale * (a * Math.cos(k * 0) + b)) / (a + b)) * Math.sin(0), // Connect back to first point
          }
        : {}),
    });
  }

  return elements;
};
