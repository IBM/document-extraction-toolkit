resource "ibm_code_engine_build" "ce_build_instance_ui" {
  depends_on         = [ibm_code_engine_secret.ce_secret_instance_ssh]
  project_id         = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name               = "ui-server-build"
  output_image       = "${var.cr_registry}/${var.cr_namespace}/det-ui"
  output_secret      = ibm_code_engine_secret.ce_cr_registry.name
  source_context_dir = "webclient"
  source_url         = var.github_repo
  source_secret      = var.use_ssh_key ? resource.ibm_code_engine_secret.ce_secret_instance_ssh.name : null
  strategy_type      = "dockerfile"
  strategy_size      = "large"
  timeout            = "1200"
}

resource "ibm_code_engine_build" "ce_build_instance_sqitch" {
  depends_on         = [ibm_code_engine_secret.ce_secret_instance_ssh]
  project_id         = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name               = "sqitch-build"
  output_image       = "${var.cr_registry}/${var.cr_namespace}/det-sqitch"
  output_secret      = ibm_code_engine_secret.ce_cr_registry.name
  source_context_dir = "sqitch"
  source_url         = var.github_repo
  source_secret      = var.use_ssh_key ? resource.ibm_code_engine_secret.ce_secret_instance_ssh.name : null
  strategy_type      = "dockerfile"
}

resource "ibm_code_engine_build" "ce_build_instance_worker" {
  depends_on         = [ibm_code_engine_secret.ce_secret_instance_ssh]
  project_id         = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name               = "py-worker-build"
  output_image       = "${var.cr_registry}/${var.cr_namespace}/det-worker"
  output_secret      = ibm_code_engine_secret.ce_cr_registry.name
  source_context_dir = "server"
  source_url         = var.github_repo
  source_secret      = var.use_ssh_key ? resource.ibm_code_engine_secret.ce_secret_instance_ssh.name : null
  strategy_type      = "dockerfile"
  timeout            = "2400"
}

provider "restapi" {
  uri                  = "https://api.${data.ibm_code_engine_project.code_engine_project_instance.region}.codeengine.cloud.ibm.com/"
  write_returns_object = true
  headers = {
    Authorization = data.ibm_iam_auth_token.tokendata.iam_access_token
  }
}

resource "random_pet" "ce_build_tag" {
  length    = 2  # Adjust the desired length of the password
  separator = "" # No separator between words
}

resource "restapi_object" "buildrun_sqitch" {
  path = "/v2/projects/${data.ibm_code_engine_project.code_engine_project_instance.project_id}/build_runs"
  data = jsonencode(
    {
      name               = "sqitch-build-run-${random_pet.ce_build_tag.id}"
      build_name = ibm_code_engine_build.ce_build_instance_sqitch.name
      #output_image       = "${var.cr_registry}/${var.cr_namespace}/det-sqitch:latest"
      #output_secret      = ibm_code_engine_secret.ce_cr_registry.name
      #source_url         = var.github_repo
      #strategy_type      = "dockerfile"
      #source_context_dir = "sqitch"
      #source_secret      = var.use_ssh_key ? resource.ibm_code_engine_secret.ce_secret_instance_ssh.name : null
      #timeout            = 360
    }
  )
  id_attribute = "name"
}

resource "restapi_object" "buildrun_worker" {
  path = "/v2/projects/${data.ibm_code_engine_project.code_engine_project_instance.project_id}/build_runs"
  data = jsonencode(
    {
      name               = "worker-build-run-${random_pet.ce_build_tag.id}"
      build_name = ibm_code_engine_build.ce_build_instance_worker.name
      #output_image       = "${var.cr_registry}/${var.cr_namespace}/det-sqitch:latest"
      #output_secret      = ibm_code_engine_secret.ce_cr_registry.name
      #source_url         = var.github_repo
      #strategy_type      = "dockerfile"
      #source_context_dir = "server"
      #source_secret      = var.use_ssh_key ? resource.ibm_code_engine_secret.ce_secret_instance_ssh.name : null
      #timeout            = 2400
    }
  )
  id_attribute = "name"
}

resource "restapi_object" "buildrun_ui" {
  path = "/v2/projects/${data.ibm_code_engine_project.code_engine_project_instance.project_id}/build_runs"
  data = jsonencode(
    {
      name               = "ui-build-run-${random_pet.ce_build_tag.id}"
      build_name = ibm_code_engine_build.ce_build_instance_ui.name
      #output_image       = "${var.cr_registry}/${var.cr_namespace}/det-ui:latest"
      #output_secret      = ibm_code_engine_secret.ce_cr_registry.name
      #source_url         = var.github_repo
      #strategy_type      = "dockerfile"
      #source_context_dir = "webclient"
      #source_secret      = var.use_ssh_key ? resource.ibm_code_engine_secret.ce_secret_instance_ssh.name : null
      #strategy_size      = "large"
      #timeout            = 1200
    }
  )
  id_attribute = "name"
}

resource "restapi_object" "jobrun_sqitch" {
  path = "/v2/projects/${data.ibm_code_engine_project.code_engine_project_instance.project_id}/job_runs"
  data = jsonencode(
    {
      name               = "sqitch-job-run-${random_pet.ce_build_tag.id}"
      job_name = ibm_code_engine_job.ce_sqitch_job.name
      #image_reference       = "${var.cr_registry}/${var.cr_namespace}/det-sqitch:latest"
      #image_secret = ibm_code_engine_secret.ce_cr_registry.name
    }
  )
  id_attribute = "name"
}

resource "restapi_object" "jobrun_worker" {
  path = "/v2/projects/${data.ibm_code_engine_project.code_engine_project_instance.project_id}/job_runs"
  data = jsonencode(
    {
      name               = "worker-job-run-${random_pet.ce_build_tag.id}"
      job_name = ibm_code_engine_job.ce_worker_job.name
      #image_reference       = "${var.cr_registry}/${var.cr_namespace}/det-worker:latest"
      #image_secret = ibm_code_engine_secret.ce_cr_registry.name
    }
  )
  id_attribute = "name"
  depends_on = [ time_sleep.wait_for_build_worker ]
}

resource "time_sleep" "wait_for_builds" {
  create_duration = "4m"

  depends_on = [
    restapi_object.buildrun_sqitch,
    restapi_object.buildrun_ui,
    restapi_object.buildrun_worker,   
  ]
}

resource "time_sleep" "wait_for_run_sqitch" {
  create_duration = "5m"
  # sqitch should have finished building, 3 mins elapsed
  depends_on = [
    time_sleep.wait_for_builds,
    restapi_object.jobrun_sqitch
  ]
}

resource "time_sleep" "wait_for_build_worker" {
  create_duration = "19m"
  # 9 min elapsed, proceed to wait for 19 more then run worker daemon
  depends_on = [
    time_sleep.wait_for_run_sqitch
  ]
}
