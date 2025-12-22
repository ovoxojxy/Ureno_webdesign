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
 * Extract photo instructions from LLM response text
 * Looks for patterns like "4 photos", "front view", "back view"
 * @param {string} llmResponse
 * @returns {Array|null} 
 */
export function parsePhotoInstructions(llmResponse) {
    if (!llmResponse) return null;

    const text = llmResponse.toLowerCase();

    const photoKeywords = ['photo', 'picture', 'image', 'upload', 'provide', 'send'];
    const hasPhotoKeywords = photoKeywords.some(keyword => text.includes(keyword));

    if (!hasPhotoKeywords) return null;

    const photoCountMatch = text.match(/(\d+)\s*(?:photos?|pictures?|images?)/);
    const photoCount = photoCountMatch ? parseInt(photoCountMatch[1], 10) : null;

    const directionPatterns = [
        { pattern: /\b(front|forward|front-facing|front view)\b/i, azimuth: 0 },
        { pattern: /\b(right|right side|right side view|right-facing)\b/i, azimuth: 90 },
        { pattern: /\b(back|rear|back view|rear view|back-facing)\b/i, azimuth: 180 },
        { pattern: /\b(left|left side|left side view|left-facing)\b/i, azimuth: 270 }
    ];

    // Extract mentioned directions
    const foundDirections = [];
    directionPatterns.forEach(({ pattern, azimuth }) => {
        if (pattern.test(text)) {
            const match = text.match(pattern);
            if (match) {
                foundDirections.push({
                    instruction: match[0],
                    azimuth: azimuth
                });
            }
        }
    });

  if (foundDirections.length > 0) {
    // Remove duplicates by azimuth
    const uniqueDirections = [];
    const seenAzimuths = new Set();
    
    foundDirections.forEach(dir => {
      if (!seenAzimuths.has(dir.azimuth)) {
        seenAzimuths.add(dir.azimuth);
        uniqueDirections.push(dir);
      }
    });

    const azimuthOrder = [0, 90, 180, 270];
    uniqueDirections.sort((a, b) => {
      const aIndex = azimuthOrder.indexOf(a.azimuth);
      const bIndex = azimuthOrder.indexOf(b.azimuth);
      return aIndex - bIndex;
    });

    // Create instruction array with order numbers
    return uniqueDirections.map((dir, index) => ({
      order: index + 1,
      instruction: dir.instruction.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ') + ' view',
      azimuth: dir.azimuth
    }));
  }

  // Fallback: if we know the count but not directions, create generic instructions
  if (photoCount && photoCount > 0 && photoCount <= 8) {
    const defaultInstructions = [
      { order: 1, instruction: 'Front view', azimuth: 0 },
      { order: 2, instruction: 'Right side view', azimuth: 90 },
      { order: 3, instruction: 'Back view', azimuth: 180 },
      { order: 4, instruction: 'Left side view', azimuth: 270 }
    ];
    
    return defaultInstructions.slice(0, photoCount);
  }

  return null;
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
