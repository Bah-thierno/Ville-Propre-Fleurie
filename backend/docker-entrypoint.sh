#!/bin/sh
set -e

echo "⏳ [VPF] Waiting for database..."
sleep 3

echo "🗄️  [VPF] Pushing Prisma schema to database..."
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss

echo "🌱 [VPF] Seeding Super Admin..."
npx ts-node prisma/seed.ts

echo "🚀 [VPF] Starting VPF Backend API on port 3000..."
exec npx ts-node src/server.ts
