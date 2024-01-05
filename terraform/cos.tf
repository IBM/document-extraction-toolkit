
resource "random_pet" "cos_bucket_suffix" {
  length    = 2 # Adjust the desired length of the random suffix
  separator = "-"
}

resource "ibm_resource_instance" "cos_instance" {
  name     = "${var.project_name}-cos"
  service  = "cloud-object-storage"
  plan     = "standard"
  location = "global"
  resource_group_id = data.ibm_resource_group.rg.id
}

resource "ibm_cos_bucket" "cos_bucket" {
  bucket_name          = "${var.project_name}-${random_pet.cos_bucket_suffix.id}"
  resource_instance_id = ibm_resource_instance.cos_instance.id
  region_location      = var.region
  storage_class        = "smart"
}

resource "ibm_resource_key" "cos_resource_key" {
  name                = "${var.project_name}-cos-resource-key"
  resource_instance_id = ibm_resource_instance.cos_instance.id
  role                = "Manager" # Adjust the role as needed
  parameters          = { "HMAC" = true }
}
