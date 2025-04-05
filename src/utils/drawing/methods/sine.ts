import { ElementPosition } from "../../types";

/**
 * Creates a sine wave pattern
 */
export const createSineWavePattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
  params: Record<string, number | string>
) => {
  const elements: ElementPosition[] = [];

  const amplitude = (params.amplitude as number) || 100;
  const frequency = (params.frequency as number) || 0.05;
  const phase = (params.phase as number) || 0;

  // Create points along a sine wave
  for (let i = 0; i < count; i++) {
    const x = i * (width / count);
    const y = height / 2 + amplitude * Math.sin(frequency * x + phase);

    elements.push({
      x,
      y,
      size: 8,
      // For lines, connect to the next point
      ...(shape === "lines" && i < count - 1
        ? {
            endX: (i + 1) * (width / count),
            endY:
              height / 2 +
              amplitude *
                Math.sin(frequency * ((i + 1) * (width / count)) + phase),
          }
        : {}),
    });
  }

  return elements;
};
