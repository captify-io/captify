import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@captify-io/base/ui';
import { Button } from '@captify-io/base/ui';

export default async function WorkflowPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workflows</h1>
        <p className="text-muted-foreground">
          Build and execute AI-powered workflows
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">My Workflows</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View and manage your workflows
          </p>
          <Button variant="outline" className="w-full">View Workflows</Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Create Workflow</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Build a new workflow from scratch
          </p>
          <Button className="w-full" asChild>
            <a href="/workflow/builder">New Workflow</a>
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">AI Patterns</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start from a pre-built pattern
          </p>
          <Button variant="outline" className="w-full" asChild>
            <a href="/workflow/patterns">Browse Patterns</a>
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">AI Workflow Patterns</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PatternCard
            name="Sequential"
            description="Linear step chains where each step feeds the next"
            icon="→"
          />
          <PatternCard
            name="Parallel"
            description="Concurrent execution of independent tasks"
            icon="⚡"
          />
          <PatternCard
            name="Routing"
            description="LLM-based intelligent routing between branches"
            icon="🔀"
          />
          <PatternCard
            name="Orchestrator"
            description="Master agent coordinating specialized workers"
            icon="🎯"
          />
          <PatternCard
            name="Evaluator"
            description="Iterative improvement with quality checks"
            icon="✓"
          />
        </div>
      </Card>
    </div>
  );
}

function PatternCard({ name, description, icon }: { name: string; description: string; icon: string }) {
  return (
    <Card className="p-4 hover:bg-accent cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{name}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
