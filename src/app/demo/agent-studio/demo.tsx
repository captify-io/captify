"use client";

import { useState } from 'react';
import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@captify-io/base/ui';
import { AgentStudioList, AgentStudioConfig, Agent } from '@captify-io/agent/client';
import { Bot, Settings, ListTree, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function AgentStudioDemo() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleAgentClick = (agentId: string) => {
    setSelectedAgentId(agentId);
    setActiveTab("config");
  };

  const handleBack = () => {
    setSelectedAgentId(null);
    setActiveTab("list");
  };

  const renderAgentDemo = (agent: any, config: any) => {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b p-4 bg-muted/30">
          <h3 className="font-semibold">Agent Preview</h3>
          <p className="text-sm text-muted-foreground">
            Live preview of agent with current configuration
          </p>
        </div>
        <div className="flex-1 p-6">
          <Agent
            mode="compact"
            defaultSettings={{
              agentId: agent.id,
              systemPrompt: config.systemPrompt,
              provider: config.providerId,
              model: config.modelId,
              temperature: config.temperature,
            }}
          />
        </div>
      </div>
    );
  };

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
        <h1 className="text-3xl font-bold mb-2">@captify/agent - Studio Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive demonstration of agent configuration and management capabilities
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Bot className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="list">
            <ListTree className="h-4 w-4 mr-2" />
            Agent List
          </TabsTrigger>
          <TabsTrigger value="config" disabled={!selectedAgentId}>
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Agent Studio Overview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What is Agent Studio?</h3>
                <p className="text-sm text-muted-foreground">
                  Agent Studio is a comprehensive management interface for configuring and managing AI agents
                  in the Captify platform. It provides a visual interface for setting up agent personalities,
                  selecting AI models, configuring tools, and managing capabilities.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Visual agent configuration with real-time preview</li>
                  <li>Provider and model selection (Bedrock, OpenAI, Anthropic)</li>
                  <li>Tool management - enable/disable tools for each agent</li>
                  <li>Temperature and parameter tuning</li>
                  <li>Memory configuration for context retention</li>
                  <li>Code interpreter and file search capabilities</li>
                  <li>System prompt customization</li>
                  <li>Agent status management (draft, published, archived)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Components</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-1">AgentStudioList</h4>
                    <p className="text-xs text-muted-foreground">
                      Grid view of all agents with statistics and quick access to configurations
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-1">AgentStudioConfig</h4>
                    <p className="text-xs text-muted-foreground">
                      Detailed configuration panel with live agent preview
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Usage</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`import { AgentStudioList, AgentStudioConfig } from '@captify/agent/client';

// List view
<AgentStudioList
  onAgentClick={(id) => console.log('Selected:', id)}
  onCreateClick={() => console.log('Create new agent')}
/>

// Configuration view
<AgentStudioConfig
  agentId="agent-id"
  onBack={() => console.log('Back to list')}
  renderAgentDemo={(agent, config) => <AgentPreview {...config} />}
/>`}
                </pre>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card className="p-0 overflow-hidden" style={{ height: '800px' }}>
            <AgentStudioList
              onAgentClick={handleAgentClick}
              onCreateClick={() => alert('Create new agent - this would navigate to agent builder')}
            />
          </Card>
        </TabsContent>

        <TabsContent value="config">
          {selectedAgentId ? (
            <Card className="p-0 overflow-hidden" style={{ height: '800px' }}>
              <AgentStudioConfig
                agentId={selectedAgentId}
                onBack={handleBack}
                renderAgentDemo={renderAgentDemo}
              />
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-muted-foreground">Select an agent from the list to configure</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card className="p-6 bg-muted/30">
        <h3 className="font-semibold mb-2">Integration with Ontology</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Agent Studio uses the ontology system to store and manage agent configurations. All agents, providers,
          models, and tools are stored as ontology object types with proper relationships.
        </p>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="border rounded p-3 bg-background">
            <div className="font-medium mb-1">Object Types</div>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• agent</li>
              <li>• provider</li>
              <li>• provider-model</li>
              <li>• tool</li>
            </ul>
          </div>
          <div className="border rounded p-3 bg-background">
            <div className="font-medium mb-1">Link Types</div>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• provider-model</li>
              <li>• agent-tool</li>
              <li>• tool-dependency</li>
            </ul>
          </div>
          <div className="border rounded p-3 bg-background">
            <div className="font-medium mb-1">Operations</div>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• listItems (agents, tools)</li>
              <li>• getItem (agent config)</li>
              <li>• updateItem (save config)</li>
              <li>• queryByEdge (models)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
