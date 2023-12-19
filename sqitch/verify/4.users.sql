-- Verify pdf-extractor:4.users on pg

BEGIN;

SELECT id, first_name, created_at
FROM data.users
WHERE FALSE;

ROLLBACK;
