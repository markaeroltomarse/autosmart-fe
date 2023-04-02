import * as auth0 from "auth0-js";

export const Auth0Client = new auth0.WebAuth({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "",
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "",
  audience: process.env.NEXT_PUBLIC_AUTH0_IDENTIFIER || "",
});
