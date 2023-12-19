import { UserManager } from "oidc-client-ts";

import getProfileFromToken from "./getProfileFromToken";

const oidcConfig = JSON.parse(window.localStorage.getItem("oidc"))
const issuer = oidcConfig? oidcConfig.REACT_APP_OIDC_ISSUER : "";
const clientId = oidcConfig ? oidcConfig.REACT_APP_OIDC_CLIENT_ID : "";
const oidcEnabled = oidcConfig ? oidcConfig.enabled : false;

const urlEncode = (body) =>
  Object.entries(body)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

const userManager = new UserManager({
  authority: issuer,
  client_id: clientId,
  redirect_uri: `${window.location.origin}/#/auth-callback`,
  response_type: "code",
  scope: "openid email name", // Allow to retrieve the email and user name later api side
});

const cleanup = () => {
  // Remove the ?code&state from the URL
  window.history.replaceState(
    {},
    window.document.title,
    window.location.origin
  );
};

const authProvider = {
  login: async () => {
    // 1. Redirect to the issuer to ask authentication
    console.log("triggering login")


    if (oidcEnabled) {
      await userManager.signinRedirect()
    }
    return; // Do not return anything, the login is still loading
  },
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkError: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkAuth: () => {
    if (oidcEnabled) {
      console.log("checking auth")
      const token = localStorage.getItem("token");
      //console.log(token)
      if (!token) {
        return Promise.reject();
      }
  
      // This is specific to the Google authentication implementation
      const jwt = getProfileFromToken(token);
      const now = new Date();
  
      return now.getTime() > jwt.exp * 1000
        ? Promise.reject()
        : Promise.resolve();
    } else {
      return
    }
  },
  getPermissions: () => Promise.resolve(),
  getIdentity: () => {
    const token = window.localStorage.getItem("token");
    const profile = getProfileFromToken(token);

    return Promise.resolve({
      id: profile.sub,
      fullName: profile.name,
      avatar: profile.picture,
    });
  },
  handleCallback: async () => {
    //console.log("handling callback")
    // We came back from the issuer with ?code infos in query params
    const { searchParams } = new URL(`${window.location.href.replace('#', '/')}`);
    const redirect_uri = `${window.location.origin}/#/auth-callback`;
    //console.log(window.location.href)
    //console.log(searchParams)
    const code = searchParams.get("code");
    //console.log(code)
    const state = searchParams.get("state");

    // oidc-client uses localStorage to keep a temporary state
    // between the two redirections. But since we need to send it to the API
    // we have to retrieve it manually
    const stateKey = `oidc.${state}`;
    const { code_verifier } = JSON.parse(
      localStorage.getItem(stateKey) || "{}"
    );
    
    // Transform the code to a token via the API
    // This is the older web application way of doing token security - we need the secret on the server
    // Should investigate how to use the PKCE flow for the SPA side of things
    // https://github.com/ibm-cloud-security/appid-clientsdk-js/blob/master/src/utils.js#L40C3-L40C3
    console.log("fetching token")
    const response = await fetch(`/api/token`, {
      method: "POST",
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, code_verifier, redirect_uri }),
    });

    if (!response.ok) {
      cleanup();
      return Promise.reject();
    }

    const token = await response.json();

    localStorage.setItem("token", JSON.stringify(token));
    userManager.clearStaleState();
    cleanup();
    return Promise.resolve();
  },
};

export default authProvider;
