"use client";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatNumber, formatPercent } from "@/lib/format";
import type { MetricRow } from "@/lib/metrics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SatisfactionSectionProps = {
  npsMetrics: MetricRow[];
  scoreDistribution: MetricRow[];
  insight: string;
};

const npsColors: Record<string, string> = {
  Detractors: "#c5173f",
  Passives: "#ff6a86",
  Promoters: "#ff0a46",
};

export function SatisfactionSection({
  npsMetrics,
  scoreDistribution,
  insight,
}: SatisfactionSectionProps) {
  const scoreBars = scoreDistribution.map((row) => ({
    score: row.label,
    customers: row.customers,
    cancelRatePct: row.cancelRate * 100,
  }));

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Satisfaction"
        title="Satisfaction & churn"
        description="Explore how customer advocacy correlates with cancellation under the current selection."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">NPS category comparison</h3>
              <p className="text-sm text-slate-600">Customer volume and cancel rate by derived NPS category.</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npsMetrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4c8d2" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) {
                      return null;
                    }

                    const customersValue = payload.find((entry) => entry.dataKey === "customers")?.value;
                    const cancelRateValue = payload.find((entry) => entry.name === "cancelRatePct")?.value;
                    const customers = typeof customersValue === "number" ? customersValue : Number(customersValue ?? 0);
                    const cancelRate = typeof cancelRateValue === "number" ? cancelRateValue : Number(cancelRateValue ?? 0);

                    return (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                        <p className="text-sm font-semibold text-slate-900">{label}</p>
                        <p className="mt-1 text-sm text-slate-600">Customers: {formatNumber(customers)}</p>
                        <p className="text-sm text-slate-600">Cancel rate: {formatPercent(cancelRate / 100)}</p>
                      </div>
                    );
                  }}
                />
                <Bar yAxisId="left" dataKey="customers" radius={[12, 12, 0, 0]}>
                  {npsMetrics.map((entry) => (
                    <Cell key={entry.label} fill={npsColors[entry.label]} />
                  ))}
                  <LabelList dataKey="customers" position="top" formatter={(value) => formatNumber(Number(value ?? 0))} />
                </Bar>
                <Bar yAxisId="right" dataKey={(entry: MetricRow) => entry.cancelRate * 100} name="cancelRatePct" radius={[12, 12, 0, 0]} fill="#43141d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-950">Recommendation score distribution</h3>
            <p className="text-sm text-slate-600">Histogram of scores from 0 to 10 with cancellation intensity per score.</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBars}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4c8d2" />
                <XAxis dataKey="score" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) {
                      return null;
                    }

                    const customersValue = payload[0]?.value;
                    const customers = typeof customersValue === "number" ? customersValue : Number(customersValue ?? 0);

                    return (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                        <p className="text-sm font-semibold text-slate-900">Score {label}</p>
                        <p className="mt-1 text-sm text-slate-600">Customers: {formatNumber(customers)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="customers" fill="#ff0a46" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-l-[3px] border-l-[var(--accent)] p-5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Dynamic insight</span>
        <p className="mt-3 text-sm leading-6 text-slate-700">{insight}</p>
      </Card>
    </section>
  );
}
