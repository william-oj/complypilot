import { jwtVerify, createRemoteJWKSet } from "jose";

const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const microsoftJwks = createRemoteJWKSet(new URL("https://login.microsoftonline.com/common/discovery/v2.0/keys"));

export type OAuthProvider = "google" | "microsoft";

export async function verifyIdToken(provider: OAuthProvider, idToken: string, audience?: string) {
  const jwks = provider === "google" ? googleJwks : microsoftJwks;
  const { payload } = await jwtVerify(idToken, jwks, audience ? { audience } : undefined);
  return payload;
}
