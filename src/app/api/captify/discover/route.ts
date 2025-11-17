import { NextRequest, NextResponse } from "next/server";
import { getAwsCredentialsFromIdentityPool } from "@/lib/credentials";
import { auth } from "@/lib/auth";
import { getStoredTokens } from "@captify-io/base/lib/auth-store";

interface ServiceManifest {
  app: string;
  service?: string;
  name: string;
  version: string;
  description?: string;
  category?: string;
  operations: string[];
}

/**
 * Service Discovery API
 * GET /api/captify/discover
 *
 * Queries the ontology for all registered services and their operations.
 * This is the single source of truth for available services.
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Not authenticated",
          message: "Please log in to access service discovery",
        },
        { status: 401 }
      );
    }

    // Get AWS credentials
    const sessionId = (session as any).sessionId;
    const storedTokens = await getStoredTokens(sessionId);

    if (!storedTokens) {
      return NextResponse.json(
        {
          error: "Session tokens not found",
          message: "Please sign in again",
        },
        { status: 401 }
      );
    }

    const credentials = await getAwsCredentialsFromIdentityPool(
      storedTokens.idToken,
      process.env.COGNITO_IDENTITY_POOL_ID!
    );

    // Import DynamoDB service for querying ontology
    const { dynamodb } = await import('@captify-io/base/services/aws');

    const schema = process.env.SCHEMA || 'captify';

    // Query all services from app-service table
    const servicesResult = await dynamodb.execute(
      {
        operation: 'scan',
        table: 'app-service',
        schema: schema,
        data: {
          FilterExpression: '#status = :active',
          ExpressionAttributeNames: {
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':active': 'active',
          },
        },
      },
      credentials
    );

    if (!servicesResult.success) {
      throw new Error(`Failed to query services: ${servicesResult.error}`);
    }

    const services: ServiceManifest[] = [];

    // For each service, get its operations
    for (const service of (servicesResult.data?.Items || [])) {
      const operationsResult = await dynamodb.execute(
        {
          operation: 'query',
          table: 'app-service-operation',
          schema: schema,
          data: {
            IndexName: 'serviceId-index',
            KeyConditionExpression: 'serviceId = :serviceId',
            FilterExpression: '#status = :active',
            ExpressionAttributeNames: {
              '#status': 'status',
            },
            ExpressionAttributeValues: {
              ':serviceId': service.id,
              ':active': 'active',
            },
          },
        },
        credentials
      );

      const operations = operationsResult.success
        ? (operationsResult.data?.Items || []).map((op: any) => op.operationName)
        : [];

      services.push({
        app: service.app || 'base',
        service: service.slug,
        name: service.name,
        version: service.version || '1.0.0',
        description: service.description,
        category: service.category,
        operations: operations.sort(),
      });
    }

    // Sort services by app, then service name
    services.sort((a, b) => {
      if (a.app !== b.app) {
        return a.app.localeCompare(b.app);
      }
      if (a.service && b.service) {
        return a.service.localeCompare(b.service);
      }
      return 0;
    });

    return NextResponse.json(
      {
        services,
        schema: schema,
        version: '2.0.0',
        source: 'ontology',
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error('[Discovery] Error:', error);

    return NextResponse.json(
      {
        error: "Failed to retrieve service discovery information",
        details: error instanceof Error ? error.message : "Unknown error",
        services: [], // Return empty array on error
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}