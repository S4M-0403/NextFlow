"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface NewWorkflowButtonProps {
  onCreate: () => string;
}

export default function NewWorkflowButton({ onCreate }: NewWorkflowButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    const id = onCreate();
    router.push(`/workflow/${id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
    >
      <Plus className="h-4 w-4" />
      New Workflow
    </button>
  );
}
