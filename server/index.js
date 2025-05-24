import dotenv from 'dotenv'
import express from 'express';
import imageRoutes from './routes/api.js';
import OpenAI from "openai"




dotenv.config({ path: './server/.env' })




console.log("✅ OpenAI Key Loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");
console.log("Actual key:", process.env.OPENAI_API_KEY);
const app = express();
app.use(express.json());
app.use('/api', imageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
})