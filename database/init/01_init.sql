-- =============================================================
-- VPF Database Init Script
-- Executed ONCE by PostgreSQL on first container startup.
-- Prisma will handle table creation via 'prisma db push'.
-- This script just ensures the database & extensions are ready.
-- =============================================================

-- Enable UUID generation (needed by Prisma default uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Log init
SELECT 'VPF Database initialized successfully at: ' || NOW();
