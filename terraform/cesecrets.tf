locals {
  postgresdb_password_16 = slice(random_pet.postgresdb_password.id, 0, 16)
  pgrst_jwt_32          = slice(random_pet.pgrst_jwt.id, 0, 32)
}

resource "ibm_code_engine_secret" "ce_secret_sqitch" {
  #depends on postgres db
  project_id = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name       = "${var.project_name}-ce-sqitch"
  format     = "generic"
  depends_on = [ibm_database.databases_for_postgresql, data.ibm_database_connection.postgresdb_connection]
  data = {
    DB_ANON_ROLE         = "anonymous"
    DB_HOST = data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].hostname
    DB_MANAGER_ROLE = "manager"
    DB_PASS = local.postgresdb_password_16
    DB_PORT = data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].port
    DB_READER_ROLE = "reader"
    DB_WRITER_ROLE = "writer"
    DB_SCHEMA = "data,public"
    DB_URI = "postgres://admin:${random_password.postgres_admin_password}@${data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].hostname}:${data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].port}/det"
    DB_USER = "pgrstuser"
    PGDATABASE = "det"
    PGHOST = data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].hostname
    PGPORT = data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].port
    PGPASSWORD = random_password.postgres_admin_password
    PGUSER = "admin"
    SQITCH_DEPLOY  = "deploy --verify"
    SQITCH_TARGET = "postgres://admin:${random_password.postgres_admin_password}@${data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].hostname}:${data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].port}/det"
  }
}

resource "ibm_code_engine_secret" "ce_secret_postgrest" {
  #depends on postgres db
  project_id = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name       = "${var.project_name}-ce-postgrest"
  format     = "generic"
  depends_on = [ibm_database.databases_for_postgresql, data.ibm_database_connection.postgresdb_connection]
  data = {
    PGRST_DB_ANON_ROLE         = "anonymous"
    PGRST_DB_EXTRA_SEARCH_PATH = "public,ibm_extension"
    PGRST_DB_POOL              = 10
    PGRST_JWT_SECRET           = local.pgrst_jwt_32
    PGRST_DB_SCHEMAS           = "data,public"
    PGRST_OPENAPI_MODE         = "ignore-privileges"
    PGRST_DB_URI               = "postgres://pgrstuser:${local.postgresdb_password_16}@${data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].hostname}:${data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].port}/det"
  }
}

resource "ibm_code_engine_secret" "ce_secret_ui" {
  #depends on postgrest, s3, appid
  project_id = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name       = "${var.project_name}-ce-ui"
  format     = "generic"
  depends_on = [ibm_appid_application.appid_app, ibm_cos_bucket.cos_bucket, ibm_resource_key.cos_resource_key, ibm_code_engine_app.ce_postgrest_instance]
  data = {
    AWS_ACCESS_KEY_ID         = ibm_resource_key.cos_resource_key.credentials["cos_hmac_keys.access_key_id"]
    AWS_SECRET_ACCESS_KEY     = ibm_resource_key.cos_resource_key.credentials["cos_hmac_keys.secret_access_key"]
    FORCE_SSL                 = "FALSE"
    PGRST_JWT_SECRET          = local.pgrst_jwt_32
    POSTGREST_URL             = ibm_code_engine_app.ce_postgrest_instance.endpoint_internal
    REACT_APP_OIDC_CLIENT_ID  = ibm_appid_application.appid_app.client_id
    SERVER_OIDC_CLIENT_ID     = ibm_appid_application.appid_app.client_id
    SERVER_OIDC_CLIENT_SECRET = ibm_appid_application.appid_app.secret
    REACT_APP_OIDC_ISSUER     = ibm_appid_application.appid_app.oauth_server_url
    S3_DEF_BUCKET             = "${var.project_name}-${random_pet.cos_bucket_suffix.id}"
    S3_ENDPOINT               = "https://${ibm_cos_bucket.cos_bucket.s3_endpoint_public}"
    SERVER_PORT               = 7001
  }
}

resource "ibm_code_engine_secret" "ce_secret_worker" {
  #depends on postgres db
  project_id = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name       = "${var.project_name}-ce-worker"
  format     = "generic"
  depends_on = [ibm_database.databases_for_postgresql, data.ibm_database_connection.postgresdb_connection,  ibm_cos_bucket.cos_bucket, ibm_resource_key.cos_resource_key, ibm_code_engine_app.ce_postgrest_instance]
  data = {
    DB_HOST = data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].hostname
    DB_PASS = local.postgresdb_password_16
    DB_PORT = data.ibm_database_connection.postgresdb_connection.postgres[0].hosts[0].port
    POSTGREST_URL             = ibm_code_engine_app.ce_postgrest_instance.endpoint_internal
    DB_NAME = "det"
    DB_USER = "pgrstuser"
    S3_ACCESS_KEY_ID         = ibm_resource_key.cos_resource_key.credentials["cos_hmac_keys.access_key_id"]
    S3_SECRET_ACCESS_KEY     = ibm_resource_key.cos_resource_key.credentials["cos_hmac_keys.secret_access_key"]
    S3_DEF_BUCKET             = "${var.project_name}-${random_pet.cos_bucket_suffix.id}"
    S3_ENDPOINT               = "https://${ibm_cos_bucket.cos_bucket.s3_endpoint_public}"
    GENAI_API = var.genai_api
    GENAI_KEY = var.genai_apikey
    PGRST_JWT_SECRET = local.pgrst_jwt_32
  }
}