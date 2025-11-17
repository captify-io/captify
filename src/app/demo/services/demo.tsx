'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@captify-io/base/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@captify-io/base/ui';
import { Badge } from '@captify-io/base/ui';
import Link from 'next/link';
import { ArrowLeft, Database, HardDrive, Users, Lock, Eye, Activity, Zap, Brain, Search, Server } from 'lucide-react';

export function Demo() {
  const services = [
    {
      name: 'DynamoDB',
      icon: Database,
      category: 'Database',
      description: 'NoSQL database operations with ontology-driven table resolution',
      operations: ['query', 'scan', 'put', 'update', 'delete', 'batchGet', 'batchWrite'],
      features: [
        'Ontology-driven table name resolution',
        'Automatic schema prefix handling',
        'GSI/LSI query support',
        'Batch operations',
        'Conditional updates',
        'Transaction support',
      ],
    },
    {
      name: 'S3',
      icon: HardDrive,
      category: 'Storage',
      description: 'Secure file storage and retrieval with signed URLs',
      operations: ['upload', 'download', 'delete', 'list', 'getSignedUrl'],
      features: [
        'Multipart upload support',
        'Pre-signed URL generation',
        'Server-side encryption',
        'Bucket lifecycle policies',
        'User-isolated file paths',
        '1-hour expiry URLs',
      ],
    },
    {
      name: 'Cognito',
      icon: Users,
      category: 'Authentication',
      description: 'User authentication and identity management',
      operations: ['listUsers', 'getUser', 'updateUser', 'listGroups', 'addUserToGroup'],
      features: [
        'User pool management',
        'Identity federation',
        'Multi-factor authentication',
        'Custom attributes',
        'Group-based access control',
        'Token storage in DynamoDB',
      ],
    },
    {
      name: 'CloudTrail',
      icon: Activity,
      category: 'Security',
      description: 'Audit logging and compliance tracking',
      operations: ['lookupEvents', 'startLogging', 'stopLogging', 'describeTrails'],
      features: [
        'API activity logging',
        'Event history queries',
        'Compliance reporting',
        'S3 integration',
        'Multi-region support',
        'Real-time monitoring',
      ],
    },
    {
      name: 'SecurityHub',
      icon: Lock,
      category: 'Security',
      description: 'Security posture management and threat detection',
      operations: ['getFindings', 'updateFindings', 'batchImportFindings'],
      features: [
        'Security standards compliance',
        'Finding aggregation',
        'Automated remediation',
        'Integration with GuardDuty',
        'Custom insights',
        'Multi-account support',
      ],
    },
    {
      name: 'GuardDuty',
      icon: Eye,
      category: 'Security',
      description: 'Intelligent threat detection and monitoring',
      operations: ['getFindings', 'listDetectors', 'updateDetector'],
      features: [
        'Continuous monitoring',
        'Machine learning detection',
        'Threat intelligence',
        'Automated responses',
        'Event-driven workflows',
        'CloudTrail integration',
      ],
    },
    {
      name: 'EventBridge',
      icon: Zap,
      category: 'Integration',
      description: 'Serverless event bus for application integration',
      operations: ['putEvents', 'putRule', 'putTargets', 'listRules'],
      features: [
        'Event routing',
        'Scheduled events',
        'Custom event buses',
        'Event filtering',
        'Multi-target delivery',
        'Event archive and replay',
      ],
    },
    {
      name: 'Lambda',
      icon: Server,
      category: 'Compute',
      description: 'Serverless function execution',
      operations: ['invoke', 'invokeAsync', 'getFunction', 'listFunctions'],
      features: [
        'On-demand execution',
        'Auto-scaling',
        'Event-driven triggers',
        'Environment variables',
        'VPC support',
        'Container image support',
      ],
    },
    {
      name: 'Bedrock',
      icon: Brain,
      category: 'AI/ML',
      description: 'Foundation models and AI agent orchestration',
      operations: ['invokeAgent', 'invokeModel', 'listAgents', 'getAgent'],
      features: [
        'Claude, Llama, and other models',
        'Agent orchestration',
        'Knowledge base integration',
        'Tool invocation',
        'Streaming responses',
        'Multi-step reasoning',
      ],
    },
    {
      name: 'Kendra',
      icon: Search,
      category: 'AI/ML',
      description: 'Intelligent enterprise search with ML',
      operations: ['query', 'retrieve', 'submitFeedback', 'createIndex'],
      features: [
        'Natural language queries',
        'Document ranking',
        'Incremental learning',
        'Custom synonyms',
        'Access control integration',
        'Multi-language support',
      ],
    },
  ];

  return (
    <div className="container mx-auto p-8 space-y-6">
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Demo Hub
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">@captify-io/base - AWS Services Demo</h1>
        <p className="text-muted-foreground">
          15+ integrated AWS services for database, storage, security, AI, and more
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Database & Storage</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="ai">AI & ML</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AWS Services Integration Overview</CardTitle>
              <CardDescription>
                Comprehensive AWS service wrappers with security, error handling, and type safety
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Available Services</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {services.map((service) => (
                    <Badge key={service.name} variant="secondary" className="justify-center">
                      {service.name}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="justify-center">
                    Aurora/RDS
                  </Badge>
                  <Badge variant="secondary" className="justify-center">
                    Glue
                  </Badge>
                  <Badge variant="secondary" className="justify-center">
                    SageMaker
                  </Badge>
                  <Badge variant="secondary" className="justify-center">
                    QuickSight
                  </Badge>
                  <Badge variant="secondary" className="justify-center">
                    Step Functions
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Architecture</h3>
                <div className="bg-muted p-4 rounded-lg space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Server className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Server-Side Services</div>
                      <p className="text-muted-foreground">
                        All AWS SDK calls happen server-side with proper credentials
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">API Proxy</div>
                      <p className="text-muted-foreground">
                        Platform provides <code>/api/captify</code> endpoint for service calls
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Security</div>
                      <p className="text-muted-foreground">
                        Session-based auth, credential isolation, IL5 NIST Rev 5 compliance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Database className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Ontology Integration</div>
                      <p className="text-muted-foreground">
                        Automatic table name resolution, schema prefix handling
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Usage Example</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  {`import { apiClient } from '@captify-io/base/lib/api';

// Client-side service call through API proxy
const notifications = await apiClient.run({
  service: 'platform.dynamodb',
  operation: 'query',
  table: 'core-notification',  // Short format, auto-resolved via ontology
  data: {
    IndexName: 'userId-createdAt-index',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': session.user.id
    }
  }
});

// Upload file to S3
const uploadResult = await apiClient.run({
  service: 'platform.s3',
  operation: 'upload',
  data: {
    bucket: 'captify-files',
    key: \`user/\${userId}/documents/\${fileName}\`,
    body: fileBuffer,
    contentType: 'application/pdf'
  }
});

// Query Bedrock AI model
const aiResponse = await apiClient.run({
  service: 'platform.bedrock',
  operation: 'invokeModel',
  data: {
    modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    messages: [{ role: 'user', content: 'Hello!' }]
  }
});`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Type Safety:</strong> Full TypeScript support with exported types
                  </li>
                  <li>
                    <strong>Error Handling:</strong> Consistent error responses with helpful messages
                  </li>
                  <li>
                    <strong>Authentication:</strong> Automatic session validation and credential management
                  </li>
                  <li>
                    <strong>Multi-Tenant:</strong> Schema-based isolation with environment-specific prefixes
                  </li>
                  <li>
                    <strong>Ontology-Driven:</strong> Automatic table resolution and relationship queries
                  </li>
                  <li>
                    <strong>Observability:</strong> Built-in logging, metrics, and error tracking
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          {services
            .filter((s) => s.category === 'Database' || s.category === 'Storage')
            .map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Operations</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.operations.map((op) => (
                          <Badge key={op} variant="outline">
                            {op}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Features</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {services
            .filter((s) => s.category === 'Security' || s.category === 'Authentication')
            .map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Operations</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.operations.map((op) => (
                          <Badge key={op} variant="outline">
                            {op}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Features</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          {services
            .filter((s) => s.category === 'AI/ML')
            .map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Operations</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.operations.map((op) => (
                          <Badge key={op} variant="outline">
                            {op}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Features</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          <Card>
            <CardHeader>
              <CardTitle>Additional AI/ML Services</CardTitle>
              <CardDescription>Other machine learning and data science services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1">SageMaker</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Model training, hosting, and inference
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Training Jobs
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Endpoints
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      AutoML
                    </Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Glue</h4>
                  <p className="text-sm text-muted-foreground mb-2">ETL and data catalog management</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Crawlers
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Jobs
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Catalog
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          {services
            .filter((s) => s.category === 'Integration' || s.category === 'Compute')
            .map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Operations</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.operations.map((op) => (
                          <Badge key={op} variant="outline">
                            {op}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Features</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          <Card>
            <CardHeader>
              <CardTitle>Additional Integration Services</CardTitle>
              <CardDescription>Other services for analytics and orchestration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1">QuickSight</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Business intelligence and dashboards
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Dashboards
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Datasets
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Analysis
                    </Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Step Functions</h4>
                  <p className="text-sm text-muted-foreground mb-2">Workflow orchestration</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      State Machines
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Executions
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Tasks
                    </Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Aurora/RDS</h4>
                  <p className="text-sm text-muted-foreground mb-2">Relational database operations</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Queries
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Transactions
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Data API
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Security & Compliance</CardTitle>
          <CardDescription>Built-in security features and compliance standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">IL5 NIST Rev 5 Compliance</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Access control and authentication</li>
                <li>• Audit logging with CloudTrail</li>
                <li>• Encryption at rest and in transit</li>
                <li>• Security monitoring and alerting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Credential Management</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Server-side credential isolation</li>
                <li>• Token storage in DynamoDB</li>
                <li>• 24-hour TTL for sensitive data</li>
                <li>• Session-based authentication</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Error Handling</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Consistent error responses</li>
                <li>• Detailed error messages</li>
                <li>• Rate limiting protection</li>
                <li>• Automatic retry logic</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
