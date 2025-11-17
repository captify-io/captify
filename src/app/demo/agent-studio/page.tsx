import { auth } from '@/lib/auth';
import { Card } from '@captify-io/base/ui';
import { AgentStudioDemo } from './demo';

export const metadata = {
  title: 'Agent Studio Demo',
  description: 'Comprehensive demonstration of agent configuration and management',
};

export default async function AgentStudioDemoPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Agent Studio Demo</h1>
          <p>Please sign in to view the demo.</p>
        </Card>
      </div>
    );
  }

  return <AgentStudioDemo />;
}
