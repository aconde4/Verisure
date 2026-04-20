import { ComparisonBars } from "@/components/ComparisonBars";
import { KpiCard } from "@/components/KpiCard";
import { MetricBarList } from "@/components/MetricBarList";
import { SectionCard } from "@/components/SectionCard";
import { verisureCase } from "@/data/verisureCase";
import {
  formatCompactNumber,
  formatNumber,
  formatPercentage,
  formatRating
} from "@/lib/format";

const { summary, npsCategories, alarmBands, installationImpact, riskTiers, conclusions } =
  verisureCase;

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />

      <section className="hero card">
        <div className="hero-copy">
          <span className="eyebrow">Intern case assessment</span>
          <h1>Verisure CX &amp; Churn Dashboard</h1>
          <p>
            A compact executive view of satisfaction, churn, and operational
            signals using pre-aggregated Verisure customer data.
          </p>
        </div>
        <div className="hero-highlight">
          <span className="eyebrow">Headline</span>
          <strong>Churn remains low overall, but customers with 11+ alarms show a severe risk cliff.</strong>
        </div>
      </section>

      <section className="kpi-grid" aria-label="Key metrics">
        <KpiCard
          label="Total customers"
          value={formatNumber(summary.totalCustomers)}
          helper="Residential and business portfolio"
        />
        <KpiCard
          label="Avg recommendation note"
          value={formatRating(summary.avgRecommendation)}
          helper={`Median ${formatRating(summary.medianRecommendation, 0)}`}
        />
        <KpiCard
          label="NPS score"
          value={formatRating(summary.npsScore)}
          helper="Strong promoter-led mix"
        />
        <KpiCard
          label="Overall cancellation rate"
          value={formatPercentage(summary.cancellationRate)}
          helper="Portfolio-wide churn"
        />
        <KpiCard
          label="Once-and-done rate"
          value={formatPercentage(summary.onceAndDoneRate)}
          helper="First-time install success"
        />
        <KpiCard
          label="Avg alarm triggers"
          value={formatCompactNumber(summary.avgAlarmTriggers)}
          helper={`Avg maintenances ${formatCompactNumber(summary.avgMaintenances)}`}
        />
      </section>

      <div className="content-grid">
        <SectionCard
          title="Satisfaction & churn"
          description="Recommendation quality is broadly healthy, but detractors churn at a much higher rate than the rest of the base."
        >
          <div className="section-grid">
            <ComparisonBars
              title="NPS composition"
              valueFormatter={(value) => formatNumber(value)}
              items={npsCategories.map((item) => ({
                label: item.category,
                primary: formatNumber(item.count),
                secondary: `${formatPercentage(item.share)} of customers`,
                value: item.count,
                tone:
                  item.category === "Promoters"
                    ? "accent"
                    : item.category === "Detractors"
                      ? "default"
                      : "default"
              }))}
            />

            <ComparisonBars
              title="Cancellation rate by NPS category"
              valueFormatter={(value) => formatPercentage(value)}
              items={npsCategories.map((item) => ({
                label: item.category,
                primary: formatPercentage(item.cancelRate),
                secondary: `${formatCompactNumber(item.avgAlarms)} avg alarms`,
                value: item.cancelRate,
                tone: item.category === "Detractors" ? "accent" : "default"
              }))}
            />
          </div>

          <div className="insight-callout">
            <span className="eyebrow">Insight</span>
            <p>
              Detractors represent just {formatPercentage(npsCategories[0].share)} of
              the portfolio, but their cancellation rate reaches{" "}
              {formatPercentage(npsCategories[0].cancelRate)}, far above passives and
              promoters.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Operational drivers"
          description="Alarm intensity and installation quality emerge as the clearest operational levers behind churn."
        >
          <div className="section-grid">
            <div className="mini-card">
              <div className="mini-card-header">
                <h3>Alarm bands vs cancellation</h3>
              </div>
              <MetricBarList
                valueFormatter={(value) => formatPercentage(value)}
                items={alarmBands.map((item) => ({
                  label: item.band,
                  value: item.cancelRate,
                  secondaryValue: `${formatNumber(item.count)} customers`,
                  tone: item.band === "11+ alarms" ? "danger" : "default",
                  highlight: item.band === "11+ alarms"
                }))}
              />
            </div>

            <ComparisonBars
              title="Once & Done impact on churn"
              valueFormatter={(value) => formatPercentage(value)}
              items={installationImpact.map((item) => ({
                label: item.label,
                primary: formatPercentage(item.cancelRate),
                secondary: `${formatCompactNumber(item.avgAlarms)} avg alarms`,
                value: item.cancelRate,
                tone: item.label.endsWith("NO") ? "accent" : "default"
              }))}
            />
          </div>

          <div className="cliff-banner">
            <span className="eyebrow">Critical signal</span>
            <p>
              The {alarmBands[4].band} segment is the sharpest churn cliff in the
              dataset: just {formatPercentage(alarmBands[4].share)} of customers, but{" "}
              {formatPercentage(alarmBands[4].cancelRate)} cancellation.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Risk segmentation"
          description="Most customers are low risk, while a very small high-risk group concentrates a disproportionate share of churn."
        >
          <div className="risk-grid">
            {riskTiers.map((item) => (
              <article
                key={item.tier}
                className={`risk-card risk-${item.tier.toLowerCase()}`}
              >
                <span className="eyebrow">{item.tier} risk</span>
                <strong>{formatNumber(item.count)}</strong>
                <p>{formatPercentage(item.share)} of customers</p>
                <div className="risk-meter">
                  <div
                    className="risk-meter-fill"
                    style={{ width: `${item.cancelRate * 100}%` }}
                  />
                </div>
                <span className="risk-rate">
                  Cancel rate {formatPercentage(item.cancelRate)}
                </span>
              </article>
            ))}
          </div>

          <div className="insight-callout">
            <span className="eyebrow">Business takeaway</span>
            <p>
              High-risk customers are only {formatPercentage(riskTiers[0].share)}, so
              targeted intervention can be highly efficient without broad-based cost.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Key conclusions"
          description="Executive summary of the main strategic implications from the case."
        >
          <ol className="conclusion-list">
            {conclusions.map((conclusion) => (
              <li key={conclusion}>{conclusion}</li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </main>
  );
}
