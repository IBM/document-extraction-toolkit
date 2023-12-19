-- Revert pdf-extractor:10.procrastinate_schema from pg

BEGIN;

-- Procrastinate Schema

-- Enums

DROP TYPE IF EXISTS procrastinate_job_status 
DROP TYPE IF EXISTS  procrastinate_job_event_type 

-- Tables

DROP TABLE IF EXISTS  procrastinate_jobs

DROP TABLE IF EXISTS procrastinate_periodic_defers

DROP TABLE IF EXISTS procrastinate_events 

-- Functions

DROP FUNCTION IF EXISTS procrastinate_defer_job

DROP FUNCTION IF EXISTS procrastinate_defer_periodic_job

DROP FUNCTION IF EXISTS procrastinate_fetch_job

-- procrastinate_finish_job
-- the next_scheduled_at argument is kept for compatibility reasons, it is to be
-- removed after 1.0.0 is released

DROP FUNCTION IF EXISTS procrastinate_finish_job


DROP FUNCTION IF EXISTS procrastinate_retry_job


DROP FUNCTION IF EXISTS procrastinate_notify_queue


DROP FUNCTION IF EXISTS procrastinate_trigger_status_events_procedure_insert


DROP FUNCTION IF EXISTS procrastinate_trigger_status_events_procedure_update


DROP FUNCTION IF EXISTS procrastinate_trigger_scheduled_events_procedure


DROP FUNCTION IF EXISTS procrastinate_unlink_periodic_defers
-- Triggers

DROP TRIGGER IF EXISTS procrastinate_jobs_notify_queue

DROP TRIGGER IF EXISTS procrastinate_trigger_status_events_update

DROP TRIGGER IF EXISTS procrastinate_trigger_status_events_procedure_insert

DROP TRIGGER IF EXISTS procrastinate_trigger_scheduled_events

DROP TRIGGER IF EXISTS procrastinate_trigger_delete_jobs

-- Old versions of functions, for backwards compatibility (to be removed
-- after 1.0.0)

DROP FUNCTION IF EXISTS procrastinate_finish_job

DROP FUNCTION IF EXISTS procrastinate_finish_job

DROP FUNCTION IF EXISTS procrastinate_defer_periodic_job

COMMIT;
