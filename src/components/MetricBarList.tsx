type MetricBarItem = {
  label: string;
  value: number;
  secondaryValue?: string;
  tone?: "default" | "accent" | "danger";
  highlight?: boolean;
};

type MetricBarListProps = {
  items: MetricBarItem[];
  maxValue?: number;
  valueFormatter: (value: number) => string;
};

export function MetricBarList({
  items,
  maxValue,
  valueFormatter
}: MetricBarListProps) {
  const localMax =
    maxValue ?? items.reduce((highest, item) => Math.max(highest, item.value), 0);

  return (
    <div className="metric-list">
      {items.map((item) => {
        const width = localMax === 0 ? 0 : (item.value / localMax) * 100;

        return (
          <div
            key={item.label}
            className={`metric-row ${item.highlight ? "is-highlight" : ""}`}
          >
            <div className="metric-row-head">
              <span className="metric-label">{item.label}</span>
              <div className="metric-values">
                <strong>{valueFormatter(item.value)}</strong>
                {item.secondaryValue ? <span>{item.secondaryValue}</span> : null}
              </div>
            </div>
            <div className="metric-track">
              <div
                className={`metric-fill tone-${item.tone ?? "default"}`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
