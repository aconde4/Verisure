import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

type DynamicInsightsProps = {
  insights: string[];
};

export function DynamicInsights({ insights }: DynamicInsightsProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Insights"
        title="Dynamic insights"
        description="Rule-based observations generated directly from the filtered dataset instead of hardcoded conclusions."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => (
          <Card key={insight} className="p-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Insight {index + 1}
            </span>
            <p className="mt-3 text-sm leading-6 text-slate-700">{insight}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
