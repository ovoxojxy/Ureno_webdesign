import express from 'express';
import dotenv from 'dotenv'
import { askOpenAI, askGuidedRenovationQuestion, extractProjectContext, generatePromptDraft } from '../askOpenAI.js';
import { generateImage } from '../generateImage.js';
import {
    generateWorldFromImage,
    generateWorldFromText,
    generateWorldFromMediaAsset,
    pollOperation,
    getWorldDetails,
    prepareMediaUpload
} from '../worldLabsService.js';




const router = express.Router();
dotenv.config()

router.post('/ask-openai', async (req, res) => {
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required'})

    try {
        console.log("Prompt received:", prompt)
        const response = await askOpenAI(prompt)
        console.log("AI reponse:", response)
        res.json({ response })
    } catch(err) {
        console.error("OpenAI error:", err.response?.data || err.message || err)
        res.status(500).json({ error: 'Failed to get AI response'})
    }
})

/**
 * Guided renovation conversation endpoint
 * Handles structured conversation flow with context extraction and guided responses
 */
router.post('/guided-chat', async (req, res) => {
    const { userMessage, conversationHistory, projectContext, currentStage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'userMessage is required' });
    }

    if (!projectContext) {
        return res.status(400).json({ error: 'projectContext is required' });
    }

    if (!currentStage) {
        return res.status(400).json({ error: 'currentStage is required' });
    }

    // conversationHistory is optional (can be empty array for first message)
    const history = conversationHistory || [];

    try {
        console.log("📨 Guided chat request received");
        console.log("📝 User message:", userMessage.substring(0, 100) + "...");
        console.log("🎯 Current stage:", currentStage);
        console.log("💬 Conversation history length:", history.length);

        // Step 1: Extract context from user's message
        const extractedContext = await extractProjectContext(
            userMessage,
            projectContext,
            currentStage
        );

        // Step 2: Merge extracted context with current context
        // Handle the Set conversion for questionsAnswered if needed
        const updatedContext = {
            ...projectContext,
            ...extractedContext,
            // Merge materials and finishes objects properly
            materials: {
                ...projectContext.materials,
                ...(extractedContext.materials || {})
            },
            finishes: {
                ...projectContext.finishes,
                ...(extractedContext.finishes || {})
            },
            // Merge existingElements arrays
            existingElements: [
                ...(Array.isArray(projectContext.existingElements) ? projectContext.existingElements : []),
                ...(Array.isArray(extractedContext.existingElements) ? extractedContext.existingElements : [])
            ],
            // Handle Set conversion for questionsAnswered (ensure it's always a Set, not overridden by extractedContext)
            questionsAnswered: (() => {
                // Don't allow extractedContext to override questionsAnswered - always use projectContext's value
                const base = projectContext.questionsAnswered instanceof Set
                    ? projectContext.questionsAnswered
                    : Array.isArray(projectContext.questionsAnswered)
                    ? new Set(projectContext.questionsAnswered)
                    : new Set();
                return base;
            })()
        };

        // Step 3: Generate/update prompt draft if we have minimum context
        // Minimum context: roomType, currentChange, style
        const hasMinimumContext = !!(
            updatedContext.roomType &&
            updatedContext.currentChange &&
            updatedContext.style
        );

        if (hasMinimumContext) {
            try {
                // Build conversation history for prompt generation
                const promptHistory = history.map(msg => ({
                    role: msg.isPersonal ? 'user' : 'assistant',
                    content: msg.text || msg.content
                }));
                promptHistory.push({
                    role: 'user',
                    content: userMessage
                });

                const promptDraft = await generatePromptDraft(updatedContext, promptHistory);
                updatedContext.promptDraft = promptDraft;
                console.log("✅ Prompt draft generated/updated:", promptDraft.substring(0, 100) + "...");
            } catch (promptError) {
                console.error("⚠️ Failed to generate prompt draft:", promptError.message);
                // Don't fail the whole request if prompt generation fails
                // Keep existing promptDraft if available
            }
        }

        // Step 4: Build conversation history for LLM
        // Format history as array of {role, content} objects
        const formattedHistory = history.map(msg => ({
            role: msg.isPersonal ? 'user' : 'assistant',
            content: msg.text || msg.content
        }));

        // Add the current user message to history
        formattedHistory.push({
            role: 'user',
            content: userMessage
        });

        // Step 5: Get guided response from LLM
        const llmResponse = await askGuidedRenovationQuestion(
            formattedHistory,
            updatedContext,
            currentStage
        );

        // Step 6: Return response with updated context
        // Convert Set to Array for JSON serialization
        const questionsAnsweredArray = updatedContext.questionsAnswered instanceof Set
            ? Array.from(updatedContext.questionsAnswered)
            : Array.isArray(updatedContext.questionsAnswered)
            ? updatedContext.questionsAnswered
            : [];

        const responseContext = {
            ...updatedContext,
            questionsAnswered: questionsAnsweredArray
        };

        res.json({
            response: llmResponse,
            updatedContext: responseContext
        });

    } catch (err) {
        console.error("❌ Guided chat error:", err.response?.data || err.message || err);
        res.status(500).json({
            error: 'Failed to process guided chat request',
            details: err.response?.data || err.message
        });
    }
})

