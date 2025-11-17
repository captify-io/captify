'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@captify-io/base/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@captify-io/base/ui';
import { Badge } from '@captify-io/base/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function Demo() {
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
        <h1 className="text-3xl font-bold mb-2">@captify-io/ontology Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive demonstration of the ontology data model and operations
        </p>
      </div>

      {/* Package Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Package Information</CardTitle>
          <CardDescription>
            Ontology data model with server and client architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Server Exports:</h3>
              <ul className="space-y-1 text-sm">
                <li><Badge variant="secondary">ObjectType</Badge> - Entity type definitions</li>
                <li><Badge variant="secondary">LinkType</Badge> - Relationship definitions</li>
                <li><Badge variant="secondary">ActionType</Badge> - Action definitions</li>
                <li><Badge variant="secondary">OntologyEdge</Badge> - Edge instances</li>
                <li><Badge variant="secondary">operations</Badge> - Unified API (19 ops)</li>
                <li><Badge variant="secondary">security</Badge> - IL5 NIST Rev 5 compliance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client Exports:</h3>
              <ul className="space-y-1 text-sm">
                <li><Badge>useOntologyData</Badge> - Fetch data by node</li>
                <li><Badge>useOntologyNode</Badge> - Fetch single node</li>
                <li><Badge>useOntologyNodes</Badge> - Fetch multiple nodes</li>
              </ul>
              <h3 className="font-semibold mb-2 mt-4">Bundle Info:</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Package:</dt>
                  <dd className="font-mono">@captify-io/ontology</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Version:</dt>
                  <dd className="font-mono">1.0.0</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Server Bundle:</dt>
                  <dd className="font-mono">56.65 KB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Client Bundle:</dt>
                  <dd className="font-mono">8.21 KB</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demos */}
      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        {/* Tab 1: Architecture */}
        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client/Server Architecture</CardTitle>
              <CardDescription>
                Critical architectural pattern for all domain packages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Client-Side</CardTitle>
                    <CardDescription>Browser Components & Hooks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <Badge className="mb-2">Pattern</Badge>
                      <p className="text-muted-foreground">Use <code className="text-xs">apiClient</code> from @captify-io/base</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <pre className="text-xs">
{`import { apiClient } from 
  '@captify-io/base/lib/api';

const result = await apiClient.run({
  service: 'platform.dynamodb',
  operation: 'query',
  table: 'ontology-node',
  data: { /* params */ }
});`}
                      </pre>
                    </div>
                    <div className="mt-2">
                      <strong className="text-xs">Why:</strong>
                      <p className="text-xs text-muted-foreground">Cannot have AWS credentials in browser, must go through authenticated API</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Server-Side</CardTitle>
                    <CardDescription>Server Functions & Operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <Badge className="mb-2">Pattern</Badge>
                      <p className="text-muted-foreground">Use AWS SDK directly</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <pre className="text-xs">
{`import { DynamoDBClient } from 
  '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from 
  '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  credentials
});
const result = await dynamodb
  .query({ /* params */ });`}
                      </pre>
                    </div>
                    <div className="mt-2">
                      <strong className="text-xs">Why:</strong>
                      <p className="text-xs text-muted-foreground">Has credentials, can call AWS directly for better performance</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Architecture Rules ✓</CardTitle>
              <CardDescription>
                Package follows architectural guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Client uses <code className="text-xs">apiClient</code> for API calls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Server uses AWS SDK directly</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>No <code className="text-xs">@captify-io/captify</code> imports in package</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Proper client/server code separation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>TypeScript strict mode with zero errors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Optimized: No console.log, no <code className="text-xs">any</code> types</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>IL5 NIST Rev 5 security compliance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Operations */}
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>19 Unified Operations</CardTitle>
              <CardDescription>
                Complete CRUD and query operations for ontology data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic CRUD</h4>
                  <ul className="space-y-1 text-sm">
                    <li><code className="text-xs">createItem</code></li>
                    <li><code className="text-xs">getItem</code></li>
                    <li><code className="text-xs">updateItem</code></li>
                    <li><code className="text-xs">deleteItem</code></li>
                    <li><code className="text-xs">queryItems</code></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Edge Operations</h4>
                  <ul className="space-y-1 text-sm">
                    <li><code className="text-xs">addEdge</code></li>
                    <li><code className="text-xs">updateEdge</code></li>
                    <li><code className="text-xs">deleteEdge</code></li>
                    <li><code className="text-xs">getEdges</code></li>
                    <li><code className="text-xs">getIncomingEdges</code></li>
                    <li><code className="text-xs">getOutgoingEdges</code></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Advanced</h4>
                  <ul className="space-y-1 text-sm">
                    <li><code className="text-xs">batchCreate</code></li>
                    <li><code className="text-xs">searchItems</code></li>
                    <li><code className="text-xs">addAttachment</code></li>
                    <li><code className="text-xs">getAttachment</code></li>
                    <li><code className="text-xs">deleteAttachment</code></li>
                    <li><code className="text-xs">addTag</code></li>
                    <li><code className="text-xs">getByTags</code></li>
                    <li><code className="text-xs">generateSchema</code></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Types */}
        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Type Definitions</CardTitle>
              <CardDescription>
                TypeScript types for ontology entities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">ObjectType</h4>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  <pre>{`interface ObjectType {
  slug: string;
  app: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  properties: {
    [key: string]: PropertyDefinition;
  };
  status: 'active' | 'deprecated';
  version: number;
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">LinkType</h4>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  <pre>{`interface LinkType {
  slug: string;
  sourceType: string;
  targetType: string;
  cardinality: 'one-to-one' | 
               'one-to-many' | 
               'many-to-many';
  verb: string;
  reverseVerb?: string;
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">OntologyEdge</h4>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  <pre>{`interface OntologyEdge {
  id: string;
  sourceId: string;
  targetId: string;
  linkType: string;
  properties?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Usage */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
              <CardDescription>
                How to use ontology package in your code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Server-Side Usage</h4>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  <pre>{`import { 
  createObjectType, 
  getObjectType 
} from '@captify-io/ontology/server';

// Create a new object type
await createObjectType({
  slug: 'user',
  app: 'core',
  name: 'User',
  properties: {
    email: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string'
    }
  }
}, credentials);

// Get object type
const userType = await getObjectType(
  'user',
  credentials
);`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Client-Side Usage</h4>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  <pre>{`import { useOntologyData } from 
  '@captify-io/ontology/client';

function MyComponent() {
  const { data, loading, columns } =
    useOntologyData({
      ontologyNodeId: 'user',
      filters: { 
        status: 'active' 
      },
      limit: 10
    });

  if (loading) return <div>Loading...</div>;

  return (
    <table>
      {data.map(item => (
        <tr key={item.id}>
          <td>{item.name}</td>
        </tr>
      ))}
    </table>
  );
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Future enhancements and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Visualization components pending <code className="text-xs">@captify-io/flow</code> package</li>
                <li>• Add client component for ontology browser</li>
                <li>• Integrate with existing ontology tables</li>
                <li>• Add server actions for mutations</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
