import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const email = process.env.INIT_EMAIL || 'admin@guineepropre.gn';
  const password = process.env.INIT_PASSWORD || 'SuperAdmin2026!';
  const name = process.env.INIT_NAME || 'Super Administrateur';

  console.log(`[Seed] Initializing Super Admin for email: ${email}`);

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: 'SUPER_ADMIN',
    },
    create: {
      email,
      name,
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`[Seed] Super admin ready! ID: ${admin.id}, Email: ${admin.email}, Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error('[Seed Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
