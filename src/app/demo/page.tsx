import { auth } from '@/lib/auth';
import { Card } from '@captify-io/base/ui';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  FileText,
  GitBranch,
  Network,
  Briefcase,
  Package,
  Cloud,
} from 'lucide-react';

export default async function DemoHubPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Captify Demo Hub</h1>
          <p>Please sign in to view the demos.</p>
        </Card>
      </div>
    );
  }

  const demos = [
    {
      title: 'AI Agent',
      description:
        'AI Agent system with chat interface, thread management, and multi-provider support (Bedrock, OpenAI, Anthropic)',
      href: '/demo/agent',
      icon: Bot,
      features: [
        'Real-time streaming chat',
        'Thread management',
        'Multi-provider support',
        'Tool invocation',
      ],
      package: '@captify-io/agent',
      status: 'Production Ready',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    {
      title: 'Agent Studio',
      description:
        'Configure and manage AI agents with custom settings, model selection, and system prompts',
      href: '/demo/agent-studio',
      icon: Sparkles,
      features: [
        'Agent configuration',
        'Model selection',
        'System prompts',
        'Context management',
      ],
      package: '@captify-io/agent',
      status: 'Production Ready',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    {
      title: 'Fabric (Living Docs)',
      description:
        'Rich text editor with real-time collaboration, templates, and AI assistance powered by ProseMirror',
      href: '/demo/fabric',
      icon: FileText,
      features: [
        'Real-time collaboration',
        'Document templates',
        'Inline comments',
        'AI assistance',
      ],
      package: '@captify-io/fabric',
      status: 'Production Ready',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    {
      title: 'Flow Diagrams',
      description:
        'Interactive diagram builder with multiple node types, auto-layout, and visualization modes',
      href: '/demo/flow',
      icon: GitBranch,
      features: [
        'Multiple node types',
        'Auto-layout',
        'Drag and drop',
        'Export/Import',
      ],
      package: '@captify-io/flow',
      status: 'Production Ready',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    {
      title: 'Ontology',
      description:
        'Single source of truth for entity types, relationships, and operations with 36 total operations',
      href: '/demo/ontology',
      icon: Network,
      features: [
        'Entity type management',
        'Relationship mapping',
        'Schema validation',
        '36 operations',
      ],
      package: '@captify-io/ontology',
      status: 'Production Ready',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    {
      title: 'Workspace',
      description:
        'Issue tracking and project management with teams, projects, milestones, and sprints',
      href: '/demo/workspace',
      icon: Briefcase,
      features: [
        'Issue tracking',
        'Project management',
        'Team collaboration',
        'Sprint planning',
      ],
      package: '@captify-io/workspace',
      status: 'Production Ready',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    {
      title: 'UI Components',
      description:
        '40+ production-ready UI components built on Radix UI with full TypeScript support',
      href: '/demo/ui-components',
      icon: Package,
      features: [
        '40+ components',
        'Radix UI base',
        'Dark mode support',
        'Fully accessible',
      ],
      package: '@captify-io/base',
      status: 'Coming Soon',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    },
    {
      title: 'AWS Services',
      description:
        '15+ integrated AWS services including DynamoDB, S3, Cognito, Bedrock, and more',
      href: '/demo/services',
      icon: Cloud,
      features: [
        'DynamoDB operations',
        'S3 file storage',
        'Cognito auth',
        'Bedrock AI',
      ],
      package: '@captify-io/base',
      status: 'Coming Soon',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    },
  ];

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Captify Platform Demo Hub</h1>
        <p className="text-lg text-muted-foreground">
          Explore all the features and capabilities of the Captify platform through interactive
          demonstrations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demos.map((demo) => {
          const Icon = demo.icon;
          return (
            <Link key={demo.href} href={demo.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-semibold">{demo.title}</h2>
                      <span className={`text-xs px-2 py-1 rounded-full ${demo.statusColor}`}>
                        {demo.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{demo.package}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{demo.description}</p>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Key Features:</h3>
                  <ul className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                    {demo.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-1">
                        <span className="text-primary">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="p-6 bg-muted/50">
        <h2 className="text-xl font-semibold mb-3">About These Demos</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Each demo showcases a different aspect of the Captify platform, from AI-powered agents
            to collaborative document editing and project management.
          </p>
          <p>
            All demos are fully interactive and use live data from the platform. You can explore
            features, test functionality, and see how different components work together.
          </p>
          <p className="font-semibold text-foreground mt-4">
            Click any card above to explore a demo →
          </p>
        </div>
      </Card>
    </div>
  );
}
