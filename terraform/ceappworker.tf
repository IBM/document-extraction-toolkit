resource "ibm_code_engine_app" "ce_postgrest_instance" {
  depends_on = [ ibm_code_engine_job.ce_sqitch_job, time_sleep.wait_for_run_sqitch]
  project_id      = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name            = "${var.project_name}-postgrest"
  image_reference = "postgrest/postgrest:latest"
  image_port      = "3000"
  scale_cpu_limit = 0.125
  scale_min_instances = 1
  scale_initial_instances = 1
  scale_memory_limit = "0.5G"

  run_env_variables {
    reference = ibm_code_engine_secret.ce_secret_postgrest.name
    type      = "secret_full_reference"
  }
}

resource "ibm_code_engine_app" "ce_ui_instance" {
  project_id      = data.ibm_code_engine_project.code_engine_project_instance.project_id
  depends_on = [ ibm_code_engine_job.ce_sqitch_job, time_sleep.wait_for_run_sqitch ]
  name            = "${var.project_name}-ui"
  image_reference = "${var.cr_registry}/${var.cr_namespace}/det-ui:latest"
  image_port      = "7001"
  image_secret      = ibm_code_engine_secret.ce_cr_registry.name
  scale_initial_instances = 1
  scale_min_instances = 1
  scale_cpu_limit = 0.125
  scale_memory_limit = "0.5G"

  run_env_variables {
    reference = ibm_code_engine_secret.ce_secret_ui.name
    type      = "secret_full_reference"
  }
}

resource "ibm_code_engine_job" "ce_worker_job" {
  project_id      = data.ibm_code_engine_project.code_engine_project_instance.project_id
  #depends_on = [ ibm_code_engine_job.ce_sqitch_job ]
  name            = "${var.project_name}-worker"
  image_reference = "${var.cr_registry}/${var.cr_namespace}/det-worker"
  image_secret      = ibm_code_engine_secret.ce_cr_registry.name
  # TODO see if this is fixed https://github.com/IBM-Cloud/terraform-provider-ibm/issues/4922
  run_mode = "task" #should be changed to daemon, but there is a bug with terraform including scale_max_execution_time into the default values
  scale_cpu_limit = 1
  scale_memory_limit = "4G"
  run_env_variables {
    reference = ibm_code_engine_secret.ce_secret_worker.name
    type      = "secret_full_reference"
  }
}

resource "ibm_code_engine_job" "ce_sqitch_job" {
  project_id      = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name            = "${var.project_name}-sqitch"
  image_reference = "${var.cr_registry}/${var.cr_namespace}/det-sqitch"
  image_secret      = ibm_code_engine_secret.ce_cr_registry.name
  run_mode = "task"
  scale_cpu_limit = 1
  scale_memory_limit = "4G"
  #depends_on = [ time_sleep.wait_for_builds ]
  run_env_variables {
    reference = ibm_code_engine_secret.ce_secret_sqitch.name
    type      = "secret_full_reference"
  }
}

