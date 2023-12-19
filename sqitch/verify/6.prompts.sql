-- Verify pdf-extractor:6.prompts on pg

BEGIN;

SELECT id,
    name,
    prompt_type,
    model_name,
    model_configuration,
    template,
    questions,
    user_id,
    created_at,
    updated_at
FROM data.prompts
WHERE FALSE;

ROLLBACK;
