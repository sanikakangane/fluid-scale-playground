import { SCALE_STEPS } from "./constants.js";

/**
 * Computes individual steps of the typography scale based on fluid mathematics
 */
export function computeTypeScale(config) {
  const { minViewport, maxViewport, minBaseSize, maxBaseSize, ratio, customRatio } = config;
  const currentRatio = ratio === 0 ? (customRatio || 1.25) : ratio;

  return SCALE_STEPS.map((step) => {
    // Standard modular scale formula: Size = Base * Ratio^Power
    const stepMinPx = minBaseSize * Math.pow(currentRatio, step.power);
    const stepMaxPx = maxBaseSize * Math.pow(currentRatio, step.power);

    // Compute the clamp math:
    // If minViewport and maxViewport are the same, clamp shouldn't divide by zero
    let clampString = "";
    let slope = 0;
    let interceptRem = 0;

    if (maxViewport === minViewport) {
      clampString = `${(stepMinPx / 16).toFixed(4)}rem`;
    } else {
      slope = (stepMaxPx - stepMinPx) / (maxViewport - minViewport);
      const interceptPx = stepMinPx - slope * minViewport;
      interceptRem = interceptPx / 16;
      const slopeVw = slope * 100;

      const minRem = stepMinPx / 16;
      const maxRem = stepMaxPx / 16;

      // Formatting clamp
      const formattedMin = `${minRem.toFixed(4)}rem`;
      const formattedMax = `${maxRem.toFixed(4)}rem`;
      
      const preferredSign = interceptRem >= 0 ? "+" : "-";
      const absInterceptRemString = Math.abs(interceptRem).toFixed(4);
      const preferredString = `${absInterceptRemString}rem ${preferredSign} ${slopeVw.toFixed(4)}vw`;

      clampString = `clamp(${formattedMin}, calc(${preferredString}), ${formattedMax})`;
    }

    return {
      name: step.name,
      power: step.power,
      minPx: stepMinPx,
      maxPx: stepMaxPx,
      clampString,
      slope,
      interceptRem,
    };
  });
}

/**
 * Parses a hex color string to sRGB RGB values
 */
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Computes relative luminance of an RGB color according to WCAG 2.1 specs
 */
function getRelativeLuminance(rgb) {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two hex colors
 * Formula: (L1 + 0.05) / (L2 + 0.05)
 */
export function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1;

  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);

  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (brighter + 0.05) / (darker + 0.05);
}

export function auditContrast(textColor, bgColor) {
  const ratio = getContrastRatio(textColor, bgColor);
  
  // WCAG 2.1 requirements:
  // Normal text (< 18pt or 24px): 4.5:1 for AA, 7.0:1 for AAA
  // Large text (>= 18pt or 24px): 3.0:1 for AA, 4.5:1 for AAA
  const normalAA = ratio >= 4.5;
  const normalAAA = ratio >= 7;
  const largeAA = ratio >= 3;
  const largeAAA = ratio >= 4.5;

  let scoreCard = "FAIL";
  if (normalAAA) {
    scoreCard = "PASS_AAA";
  } else if (normalAA) {
    scoreCard = "PASS_AA";
  }

  return {
    ratio,
    normalAA,
    normalAAA,
    largeAA,
    largeAAA,
    scoreCard,
  };
}

/**
 * Encodes configuration into a URL-friendly base64 or query string
 */
export function encodeConfigToQuery(config) {
  const params = new URLSearchParams({
    minV: config.minViewport.toString(),
    maxV: config.maxViewport.toString(),
    minF: config.minBaseSize.toString(),
    maxF: config.maxBaseSize.toString(),
    ratio: config.ratio.toString(),
    f: config.selectedFont,
    tc: config.textColor,
    bg: config.backgroundColor,
  });
  if (config.customRatio) {
    params.set("cr", config.customRatio.toString());
  }
  return params.toString();
}

/**
 * Decodes configuration from the URL query string with secure fallbacks
 */
export function decodeConfigFromQuery(queryString, defaults) {
  const params = new URLSearchParams(queryString);
  const minViewport = parseInt(params.get("minV") || "", 10);
  const maxViewport = parseInt(params.get("maxV") || "", 10);
  const minBaseSize = parseInt(params.get("minF") || "", 10);
  const maxBaseSize = parseInt(params.get("maxF") || "", 10);
  const ratio = parseFloat(params.get("ratio") || "");
  const customRatio = parseFloat(params.get("cr") || "");
  const selectedFont = params.get("f");
  const textColor = params.get("tc");
  const backgroundColor = params.get("bg");

  return {
    minViewport: isNaN(minViewport) ? defaults.minViewport : minViewport,
    maxViewport: isNaN(maxViewport) ? defaults.maxViewport : maxViewport,
    minBaseSize: isNaN(minBaseSize) ? defaults.minBaseSize : minBaseSize,
    maxBaseSize: isNaN(maxBaseSize) ? defaults.maxBaseSize : maxBaseSize,
    ratio: isNaN(ratio) ? defaults.ratio : ratio,
    customRatio: isNaN(customRatio) ? undefined : customRatio,
    selectedFont: selectedFont || defaults.selectedFont,
    textColor: textColor && textColor.startsWith("#") ? textColor : defaults.textColor,
    backgroundColor: backgroundColor && backgroundColor.startsWith("#") ? backgroundColor : defaults.backgroundColor,
  };
}
