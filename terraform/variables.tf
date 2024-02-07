# code engine project (should already exist)
variable "project_name" {
  default = "det"
  description = "name used for prefixing resources created"
}

# resource group (should already exist)
variable "resource_group" {
  default = "cce-det"
  description = "resource group of deployment (should already exist)"
}

# CE project name
variable "ce_project_id" {
  default = "cce-det"
  description = "code engine project GUID (should already exist)"
}


variable "cr_namespace" {
    default = "ibm-det"
    description = "Container Registry namespace"
}

# doesn't seem like the cr_registry can be created in other regions yet, defaults to global for now
variable "cr_registry" {
    default =  "icr.io"
    description = "Location of the CR registry - do not change yet"
}

variable "region" {
  default = "us-south"
  description = "account region (us-south, us-east, etc)"
}
# github repository
variable "github_repo" {
  default = "https://github.com/IBM/document-extraction-toolkit"
  description = "location of the github mono repo"
}

variable "use_ssh_key" {
  description = "Whether to use an SSH private key to access the github repo for Code Engine build. Set to True when using with a private repo"
  type        = bool
  default     = false
}

# github repository
variable "ssh_deploykey" {
  default = ""
  sensitive = true
  description = "Create a deploy private key using ssh-keygen -t ed25519 -C \"email@ibm.com\" -f yourkeyname"
}

variable "wml_endpoint" {
  default = "https://us-south.ml.cloud.ibm.com"
  description = "URL of wml watsonx aas endpoint"
}

variable "wml_apikey" {
  default = ""
  sensitive = true
  description = "apikey for wml watsonx aas"
}

variable "wml_project_id" {
  default = ""
  description = "WML project ID"
}