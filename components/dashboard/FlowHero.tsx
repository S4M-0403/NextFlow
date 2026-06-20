import { Zap } from "lucide-react";
import FlowHeroAuthButtons from "./FlowHeroAuthButtons";

export default function FlowHero() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
        <Zap className="h-3.5 w-3.5" />
        All-in-One AI Platform
      </div>

      <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        Build AI workflows, run models instantly
      </h2>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
        Connect AI models into powerful automated workflows. Text, image, video,
        audio — all in one place with no code required.
      </p>

      <FlowHeroAuthButtons />
    </section>
  );
}
