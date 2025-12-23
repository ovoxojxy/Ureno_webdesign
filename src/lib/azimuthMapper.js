/**
 * Maps descriptive direction terms to azimuth values (degrees)
 */
export const AZIMUTH_MAP = {
    'front': 0,
    'front view': 0,
    'front-facing': 0,
    'forward': 0,
    'right': 90,
    'right side': 90,
    'right side view': 90,
    'right-facing': 90,
    'back': 180,
    'back view': 180,
    'rear': 180,
    'rear view': 180,
    'back-facing': 180,
    'left': 270,
    'left side': 270,
    'left side view': 270,
    'left-facing': 270,
    // Diagonal views (optional, for more advanced use cases)
    'front-right': 45,
    'front-left': 315,
    'back-right': 135,
    'back-left': 225
}

/**
 * Get azimuth value from a descriptive term
 * @param {string} direction - Direction term (e.g., "front", "right side")
 * @returns {number|null} Azimuth in degrees, or null if not found
 */
export function getAzimuthFromDirection(direction) {
  if (!direction) return null;
  
  const normalized = direction.toLowerCase().trim();

  // Direct lookup
  if (AZIMUTH_MAP[normalized]) {
    return AZIMUTH_MAP[normalized];
  }

  // Try partial matches
  for (const [key, value] of Object.entries(AZIMUTH_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  return null;
}
