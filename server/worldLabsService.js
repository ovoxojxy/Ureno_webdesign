import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
dotenv.config({ path: '.env'});

const WORLDLABS_API_BASE_URL = 'https://api.worldlabs.ai/marble/v1';
const WORLDLABS_API_KEY = process.env.WORLDLABS_API_KEY;

function getHeaders() {
    if (!WORLDLABS_API_KEY) {
        console.error("❌ WORLDLABS_API_KEY not found in environment variables");
        throw new Error("World Labs API key is not configured");
    }
    return {
        'WLT-Api-Key': WORLDLABS_API_KEY,
        'Content-Type': 'application/json'
    };
}


/**
 * Generate a world from an image URL
 * @param {string} imageUrl
 * @param {string} textPrompt
 * @param {string} displayName
 * @returns {Promise<Object>}
 */

export async function generateWorldFromImage(imageUrl, textPrompt = '', displayName = "Untitled World") {
    console.log("🎨 Generating world from image:", imageUrl);

    try {
        const response = await axios.post(
            `${WORLDLABS_API_BASE_URL}/worlds:generate`,
            {
                display_name: displayName,
                world_prompt: {
                    type: "image",
                    image_prompt: {
                        source: "uri",
                        uri: imageUrl
                    },
                    ...(textPrompt && { text_prompt: textPrompt })
                }
            },
            { headers: getHeaders() }
        );

        console.log("✅ World generation started:", response.data.operation_id);
        return response.data;
    } catch (err) {
        console.error("❌ World Labs API Error (generateWorldFromImage):", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Generate a world from a text prompt
 * @param {string} textPrompt
 * @param {string} displayName
 * @returns {Promise<Object>}
 */
export async function generateWorldFromText(textPrompt, displayName = 'Untitled World') {
    console.log("📝 Generating world from text:", textPrompt);

    try {
        const response = await axios.post(
            `${WORLDLABS_API_BASE_URL}/worlds:generate`,
            {
                display_name: displayName,
                world_prompt: {
                    type: "text",
                    text_prompt: textPrompt
                }
            },
            { headers: getHeaders()}
        );

        console.log("✅ World generation started:", response.data.operation_id);
        return response.data;
    } catch (err) {
        console.error("❌ World Labs API Error (generateWorldFromText):", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Generate a world from a media asset ID (after file upload)
 * @param {string} mediaAssetId
 * @param {string} textPrompt
 * @param {string} displayName
 * @returns {Promise<Object>}
 */
export async function generateWorldFromMediaAsset(mediaAssetId, textPrompt = "", displayName = "Untitled World") {
        console.log("📦 Generating world from media asset:", mediaAssetId);

    try {
        const response = await axios.post(
            `${WORLDLABS_API_BASE_URL}/worlds:generate`,
            {
                display_name: displayName,
                world_prompt: {
                    type: "image",
                    image_prompt: {
                        source: "media_asset",
                        media_asset_id: mediaAssetId
                    },
                    ...(textPrompt && { text_prompt: textPrompt })
                }
            },
            { headers: getHeaders() }
        );
        console.log("✅ World generation started:", response.data.operation_id);
        return response.data;
    } catch (err) {
        console.error("❌ World Labs API Error (generateWorldFromMediaAsset):", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Generate a world from multiple images with azimuth values
 * @param {Array} images - Array of image objects with {mediaAssetId: string, azimuth: number} or {uri: string, azimuth: number}
 * @param {string} textPrompt - Text prompt describing the scene
 * @param {string} displayName - Display name for the world
 * @returns {Promise<Object>}
 */
export async function generateWorldFromMultipleImages(images, textPrompt = "", displayName = "Untitled World") {
    console.log("📸 Generating world from multiple images:", images.length, "images");
    console.log("Images:", images.map(img => ({ azimuth: img.azimuth, source: img.mediaAssetId ? 'media_asset' : 'uri' })));

    if (!images || images.length === 0) {
        throw new Error("At least one image is required");
    }

    try {
        // Build image prompts array - each image needs source and azimuth
        const imagePrompts = images.map(img => {
            if (img.mediaAssetId) {
                return {
                    source: "media_asset",
                    media_asset_id: img.mediaAssetId,
                    azimuth: img.azimuth
                };
            } else if (img.uri) {
                return {
                    source: "uri",
                    uri: img.uri,
                    azimuth: img.azimuth
                };
            } else {
                throw new Error("Each image must have either mediaAssetId or uri");
            }
        });

        const response = await axios.post(
            `${WORLDLABS_API_BASE_URL}/worlds:generate`,
            {
                display_name: displayName,
                world_prompt: {
                    type: "image",
                    image_prompt: imagePrompts.length === 1 ? imagePrompts[0] : imagePrompts,
                    ...(textPrompt && { text_prompt: textPrompt })
                }
            },
            { headers: getHeaders() }
        );

        console.log("✅ World generation started with", images.length, "images:", response.data.operation_id);
        return response.data;
    } catch (err) {
        console.error("❌ World Labs API Error (generateWorldFromMultipleImages):", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Poll operation status to check if world generation is complete
 * @param {string} operationId
 * @returns {Promise<Object>}
 */
export async function pollOperation(operationId) {
    try {
        const response = await axios.get(
            `${WORLDLABS_API_BASE_URL}/operations/${operationId}`,
            {
                headers: getHeaders()
            }
        );
        return response.data;
    } catch (err) {
        console.error("❌ World Labs API Error (pollOperation):", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Get world details including all assets
 * @param {string} worldId
 * @returns {Promise<Object>}
 */
export async function getWorldDetails(worldId) {
    console.log("🔍 Fetching world details:", worldId);

    try {
        const response = await axios.get(
            `${WORLDLABS_API_BASE_URL}/worlds/${worldId}`,
            { headers: getHeaders() }
        );

        console.log("✅ World details fetched:", worldId);
        return response.data;
    } catch (err) {
        console.error("❌ World Labs API Error (getWorldDetails):", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Prepare media asset upload - gets URL for file upload
 * @param {string} fileName - Name of the file
 * @param {string} kind - "image" or "video"
 * @param {string} extension - File extension (e.g., "jpg", "png", "mp4")
 * @returns {Promise<Object>} Media asset and upload info
 */

export async function prepareMediaUpload(fileName, kind, extension) {
    console.log(`📤 Preparing upload for ${kind}:`, fileName);
    
    try {
        const response = await axios.post(
            `${WORLDLABS_API_BASE_URL}/media-assets:prepare_upload`,
            {
                file_name: fileName,
                kind: kind,
                extension: extension
            },
            { headers: getHeaders() }
        );
        
        console.log("✅ Upload prepared:", response.data.media_asset.id);
        return response.data;
    } catch (err) {
        console.error("❌ World Labs API Error (prepareMediaUpload):", err.response?.data || err.message);
        throw err;
    }
}
