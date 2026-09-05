import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { randomUUID } from 'crypto';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role, cityId: user.cityId },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        // Create refresh token (expires in 7 days)
        const refreshTokenValue = randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await prisma.refreshToken.create({
            data: {
                token: refreshTokenValue,
                userId: user.id,
                expiresAt,
            }
        });

        res.json({
            token: accessToken,
            refreshToken: refreshTokenValue,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                cityId: user.cityId
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const register = async (req: Request, res: Response) => {
    // Only for initial setup or explicit admin creation
    try {
        const { email, password, role, cityId } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: role || 'CITY_MANAGER',
                cityId
            }
        });

        res.status(201).json({ message: 'Utilisateur créé', userId: newUser.id });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Erreur création utilisateur' });
    }
};

// Init admin endpoint - only allowed with INIT_TOKEN from env
export const initAdmin = async (req: Request, res: Response) => {
    try {
        const initToken = process.env.INIT_TOKEN;
        const provided = req.headers['x-init-token'] || req.body.initToken;
        if (!initToken || provided !== initToken) {
            return res.status(403).json({ message: 'Token d\'initialisation invalide' });
        }

        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Utilisateur existe déjà' });

        const passwordHash = await bcrypt.hash(password, 10);
        const admin = await prisma.user.create({ data: { email, passwordHash, role: 'SUPER_ADMIN' } });
        res.status(201).json({ message: 'Super admin créé', id: admin.id });
    } catch (error) {
        console.error('Init admin error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Refresh endpoint: provide refresh token to obtain new access token
export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token requis' });

        const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!stored) return res.status(401).json({ message: 'Refresh token invalide' });
        if (stored.expiresAt.getTime() < Date.now()) {
            await prisma.refreshToken.delete({ where: { token: refreshToken } });
            return res.status(401).json({ message: 'Refresh token expiré' });
        }

        const user = await prisma.user.findUnique({ where: { id: stored.userId } });
        if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

        const newAccessToken = jwt.sign(
            { userId: user.id, role: user.role, cityId: user.cityId },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        // Optionally rotate refresh token
        await prisma.refreshToken.delete({ where: { token: refreshToken } });
        const newRefresh = randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma.refreshToken.create({ data: { token: newRefresh, userId: user.id, expiresAt } });

        res.json({ token: newAccessToken, refreshToken: newRefresh });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Logout: revoke a refresh token
export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token requis' });
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        res.json({ message: 'Déconnecté' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Get current authenticated user profile
export const getMe = async (req: Request, res: Response) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                cityId: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        res.json(user);
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

