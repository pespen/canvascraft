import { ElementPosition } from "../../types";

/**
 * Creates a grid pattern
 */
export const createGridPattern = (
  width: number,
  height: number,
  count: number,
  shape: string,
  params: Record<string, number | string>
) => {
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
