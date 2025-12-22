import { collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../src/firebase/firebaseConfig';

/**
 * @param {string} userId - The user's UID
 * @param {Object} worldData - World data to save
 * @param {string} worldData.worldId - World Labs world ID
 * @param {string} worldData.panoramaUrl - Panorama image URL
 * @param {string} worldData.marbleUrl - Marble viewing URL
 * @param {string} worldData.displayName - Display name for the world
 * @param {string} worldData.sourceImageUrl - Original source image URL (optional)
 * @param {string} projectId - Optional project ID to link the world to
 * @returns {Promise<string>} - Document ID of saved world
 */

export const saveWorld = async (userId, worldData, projectId = null) => {
    try {
        const worldsRef = collection(db, 'worlds');

        const worldDoc = { 
            userId,
            worldId: worldData.worldId,
            panoramaUrl: worldData.panoramaUrl || null,
            marbleUrl: worldData.marbleUrl || `https://marble.worldlabs.ai/world/${worldData.worldId}`,
            displayName: worldData.displayName || 'Untitled World',
            sourceImageUrl: worldData.sourceImageUrl || null,
            projectId: projectId || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(worldsRef, worldDoc);
        console.log('World Saved successfully with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving world:", error);
        throw error
    }
};

/**
 * Get all worlds for a user
 * @param {string} userId - The user's UID
 * @returns {Promise<Array>} - Array of world documents
 */
export const getUserWorlds = async (userId) => {
    try {
        const worldsRef = collection(db, 'worlds');
        const q = query(worldsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching user worlds:', error);
        throw error;
    }
};

/**
 * Get worlds linked to a specific project
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} - Array of world documents
 */
export const getProjectWorlds = async (projectId) => {
    try {
        const worldsRef = collection(db, 'worlds');
        const q = query(worldsRef, where('projectId', '==', projectId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching project worlds:", error)
        throw error;
    }
};
/**
 * Link a world to a project
 * @param {string} worldDocId - Firestore document ID of the world
 * @param {string} projectId - Project ID to link to
 */
export const linkWorldToProject = async (worldDocId, projectId) => {
    try {
        const worldRef = doc(db, 'worlds', worldDocId);
        await updateDoc(worldRef, {
            projectId,
            updatedAt: serverTimestamp()
        });
        console.log('World linked to project successfully');
    } catch (error) {
        console.error('Error linking world to project:', error);
        throw error;
    }
};