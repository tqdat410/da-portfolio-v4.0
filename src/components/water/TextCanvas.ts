/**
 * TextCanvas - Canvas 2D text renderer utility for water ripple effect
 * Renders text to a canvas that will be distorted by the water simulation
 * Supports multiple text items with individual positions for scroll animations
 */

// Single text item with position and styling
export interface TextItem {
  id: string;
  text: string;
  /** X position: 0-1 normalized (0=left, 0.5=center, 1=right) */
  x: number;
  /** Y position: 0-1 normalized (0=top, 0.5=center, 1=bottom) */
  y: number;
  fontSize: number;
  fontFamily?: string;
  color?: string;
  opacity?: number;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  glowColor?: string;
  glowBlur?: number;
  revealProgress?: number; // 0 to 1, for typewriter effect without layout shift
}

// Legacy single-text options (backward compatible)
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

// Multi-text options for animated scenes
export interface MultiTextCanvasOptions {
  width: number;
  height: number;
  items: TextItem[];
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
  
  // CONFIG: Default Static Text Glow
  // Uncomment to enable glow for static text too
  // ctx.shadowColor = "#ffffff";
  // ctx.shadowBlur = 20 * devicePixelRatio;

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

/**
 * Creates a canvas with multiple text items at specified positions
 * Each item can have different font, size, color, and position
 */
export function createMultiTextCanvas(options: MultiTextCanvasOptions): HTMLCanvasElement {
  const {
    width,
    height,
    items,
    bgColor = "#A3B18A", // Soft Sage background
    devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1,
  } = options;

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

  // Enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw each text item
  for (const item of items) {
    drawTextItem(ctx, item, scaledWidth, scaledHeight, devicePixelRatio);
  }

  return canvas;
}

/**
 * Updates existing canvas with new text items (for animation frames)
 * Clears and redraws all items - optimized for 60fps updates
 */
export function updateMultiTextCanvas(
  canvas: HTMLCanvasElement,
  items: TextItem[],
  bgColor: string = "#A3B18A",
  devicePixelRatio: number = typeof window !== "undefined" ? window.devicePixelRatio : 1
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear and fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw each item
  for (const item of items) {
    drawTextItem(ctx, item, width, height, devicePixelRatio);
  }
}

/**
 * Internal: Draw single text item to canvas context
 */
function drawTextItem(
  ctx: CanvasRenderingContext2D,
  item: TextItem,
  canvasWidth: number,
  canvasHeight: number,
  dpr: number
): void {
  const {
    text,
    x,
    y,
    fontSize,
    fontFamily = '"Style Script", cursive',
    color = "#1A1512",
    opacity = 1,
    align = "center",
    baseline = "middle",
    glowColor,
    glowBlur = 0,
    revealProgress = 1, // Default to fully visible
  } = item;

  // Skip fully transparent items
  if (opacity <= 0) return;

  const scaledFontSize = Math.round(fontSize * dpr);
  ctx.font = `bold ${scaledFontSize}px ${fontFamily}`;

  // Measure full text width to ensure fixed layout
  // We need to calculate word positions manually to support word-by-word reveal
  // while keeping the sentence centered as a whole.
  const words = text.split(" ");
  const spaceWidth = ctx.measureText(" ").width;
  
  // Calculate total width and individual word widths
  let totalWidth = 0;
  const wordWidths = words.map(word => {
    const w = ctx.measureText(word).width;
    totalWidth += w;
    return w;
  });
  totalWidth += spaceWidth * (words.length - 1);

  // Determine starting X position based on alignment
  const originX = x * canvasWidth;
  const originY = y * canvasHeight;
  let startX = originX;

  if (align === "center") {
    startX = originX - totalWidth / 2;
  } else if (align === "right") {
    startX = originX - totalWidth;
  }
  // if left, startX = originX

  // Save context state
  ctx.save();
  ctx.globalAlpha = opacity;

  // Apply glow
  if (glowColor && glowBlur > 0) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowBlur * dpr;
  }

  ctx.fillStyle = color;
  ctx.textBaseline = baseline;
  // We manually handle alignment by calculating startX, so set canvas align to left
  ctx.textAlign = "left"; 

  // Determine how many words to show with smooth fading
  const revealValue = revealProgress * words.length;

  // Draw words
  let currentX = startX;
  words.forEach((word, index) => {
    // Calculate opacity for this specific word
    // It becomes visible when revealValue passes its index
    // We can add a "fade duration" of e.g. 1.0 unit (one word length)
    // revealValue = 3.5 means words 0,1,2 are opacity 1, word 3 is opacity 0.5
    const wordOpacity = Math.min(1, Math.max(0, revealValue - index));

    if (wordOpacity > 0.01) {
      ctx.save();
      ctx.globalAlpha = opacity * wordOpacity;
      
      // Apply shadow per word to avoid overlapping shadow artifacts if necessary
      // But typically shadow on context is fine. 
      // Careful: global shadow is set on parent context. 
      // With varying opacity, the shadow opacity will scale with globalAlpha automatically in simplified canvas logic.
      
      ctx.fillText(word, currentX, originY);
      ctx.restore();
    }
    
    currentX += wordWidths[index] + spaceWidth;
  });

  // Restore context
  ctx.restore();
}
