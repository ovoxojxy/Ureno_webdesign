import React, { useState, useEffect, useCallback } from 'react';
import { getWorld } from '../../../services/worldLabsService';
import SaveWorldModal from './SaveWorldModel';

const WorldViewer = ({
    imagePreview,
    worldId,
    generationStatus,
    onWorldGenerated
}) => {
    const [worldData, setWorldData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const fetchWorldDetails = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWorld(id);
            setWorldData(data);
            if (onWorldGenerated) {
                onWorldGenerated(data);
            }
        } catch (err) {
            console.error("Error fetching world details:", err);
            setError('Failed to load world details');
        } finally {
            setLoading(false);
        }
    }, [onWorldGenerated]);

    useEffect(() => {
        if (worldId && !worldData) {
            fetchWorldDetails(worldId);
        }
    }, [worldId, worldData, fetchWorldDetails]);

    const styles = {
        container: {
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '15px',
          margin: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '200px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'stretch'
        },
        placeholder: {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '150px'
        },
        imagePreview: {
          width: '100%',
          maxHeight: '300px',
          objectFit: 'contain',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.3)'
        },
        panorama: {
          width: '100%',
          maxHeight: '400px',
          objectFit: 'contain',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        },
        progressContainer: {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        },
        spinner: {
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            borderTop: '3px solid #248A52',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          },
          statusText: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '12px',
            marginBottom: '8px'
          },
          statusSubtext: {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '10px',
            fontStyle: 'italic'
          },
          buttonsContainer: {
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          },
          button: {
            flex: '1',
            minWidth: '120px',
            background: '#248A52',
            border: 'none',
            color: 'white',
            fontSize: '11px',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
            textAlign: 'center',
            transition: 'background 0.2s ease'
          },
          buttonSecondary: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          },
          errorMessage: {
            background: 'rgba(255, 0, 0, 0.2)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '15px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '12px',
            textAlign: 'center'
          },
          worldInfo: {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.7)'
          }
    };

    const spinnerKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Error state
  if (error && !worldData) {
    return (
      <div style={styles.container}>
        <style>{spinnerKeyframes}</style>
        <div style={styles.errorMessage}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  // Loading world details
  if (loading && worldId) {
    return (
      <div style={styles.container}>
        <style>{spinnerKeyframes}</style>
        <div style={styles.progressContainer}>
          <div style={styles.spinner}></div>
          <div style={styles.statusText}>Loading world details...</div>
        </div>
      </div>
    );
  }
  // Show generation progress
  if (generationStatus && !worldData) {
    return (
      <div style={styles.container}>
        <style>{spinnerKeyframes}</style>
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Source image" 
            style={styles.imagePreview}
          />
        )}
        <div style={styles.progressContainer}>
          <div style={styles.spinner}></div>
          <div style={styles.statusText}>
            {generationStatus}
          </div>
          <div style={styles.statusSubtext}>
            This usually takes about 5 minutes...
          </div>
        </div>
      </div>
    );
  }
  if (worldData && worldData.assets) {
    const panoramaUrl = worldData.assets.imagery?.pano_url;
    // Use worldId prop instead of worldData.id for the Marble URL
    const marbleUrl = worldId ? `https://marble.worldlabs.ai/world/${worldId}` : null;

    return (
      <div style={styles.container}>
        <style>{spinnerKeyframes}</style>
        
        {panoramaUrl ? (
          <div>
            <img 
              src={panoramaUrl} 
              alt="Generated 3D world panorama" 
              style={styles.panorama}
            />
          </div>
        ) : imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Source image" 
            style={styles.imagePreview}
          />
        ) : (
          <div style={styles.placeholder}>
            No preview available
          </div>
        )}

        {worldData.display_name && (
          <div style={styles.worldInfo}>
            <strong>World:</strong> {worldData.display_name}
          </div>
        )}

        <div style={styles.buttonsContainer}>
          {panoramaUrl && marbleUrl && (
            <a
              href={marbleUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.button}
              onMouseEnter={(e) => e.target.style.background = '#1D7745'}
              onMouseLeave={(e) => e.target.style.background = '#248A52'}
              onClick={() => {
                console.log('Opening Marble URL:', marbleUrl);
              }}
            >
              View in Marble
            </a>
          )}
          <button
            style={{
              ...styles.button,
              ...styles.buttonSecondary
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            onClick={() => {
                if (worldData) {
                  setShowSaveModal(true);
                } else {
                  alert('World data not loaded yet');
                }
              }}
          >
            Save to Project
          </button>
        </div>
        {showSaveModal && worldData && (
          <SaveWorldModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            worldData={{
              ...worldData,
              sourceImageUrl: imagePreview
            }}
            onSaveSuccess={(worldDocId) => {
              console.log('World saved with ID:', worldDocId);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {imagePreview ? (
        <img 
          src={imagePreview} 
          alt="Uploaded room" 
          style={styles.imagePreview}
        />
      ) : (
        <div style={styles.placeholder}>
          Upload a photo and generate a 3D world to see it here
        </div>
      )}
    </div>
  );
};

export default WorldViewer;