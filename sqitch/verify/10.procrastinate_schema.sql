-- Verify pdf-extractor:10.procrastinate_schema on pg

BEGIN;

SELECT id, queue_name, task_name
FROM procrastinate_jobs
WHERE FALSE;

ROLLBACK;
