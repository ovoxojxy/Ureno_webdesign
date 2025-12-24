import React, { useState, useRef, useEffect } from "react";
import { hasAllRequiredPhotos, getCoverageCount, isRequiredLabel, LABEL_TO_AZIMUTH } from "../../lib/photoCoverage";

/**
 * PhotoLabelingGrid component for uploading and labeling photos
 * Always shows 4 required slots (Front, Right, Back, Left) + optional slots (Top, Other)
 * @param {Function} onPhotosComplete - Callback when all required photos are uploaded and labeled
 * @param {Array} existingPhotos - Previously uploaded photos
 */
const PhotoLabelingGrid = ({ onPhotosComplete, existingPhotos = [] }) => {
  const LABEL_OPTIONS = ['Front', 'Right', 'Back', 'Left', 'Top', 'Other'];
  const REQUIRED_LABELS = ['Front', 'Right', 'Back', 'Left'];
  const OPTIONAL_LABELS = ['Top', 'Other'];
  
  // Initialize with existing photos or create empty slots
  const [photos, setPhotos] = useState(() => {
    if (existingPhotos && existingPhotos.length > 0) {
      return existingPhotos;
    }
    // Create empty slots for required photos
    return REQUIRED_LABELS.map(label => ({
      file: null,
      preview: null,
      label: label,
      azimuth: LABEL_TO_AZIMUTH[label],
      customLabel: null
    }));
  });

  const fileInputRefs = useRef({});

  // Get all photo slots (required + optional if they exist)
  const allPhotoSlots = [...REQUIRED_LABELS];
  const hasOptionalPhotos = photos.some(p => OPTIONAL_LABELS.includes(p.label));
  if (hasOptionalPhotos) {
    allPhotoSlots.push(...OPTIONAL_LABELS.filter(label => photos.some(p => p.label === label)));
  }

  const handleFileSelect = (label, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result;

      // Update photos array
      setPhotos(prev => {
        const existingIndex = prev.findIndex(p => p.label === label);
        const updatedPhoto = {
          file: file,
          preview: preview,
          label: label,
          azimuth: LABEL_TO_AZIMUTH[label] ?? null,
          customLabel: label === 'Other' ? null : undefined
        };

        if (existingIndex >= 0) {
          // Replace existing photo
          const updated = [...prev];
          updated[existingIndex] = updatedPhoto;
          return updated;
        } else {
          // Add new photo
          return [...prev, updatedPhoto];
        }
      });
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRefs.current[label]) {
      fileInputRefs.current[label].value = '';
    }
  };

  const handleLabelChange = (oldLabel, newLabel) => {
    // Don't allow changing to a label that's already used (unless it's the same photo)
    const labelInUse = photos.some(p => p.label === newLabel && p.label !== oldLabel);
    if (labelInUse && isRequiredLabel(newLabel)) {
      alert(`You already have a photo labeled '${newLabel}'. Please choose a different label.`);
      return;
    }

    setPhotos(prev => prev.map(p => {
      if (p.label === oldLabel) {
        return {
          ...p,
          label: newLabel,
          azimuth: LABEL_TO_AZIMUTH[newLabel] ?? null,
          customLabel: newLabel === 'Other' ? (p.customLabel || null) : undefined
        };
      }
      return p;
    }));
  };

  const handleCustomLabelChange = (label, customLabel) => {
    setPhotos(prev => prev.map(p => {
      if (p.label === label) {
        return { ...p, customLabel: customLabel };
      }
      return p;
    }));
  };

  const handleRemovePhoto = (label) => {
    setPhotos(prev => prev.filter(p => p.label !== label));
  };

  const handleAddOptional = () => {
    // Add next available optional label
    const availableLabels = OPTIONAL_LABELS.filter(label => !photos.some(p => p.label === label));
    if (availableLabels.length > 0) {
      const newLabel = availableLabels[0];
      setPhotos(prev => [...prev, {
        file: null,
        preview: null,
        label: newLabel,
        azimuth: null,
        customLabel: newLabel === 'Other' ? null : undefined
      }]);
    }
  };

  // Check if all required photos are uploaded and labeled
  const allRequiredUploaded = hasAllRequiredPhotos(photos);
  const coverageCount = getCoverageCount(photos);

  // Notify parent whenever photos change (to keep parent state in sync)
  // Always notify to maintain synchronization, even if photos become incomplete
  // The parent's stage transition logic will handle checking if photos are complete
  useEffect(() => {
    if (onPhotosComplete) {
      // Filter to only photos with actual files and notify parent
      // This keeps parent's projectContext.photos in sync with local state
      const photosWithFiles = photos.filter(p => p.file !== null);
      onPhotosComplete(photosWithFiles);
    }
  }, [photos, onPhotosComplete]);

  const styles = {
    container: {
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    header: {
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    coverageMeter: {
      color: allRequiredUploaded ? 'rgba(36, 138, 82, 0.9)' : 'rgba(255, 255, 255, 0.7)',
      fontSize: '11px',
      fontWeight: 'normal'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '15px',
      marginTop: '15px'
    },
    photoSlot: {
      position: 'relative',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '6px',
      padding: '10px',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      minHeight: '180px'
    },
    photoPreview: {
      width: '100%',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '4px',
      marginBottom: '8px',
      background: 'rgba(255, 255, 255, 0.1)'
    },
    placeholder: {
      width: '100%',
      height: '120px',
      borderRadius: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '2px dashed rgba(255, 255, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '10px',
      textAlign: 'center',
      marginBottom: '8px',
      cursor: 'pointer'
    },
    labelSelect: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      padding: '6px',
      color: 'white',
      fontSize: '11px',
      marginBottom: '6px',
      cursor: 'pointer'
    },
    customLabelInput: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      padding: '6px',
      color: 'white',
      fontSize: '11px',
      marginTop: '6px'
    },
    uploadButton: {
      width: '100%',
      background: '#248A52',
      border: 'none',
      color: 'white',
      fontSize: '10px',
      padding: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginTop: '6px'
    },
    removeButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'rgba(0, 0, 0, 0.7)',
      border: 'none',
      color: 'white',
      fontSize: '12px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    requiredBadge: {
      position: 'absolute',
      top: '5px',
      left: '5px',
      background: 'rgba(36, 138, 82, 0.8)',
      color: 'white',
      fontSize: '9px',
      padding: '2px 6px',
      borderRadius: '3px',
      fontWeight: 'bold'
    },
    addOptionalButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px dashed rgba(255, 255, 255, 0.3)',
      borderRadius: '6px',
      padding: '15px',
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '11px',
      cursor: 'pointer',
      textAlign: 'center',
      minHeight: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>Upload Photos</span>
        <span style={styles.coverageMeter}>{coverageCount}</span>
      </div>

      <div style={styles.grid}>
        {allPhotoSlots.map(label => {
          const photo = photos.find(p => p.label === label);
          const isUploaded = photo && photo.file !== null;
          const isRequired = isRequiredLabel(label);

          return (
            <div key={label} style={styles.photoSlot}>
              {isRequired && <div style={styles.requiredBadge}>Required</div>}
              
              {isUploaded && (
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemovePhoto(label)}
                  title="Remove photo"
                >
                  ×
                </button>
              )}

              {isUploaded ? (
                <>
                  <img
                    src={photo.preview}
                    alt={label}
                    style={styles.photoPreview}
                  />
                  <select
                    style={styles.labelSelect}
                    value={photo.label}
                    onChange={(e) => handleLabelChange(label, e.target.value)}
                  >
                    {LABEL_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {photo.label === 'Other' && (
                    <input
                      type="text"
                      placeholder="Custom label..."
                      value={photo.customLabel || ''}
                      onChange={(e) => handleCustomLabelChange(label, e.target.value)}
                      style={styles.customLabelInput}
                    />
                  )}
                  <button
                    style={styles.uploadButton}
                    onClick={() => fileInputRefs.current[label]?.click()}
                  >
                    Replace
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={styles.placeholder}
                    onClick={() => fileInputRefs.current[label]?.click()}
                  >
                    {label}
                  </div>
                  <select
                    style={styles.labelSelect}
                    value={label}
                    onChange={(e) => handleLabelChange(label, e.target.value)}
                    disabled={isRequired}
                  >
                    {LABEL_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {label === 'Other' && (
                    <input
                      type="text"
                      placeholder="Custom label..."
                      style={styles.customLabelInput}
                      disabled
                    />
                  )}
                  <button
                    style={styles.uploadButton}
                    onClick={() => fileInputRefs.current[label]?.click()}
                  >
                    Upload {label}
                  </button>
                </>
              )}
              
              {/* Hidden file input - always present for each slot */}
              <input
                ref={el => fileInputRefs.current[label] = el}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(label, e)}
                style={{ display: 'none' }}
              />
            </div>
          );
        })}

        {/* Add optional photo button */}
        {!hasOptionalPhotos && (
          <div
            style={styles.addOptionalButton}
            onClick={handleAddOptional}
          >
            + Add Optional Photo
          </div>
        )}
      </div>

      {allRequiredUploaded && (
        <div style={{
          color: 'rgba(36, 138, 82, 0.9)',
          fontSize: '11px',
          padding: '10px',
          background: 'rgba(36, 138, 82, 0.2)',
          borderRadius: '6px',
          border: '1px solid rgba(36, 138, 82, 0.3)',
          textAlign: 'center',
          marginTop: '15px'
        }}>
          ✓ All required photos uploaded and labeled!
        </div>
      )}
    </div>
  );
};

export default PhotoLabelingGrid;

