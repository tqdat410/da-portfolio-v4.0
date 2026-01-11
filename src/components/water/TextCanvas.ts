/**
 * TextCanvas - Canvas 2D text renderer utility for water ripple effect
 * Renders text to a canvas that will be distorted by the water simulation
 */

export interface TextCanvasOptions {
  width: number;
  height: number;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  bgColor?: string;
  devicePixelRatio?: number;
}

/**
 * Creates a canvas with centered text for use as a texture
 * Scales by devicePixelRatio for crisp rendering on high-DPI displays
 */
export function createTextCanvas(options: TextCanvasOptions): HTMLCanvasElement {
  const {
    width,
    height,
    text,
    fontSize = 120,
    fontFamily = "Inter, system-ui, sans-serif",
    textColor = "#F4EEE0", // Warm Cream from Terrarium palette
    bgColor = "#0D0A08", // Deep Earth from Terrarium palette
    devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1,
  } = options;

  // Create canvas with DPI scaling
  const canvas = document.createElement("canvas");
  const scaledWidth = width * devicePixelRatio;
  const scaledHeight = height * devicePixelRatio;

  canvas.width = scaledWidth;
  canvas.height = scaledHeight;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    throw new Error("Failed to get 2D context");
  }

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, scaledWidth, scaledHeight);

  // Configure text rendering
  const scaledFontSize = Math.round(fontSize * devicePixelRatio);
  ctx.fillStyle = textColor;
  ctx.font = `bold ${scaledFontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw centered text
  ctx.fillText(text, scaledWidth / 2, scaledHeight / 2);

  return canvas;
}

/**
 * Updates an existing canvas with new text content
 * Useful for dynamic text changes without recreating the canvas
 */
export function updateTextCanvas(
  canvas: HTMLCanvasElement,
  options: Omit<TextCanvasOptions, "width" | "height">
): void {
  const {
    text,
    fontSize = 120,
    fontFamily = "Inter, system-ui, sans-serif",
    textColor = "#F4EEE0",
    bgColor = "#0D0A08",
    devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1,
  } = options;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear and fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Configure and draw text
  const scaledFontSize = Math.round(fontSize * devicePixelRatio);
  ctx.fillStyle = textColor;
  ctx.font = `bold ${scaledFontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.fillText(text, width / 2, height / 2);
}
