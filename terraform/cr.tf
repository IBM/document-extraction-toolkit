# Create an IBM Container Registry namespace
resource "ibm_cr_namespace" "cr_namespace" {
  name              = var.cr_namespace
  resource_group_id = data.ibm_resource_group.rg.id
}

resource "ibm_iam_service_id" "serviceID" {
  name        = "${var.project_name}-id"
  description = "Service ID for IBM Cloud Container Registry namespace ${var.cr_namespace}"
}

resource "ibm_iam_service_policy" "policy" {
  iam_service_id = ibm_iam_service_id.serviceID.id
  roles          = ["Reader", "Writer", "Manager"]

  resources {
    service       = "container-registry"
    resource_type = "namespace"
    resource      = var.cr_namespace
    #resource_instance_id = element(split(":", ibm_resource_instance.instance.id), 7)
  }
}

resource "ibm_iam_service_api_key" "cr_api_key" {
  name           = "${var.project_name}-apikey"
  iam_service_id = ibm_iam_service_id.serviceID.iam_id
}

output "cr_api_key" {
  value     = ibm_iam_service_api_key.cr_api_key.apikey
  sensitive = true
}

resource "ibm_code_engine_secret" "ce_cr_registry" {
  project_id = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name       = "${var.cr_namespace}-crsecret"
  format     = "registry"
  data = {
    "username" = "iamapikey"
    "password" = ibm_iam_service_api_key.cr_api_key.apikey
    "server"   = var.cr_registry
    "email"    = "placeholder@ibm.com"
  }
}
