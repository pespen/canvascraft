import { ElementPosition } from "../../types";

/**
 * Creates a Fibonacci spiral pattern
 */
export const createFibonacciPattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
  params: Record<string, number | string>
) => {
  const elements: ElementPosition[] = [];

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
      ...(shape === "lines" && i < count - 1
        ? {
            endX:
              centerX +
              Math.pow(phi, 2 * ((i + 1) / count)) *
                scale *
                Math.cos(rotation + 2 * Math.PI * ((i + 1) / count) * turns),
            endY:
              centerY +
              Math.pow(phi, 2 * ((i + 1) / count)) *
                scale *
                Math.sin(rotation + 2 * Math.PI * ((i + 1) / count) * turns),
          }
        : {}),
    });
  }

  return elements;
};
