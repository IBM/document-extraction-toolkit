-- Verify pdf-extractor:8.extracted_relations_live on pg

BEGIN;

SELECT doc_id, id, user_id, prompt_id
FROM data.extracted_relations_live
WHERE FALSE;

ROLLBACK;
