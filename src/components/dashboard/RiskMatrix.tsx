import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ALARM_BANDS, NPS_CATEGORIES } from "@/lib/derived";
import { formatDecimal, formatNumber, formatPercent } from "@/lib/format";
import type { RiskCell } from "@/lib/metrics";

type RiskMatrixProps = {
  matrix: RiskCell[];
};

function getBackground(cancelRate: number) {
  const opacity = Math.min(0.12 + cancelRate * 1.8, 0.85);
  return `rgba(185, 28, 28, ${opacity})`;
}

export function RiskMatrix({ matrix }: RiskMatrixProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Risk map"
        title="Risk matrix"
        description="Cross-derived NPS category and alarm band to spot concentrated zones of churn risk."
      />

      <Card className="overflow-hidden p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  NPS category
                </th>
                {ALARM_BANDS.map((band) => (
                  <th key={band} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {band}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NPS_CATEGORIES.map((category) => (
                <tr key={category}>
                  <td className="px-3 py-3 text-sm font-semibold text-slate-900">{category}</td>
                  {ALARM_BANDS.map((band) => {
                    const cell = matrix.find((entry) => entry.npsCategory === category && entry.alarmBand === band);

                    if (!cell || cell.customers === 0) {
                      return (
                        <td key={band} className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-400">
                          No data
                        </td>
                      );
                    }

                      return (
                        <td
                          key={band}
                          title={`Customers: ${formatNumber(cell.customers)} | Cancel count: ${formatNumber(cell.cancelCount)} | Avg recommendation: ${formatDecimal(cell.avgRecommendation)} | Once-and-done rate: ${formatPercent(cell.onceAndDoneRate)}`}
                        className="rounded-2xl px-4 py-5 align-top text-slate-950 shadow-sm"
                        style={{ background: getBackground(cell.cancelRate) }}
                      >
                        <div className="space-y-1">
                          <p className="text-lg font-semibold">{formatPercent(cell.cancelRate)}</p>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-800/80">
                            {formatNumber(cell.customers)} customers
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
