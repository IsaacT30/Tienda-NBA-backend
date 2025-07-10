-- Script para solucionar los problemas de la base de datos

-- 1. Actualizar los registros existentes que tienen username null
UPDATE users SET username = COALESCE(email, 'user_' || id) WHERE username IS NULL;

-- 2. Ahora hacer que la columna username no sea nullable (opcional)
-- ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Verificar los cambios
SELECT id, username, email FROM users LIMIT 10;
