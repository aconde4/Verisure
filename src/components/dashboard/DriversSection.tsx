"use client";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDecimal, formatNumber, formatPercent } from "@/lib/format";
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

type DriversSectionProps = {
  alarmMetrics: MetricRow[];
  onceAndDoneMetrics: MetricRow[];
  insight: string;
};

export function DriversSection({
  alarmMetrics,
  onceAndDoneMetrics,
  insight,
}: DriversSectionProps) {
  const highestBand = [...alarmMetrics]
    .filter((row) => row.customers > 0)
    .sort((left, right) => right.cancelRate - left.cancelRate)[0];

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Operations"
        title="Operational drivers"
        description="Pressure-test how friction, alarm intensity, and first-time resolution relate to churn."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Card className="p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-950">Cancel rate by alarm band</h3>
            <p className="text-sm text-slate-600">Alarm intensity bands are derived directly from the row-level dataset.</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alarmMetrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4c8d2" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) {
                      return null;
                    }

                    const cancelRateValue = payload[0]?.value;
                    const cancelRate = typeof cancelRateValue === "number" ? cancelRateValue : Number(cancelRateValue ?? 0);
                    const customers = alarmMetrics.find((row) => row.label === label)?.customers ?? 0;

                    return (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                        <p className="text-sm font-semibold text-slate-900">{label} alarms</p>
                        <p className="mt-1 text-sm text-slate-600">Cancel rate: {formatPercent(cancelRate / 100)}</p>
                        <p className="text-sm text-slate-600">Customers: {formatNumber(customers)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey={(entry: MetricRow) => entry.cancelRate * 100} name="cancelRatePct" radius={[12, 12, 0, 0]}>
                  {alarmMetrics.map((entry) => {
                    const isHighlight = highestBand && entry.label === highestBand.label;
                    return <Cell key={entry.label} fill={isHighlight ? "#c5173f" : "#ff6a86"} />;
                  })}
                  <LabelList dataKey={(entry: MetricRow) => `${formatPercent(entry.cancelRate, 0)}`} position="top" formatter={(value) => String(value ?? "")} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {highestBand ? (
            <div className="mt-4 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
              <span className="font-semibold uppercase tracking-[0.18em]">Highest churn risk</span>
              <p className="mt-2">
                {highestBand.label} alarms is the steepest risk band in the current slice, with {formatPercent(highestBand.cancelRate)} cancellations across {formatNumber(highestBand.customers)} customers.
              </p>
            </div>
          ) : null}
        </Card>

        <div className="grid gap-4">
          <Card className="p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-950">Recommendation and once-and-done by alarm band</h3>
              <p className="text-sm text-slate-600">Use this to see whether higher friction is also eroding satisfaction and first-time resolution.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Alarm band</th>
                    <th className="px-4 py-3 font-medium">Avg recommendation</th>
                    <th className="px-4 py-3 font-medium">Once-and-done rate</th>
                    <th className="px-4 py-3 font-medium">Customers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/70">
                  {alarmMetrics.map((row) => (
                    <tr key={row.label}>
                      <td className="px-4 py-3 font-medium text-slate-900">{row.label}</td>
                      <td className="px-4 py-3 text-slate-700">{formatDecimal(row.avgRecommendation)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatPercent(row.onceAndDoneRate)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatNumber(row.customers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-950">Once-and-done impact</h3>
              <p className="text-sm text-slate-600">A compact comparison of retention, satisfaction, and friction by resolution status.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {onceAndDoneMetrics.map((row) => (
                <div key={row.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-950">{row.label}</h4>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {formatNumber(row.customers)} customers
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Cancel rate</dt>
                      <dd className="font-medium text-slate-900">{formatPercent(row.cancelRate)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Avg recommendation</dt>
                      <dd className="font-medium text-slate-900">{formatDecimal(row.avgRecommendation)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Avg alarm triggers</dt>
                      <dd className="font-medium text-slate-900">{formatDecimal(row.avgAlarmTriggers)}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-l-[3px] border-l-[var(--accent)] p-5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Dynamic insight</span>
        <p className="mt-3 text-sm leading-6 text-slate-700">{insight}</p>
      </Card>
    </section>
  );
}
