import { ElementPosition } from "../../types";

/**
 * Creates a Phyllotaxis pattern
 */
export const createPhyllotaxisPattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
  params: Record<string, number | string>
) => {
  const elements: ElementPosition[] = [];

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
      ...(shape === "lines" && i < count - 1 && i % 5 === 0 // Only connect every 5th point
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

  return elements;
};
