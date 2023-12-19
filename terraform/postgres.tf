resource "random_password" "postgres_admin_password" {
  length           = 16
  special          = false
}

resource "random_pet" "postgresdb_password" {
  length    = 8  # Adjust the desired length of the password
  separator = "" # No separator between words
}

output "postgresdb_password" {
  value     = random_pet.postgresdb_password.id
  sensitive = true
}

resource "ibm_database" "databases_for_postgresql" {
  name          = "${var.project_name}-pg"
  service       = "databases-for-postgresql"
  plan          = "standard" # Update to your preferred plan
  location      = var.region
  adminpassword = random_password.postgres_admin_password.result
  resource_group_id = data.ibm_resource_group.rg.id
  users {
    name     = "pgrstuser"
    password = random_pet.postgresdb_password.id
  }

  group {
    group_id = "member"
    memory {
      allocation_mb = 1024
    }
    disk {
      allocation_mb = 5120
    }
  }

}

data "ibm_database_connection" "postgresdb_connection" {
  endpoint_type = "public"
  deployment_id = ibm_database.databases_for_postgresql.id
  user_id       = "pgrstuser"
  user_type     = "database"
}