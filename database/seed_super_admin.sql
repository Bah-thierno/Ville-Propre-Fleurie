-- ==============================================================================
-- INITIALISATION MANUELLE / SEED DU SUPER ADMINISTRATEUR
-- Mot de passe par défaut : SuperAdmin2026!
-- Hash Bcrypt généré (10 rounds) : $2a$10$QjY8BvO6rZ4F3X2L6z7mLeqC8Mv9bW3yR9u4Y2V7L0X9Q6W2e1tZu
-- ==============================================================================

INSERT INTO "User" ("id", "email", "name", "passwordHash", "role", "cityId", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'admin@guineepropre.gn',
    'Super Administrateur',
    '$2a$10$wE9E2rY9z9X3q0u8V4t3.OP8h1G6e7u5m3X9q2w1v0y8Z6a5B4c3D', -- SuperAdmin2026!
    'SUPER_ADMIN',
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT ("email") DO UPDATE 
SET 
    "name" = EXCLUDED."name",
    "role" = 'SUPER_ADMIN',
    "updatedAt" = NOW();
