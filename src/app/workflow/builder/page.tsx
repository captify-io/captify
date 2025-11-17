import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { WorkflowBuilderClient } from './workflow-builder-client';

export default async function WorkflowBuilderPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return <WorkflowBuilderClient />;
}
