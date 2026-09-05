import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Submit volunteer application
export const submitApplication = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, cityId, motivation } = req.body;

        if (!name || !email || !cityId) {
            return res.status(400).json({ message: 'Champs requis manquants.' });
        }

        const application = await prisma.volunteerApplication.create({
            data: {
                name,
                email,
                phone: phone || '',
                cityId,
                motivation: motivation || ''
            }
        });

        res.status(201).json({ message: 'Candidature reçue !', id: application.id });
    } catch (error) {
        console.error('Volunteer error:', error);
        res.status(500).json({ message: 'Erreur lors de la candidature.' });
    }
};

// Get all applications (Admin only)
export const getApplications = async (req: Request, res: Response) => {
    try {
        const applications = await prisma.volunteerApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Erreur récupération candidatures' });
    }
};
