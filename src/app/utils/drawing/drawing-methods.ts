import { ElementPosition, CanvasSettings } from "../types";

/**
 * Factory function that creates element positions based on the selected drawing method
 */
export const generatePositions = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  color: string,
  methodType: string | undefined = "circular",
  params: Record<string, number | string> = {}
): ElementPosition[] => {
  const elements: ElementPosition[] = [];

  // Default to circular if no method specified
  if (!methodType) {
    methodType = "circular";
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

  return elements;
};

/**
 * Creates a grid pattern
 */
export const createGridPattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  params: Record<string, number | string>
): ElementPosition[] => {
  const elements: ElementPosition[] = [];

  const columns = (params.columns as number) || 5;
  const rows = (params.rows as number) || 5;
  const offsetX = (params.offsetX as number) || 0;
  const offsetY = (params.offsetY as number) || 0;

  const cellWidth = width / (columns + 1);
  const cellHeight = height / (rows + 1);

  // Create a grid arrangement
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      elements.push({
        x: (col + 1) * cellWidth + offsetX,
        y: (row + 1) * cellHeight + offsetY,
        size: 10 + Math.random() * 10,
        // For lines, connect to the next point
        ...(shape === "lines" && col < columns - 1
          ? {
              endX: (col + 2) * cellWidth + offsetX,
              endY: (row + 1) * cellHeight + offsetY,
            }
          : {}),
      });
    }
  }

  return elements;
};

/**
 * Creates a sine wave pattern
 */
export const createSineWavePattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  params: Record<string, number | string>
): ElementPosition[] => {
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

/**
 * Creates a spiral pattern
 */
export const createSpiralPattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  params: Record<string, number | string>
): ElementPosition[] => {
  const elements: ElementPosition[] = [];

  const spacing = (params.spacing as number) || 10;
  const rotation = (params.rotation as number) || 0.1;
  const expansion = (params.expansion as number) || 0.2;

  const centerX = width / 2;
  const centerY = height / 2;

  // Create points along a spiral
  for (let i = 0; i < count; i++) {
    const angle = i * rotation;
    const radius = spacing * (i * expansion);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    elements.push({
      x,
      y,
      size: 6 + (i / count) * 10,
      // For lines, connect to the next point
      ...(shape === "lines" && i < count - 1
        ? {
            endX:
              centerX +
              spacing * ((i + 1) * expansion) * Math.cos((i + 1) * rotation),
            endY:
              centerY +
              spacing * ((i + 1) * expansion) * Math.sin((i + 1) * rotation),
          }
        : {}),
    });
  }

  return elements;
};

/**
 * Creates a circular pattern
 */
export const createCircularPattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  params: Record<string, number | string>
): ElementPosition[] => {
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

/**
 * Creates a Fibonacci spiral pattern
 */
export const createFibonacciPattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  params: Record<string, number | string>
): ElementPosition[] => {
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

/**
 * Creates a Lissajous curve pattern
 */
export const createLissajousPattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  params: Record<string, number | string>
): ElementPosition[] => {
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

/**
 * Creates a Rose curve pattern
 */
export const createRosePattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  params: Record<string, number | string>
): ElementPosition[] => {
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
      // For lines, connect to the next point
      ...(shape === "lines" && i < count - 1
        ? {
            endX:
              centerX +
              ((scale *
                (a * Math.cos(k * ((i + 1) * ((2 * Math.PI * n) / count))) +
                  b)) /
                (a + b)) *
                Math.cos((i + 1) * ((2 * Math.PI * n) / count)),
            endY:
              centerY +
              ((scale *
                (a * Math.cos(k * ((i + 1) * ((2 * Math.PI * n) / count))) +
                  b)) /
                (a + b)) *
                Math.sin((i + 1) * ((2 * Math.PI * n) / count)),
          }
        : {}),
    });
  }

  return elements;
};

/**
 * Creates a Phyllotaxis pattern
 */
export const createPhyllotaxisPattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  params: Record<string, number | string>
): ElementPosition[] => {
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

/**
 * Creates a custom pattern using provided function body
 */
export const createCustomPattern = (
  width: number,
  height: number,
  count: number,
  shape: CanvasSettings["shape"],
  color: string,
  functionBody: string
): ElementPosition[] => {
  const elements: ElementPosition[] = [];

  try {
    // Create a function from the custom code
    // eslint-disable-next-line no-new-func
    const customFunc = new Function(
      "width",
      "height",
      "count",
      "color",
      functionBody
    );

    // Execute the function to get positions
    const positions = customFunc(width, height, count, color);

    // Process the returned positions
    if (Array.isArray(positions)) {
      positions.forEach((pos, i) => {
        if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
          elements.push({
            x: pos.x,
            y: pos.y,
            size: pos.size || 8,
            ...(shape === "lines" && i < positions.length - 1
              ? {
                  endX: positions[i + 1]?.x,
                  endY: positions[i + 1]?.y,
                }
              : {}),
          });
        }
      });
    }
  } catch (error) {
    console.error("Error in custom function:", error);
  }

  return elements;
};
