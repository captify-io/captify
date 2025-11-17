import { auth } from '@/lib/auth';
import { Card } from '@captify-io/base/ui';
import { Demo } from './demo';

export default async function ServicesDemoPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">AWS Services Demo</h1>
          <p>Please sign in to view the demo.</p>
        </Card>
      </div>
    );
  }

  return <Demo />;
}
