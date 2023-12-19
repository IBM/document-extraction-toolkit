resource "ibm_resource_instance" "appid_instance" {
  name    = "${var.project_name}-appid"
  service = "appid"
  location = var.region
  plan    = "graduated-tier" # Update to your preferred plan
  resource_group_id = data.ibm_resource_group.rg.id
}

resource "ibm_appid_application" "appid_app" {
  tenant_id = ibm_resource_instance.appid_instance.guid
  name      = "${var.project_name}-ui"
  type      = "regularwebapp" // singlepageapp | regularwebapp
}

resource "ibm_appid_redirect_urls" "appid_redirect" {
    tenant_id = ibm_resource_instance.appid_instance.guid
    depends_on = [ ibm_code_engine_app.ce_ui_instance ]
    urls = [
        "${ibm_code_engine_app.ce_ui_instance.endpoint}/#/auth-callback",
        "http://localhost:3003/#/auth-callback" # for local application development with appid enabled
    ]
}

##
## Configure APP ID: Only allow email auth, but permit self service
##
resource "ibm_appid_idp_cloud_directory" "appid_cd" {
  tenant_id = ibm_resource_instance.appid_instance.guid
  is_active = true

  identity_confirm_methods = [
    "email"
  ]

  identity_field = "email"

  self_service_enabled = true
  signup_enabled = true
  welcome_enabled = true
  reset_password_enabled = true
  reset_password_notification_enabled = false
}

##
## Configure APP ID: Disable third party auth providers
##
resource "ibm_appid_idp_facebook" "appid_fb" {
  tenant_id = ibm_resource_instance.appid_instance.guid
  is_active = false
}

resource "ibm_appid_idp_google" "appid_goog" {
  tenant_id = ibm_resource_instance.appid_instance.guid
  is_active = false
}