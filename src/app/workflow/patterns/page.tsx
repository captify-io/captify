import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@captify-io/base/ui';
import { Button } from '@captify-io/base/ui';

export default async function WorkflowPatternsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const patterns = [
    {
      id: 'sequential',
      name: 'Sequential',
      description: 'Linear step chains where each step feeds the next',
      icon: '→',
      useCase: 'Content generation pipelines, data transformation',
      status: 'implemented',
    },
    {
      id: 'parallel',
      name: 'Parallel',
      description: 'Concurrent execution of independent tasks',
      icon: '⚡',
      useCase: 'Multi-document analysis, concurrent code reviews',
      status: 'implemented',
    },
    {
      id: 'routing',
      name: 'Routing',
      description: 'LLM-based intelligent routing between branches',
      icon: '🔀',
      useCase: 'Customer query classification, adaptive workflows',
      status: 'planned',
    },
    {
      id: 'orchestrator',
      name: 'Orchestrator',
      description: 'Master agent coordinating specialized workers',
      icon: '🎯',
      useCase: 'Complex task decomposition, multi-agent systems',
      status: 'planned',
    },
    {
      id: 'evaluator',
      name: 'Evaluator',
      description: 'Iterative improvement with quality checks',
      icon: '✓',
      useCase: 'Translation quality, content refinement',
      status: 'planned',
    },
  ];

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Workflow Patterns</h1>
        <p className="text-muted-foreground">
          Pre-built patterns based on AI SDK 6 best practices
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <Card key={pattern.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{pattern.icon}</div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  pattern.status === 'implemented'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {pattern.status}
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-2">{pattern.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{pattern.description}</p>

            <div className="mb-4">
              <p className="text-xs font-semibold mb-1">Use Case:</p>
              <p className="text-xs text-muted-foreground">{pattern.useCase}</p>
            </div>

            <Button
              variant={pattern.status === 'implemented' ? 'default' : 'outline'}
              className="w-full"
              disabled={pattern.status !== 'implemented'}
              asChild={pattern.status === 'implemented'}
            >
              {pattern.status === 'implemented' ? (
                <a href={`/workflow/builder?pattern=${pattern.id}`}>Use Pattern</a>
              ) : (
                <span>Coming Soon</span>
              )}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">About AI Workflow Patterns</h2>
        <div className="prose prose-sm max-w-none">
          <p>
            These patterns are based on Vercel AI SDK 6 best practices for building
            reliable AI agent workflows. Each pattern is optimized for specific use cases
            and can be customized to fit your needs.
          </p>
          <ul>
            <li>
              <strong>Sequential:</strong> Best for linear processes where each step depends
              on the previous one
            </li>
            <li>
              <strong>Parallel:</strong> Ideal for independent tasks that can run
              concurrently to save time
            </li>
            <li>
              <strong>Routing:</strong> Perfect for adaptive workflows that need to make
              decisions based on input
            </li>
            <li>
              <strong>Orchestrator:</strong> Great for complex tasks that benefit from
              specialized agents
            </li>
            <li>
              <strong>Evaluator:</strong> Essential for tasks requiring iterative
              improvement and quality control
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
