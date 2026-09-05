import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Get all public users (Community page)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const { role, cityId, search } = req.query;

        const where: any = {
            isActive: true
        };

        if (role && role !== 'all') {
            where.role = String(role).toUpperCase();
        }

        if (cityId && cityId !== 'all') {
            where.cityId = String(cityId);
        }

        if (search) {
            where.OR = [
                { name: { contains: String(search), mode: 'insensitive' } },
                { matricule: { contains: String(search), mode: 'insensitive' } }
            ];
        }

        const users = await prisma.publicUser.findMany({
            where,
            orderBy: { joinDate: 'desc' }
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
};

// Create a user (Admin only or Volunteer application approval)
export const createUser = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const newUser = await prisma.publicUser.create({
            data: body
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Erreur création utilisateur' });
    }
};
