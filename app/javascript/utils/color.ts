export const hexToRgb = (hex: string) =>
  `${parseInt(hex.slice(1, 3), 16)} ${parseInt(hex.slice(3, 5), 16)} ${parseInt(hex.slice(5), 16)}`;

export const getContrastColor = (background: string) => {
  const r = parseInt(background.substring(1, 3), 16) / 255;
  const g = parseInt(background.substring(3, 5), 16) / 255;
  const b = parseInt(background.substring(5, 7), 16) / 255;

  return (Math.min(r, g, b) + Math.max(r, g, b)) / 2 < 0.55 ? "#FFFFFF" : "#000000";
};

// Threshold for "darken in dark mode" - vibrant colors (red, blue, etc.) should adapt too
const DARKEN_THRESHOLD = 0.45;

const isLightBackground = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lightness = (Math.min(r, g, b) + Math.max(r, g, b)) / 2;
  return lightness >= DARKEN_THRESHOLD;
};

// Gentler darkening so colors stay recognizable (red stays red, not muddy black)
const DARKEN_MULTIPLIER = 0.5;

export const getDarkModeBackground = (hex: string) => {
  if (!isLightBackground(hex)) return hex;
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * DARKEN_MULTIPLIER);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * DARKEN_MULTIPLIER);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * DARKEN_MULTIPLIER);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};
