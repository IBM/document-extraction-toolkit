-- Verify pdf-extractor:4.roles on pg

BEGIN;

SELECT id, name, description
FROM data.roles
WHERE FALSE;

ROLLBACK;
