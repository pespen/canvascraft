import { ElementPosition } from "../../types";

/**
 * Creates a Lissajous curve pattern
 */
export const createLissajousPattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
  params: Record<string, number | string>
) => {
  const elements: ElementPosition[] = [];

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
      ...(shape === "lines" && i < count - 1
        ? {
            endX:
              centerX +
              scale * Math.sin(a * ((i + 1) * ((2 * Math.PI) / count)) + delta),
            endY:
              centerY +
              scale * Math.sin(b * ((i + 1) * ((2 * Math.PI) / count))),
          }
        : {}),
    });
  }

  return elements;
};
