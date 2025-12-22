import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../../contexts/authContext';
import { saveWorld, linkWorldToProject } from '../../../services/worldStorage';

const SaveWorldModal = ({ isOpen, onClose, worldData, onSaveSuccess }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [worldName, setWorldName] = useState(worldData?.displayName || '');

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchUserProjects();
    }
  }, [isOpen, currentUser]);

  const fetchUserProjects = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('ownerId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const userProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProjects(userProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // worldData.id is the World Labs world ID
    const worldLabsId = worldData?.id || worldData?.worldId;
    if (!currentUser || !worldLabsId) {
      alert('Missing required data');
      return;
    }

    setSaving(true);
    try {
      const worldDocData = {
        worldId: worldLabsId,
        panoramaUrl: worldData.assets?.imagery?.pano_url || null,
        marbleUrl: `https://marble.worldlabs.ai/world/${worldLabsId}`,
        displayName: worldName || worldData.display_name || 'Untitled World',
        sourceImageUrl: worldData.sourceImageUrl || null
      };

      const worldDocId = await saveWorld(currentUser.uid, worldDocData, selectedProjectId || null);
      
      if (onSaveSuccess) {
        onSaveSuccess(worldDocId);
      }
      
      alert('World saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving world:', error);
      alert('Failed to save world. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#1a1a1a'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
      marginTop: '24px'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      transition: 'background-color 0.2s'
    },
    cancelButton: {
      backgroundColor: '#f0f0f0',
      color: '#333'
    },
    saveButton: {
      backgroundColor: '#248A52',
      color: 'white'
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Save 3D World</h2>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="worldName">
            World Name
          </label>
          <input
            id="worldName"
            type="text"
            value={worldName}
            onChange={(e) => setWorldName(e.target.value)}
            placeholder="Enter a name for this world"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="projectSelect">
            Link to Project (Optional)
          </label>
          {loading ? (
            <div>Loading projects...</div>
          ) : (
            <select
              id="projectSelect"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={styles.select}
            >
              <option value="">No project (save as standalone)</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          )}
          {projects.length === 0 && !loading && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              You don't have any projects yet. Create one from the Projects page.
            </div>
          )}
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={onClose}
            style={{ ...styles.button, ...styles.cancelButton }}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ ...styles.button, ...styles.saveButton }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save World'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveWorldModal;