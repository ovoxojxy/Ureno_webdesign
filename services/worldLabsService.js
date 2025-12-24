import axios from 'axios';

/**
 * Generate a world from text, image URL, or media asset
 * @param {Object} payload = { type: 'text'|'image'|'multiple_images', textPrompt?, imageUrl?, mediaAssetId?, images?, displayName? }
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
 * Upload a single file to World Labs and get media asset ID
 * @param {File} file - File to upload
 * @returns {Promise<string>} Media asset ID
 */
export const uploadPhotoToWorldLabs = async (file) => {
    try {
        // Get file extension
        const fileName = file.name;
        const extension = fileName.split('.').pop().toLowerCase();
        
        // Prepare upload
        const prepareResponse = await prepareMediaUpload({
            fileName: fileName,
            kind: 'image',
            extension: extension
        });
        
        const { media_asset, upload_info } = prepareResponse;
        const mediaAssetId = media_asset.id;
        
        // Upload file to signed URL
        await uploadMedia(file, upload_info.upload_url, upload_info.headers);
        
        console.log("Photo uploaded successfully, media asset ID:", mediaAssetId);
        return mediaAssetId;
    } catch (error) {
        console.error('Error uploading photo to World Labs:', error);
        throw error;
    }
};

/**
 * Upload multiple photos to World Labs and get media asset IDs
 * @param {Array<File>} files - Array of files to upload
 * @returns {Promise<Array<string>>} Array of media asset IDs in same order as files
 */
export const uploadPhotosToWorldLabs = async (files) => {
    try {
        console.log(`Uploading ${files.length} photos to World Labs...`);
        const uploadPromises = files.map(file => uploadPhotoToWorldLabs(file));
        const mediaAssetIds = await Promise.all(uploadPromises);
        console.log(`Successfully uploaded ${mediaAssetIds.length} photos`);
        return mediaAssetIds;
    } catch (error) {
        console.error('Error uploading photos to World Labs:', error);
        throw error;
    }
};

/**
 * Generate world from multiple photos with azimuth values
 * @param {Array<Object>} photos - Array of { file: File, azimuth: number } objects
 * @param {string} textPrompt - Text prompt describing the scene
 * @param {string} displayName - Display name for the world
 * @returns {Promise<Object>} Operation object with operation_id
 */
export const generateWorldFromMultiplePhotos = async (photos, textPrompt = '', displayName = 'Untitled World') => {
    try {
        console.log(`Generating world from ${photos.length} photos with prompt:`, textPrompt.substring(0, 50) + '...');
        
        // Upload all photos to World Labs
        const files = photos.map(p => p.file);
        const mediaAssetIds = await uploadPhotosToWorldLabs(files);
        
        // Map photos to images array with mediaAssetId and azimuth
        const images = photos.map((photo, index) => ({
            mediaAssetId: mediaAssetIds[index],
            azimuth: photo.azimuth
        }));
        
        // Generate world with multiple images
        const operation = await generateWorld({
            type: 'multiple_images',
            images: images,
            textPrompt: textPrompt,
            displayName: displayName
        });
        
        return operation;
    } catch (error) {
        console.error('Error generating world from multiple photos:', error);
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