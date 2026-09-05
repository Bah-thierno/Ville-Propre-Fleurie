import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Submit contact form
export const submitContact = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        const newContact = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject: subject || 'Nouveau message',
                message
            }
        });

        res.status(201).json({ message: 'Message envoyé avec succès !', id: newContact.id });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi du message.' });
    }
};

// Get all messages (Admin only)
export const getContacts = async (req: Request, res: Response) => {
    try {
        const contacts = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur récupération messages' });
    }
};
