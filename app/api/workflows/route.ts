import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import demoWorkflow from "@/lib/workflow/demo-workflow.json";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workflows = await prisma.workflow.findMany({
    where: { userId },
    orderBy: {
      updatedAt: "desc",
    },
  });
    

  return NextResponse.json(workflows);
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const workflow = await prisma.workflow.upsert({
    where: {
      workflowId: body.workflowId,
    },
    update: {
      nodes: body.nodes,
      edges: body.edges,
      runHistory: body.runHistory,
      recentNodeTypes: body.recentNodeTypes,
    },
    create: {
      userId,
      workflowId: body.workflowId,
      nodes: body.nodes,
      edges: body.edges,
      runHistory: body.runHistory,
      recentNodeTypes: body.recentNodeTypes,
    },
  });

  return NextResponse.json(workflow);
}