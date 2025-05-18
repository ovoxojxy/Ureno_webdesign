/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const axios = require("axios");
const { default: url } = require("@rollup/plugin-url");

exports.generateImage = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }
    
    const { prompt } = req.body.prompt
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/images/generations",
            {
                prompt,
                n: 1,
                size: "1024x1024",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        )

        const imageUrl = response.data.data[0].url;
        res.json({ url: imageUrl });
    } catch (err) {
        console.error("OpenAI Error:", err.response?.data || err.message)
        res.status(500).json({ error: "Failed to generate image" });
    }
})