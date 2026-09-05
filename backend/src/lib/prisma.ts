import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/guinee_propre_db?schema=public';

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
export default prisma;
