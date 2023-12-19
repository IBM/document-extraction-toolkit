-- Verify pdf-extractor:5.documents on pg

BEGIN;

SELECT id, user_id, role_id
FROM data.documents
WHERE FALSE;

ROLLBACK;
