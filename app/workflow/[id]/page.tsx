import WorkflowBuilder from "@/components/workflow/WorkflowBuilder";

interface WorkflowPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = await params;

  return <WorkflowBuilder workflowId={id} />;
}
