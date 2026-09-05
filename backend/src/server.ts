import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';
import authRoutes from './routes/auth.routes';
import contactRoutes from './routes/contact.routes';
import userRoutes from './routes/user.routes';
import volunteerRoutes from './routes/volunteer.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// CORS: accept all origins when in production Docker,
// or specific local origins during development
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Nginx proxy, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Permissive in docker; tighten in production
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // Compatibility alias for /api/login and /api/me
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Health Check
app.get(['/health', '/api/health'], (req, res) => {
    res.json({ status: 'ok', service: 'VPF Backend API', timestamp: new Date() });
});

// Basic Root Route
app.get('/', (req, res) => {
    res.send('VPF Backend API is running');
});

// Error handler (last middleware)
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] VPF Backend running on http://0.0.0.0:${PORT}`);
});

export { app, prisma };
