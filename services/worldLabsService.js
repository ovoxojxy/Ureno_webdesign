import axios from 'axios';

/**
 * Generate a world from text, image URL, or media asset
 * @param {Object} payload = { type: 'text'|'image', textPrompt?, imageUrl?, mediaAssetId?, displayName? }
 * @return {Promise<Object>} Operation object with operation_id
 */
export const generateWorld = async (payload) => {
    try {
        console.log("generating world with payload:", payload);
        const response = await axios.post('/api/worlds/generate', payload);
        console.log("world generation started:", response.data.operation_id);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('World generation error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        } else {
            console.error("Unexpected error:", error)
        }
        throw error;
    }
};

/**
 * Poll operation status
 * @param {string} operationId
 * @returns {Promise<Object>}
 */

export const pollOperation = async (operationId) => {
    try {
        const response = await axios.get(`/api/worlds/operations/${operationId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Poll operation error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        } else {
            console.error("unexepcted error:", error);
        }
        throw error;
    }
}

/**
 * Get world details including all assets
 * @param {string} worldId - World ID
 * @returns {Promise<Object>}
 */
export const getWorld = async (worldId) => {
    try {
        const response = await axios.get(`/api/worlds/${worldId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Get world error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
};

/**
 * Prepare media asset upload - gets signed URL for file upload
 * @param {Object} fileData - { fileName, kind: 'image'|'video', extension }
 * @returns {Promise<Object>} Media asset and upload info
 */
export const prepareMediaUpload = async (fileData) => {
    try {
        const response = await axios.post('/api/worlds/media-assets/prepare', fileData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Prepare upload error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
};

/**
 * Upload file to signed URL
 * @param {File} file - File to upload
 * @param {string} uploadUrl - Signed URL from prepareMediaUpload
 * @param {Object} headers - Required headers (Content-Type)
 * @returns {Promise<void>}
 */
export const uploadMedia = async (file, uploadUrl, headers) => {
    try {
        await axios.put(uploadUrl, file, {
            headers: headers,
            // Important: Don't set Content-Type header - browser will set it based on file type
            // OR set it explicitly if required
        });
        console.log("File uploaded successfully");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Upload error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
};