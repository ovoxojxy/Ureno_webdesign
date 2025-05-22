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