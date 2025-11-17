import { NextRequest } from "next/server";
import { getAwsCredentialsFromIdentityPool } from "@/lib/credentials";
import { auth, refreshAccessToken } from "@/lib/auth";
import { getStoredTokens, storeTokensSecurely } from "@captify-io/base/lib/auth-store";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);

  const headers = {
    "Content-Type": "application/json",
  };

  try {

    // Get request body
    const body = await request.json();
    const externalApp = request.headers.get("x-app");

    const { app, service, operation, data } = body;

    // Debug logging
    const fs = require('fs');
    fs.appendFileSync('/tmp/api-requests.log', `[${new Date().toISOString()}] Request: app=${app}, service=${service}, operation=${operation}\n`);

    // Log full body for streamMessage operations
    if (operation === 'streamMessage') {
      fs.appendFileSync('/tmp/stream-requests.log', `[${new Date().toISOString()}] StreamMessage Body: ${JSON.stringify(body, null, 2)}\n`);
    }

    // Validate required parameters
    if (!app) {
      return new Response(
        JSON.stringify({
          error: "app parameter is required",
          expectedFormat: "{ app: 'base' | 'ontology' | 'flow' | 'workspace' | 'agent', service?: string, operation: string }",
          receivedRequest: { ...body, identityPoolId: body.identityPoolId ? "[REDACTED]" : undefined }
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    if (!operation) {
      return new Response(
        JSON.stringify({
          error: "operation parameter is required",
          receivedRequest: { app, service, identityPoolId: body.identityPoolId ? "[REDACTED]" : undefined }
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    // For base app, service parameter is required
    if (app === 'base' && !service) {
      return new Response(
        JSON.stringify({
          error: "service parameter is required for base app",
          expectedFormat: "{ app: 'base', service: 'dynamodb' | 's3' | 'bedrock' | 'agent', operation: string }",
          receivedRequest: { app, operation }
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    try {
      let session;
      try {
        session = await auth();
      } catch (authError) {
        throw authError;
      }
      if (!session?.user) {
        return new Response(
          JSON.stringify({
            error: "Not authenticated. Please log in.",
            app: externalApp,
            suggestion: externalApp
              ? "External app must forward valid NextAuth session cookies or tokens"
              : "Please log in to the application"
          }),
          {
            status: 401,
            headers,
          }
        );
      }

      // Check for token refresh error
      if ((session as any).error === "RefreshAccessTokenError") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Token refresh failed",
            code: "TOKEN_REFRESH_ERROR",
            message: "Your session has expired. Please sign in again.",
          }),
          {
            status: 401,
            headers,
          }
        );
      }

      // Get tokens from DynamoDB storage using sessionId
      const sessionId = (session as any).sessionId;

      if (!sessionId) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Session ID not found",
            code: "NO_SESSION_ID",
            message: "Your session is invalid. Please sign in again.",
          }),
          {
            status: 401,
            headers,
          }
        );
      }

      // Retrieve stored tokens from DynamoDB
      let storedTokens = await getStoredTokens(sessionId);

      if (!storedTokens) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Stored tokens not found",
            code: "NO_STORED_TOKENS",
            message: "Your session tokens have expired. Please sign in again.",
          }),
          {
            status: 401,
            headers,
          }
        );
      }

      // Check if tokens are expired or close to expiring
      const now = Date.now() / 1000;
      const refreshBuffer = 600; // 10 minutes buffer for API calls (less than JWT callback's 30 min)

      if (storedTokens.expiresAt <= now + refreshBuffer && storedTokens.refreshToken) {
        // Tokens are expired or about to expire, refresh them
        try {
          const refreshedTokens = await refreshAccessToken(storedTokens.refreshToken);

          // Update stored tokens
          const newExpiresAt = Math.floor(Date.now() / 1000) + (refreshedTokens.expires_in || 3600);
          await storeTokensSecurely(sessionId, {
            accessToken: refreshedTokens.access_token,
            idToken: refreshedTokens.id_token,
            refreshToken: refreshedTokens.refresh_token || storedTokens.refreshToken,
            expiresAt: newExpiresAt,
          });

          // Get the refreshed tokens
          storedTokens = await getStoredTokens(sessionId);
          if (!storedTokens) {
            throw new Error("Failed to retrieve refreshed tokens");
          }
        } catch (refreshError) {
          // Token refresh failed, return 401
          return new Response(
            JSON.stringify({
              success: false,
              error: "Token refresh failed",
              code: "TOKEN_REFRESH_FAILED",
              message: "Your session has expired. Please sign in again.",
            }),
            {
              status: 401,
              headers,
            }
          );
        }
      }

      const idToken = storedTokens.idToken;
      const accessToken = storedTokens.accessToken;

      // Get AWS credentials for the service
      let credentials;

      try {
        // Use Identity Pool from request body if provided, otherwise use default
        // Always default to COGNITO_IDENTITY_POOL_ID if no identityPoolId is provided
        const identityPoolId = body.identityPoolId || process.env.COGNITO_IDENTITY_POOL_ID;
        // Force refresh when switching to default pool to avoid cached credentials from other pools
        const forceRefresh = body.forceRefresh === true || !body.identityPoolId;


        // Create session object with tokens for credential exchange
        const sessionWithTokens = {
          ...session,
          idToken: idToken,
          accessToken: accessToken,
        };

        credentials = await getAwsCredentialsFromIdentityPool(
          idToken,
          identityPoolId
        );
      } catch (credentialError: any) {

        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to get AWS credentials",
            details: credentialError.message,
            app: externalApp,
            identityPoolUsed: body.identityPoolId || process.env.COGNITO_IDENTITY_POOL_ID,
          }),
          {
            status: 401,
            headers,
          }
        );
      }

      // Get service handler using dynamic imports
      let serviceModule;

      try {
        if (app === 'base') {
          // Base package: AWS services (multi-service)
          const awsServices = await import('@captify-io/base/services/aws');
          serviceModule = (awsServices as any)[service!];

          if (!serviceModule) {
            // Get available services for error message
            const availableServices = Object.keys(awsServices).filter(k => k !== 'default').join(', ');
            throw new Error(
              `Service '${service}' not found in base package. ` +
              `Available services: ${availableServices}`
            );
          }
        } else if (app === 'ontology') {
          // Ontology service from base package (like AWS services)
          const baseServices = await import('@captify-io/base/services');
          serviceModule = (baseServices as any).ontology;

          if (!serviceModule) {
            throw new Error(
              `Ontology service not found in base package. ` +
              `Make sure @captify-io/base/services exports ontology.`
            );
          }
        } else {
          // Other apps: single-service packages (flow, workspace, agent, etc.)
          const servicePath = `@captify-io/${app}/server`;
          try {
            serviceModule = await import(servicePath);
            // Handle default export
            if (serviceModule.default && typeof serviceModule.default.execute === 'function') {
              serviceModule = serviceModule.default;
            }
          } catch (importError) {
            throw new Error(
              `Failed to load service from ${servicePath}. ` +
              `Error: ${importError instanceof Error ? importError.message : 'Unknown error'}`
            );
          }
        }

        // Verify execute function exists
        if (typeof serviceModule.execute !== 'function') {
          throw new Error(
            `Service ${app === 'base' ? `'${service}' from base` : `'${app}'`} does not have an execute method`
          );
        }

      } catch (importError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Failed to load service`,
            details: importError instanceof Error ? importError.message : "Unknown import error",
            app: app,
            service: service,
            externalApp: externalApp,
          }),
          {
            status: 404,
            headers,
          }
        );
      }

      // Create a session object for the service with all auth fields
      const apiSession = {
        user: {
          id: session.user?.id || '',
          userId: session.user?.id || '',
          email: session.user?.email,
          name: session.user?.name,
          groups: (session as any).groups,
          isAdmin: (session as any).groups?.includes('Admins'),
          tenantId: (session.user as any)?.tenantId,
          // Security attributes from Cognito
          organizationId: (session as any).organizationId,
          clearanceLevel: (session as any).clearanceLevel || 'UNCLASSIFIED',
          markings: (session as any).markings || [],
          sciCompartments: (session as any).sciCompartments || [],
          needToKnow: (session as any).needToKnow || false,
          employeeId: (session as any).employeeId,
        },
        idToken: idToken, // From DynamoDB storage
        accessToken: accessToken, // From DynamoDB storage
        groups: (session as any).groups,
        isAdmin: (session as any).groups?.includes('Admins'),
        // Security context at session level
        organizationId: (session as any).organizationId,
        clearanceLevel: (session as any).clearanceLevel || 'UNCLASSIFIED',
        markings: (session as any).markings || [],
        sciCompartments: (session as any).sciCompartments || [],
        needToKnow: (session as any).needToKnow || false,
      };

      // Pass both request and credentials to the service
      // Add schema to the request body
      // AI SDK sends id and messages at root level - keep them there
      const processedBody = {
        ...body,
        schema: process.env.SCHEMA || "captify",
      };

      const result = await serviceModule.execute(
        processedBody,
        credentials,
        apiSession
      );

      // Handle streaming response (AI SDK returns Response directly for streamMessage)
      if (result instanceof Response) {
        console.log('[API] Returning direct stream Response');
        return result;
      }

      // Normal JSON response
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to execute service`,
          details: error instanceof Error ? error.message : "Unknown error",
          app: app,
          service: service,
          operation: operation,
          externalApp: externalApp,
        }),
        {
          status: 500,
          headers,
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error",
      requestId,
    }), {
      status: 500,
      headers,
    });
  }
}
