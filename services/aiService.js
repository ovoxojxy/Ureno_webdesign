import axios from 'axios'

export const getAIResponse = async (prompt) => {
    try {
        console.log("Sending prompt to API:", prompt)
        const response = await axios.post('/api/ask-openai', { prompt })
        console.log("raw response from API:", response.data)
        return response.data.response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            })
        } else {
            console.error("unexepcted error:", error)
        }
        throw error
    }
}

export const generateImage = async (prompt) => {
    try {
        const response = await axios.post('/api/generate-image', { prompt })
        return response.data.imageUrl
    } catch (error){
        console.error('Error generating image:', error)
        throw error
    }
}

/**
 * Guided renovation conversation
 * Calls the guided chat API with user message, conversation history, and project context
 * @param {string} userMessage
 * @param {Array} conversationHistory
 * @param {Object} projectContext
 * @param {string} currentStage
 * @returns {Promise<Object>}
 */

export const askGuidedRenovation = async (userMessage, conversationHistory, projectContext, currentStage) => {
    try {
        console.log("Sending guided chat request:", {
            messageLength: userMessage.length,
            historyLength: conversationHistory.length,
            stage: currentStage
        });

        const requestBody = {
            userMessage,
            conversationHistory: conversationHistory || [],
            projectContext: {
                ...projectContext,
                questionsAnswered: projectContext.questionAnswered instanceof Set
                ? Array.from(projectContext.questionsAnswered)
                : projectContext.questionsAnswered || []
            },
            currentStage
        };

        const response = await axios.post('/api/guided-chat', requestBody);

        console.log("Guided chat response received:", {
            responseLength: response.data.response?.length || 0,
            hasUpdateContext: !!response.data.updatedContext
        });

        if (response.data.updatedContext && response.data.updatedContext.questionsAnswered) {
            response.data.updatedContext.questionsAnswered = new Set(
                response.data.updatedContext.questionsAnswered
            )
        }

        return {
            response: response.data.response,
            updatedContext: response.data.updatedContext
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Guided chat error:', {
                message: error.message,
                status: error.reponse?.status,
                data: error.response?.data
            });
        } else {
            console.error("Unexpected error in guided chat:", error);
        }
        throw error
    }
};