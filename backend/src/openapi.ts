export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "ComplyPilot API",
    version: "0.1.0"
  },
  servers: [{ url: "http://localhost:4000" }],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  name: { type: "string" },
                  organizationName: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" }, "400": { description: "Validation error" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" }, "401": { description: "Invalid credentials" } }
      }
    },
    "/auth/oauth": {
      post: {
        summary: "OAuth login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["provider", "idToken"],
                properties: {
                  provider: { type: "string", enum: ["google", "microsoft"] },
                  idToken: { type: "string", minLength: 10 },
                  organizationName: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" }, "401": { description: "Invalid OAuth token" } }
      }
    },
    "/organizations": { post: { summary: "Create org", responses: { "200": { description: "OK" } } } },
    "/assets": { get: { summary: "List assets" }, post: { summary: "Create asset" } },
    "/risks": { get: { summary: "List risks" }, post: { summary: "Create risk" } },
    "/controls": { get: { summary: "List controls" } },
    "/policies": { get: { summary: "List policies" }, post: { summary: "Create policy" } },
    "/evidence": { post: { summary: "Upload evidence" } },
    "/audits": { get: { summary: "List audits" }, post: { summary: "Create audit" } },
    "/dashboard": { get: { summary: "Dashboard metrics" } },
    "/badges": { get: { summary: "List badges" } },
    "/ai/assist": { post: { summary: "AI assistant" } }
  }
};
