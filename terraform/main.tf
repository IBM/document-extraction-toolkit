terraform {
  required_providers {
    ibm = {
      source  = "IBM-Cloud/ibm"
      version = "1.58.0"
    }
    restapi = {
      source = "Mastercard/restapi"
      version = "1.18.2"
    }
  }
}
provider "random" {}


provider "ibm" {
  region = var.region
}

data "ibm_resource_group" "rg" {
  name = var.resource_group
}

data "ibm_code_engine_project" "code_engine_project_instance" {
  project_id = var.ce_project_id
}

# Create secret to hold ssh private key for repo access
# https://registry.terraform.io/providers/IBM-Cloud/ibm/latest/docs/resources/code_engine_secret
resource "ibm_code_engine_secret" "ce_secret_instance_ssh" {
  project_id = data.ibm_code_engine_project.code_engine_project_instance.project_id
  name       = "${var.project_name}-ssh-deploy"
  format     = "ssh_auth"

  data = {
    ssh_key = var.ssh_deploykey
  }
}

data "ibm_iam_auth_token" "tokendata" {}