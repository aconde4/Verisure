import { Card } from "@/components/ui/Card";
import { formatDecimal, formatNumber, formatPercent } from "@/lib/format";
import type { KpiSet } from "@/lib/metrics";

type KpiCardsProps = {
  kpis: KpiSet;
};

const tiles = [
  { label: "Total customers", key: "totalCustomers" as const, tone: "neutral" },
  { label: "Cancel count", key: "cancelCount" as const, tone: "danger" },
  { label: "Cancel rate", key: "cancelRate" as const, tone: "danger" },
  { label: "Average recommendation", key: "averageRecommendation" as const, tone: "accent" },
  { label: "Once-and-done rate", key: "onceAndDoneRate" as const, tone: "accent" },
  { label: "Average alarm triggers", key: "averageAlarmTriggers" as const, tone: "warning" },
  { label: "Average maintenances", key: "averageMaintenances" as const, tone: "warning" },
  { label: "NPS score", key: "npsScore" as const, tone: "accent" },
];

function renderValue(kpis: KpiSet, key: (typeof tiles)[number]["key"]) {
  switch (key) {
    case "totalCustomers":
    case "cancelCount":
      return formatNumber(kpis[key]);
    case "cancelRate":
    case "onceAndDoneRate":
      return formatPercent(kpis[key]);
    case "averageRecommendation":
    case "averageAlarmTriggers":
    case "averageMaintenances":
      return formatDecimal(kpis[key]);
    case "npsScore":
      return formatDecimal(kpis[key], 0);
  }
}

function toneClass(tone: string) {
  if (tone === "danger") {
    return "bg-[var(--danger-soft)] text-[var(--danger)]";
  }

  if (tone === "warning") {
    return "bg-[var(--warning-soft)] text-[var(--warning)]";
  }

  if (tone === "accent") {
    return "bg-[var(--accent-soft)] text-[var(--accent)]";
  }

  return "bg-slate-100 text-slate-700";
}

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.key} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">{tile.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {renderValue(kpis, tile.key)}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneClass(tile.tone)}`}>
              Live
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
