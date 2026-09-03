import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import contactRoutes from './routes/contact.routes';
import userRoutes from './routes/user.routes';
import volunteerRoutes from './routes/volunteer.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Error handler (last middleware)
app.use(errorHandler);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Basic Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('VPF Backend API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export { app, prisma };
