"use client";

import { Card } from "@/components/ui/Card";
import {
  alarmBandOptions,
  customerTypeOptions,
  npsCategoryOptions,
  type FilterState,
  yesNoOptions,
} from "@/lib/filters";

type FilterBarProps = {
  filters: FilterState;
  filteredCount: number;
  totalCount: number;
  onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="flex min-w-[150px] flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-[var(--ink-strong)] outline-none transition focus:border-[var(--accent)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ filters, filteredCount, totalCount, onChange, onReset }: FilterBarProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Global filters</h2>
            <p className="text-sm text-slate-600">
              Adjust the portfolio slice and watch every KPI, chart, table, and insight update in sync.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_-18px_rgba(197,23,63,0.9)]">
              {filteredCount.toLocaleString("en-US")} of {totalCount.toLocaleString("en-US")} customers
            </span>
            <button
              type="button"
              onClick={onReset}
              className="h-11 rounded-2xl border border-rose-200 px-4 text-sm font-medium text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <FilterSelect label="Customer type" value={filters.customerType} options={customerTypeOptions} onChange={(value) => onChange("customerType", value as FilterState["customerType"])} />
          <FilterSelect label="NPS category" value={filters.npsCategory} options={npsCategoryOptions} onChange={(value) => onChange("npsCategory", value as FilterState["npsCategory"])} />
          <FilterSelect label="Alarm band" value={filters.alarmBand} options={alarmBandOptions} onChange={(value) => onChange("alarmBand", value as FilterState["alarmBand"])} />
          <FilterSelect label="Once and done" value={filters.onceAndDone} options={yesNoOptions} onChange={(value) => onChange("onceAndDone", value as FilterState["onceAndDone"])} />
          <FilterSelect label="Cancelled" value={filters.cancelled} options={yesNoOptions} onChange={(value) => onChange("cancelled", value as FilterState["cancelled"])} />
        </div>
      </div>
    </Card>
  );
}
