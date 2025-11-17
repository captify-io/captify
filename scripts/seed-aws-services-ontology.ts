#!/usr/bin/env tsx
/**
 * Seed AWS Services Ontology
 *
 * Creates ontology object types and link types for AWS services and their operations.
 * This provides a queryable blueprint of all available AWS services that users can
 * access based on their permissions.
 *
 * Usage:
 *   npx tsx scripts/seed-aws-services-ontology.ts
 *   AWS_REGION="us-east-1" AWS_ACCESS_KEY_ID="..." AWS_SECRET_ACCESS_KEY="..." npx tsx scripts/seed-aws-services-ontology.ts
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'us-east-1';
const SCHEMA = process.env.SCHEMA || 'captify';

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
};

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION, credentials })
);

/**
 * AWS Service Object Types
 */
const awsServiceObjectTypes = [
  // 1. AWS Service (Parent type)
  {
    slug: 'aws-service',
    name: 'AWS Service',
    type: 'aws-service',
    category: 'aws',
    domain: 'Cloud Services',
    description: 'An AWS cloud service available in the platform',
    icon: 'Cloud',
    color: '#FF9900', // AWS orange
    status: 'active',
    app: 'core',
    properties: {
      dataSource: 'aws-service',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier (slug)' },
          slug: { type: 'string', description: 'Service slug (e.g., dynamodb, s3)', required: true },
          name: { type: 'string', description: 'Service name (e.g., DynamoDB, S3)', required: true },
          serviceName: { type: 'string', description: 'AWS SDK service name', required: true },
          description: { type: 'string', description: 'Service description' },
          provider: { type: 'string', description: 'Cloud provider (AWS)', required: true },
          version: { type: 'string', description: 'Implementation version' },
          category: {
            type: 'string',
            enum: ['database', 'storage', 'compute', 'ai', 'monitoring', 'security', 'analytics', 'integration'],
            description: 'Service category'
          },
          sdkPackage: { type: 'string', description: 'NPM package name (e.g., @aws-sdk/client-dynamodb)' },
          status: {
            type: 'string',
            enum: ['active', 'beta', 'deprecated'],
            description: 'Service status',
            required: true
          },
          icon: { type: 'string', description: 'Icon name (Lucide)' },
          color: { type: 'string', description: 'Brand color (hex)' },
          documentation: { type: 'string', description: 'AWS documentation URL' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'slug', 'name', 'serviceName', 'provider', 'status']
      },
      indexes: {
        'provider-index': { hashKey: 'provider', type: 'GSI' },
        'category-index': { hashKey: 'category', type: 'GSI' },
        'status-index': { hashKey: 'status', type: 'GSI' }
      }
    }
  },

  // 2. AWS Service Operation
  {
    slug: 'aws-service-operation',
    name: 'AWS Service Operation',
    type: 'aws-service-operation',
    category: 'aws',
    domain: 'Cloud Services',
    description: 'An operation available for an AWS service',
    icon: 'Zap',
    color: '#FF9900',
    status: 'active',
    app: 'core',
    properties: {
      dataSource: 'aws-service-operation',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier (serviceSlug-operationName)' },
          serviceSlug: { type: 'string', description: 'Parent service slug', required: true },
          operationName: { type: 'string', description: 'Operation name (e.g., query, put, upload)', required: true },
          description: { type: 'string', description: 'Operation description' },
          category: {
            type: 'string',
            enum: ['read', 'write', 'delete', 'list', 'manage', 'execute'],
            description: 'Operation category'
          },
          requiresData: { type: 'boolean', description: 'Whether operation requires data parameter' },
          requiredParams: {
            type: 'array',
            items: { type: 'string' },
            description: 'Required parameters (e.g., table, key, bucket)'
          },
          status: {
            type: 'string',
            enum: ['active', 'beta', 'deprecated'],
            description: 'Operation status',
            required: true
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'serviceSlug', 'operationName', 'status']
      },
      indexes: {
        'serviceSlug-index': { hashKey: 'serviceSlug', type: 'GSI' },
        'category-index': { hashKey: 'category', type: 'GSI' },
        'status-index': { hashKey: 'status', type: 'GSI' }
      }
    }
  }
];

/**
 * AWS Services with their operations
 */
