type KpiCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function KpiCard({ label, value, helper }: KpiCardProps) {
  return (
    <article className="card kpi-card">
      <span className="eyebrow">{label}</span>
      <strong className="kpi-value">{value}</strong>
      {helper ? <p className="kpi-helper">{helper}</p> : null}
    </article>
  );
}
