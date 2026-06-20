"use client";

import { ArrowRight, LogIn } from "lucide-react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

export default function FlowHeroAuthButtons() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <SignInButton mode="redirect">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <LogIn className="h-4 w-4" />
          Sign in to get started
        </button>
      </SignInButton>

      <SignUpButton mode="redirect">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Create free account
          <ArrowRight className="h-4 w-4" />
        </button>
      </SignUpButton>
    </div>
  );
}
