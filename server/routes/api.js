import express from 'express';
import { generateImage } from '../generateImage.js';
import { askOpenAI } from '../askOpenAI.js'



const router = express.Router();

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

export default router;