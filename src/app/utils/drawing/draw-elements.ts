import { ElementPosition, CanvasSettings } from "../types";

/**
 * Draws a single element on the canvas
 */
export const drawElement = (
  ctx: CanvasRenderingContext2D,
  element: ElementPosition,
  shape: CanvasSettings["shape"],
  color: string
) => {
  // Set the colors
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  switch (shape) {
    case "circles":
      drawCircle(ctx, element);
      break;

    case "rectangles":
      drawRectangle(ctx, element);
      break;

    case "lines":
      drawLine(ctx, element);
      break;
  }
};

/**
 * Draws a circle element
 */
export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  element: ElementPosition
) => {
  // Draw a simple circle with the settings color
  ctx.beginPath();
  ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Draws a rectangle element
 */
export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  element: ElementPosition
) => {
  // Draw a simple rectangle with the settings color
  ctx.fillRect(
    element.x - element.size / 2,
    element.y - element.size / 2,
    element.size,
    element.size
  );
};

/**
 * Draws a line element
 */
export const drawLine = (
  ctx: CanvasRenderingContext2D,
  element: ElementPosition
) => {
  if (element.endX !== undefined && element.endY !== undefined) {
    // Draw a simple line with the settings color
    ctx.beginPath();
    ctx.moveTo(element.x, element.y);
    ctx.lineTo(element.endX, element.endY);
    ctx.lineWidth = element.size / 3;
    ctx.stroke();
  }
};
