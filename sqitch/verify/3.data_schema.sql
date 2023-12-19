-- Verify pdf-extractor:3.data_schema on pg

BEGIN;

SET client_min_messages = 'warning';

DO $$
BEGIN
	ASSERT (SELECT has_schema_privilege('data', 'usage'));
END;
$$;

DO $$
BEGIN
	ASSERT (SELECT has_schema_privilege('public', 'usage'));
END;
$$;

ROLLBACK;
