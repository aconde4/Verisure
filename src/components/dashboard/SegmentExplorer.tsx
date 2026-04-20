"use client";

import { useDeferredValue, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDecimal, formatNumber, formatPercent } from "@/lib/format";
import type { GroupDimension, MetricRow } from "@/lib/metrics";

type SegmentExplorerProps = {
  dataByDimension: Record<GroupDimension, MetricRow[]>;
};

type SortKey = keyof Pick<
  MetricRow,
  | "label"
  | "customers"
  | "cancelCount"
  | "cancelRate"
  | "avgRecommendation"
  | "avgAlarmTriggers"
  | "onceAndDoneRate"
  | "avgMaintenances"
>;

const dimensionOptions: { label: string; value: GroupDimension }[] = [
  { label: "Customer type", value: "customerType" },
  { label: "NPS category", value: "npsCategory" },
  { label: "Alarm band", value: "alarmBand" },
  { label: "Once-and-done", value: "onceAndDone" },
];

export function SegmentExplorer({ dataByDimension }: SegmentExplorerProps) {
  const [groupBy, setGroupBy] = useState<GroupDimension>("alarmBand");
  const [sortKey, setSortKey] = useState<SortKey>("cancelRate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const visibleRows = dataByDimension[groupBy] ?? [];

  const filteredRows = [...visibleRows]
    .filter((row) => row.label.toLowerCase().includes(deferredQuery.trim().toLowerCase()))
    .sort((left, right) => {
      const first = left[sortKey];
      const second = right[sortKey];
      const direction = sortDirection === "asc" ? 1 : -1;

      if (typeof first === "string" && typeof second === "string") {
        return first.localeCompare(second) * direction;
      }

      return ((first as number) - (second as number)) * direction;
    });

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "label" ? "asc" : "desc");
  }

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Segments"
        title="Segment explorer"
        description="Compare aggregated segments on demand and sort the table by whichever retention signal matters most."
      />

      <Card className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {dimensionOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGroupBy(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  option.value === groupBy
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white/80 text-slate-700 hover:border-slate-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search segment"
            className="h-11 rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-teal-600"
          />
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Grouped by <span className="font-medium text-slate-900">{dimensionOptions.find((option) => option.value === groupBy)?.label}</span>. Sorting and search apply to the active segment view instantly.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  {[
                    ["label", "Segment"],
                    ["customers", "Customers"],
                    ["cancelCount", "Cancel count"],
                    ["cancelRate", "Cancel rate"],
                    ["avgRecommendation", "Avg recommendation"],
                    ["avgAlarmTriggers", "Avg alarm triggers"],
                    ["onceAndDoneRate", "Once-and-done rate"],
                    ["avgMaintenances", "Avg maintenances"],
                  ].map(([key, label]) => (
                    <th key={key} className="px-4 py-3 font-medium">
                      <button type="button" onClick={() => toggleSort(key as SortKey)} className="transition hover:text-slate-900">
                        {label}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70">
                {filteredRows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 font-medium text-slate-900">{row.label}</td>
                    <td className="px-4 py-3 text-slate-700">{formatNumber(row.customers)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatNumber(row.cancelCount)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatPercent(row.cancelRate)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatDecimal(row.avgRecommendation)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatDecimal(row.avgAlarmTriggers)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatPercent(row.onceAndDoneRate)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatDecimal(row.avgMaintenances)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
}
