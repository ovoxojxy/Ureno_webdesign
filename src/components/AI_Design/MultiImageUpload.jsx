import React, { useState, useRef } from "react";

/**
 * MultiImageUpload component for sequential photo uploads with azimuth mapping
 * @param {Array} photoInstructions
 * @param {Function} onPhotosComplete
 * @param {Array} existingPhotos
 */
const MultiImageUpload = ({ photoInstructions, onPhotosComplete, existingPhotos = [] }) => {
    const [uploadedPhotos, setUploadedPhotos] = useState(() => {
      // Initialize with existing photos if provided
      return existingPhotos.map(photo => ({
        file: photo.file || null,
        preview: photo.preview || null,
        azimuth: photo.azimuth,
        order: photo.order,
        instruction: photoInstructions?.find(inst => inst.order === photo.order)?.instruction || ''
      }));
    });

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(() => {
      // Start at first photo that hasn't been uploaded yet
      // Use existingPhotos directly since uploadedPhotos state isn't available yet
      const initializedPhotos = existingPhotos.map(photo => ({
        file: photo.file || null,
        preview: photo.preview || null,
        azimuth: photo.azimuth,
        order: photo.order
      }));
      const firstMissing = photoInstructions?.findIndex(inst => 
        !initializedPhotos.find(p => p.order === inst.order && p.file)
      );
      return firstMissing !== -1 ? firstMissing : 0;
    });

    const fileInputRef = useRef(null);

    // Get current photo instruction
    const currentInstruction = photoInstructions?.[currentPhotoIndex];

    // Check if all photos are uploaded
    const allPhotosUploaded = photoInstructions?.every(inst => 
        uploadedPhotos.find(p => p.order === inst.order && p.file)
    );

    const handleFileSelect = (e) => {
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

          // Update uploaded photos
          const updatedPhotos = [...uploadedPhotos];
          const photoIndex = updatedPhotos.findIndex(p => p.order === currentInstruction.order);

          const photoData = {
            file: file,
            preview: preview,
            azimuth: currentInstruction.azimuth,
            order: currentInstruction.order,
            instruction: currentInstruction.instruction
          };

          if (photoIndex >= 0) {
            // Replace existing photo
            updatedPhotos[photoIndex] = photoData;
          } else {
            // Add new photo
            updatedPhotos.push(photoData);
          }

          setUploadedPhotos(updatedPhotos);

          // Move to next photo if not the last one
          if (currentPhotoIndex < photoInstructions.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
          } else {
            // All photos uploaded, notify parent
            if (onPhotosComplete) {
              onPhotosComplete(updatedPhotos.filter(p => p.file));
            }
          }
        };
        reader.readAsDataURL(file);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    };
  
    const handleReplacePhoto = (order) => {
      // Find the index of the photo instruction
      const instructionIndex = photoInstructions.findIndex(inst => inst.order === order);
      if (instructionIndex >= 0) {
        setCurrentPhotoIndex(instructionIndex);
        fileInputRef.current?.click();
      }
    };
  
    const handleRemovePhoto = (order) => {
      const updatedPhotos = uploadedPhotos.filter(p => p.order !== order);
      setUploadedPhotos(updatedPhotos);
  
      // Move to this photo's instruction
      const instructionIndex = photoInstructions.findIndex(inst => inst.order === order);
      if (instructionIndex >= 0) {
        setCurrentPhotoIndex(instructionIndex);
      }
    };

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
          marginBottom: '10px'
        },
        currentInstruction: {
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '11px',
          marginBottom: '15px',
          padding: '10px',
          background: 'rgba(36, 138, 82, 0.2)',
          borderRadius: '6px',
          border: '1px solid rgba(36, 138, 82, 0.3)'
        },
        uploadButton: {
          width: '100%',
          background: '#248A52',
          border: 'none',
          color: 'white',
          fontSize: '11px',
          padding: '10px',
          borderRadius: '6px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          marginBottom: '15px',
          transition: 'background 0.2s ease'
        },
        thumbnailsContainer: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '15px'
        },
        thumbnail: {
            position: 'relative',
            width: '80px',
            height: '80px',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(0, 0, 0, 0.3)'
          },
          thumbnailImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          },
          thumbnailLabel: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '9px',
            padding: '3px 5px',
            textAlign: 'center'
          },
          thumbnailActions: {
            position: 'absolute',
            top: '3px',
            right: '3px',
            display: 'flex',
            gap: '3px'
          },
          thumbnailButton: {
            background: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            color: 'white',
            fontSize: '9px',
            padding: '3px 6px',
            borderRadius: '3px',
            cursor: 'pointer'
          },
          placeholder: {
            width: '80px',
            height: '80px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px dashed rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '10px',
            textAlign: 'center',
            padding: '5px'
          },
          completionMessage: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '11px',
            padding: '10px',
            background: 'rgba(36, 138, 82, 0.2)',
            borderRadius: '6px',
            border: '1px solid rgba(36, 138, 82, 0.3)',
            textAlign: 'center'
          }
    };

    if (!photoInstructions || photoInstructions.length === 0) {
      return null;
    }

    return (
      <div style={styles.container}>
              <div style={styles.header}>
                Upload Photos ({uploadedPhotos.filter(p => p.file).length} / {photoInstructions.length})
              </div>
        
              {/* Current instruction */}
              {!allPhotosUploaded && currentInstruction && (
                <div style={styles.currentInstruction}>
                  Photo {currentPhotoIndex + 1} of {photoInstructions.length}: {currentInstruction.instruction}
                </div>
              )}
        
              {/* Completion message */}
              {allPhotosUploaded && (
                <div style={styles.completionMessage}>
                  ✓ All photos uploaded! You can replace any photo by clicking on it.
                </div>
              )}
        
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
        
              {/* Upload button */}
              {!allPhotosUploaded && (
                <button
                  style={styles.uploadButton}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={(e) => e.target.style.background = '#1D7745'}
                  onMouseLeave={(e) => e.target.style.background = '#248A52'}
                >
                  {currentInstruction ? `Upload ${currentInstruction.instruction}` : 'Upload Photo'}
                </button>
              )}

              <div style={styles.thumbnailsContainer}>
                {photoInstructions.map((instruction, index) => {
                  const photo = uploadedPhotos.find(p => p.order === instruction.order);
                  const isUploaded = !!photo?.file;

                  return (
                    <div key={instruction.order} style={styles.thumbnail}>
                      {isUploaded ? (
                        <>
                          <img
                            src={photo.preview}
                            alt={instruction.instruction}
                            style={styles.thumbnailImage}
                            onClick={() => handleReplacePhoto(instruction.order)}
                          />
                          <div style={styles.thumbnailLabel}>
                            {instruction.instruction}
                          </div>
                          <div style={styles.thumbnailActions}>
                            <button
                              style={styles.thumbnailButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReplacePhoto(instruction.order);
                              }}
                              title="Replace"
                            >
                              ✏️
                            </button>
                            <button
                              style={styles.thumbnailButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto(instruction.order);
                              }}
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          style={styles.placeholder}
                          onClick={() => {
                            setCurrentPhotoIndex(index);
                            fileInputRef.current?.click();
                          }}
                        >
                          {index + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
      </div>
    );
};

export default MultiImageUpload;