router.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    try {
        const imageUrl = await generateImage(prompt)
        res.json({ imageUrl });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to generate image'})
    }
});

router.post('/worlds/generate', async (req, res) => {
    const {type, imageUrl, textPrompt, displayName, mediaAssetId} = req.body;

    if (!type) {
        return res.status(400).json({ error: 'Type is required (text, image, or media_asset)'});
    }

    if (type === 'image' && !imageUrl && !mediaAssetId) {
        return res.status(400).json({ error: 'imageUrl or mediaAssetId is required for image type' });
    }

    if (type === 'text' && !textPrompt) {
        return res.status(400).json({ error: 'textPrompt is required for text type' });
    }

    try {
        let operation;

        if (type === 'text') {
            operation = await generateWorldFromText(textPrompt, displayName || 'Untitled World');
        } else if (type === 'image' && mediaAssetId) {
            operation = await generateWorldFromMediaAsset(mediaAssetId, textPrompt || '', displayName || 'Untitled World');
        } else if (type === 'image' && imageUrl) {
            operation = await generateWorldFromImage(imageUrl, textPrompt || '', displayName || 'Untitled World');
        } else {
            return res.status(400).json({ error: 'Invalid type or missing required fields' });
        }

        console.log("World generation operation started:", operation.operation_id);
        res.json(operation);
    } catch (err) {
        console.error("world generation error:", err.response?.data || err.message || err);
        res.status(500).json({
            error: 'Failed to start world generation',
            details: err.response?.data || err.message
        });
    }
});

// Poll operation status
router.get('/worlds/operations/:operationId', async (req, res) => {
    const { operationId } = req.params;

    if (!operationId) {
        return res.status(400).json({ error: 'Operation ID is required' });
    }

    try {
        const operation = await pollOperation(operationId);
        res.json(operation);
    }catch (err) {
        console.error("Poll operation error:", err.response?.data || err.message || err);
        res.status(500).json({
            error: 'Failed to poll operation',
            details: err.response?.data || err.message
        })
    }
});

router.get('/worlds/:worldId', async (req, res) => {
    const { worldId } = req.params;

    if (!worldId) {
        return res.status(400).json({ error: 'World ID is required' });
    }

    try {
        const world = await getWorldDetails(worldId);
        res.json(world)
    } catch (err) {
        console.error("Get world details error:", err.response?.data || err.message || err);
        res.status(500).json({
            error: 'Failed to get world details',
            details: err.response?.data || err.message
        });
    }
});

//Prepare media upload (get signed URL)
router.post('/worlds/media-assets/prepare', async (req, res) => {
    const {fileName, kind, extension } = req.body;

    if (!fileName || !kind || !extension) {
        return res.status(400).json({ 
            error: 'fileName, kind (image/video), and extension are required' 
        });
    }
    
    if (kind !== 'image' && kind !== 'video') {
        return res.status(400).json({ error: 'kind must be "image" or "video"' });
    }

    try {
        const uploadInfo = await prepareMediaUpload(fileName, kind, extension);
        res.json(uploadInfo);
    } catch (err) {
        console.error("Prepare upload error:", err.response?.data || err.message || err);
        res.status(500).json({
            error: 'Failed to prepare upload',
            details: err.response?.data || err.message
        });
    }
});


export default router;