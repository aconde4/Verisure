import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatNumber, formatPercent } from "@/lib/format";
import type { EnrichedCustomer } from "@/types/customer";

type Breakdown = {
  label: string;
  count: number;
  share: number;
};

type OverviewSectionProps = {
  customers: EnrichedCustomer[];
  composition: {
    customerType: Breakdown[];
    cancelled: Breakdown[];
    onceAndDone: Breakdown[];
  };
};

function CompositionCard({
  title,
  items,
}: {
  title: string;
  items: Breakdown[];
}) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      <div className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>{item.label}</span>
              <span>
                {formatNumber(item.count)} · {formatPercent(item.share)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-900"
                style={{ width: `${Math.max(item.share * 100, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function OverviewSection({ customers, composition }: OverviewSectionProps) {
  const cancelled = customers.filter((customer) => customer.isCancelled).length;
  const businessShare = composition.customerType.find((item) => item.label === "Business")?.share ?? 0;

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Overview"
        title="Portfolio view"
        description="A fast reading of the current slice before diving into the churn drivers."
      />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_repeat(3,1fr)]">
        <Card className="p-6">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Current slice</span>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {formatNumber(customers.length)} customers are visible under the active filters.
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
            This subset contains {formatNumber(cancelled)} cancellations and a {formatPercent(businessShare)} Business mix.
            Use the filters above to isolate cohorts and pressure-test the main churn patterns from different angles.
          </p>
        </Card>
        <CompositionCard title="Customer type split" items={composition.customerType} />
        <CompositionCard title="Cancelled split" items={composition.cancelled} />
        <CompositionCard title="Once-and-done split" items={composition.onceAndDone} />
      </div>
    </section>
  );
}
