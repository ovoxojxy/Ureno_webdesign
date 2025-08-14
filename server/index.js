import dotenv from 'dotenv'
import express from 'express';
import imageRoutes from './routes/api.js';

// Try to load .env from root directory first, then server directory
dotenv.config({ path: '.env' });
dotenv.config({ path: './server/.env' });

const app = express();

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use('/api', imageRoutes);

// Basic health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'OpenAI Server is running', status: 'healthy' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/`);
    console.log(`🤖 OpenAI API: http://localhost:${PORT}/api/ask-openai`);
    console.log(`🎨 Image API: http://localhost:${PORT}/api/generate-image`);
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err.message);
});