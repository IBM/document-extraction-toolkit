output "postgresdb_password_16" {
  value     = slice(random_pet.postgresdb_password.id,0,16)
  sensitive = true
}

output "pgrst_jwt_32" {
  value     = slice(random_pet.pgrst_jwt.id,0,32)
  sensitive = true
}