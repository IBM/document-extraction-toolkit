-- Verify pdf-extractor:1.utils_schema on pg

BEGIN;

SET client_min_messages = 'warning';

DO $$
BEGIN
	ASSERT (SELECT has_schema_privilege('utils', 'usage'));
END;
$$;
ROLLBACK;