const awsServices = [
  // 1. DynamoDB
  {
    slug: 'dynamodb',
    name: 'DynamoDB',
    serviceName: 'dynamodb',
    provider: 'AWS',
    version: '1.0.0',
    category: 'database',
    description: 'AWS DynamoDB service for NoSQL database operations',
    sdkPackage: '@aws-sdk/client-dynamodb',
    icon: 'Database',
    color: '#527FFF',
    documentation: 'https://docs.aws.amazon.com/dynamodb/',
    status: 'active',
    operations: [
      { name: 'query', category: 'read', description: 'Query items by partition key' },
      { name: 'scan', category: 'read', description: 'Scan all items in table' },
      { name: 'get', category: 'read', description: 'Get single item by key' },
      { name: 'batchGet', category: 'read', description: 'Get multiple items by keys' },
      { name: 'put', category: 'write', description: 'Put item in table' },
      { name: 'update', category: 'write', description: 'Update existing item' },
      { name: 'delete', category: 'delete', description: 'Delete item by key' },
      { name: 'batchWrite', category: 'write', description: 'Batch put/delete items' },
      { name: 'transactWrite', category: 'write', description: 'Transaction write operations' },
      { name: 'transactGet', category: 'read', description: 'Transaction get operations' },
      { name: 'describeTable', category: 'manage', description: 'Get table metadata' },
      { name: 'listTables', category: 'list', description: 'List all tables' },
      { name: 'createTable', category: 'manage', description: 'Create new table' },
      { name: 'deleteTable', category: 'delete', description: 'Delete table' },
      { name: 'updateTable', category: 'manage', description: 'Update table configuration' },
      { name: 'conditionalPut', category: 'write', description: 'Conditional put operation' },
      { name: 'conditionalUpdate', category: 'write', description: 'Conditional update operation' },
      { name: 'conditionalDelete', category: 'delete', description: 'Conditional delete operation' }
    ]
  },

  // 2. S3
  {
    slug: 's3',
    name: 'S3',
    serviceName: 's3',
    provider: 'AWS',
    version: '1.0.0',
    category: 'storage',
    description: 'AWS S3 service for object storage',
    sdkPackage: '@aws-sdk/client-s3',
    icon: 'HardDrive',
    color: '#569A31',
    documentation: 'https://docs.aws.amazon.com/s3/',
    status: 'active',
    operations: [
      { name: 'getObject', category: 'read', description: 'Get object from bucket' },
      { name: 'putObject', category: 'write', description: 'Put object to bucket' },
      { name: 'deleteObject', category: 'delete', description: 'Delete object from bucket' },
      { name: 'listObjects', category: 'list', description: 'List objects in bucket' },
      { name: 'copyObject', category: 'write', description: 'Copy object within/between buckets' },
      { name: 'headObject', category: 'read', description: 'Get object metadata' },
      { name: 'getPresignedUrl', category: 'read', description: 'Generate presigned download URL' },
      { name: 'putPresignedUrl', category: 'write', description: 'Generate presigned upload URL' },
      { name: 'createMultipartUpload', category: 'write', description: 'Start multipart upload' },
      { name: 'uploadPart', category: 'write', description: 'Upload part of multipart upload' },
      { name: 'completeMultipartUpload', category: 'write', description: 'Complete multipart upload' },
      { name: 'abortMultipartUpload', category: 'write', description: 'Abort multipart upload' },
      { name: 'listBuckets', category: 'list', description: 'List all buckets' },
      { name: 'createBucket', category: 'manage', description: 'Create new bucket' },
      { name: 'deleteBucket', category: 'delete', description: 'Delete bucket' },
      { name: 'getBucketPolicy', category: 'read', description: 'Get bucket policy' },
      { name: 'putBucketPolicy', category: 'write', description: 'Update bucket policy' },
      { name: 'batchDelete', category: 'delete', description: 'Delete multiple objects' }
    ]
  },

  // 3. Cognito
  {
    slug: 'cognito',
    name: 'Cognito',
    serviceName: 'cognito',
    provider: 'AWS',
    version: '1.0.0',
    category: 'security',
    description: 'AWS Cognito service for user authentication and management',
    sdkPackage: '@aws-sdk/client-cognito-identity-provider',
    icon: 'Shield',
    color: '#DD344C',
    documentation: 'https://docs.aws.amazon.com/cognito/',
    status: 'active',
    operations: [
      { name: 'listUsers', category: 'list', description: 'List users in user pool' },
      { name: 'getUser', category: 'read', description: 'Get user details' },
      { name: 'createUser', category: 'write', description: 'Create new user' },
      { name: 'updateUser', category: 'write', description: 'Update user attributes' },
      { name: 'deleteUser', category: 'delete', description: 'Delete user' },
      { name: 'enableUser', category: 'manage', description: 'Enable user account' },
      { name: 'disableUser', category: 'manage', description: 'Disable user account' },
      { name: 'resetUserPassword', category: 'manage', description: 'Reset user password' },
      { name: 'listGroups', category: 'list', description: 'List groups in user pool' },
      { name: 'createGroup', category: 'write', description: 'Create new group' },
      { name: 'deleteGroup', category: 'delete', description: 'Delete group' },
      { name: 'addUserToGroup', category: 'write', description: 'Add user to group' },
      { name: 'removeUserFromGroup', category: 'write', description: 'Remove user from group' },
      { name: 'listUsersInGroup', category: 'list', description: 'List users in group' },
      { name: 'getUserGroups', category: 'read', description: 'Get groups for user' },
      { name: 'initiateAuth', category: 'execute', description: 'Initiate authentication' },
      { name: 'respondToAuthChallenge', category: 'execute', description: 'Respond to auth challenge' },
      { name: 'globalSignOut', category: 'execute', description: 'Sign out user globally' },
      { name: 'describeUserPool', category: 'read', description: 'Get user pool details' },
      { name: 'listUserPools', category: 'list', description: 'List user pools' },
      { name: 'setUserMFAPreference', category: 'write', description: 'Set MFA preference' },
      { name: 'getUserMFAPreference', category: 'read', description: 'Get MFA preference' }
    ]
  },

  // 4. Bedrock
  {
    slug: 'bedrock',
    name: 'Bedrock',
    serviceName: 'bedrock',
    provider: 'AWS',
    version: '1.0.0',
    category: 'ai',
    description: 'AWS Bedrock service for AI agent and knowledge base operations',
    sdkPackage: '@aws-sdk/client-bedrock-agent-runtime',
    icon: 'Brain',
    color: '#FF9900',
    documentation: 'https://docs.aws.amazon.com/bedrock/',
    status: 'active',
    operations: [
      { name: 'invokeAgent', category: 'execute', description: 'Invoke Bedrock agent' },
      { name: 'retrieve', category: 'read', description: 'Retrieve from knowledge base' },
      { name: 'retrieveAndGenerate', category: 'execute', description: 'Retrieve and generate response' }
    ]
  },

  // 5. Agent (Custom Service)
  {
    slug: 'agent',
    name: 'Agent',
    serviceName: 'agent',
    provider: 'AWS',
    version: '1.0.0',
    category: 'ai',
    description: 'Custom agent service for AI thread and message management',
    sdkPackage: '@captify-io/base',
    icon: 'Bot',
    color: '#8B5CF6',
    documentation: 'https://captify.io/docs/agent',
    status: 'active',
    operations: [
      { name: 'getThreads', category: 'list', description: 'List agent threads' },
      { name: 'getThread', category: 'read', description: 'Get thread details' },
      { name: 'createThread', category: 'write', description: 'Create new thread' },
      { name: 'updateThread', category: 'write', description: 'Update thread' },
      { name: 'deleteThread', category: 'delete', description: 'Delete thread' },
      { name: 'sendMessage', category: 'execute', description: 'Send message to agent' },
      { name: 'streamMessage', category: 'execute', description: 'Stream message to agent' },
      { name: 'getMessages', category: 'list', description: 'Get thread messages' },
      { name: 'listAgents', category: 'list', description: 'List available agents' },
      { name: 'getAgent', category: 'read', description: 'Get agent details' },
      { name: 'createAgent', category: 'write', description: 'Create new agent' },
      { name: 'updateAgent', category: 'write', description: 'Update agent' },
      { name: 'deleteAgent', category: 'delete', description: 'Delete agent' }
    ]
  },

  // 6. CloudWatch
  {
    slug: 'cloudwatch',
    name: 'CloudWatch',
    serviceName: 'cloudwatch',
    provider: 'AWS',
    version: '1.0.0',
    category: 'monitoring',
    description: 'AWS CloudWatch service for metrics and monitoring',
    sdkPackage: '@aws-sdk/client-cloudwatch',
    icon: 'Activity',
    color: '#FF4F8B',
    documentation: 'https://docs.aws.amazon.com/cloudwatch/',
    status: 'active',
    operations: [
      { name: 'putMetricData', category: 'write', description: 'Put metric data' },
      { name: 'getMetricData', category: 'read', description: 'Get metric data' },
      { name: 'getMetricStatistics', category: 'read', description: 'Get metric statistics' },
      { name: 'listMetrics', category: 'list', description: 'List available metrics' },
      { name: 'putMetricAlarm', category: 'write', description: 'Create/update alarm' },
      { name: 'deleteAlarms', category: 'delete', description: 'Delete alarms' },
      { name: 'describeAlarms', category: 'read', description: 'Describe alarms' },
      { name: 'describeAlarmsForMetric', category: 'read', description: 'Get alarms for metric' },
      { name: 'setAlarmState', category: 'write', description: 'Set alarm state' },
      { name: 'putDashboard', category: 'write', description: 'Create/update dashboard' },
      { name: 'getDashboard', category: 'read', description: 'Get dashboard' },
      { name: 'listDashboards', category: 'list', description: 'List dashboards' },
      { name: 'deleteDashboards', category: 'delete', description: 'Delete dashboards' }
    ]
  },

  // 7. CloudWatch Logs
  {
    slug: 'cloudwatch-logs',
    name: 'CloudWatch Logs',
    serviceName: 'cloudwatchLogs',
    provider: 'AWS',
    version: '1.0.0',
    category: 'monitoring',
    description: 'AWS CloudWatch Logs service for log management',
    sdkPackage: '@aws-sdk/client-cloudwatch-logs',
    icon: 'FileText',
    color: '#FF4F8B',
    documentation: 'https://docs.aws.amazon.com/cloudwatch/logs/',
    status: 'active',
    operations: [
      { name: 'createLogGroup', category: 'write', description: 'Create log group' },
      { name: 'deleteLogGroup', category: 'delete', description: 'Delete log group' },
      { name: 'describeLogGroups', category: 'read', description: 'Describe log groups' },
      { name: 'createLogStream', category: 'write', description: 'Create log stream' },
      { name: 'deleteLogStream', category: 'delete', description: 'Delete log stream' },
      { name: 'describeLogStreams', category: 'read', description: 'Describe log streams' },
      { name: 'putLogEvents', category: 'write', description: 'Put log events' },
      { name: 'getLogEvents', category: 'read', description: 'Get log events' },
      { name: 'filterLogEvents', category: 'read', description: 'Filter log events' },
      { name: 'putSubscriptionFilter', category: 'write', description: 'Create subscription filter' },
      { name: 'deleteSubscriptionFilter', category: 'delete', description: 'Delete subscription filter' },
      { name: 'describeSubscriptionFilters', category: 'read', description: 'Describe subscription filters' }
    ]
  },

  // 8. Aurora (NEW)
  {
    slug: 'aurora',
    name: 'Aurora',
    serviceName: 'aurora',
    provider: 'AWS',
    version: '1.0.0',
    category: 'database',
    description: 'AWS Aurora (RDS) service for relational database operations',
    sdkPackage: '@aws-sdk/client-rds',
    icon: 'Database',
    color: '#527FFF',
    documentation: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/',
    status: 'active',
    operations: [
      { name: 'describeDBClusters', category: 'read', description: 'Describe DB clusters' },
      { name: 'createDBCluster', category: 'write', description: 'Create DB cluster' },
      { name: 'modifyDBCluster', category: 'write', description: 'Modify DB cluster' },
      { name: 'deleteDBCluster', category: 'delete', description: 'Delete DB cluster' },
      { name: 'startDBCluster', category: 'manage', description: 'Start DB cluster' },
      { name: 'stopDBCluster', category: 'manage', description: 'Stop DB cluster' },
      { name: 'failoverDBCluster', category: 'manage', description: 'Failover DB cluster' },
      { name: 'describeDBInstances', category: 'read', description: 'Describe DB instances' },
      { name: 'createDBInstance', category: 'write', description: 'Create DB instance' },
      { name: 'modifyDBInstance', category: 'write', description: 'Modify DB instance' },
      { name: 'deleteDBInstance', category: 'delete', description: 'Delete DB instance' },
      { name: 'rebootDBInstance', category: 'manage', description: 'Reboot DB instance' },
      { name: 'createDBClusterSnapshot', category: 'write', description: 'Create cluster snapshot' },
      { name: 'deleteDBClusterSnapshot', category: 'delete', description: 'Delete cluster snapshot' },
      { name: 'describeDBClusterSnapshots', category: 'read', description: 'Describe cluster snapshots' },
      { name: 'restoreDBClusterFromSnapshot', category: 'write', description: 'Restore from snapshot' },
      { name: 'describeDBClusterEndpoints', category: 'read', description: 'Describe cluster endpoints' },
      { name: 'createDBClusterEndpoint', category: 'write', description: 'Create cluster endpoint' },
      { name: 'modifyDBClusterEndpoint', category: 'write', description: 'Modify cluster endpoint' },
      { name: 'deleteDBClusterEndpoint', category: 'delete', description: 'Delete cluster endpoint' },
      { name: 'executeStatement', category: 'execute', description: 'Execute SQL statement (Data API)' },
      { name: 'batchExecuteStatement', category: 'execute', description: 'Batch execute SQL (Data API)' },
      { name: 'beginTransaction', category: 'execute', description: 'Begin transaction (Data API)' },
      { name: 'commitTransaction', category: 'execute', description: 'Commit transaction (Data API)' },
      { name: 'rollbackTransaction', category: 'execute', description: 'Rollback transaction (Data API)' },
      { name: 'describeDBClusterParameters', category: 'read', description: 'Describe cluster parameters' },
      { name: 'modifyDBClusterParameterGroup', category: 'write', description: 'Modify parameter group' },
      { name: 'listTagsForResource', category: 'read', description: 'List resource tags' },
      { name: 'addTagsToResource', category: 'write', description: 'Add tags to resource' },
      { name: 'removeTagsFromResource', category: 'delete', description: 'Remove tags from resource' }
    ]
  }
];

