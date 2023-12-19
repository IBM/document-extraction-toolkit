-- Deploy pdf-extractor:1.utils_schema to pg


BEGIN;

SET client_min_messages = 'warning';

drop schema if exists utils cascade;
create schema utils;
grant usage on schema utils to public;

CREATE OR REPLACE FUNCTION utils.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

COMMIT;
