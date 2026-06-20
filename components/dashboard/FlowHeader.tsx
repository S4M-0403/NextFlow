"use client";

import { UserButton } from "@clerk/nextjs";

export default function FlowHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Flow</h1>
        <p className="mt-1 text-base text-slate-500">
          Build workflows or run models directly.
        </p>
      </div>

      <UserButton />
    </div>
  );
}