/**
 * AWS Service Link Types
 */
const awsServiceLinkTypes = [
  {
    slug: 'aws-service-has-operation',
    name: 'AWS Service Has Operation',
    description: 'An AWS service provides multiple operations',
    sourceObjectType: 'aws-service',
    targetObjectType: 'aws-service-operation',
    cardinality: 'ONE_TO_MANY',
    bidirectional: true,
    inverseName: 'Operation Belongs To Service',
    foreignKey: 'serviceSlug',
    status: 'active'
  }
];

/**
 * Seed Object Types
 */
async function seedObjectTypes(): Promise<{ created: number; skipped: number }> {
  console.log('📦 Seeding AWS Service Object Types...\n');

  const tableName = `${SCHEMA}-ontology-object-type`;
  console.log(`Checking existing types in ${tableName}...`);

  const scanResult = await client.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': 'aws',
      },
    })
  );

  const existingTypes = new Set((scanResult.Items || []).map((item: any) => item.slug));
  console.log(`Found ${existingTypes.size} existing AWS types\n`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const objectType of awsServiceObjectTypes) {
    if (existingTypes.has(objectType.slug)) {
      console.log(`⏭️  Skipping ${objectType.slug} (already exists)`);
      skippedCount++;
      continue;
    }

    console.log(`✨ Creating ${objectType.slug}...`);

    await client.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          ...objectType,
          id: objectType.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );

    createdCount++;
  }

  return { created: createdCount, skipped: skippedCount };
}

