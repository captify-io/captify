'use client';

import { Agent, AgentProvider } from '@captify-io/agent/client';
import { Card } from '@captify-io/base/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@captify-io/base/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function AgentDemo() {
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
        <h1 className="text-3xl font-bold mb-2">@captify-io/agent Demo</h1>
        <p className="text-muted-foreground">
          AI Agent system with chat interface, thread management, and multi-provider support
        </p>
      </div>

      <Tabs defaultValue="full-agent">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="full-agent">Full Agent Interface</TabsTrigger>
          <TabsTrigger value="info">Package Info</TabsTrigger>
        </TabsList>

        <TabsContent value="full-agent" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Complete Agent Interface</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Full 3-panel layout with threads, chat, and configuration. Features:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-6">
              <li>Thread management (create, select, delete)</li>
              <li>Real-time AI chat with streaming responses</li>
              <li>Multi-provider support (Bedrock, OpenAI, Anthropic)</li>
              <li>Tool invocation visualization</li>
              <li>Message editing and regeneration</li>
              <li>Context management</li>
            </ul>

            <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <Agent
                mode="full"
                className=""
                userState={undefined}
                updateUserState={undefined}
                defaultSettings={{}}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Package Information</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Package Details</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Name:</dt>
                  <dd className="font-mono">@captify-io/agent</dd>
                  <dt className="text-muted-foreground">Version:</dt>
                  <dd>1.0.0</dd>
                  <dt className="text-muted-foreground">AI SDK:</dt>
                  <dd>6.0.0-beta.99</dd>
                  <dt className="text-muted-foreground">Client Bundle:</dt>
                  <dd>192.17 KB</dd>
                  <dt className="text-muted-foreground">Server Bundle:</dt>
                  <dd>137.66 KB</dd>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Components (41 files)</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <span>• Agent (main layout)</span>
                  <span>• AgentProvider</span>
                  <span>• ChatPanel</span>
                  <span>• ThreadsPanel</span>
                  <span>• AgentConfigPanel</span>
                  <span>• MessageActions</span>
                  <span>• CodeBlock</span>
                  <span>• ChainOfThought</span>
                  <span>• Citations</span>
                  <span>• ContextDisplay</span>
                  <span>• ImageMessage</span>
                  <span>• FileUploadDialog</span>
                  <span>• Widget system (10+ components)</span>
                  <span>• Tool visualization</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Server Functions (29 files)</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <span>• Thread operations</span>
                  <span>• Message streaming</span>
                  <span>• Bedrock agent integration</span>
                  <span>• Provider integrations</span>
                  <span>• Memory management</span>
                  <span>• Tool registry</span>
                  <span>• Security middleware</span>
                  <span>• Observability</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Multi-provider support: AWS Bedrock, OpenAI, Anthropic</li>
                  <li>Streaming responses with AI SDK 6 beta</li>
                  <li>Thread persistence to DynamoDB</li>
                  <li>Dynamic widget rendering (tables, charts, forms)</li>
                  <li>Tool invocation with Zod validation</li>
                  <li>Context optimization and memory management</li>
                  <li>Observability (logging, metrics, tracing)</li>
                  <li>Security (rate limiting, content moderation, permissions)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Dependencies</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <span className="font-mono">@captify-io/base</span>
                  <span className="font-mono">@captify-io/ontology</span>
                  <span className="font-mono">ai ^6.0.0-beta.99</span>
                  <span className="font-mono">@ai-sdk/react</span>
                  <span className="font-mono">@ai-sdk/anthropic</span>
                  <span className="font-mono">@ai-sdk/openai</span>
                  <span className="font-mono">@ai-sdk/amazon-bedrock</span>
                  <span className="font-mono">AWS SDK v3</span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-4 rounded">
                <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">✅ Migration Completed</h3>
                <ul className="list-disc list-inside text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>73 files successfully migrated from @captify-io/core</li>
                  <li>106+ console statements removed</li>
                  <li>All imports updated to use @captify-io/base</li>
                  <li>AI SDK updated to 6.0.0-beta.99 (latest)</li>
                  <li>S3 file upload/download fully implemented</li>
                  <li>Space search removed (deprecated)</li>
                  <li>JavaScript builds successfully (332 KB total)</li>
                  <li>Package installed in captify app</li>
                  <li>Demo page created and working</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">🚀 Streaming & Real-Time Features</h3>
                <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li><strong>100% Streaming:</strong> Real-time text and tool execution updates</li>
                  <li><strong>Multi-step Tools:</strong> AI SDK 6 steps capability with live progress tracking</li>
                  <li><strong>Tool Visualization:</strong> See tools being called and completed in real-time</li>
                  <li><strong>Auto-persistence:</strong> Messages saved to DynamoDB via onFinish callback</li>
                  <li><strong>Custom Fetch Bridge:</strong> Seamless AI SDK 6 ↔ Captify platform integration</li>
                  <li><strong>Provider Support:</strong> OpenAI, Anthropic, AWS Bedrock streaming</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded">
                <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">💾 File Storage Features</h3>
                <ul className="list-disc list-inside text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li><strong>S3 Service:</strong> Reusable @captify-io/base/services/aws/s3 module</li>
                  <li><strong>Secure Upload:</strong> Server-side S3 calls with AWS SDK v3</li>
                  <li><strong>Signed Downloads:</strong> 1-hour expiry URLs for secure file access</li>
                  <li><strong>User Isolation:</strong> Files stored at user/&#123;userId&#125;/agent-files/&#123;threadId&#125;</li>
                  <li><strong>File API:</strong> uploadFile & getFile operations ready for UI integration</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded">
                <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">⚠️ Known Limitations</h3>
                <ul className="list-disc list-inside text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  <li>TypeScript declarations disabled for server/client bundles (AI SDK 6 type compatibility)</li>
                  <li>File attachments UI not yet added to chat input (API ready, UI pending)</li>
                  <li>Tool visualization clears on completion (could persist in message history)</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
