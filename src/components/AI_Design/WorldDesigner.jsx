import React, { useState } from 'react';
// import AIChat from './AIChat';
import GuidedAIChat from './GuidedAIChat';  // Changed from AIChat
import WorldViewer from './WorldViewer';

const WorldDesigner = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [worldId, setWorldId] = useState(null);
  const [generationStatus, setGenerationStatus] = useState(null);

  const handleImageUpload = (file, preview) => {
    setImagePreview(preview);
    // Reset world-related state when new image is uploaded
    if (preview === null) {
      setWorldId(null);
      setGenerationStatus(null);
    }
  };

  const handleWorldGenerated = (idOrData) => {
    // Handle both ID (from AIChat) and data object (from WorldViewer)
    if (typeof idOrData === 'string') {
      setWorldId(idOrData);
    } else if (idOrData?.id) {
      setWorldId(idOrData.id);
    }
    // Status will be cleared by WorldViewer when it loads the world
  };

  const handleGenerationStatusChange = (status) => {
    setGenerationStatus(status);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
      fontFamily: 'Arial, sans-serif'
    },
    layout: {
      display: 'flex',
      flex: '1',
      gap: '20px',
      padding: '20px',
      overflow: 'hidden'
    },
    chatSection: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0' // Allow flexbox to shrink below content size
    },
    viewerSection: {
      width: '400px',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
      height: '100%'
    },
    '@media (max-width: 768px)': {
      layout: {
        flexDirection: 'column'
      },
      viewerSection: {
        width: '100%'
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        <div style={styles.chatSection}>
          {/* <AIChat
            onWorldGenerated={handleWorldGenerated}
            onImageUpload={handleImageUpload}
            onGenerationStatusChange={handleGenerationStatusChange}
          /> */}
          <GuidedAIChat
            onWorldGenerated={handleWorldGenerated}
            onImageUplaod={handleImageUpload}
            onGenerationStatusChange={handleGenerationStatusChange}
          />
        </div>
        <div style={styles.viewerSection}>
          <WorldViewer
            imagePreview={imagePreview}
            worldId={worldId}
            generationStatus={generationStatus}
            onWorldGenerated={handleWorldGenerated}
          />
        </div>
      </div>
    </div>
  );
};

export default WorldDesigner;

