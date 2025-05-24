import dotenv from 'dotenv'
import express from 'express';
import imageRoutes from './routes/api.js';

dotenv.config({ path: './server/.env' })

const app = express();
app.use(express.json());
app.use('/api', imageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
})