/**
 * Photo coverage validation utilities
 * Determines if all required photos are uploaded and labeled
 */

const REQUIRED_LABELS = ['Front', 'Right', 'Back', 'Left'];

export const LABEL_TO_AZIMUTH = {
  'Front': 0,
  'Right': 90,
  'Back': 180,
  'Left': 270,
  'Top': null,      // Optional
  'Other': null     // Optional
};

/**
 * Check if all required cardinal photos are uploaded and labeled
 * @param {Array} photos - Array of photo objects with label and file properties
 * @returns {boolean} True if all 4 required labels are present AND have files
 */
export function hasAllRequiredPhotos(photos) {
  if (!photos || photos.length === 0) return false;
  
  // Filter to only photos that have actual files uploaded
  const photosWithFiles = photos.filter(p => p.file !== null && p.file !== undefined);
  
  const labels = photosWithFiles
    .map(p => p.label)
    .filter(Boolean); // Filter out null/undefined labels
  
  return REQUIRED_LABELS.every(label => labels.includes(label));
}

/**
 * Get only the cardinal photos (Front/Right/Back/Left) with azimuth mapping
 * Filters out optional photos (Top/Other) and maps labels to azimuth values
 * @param {Array} photos - Array of photo objects
 * @returns {Array} Filtered photos with azimuth values
 */
export function getCardinalPhotos(photos) {
  if (!photos || photos.length === 0) return [];
  
  return photos
    .filter(p => REQUIRED_LABELS.includes(p.label))
    .map(p => ({
      ...p,
      azimuth: LABEL_TO_AZIMUTH[p.label]
    }));
}

/**
 * Get coverage count (e.g., "3/4 required photos")
 * @param {Array} photos - Array of photo objects
 * @returns {string} Coverage string
 */
export function getCoverageCount(photos) {
  if (!photos || photos.length === 0) return '0/4 required photos';
  
  // Only count photos that have actual files uploaded
  const photosWithFiles = photos.filter(p => p.file !== null && p.file !== undefined);
  
  const labels = photosWithFiles
    .map(p => p.label)
    .filter(Boolean)
    .filter(label => REQUIRED_LABELS.includes(label));
  
  const count = labels.length;
  return `${count}/4 required photos`;
}

/**
 * Check if a label is a required label
 * @param {string} label - Label to check
 * @returns {boolean} True if label is required
 */
export function isRequiredLabel(label) {
  return REQUIRED_LABELS.includes(label);
}