/**
 * Seed Link Types
 */
async function seedLinkTypes(): Promise<{ created: number; skipped: number }> {
  console.log('\n🔗 Seeding AWS Service Link Types...\n');

  const tableName = `${SCHEMA}-ontology-link-type`;
  console.log(`Checking existing link types in ${tableName}...`);

  const scanResult = await client.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: 'contains(slug, :prefix)',
      ExpressionAttributeValues: {
        ':prefix': 'aws-service',
      },
    })
  );

  const existingLinks = new Set((scanResult.Items || []).map((item: any) => item.slug));
  console.log(`Found ${existingLinks.size} existing AWS link types\n`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const linkType of awsServiceLinkTypes) {
    if (existingLinks.has(linkType.slug)) {
      console.log(`⏭️  Skipping ${linkType.slug} (already exists)`);
      skippedCount++;
      continue;
    }

    console.log(`✨ Creating ${linkType.slug}...`);

    await client.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          ...linkType,
          id: linkType.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );

    createdCount++;
  }

  return { created: createdCount, skipped: skippedCount };
}

/**
 * Seed AWS Services and Operations
 */
async function seedServices(): Promise<{ servicesCreated: number; operationsCreated: number; skipped: number }> {
  console.log('\n☁️  Seeding AWS Services and Operations...\n');

  const serviceTableName = `${SCHEMA}-core-aws-service`;
  const operationTableName = `${SCHEMA}-core-aws-service-operation`;

  console.log(`Checking existing services in ${serviceTableName}...`);

  // Check existing services
  let existingServices: Set<string>;
  try {
    const scanResult = await client.send(
      new ScanCommand({
        TableName: serviceTableName,
      })
    );
    existingServices = new Set((scanResult.Items || []).map((item: any) => item.slug));
  } catch (error) {
    console.log(`⚠️  Table ${serviceTableName} doesn't exist yet. Will skip service data seeding.`);
    console.log(`   Create tables first with CloudFormation or AWS Console.`);
    return { servicesCreated: 0, operationsCreated: 0, skipped: awsServices.length };
  }

  console.log(`Found ${existingServices.size} existing services\n`);

  let servicesCreated = 0;
  let operationsCreated = 0;
  let skipped = 0;

  for (const service of awsServices) {
    if (existingServices.has(service.slug)) {
      console.log(`⏭️  Skipping service ${service.slug} (already exists)`);
      skipped++;
      continue;
    }

    console.log(`✨ Creating service: ${service.name} (${service.slug})`);

    // Create service
    const { operations, ...serviceData } = service;
    await client.send(
      new PutCommand({
        TableName: serviceTableName,
        Item: {
          ...serviceData,
          id: service.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );
    servicesCreated++;

    // Create operations
    console.log(`   Creating ${operations.length} operations...`);
    for (const operation of operations) {
      const operationId = `${service.slug}-${operation.name}`;
      await client.send(
        new PutCommand({
          TableName: operationTableName,
          Item: {
            id: operationId,
            serviceSlug: service.slug,
            operationName: operation.name,
            description: operation.description,
            category: operation.category,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        })
      );
      operationsCreated++;
    }
  }

  return { servicesCreated, operationsCreated, skipped };
}

/**
 * Main execution
 */
async function main() {
  console.log('🌱 Seeding AWS Services Ontology\n');
  console.log(`Schema: ${SCHEMA}`);
  console.log(`Region: ${REGION}\n`);

  // Seed object types
  const objectTypeStats = await seedObjectTypes();

  // Seed link types
  const linkTypeStats = await seedLinkTypes();

  // Seed services and operations
  const serviceStats = await seedServices();

  // Summary
  console.log(`\n✅ Complete!\n`);
  console.log(`📦 Object Types:`);
  console.log(`   Created: ${objectTypeStats.created}`);
  console.log(`   Skipped: ${objectTypeStats.skipped} (already exist)`);

  console.log(`\n🔗 Link Types:`);
  console.log(`   Created: ${linkTypeStats.created}`);
  console.log(`   Skipped: ${linkTypeStats.skipped} (already exist)`);

  console.log(`\n☁️  AWS Services:`);
  console.log(`   Services Created: ${serviceStats.servicesCreated}`);
  console.log(`   Operations Created: ${serviceStats.operationsCreated}`);
  console.log(`   Skipped: ${serviceStats.skipped} (already exist)`);

  if (serviceStats.servicesCreated === 0 && serviceStats.skipped === 0) {
    console.log(`\n⚠️  Service data was NOT seeded because tables don't exist yet.`);
    console.log(`\n📋 Required DynamoDB Tables:`);
    console.log(`   1. ${SCHEMA}-core-aws-service`);
    console.log(`      PK: id (string)`);
    console.log(`      GSIs: provider-index, category-index, status-index`);
    console.log(`\n   2. ${SCHEMA}-core-aws-service-operation`);
    console.log(`      PK: id (string)`);
    console.log(`      GSIs: serviceSlug-index, category-index, status-index`);
    console.log(`\n   Create these tables first, then run this script again.`);
  } else {
    console.log(`\n📊 Summary:`);
    console.log(`   - ${awsServices.length} AWS services defined`);
    console.log(`   - ${awsServices.reduce((sum, s) => sum + s.operations.length, 0)} operations total`);
    console.log(`   - Services are queryable via ontology API`);
    console.log(`   - User permissions can be managed per service/operation`);
  }
}

// Run
main().catch(console.error);
