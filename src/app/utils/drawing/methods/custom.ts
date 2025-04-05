import { ElementPosition } from "../../types";

/**
 * Creates a custom pattern using provided function body
 */
export const createCustomPattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
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
