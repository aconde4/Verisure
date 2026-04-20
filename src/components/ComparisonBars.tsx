type ComparisonBar = {
  label: string;
  primary: string;
  secondary: string;
  value: number;
  tone?: "default" | "accent";
};

type ComparisonBarsProps = {
  title: string;
  items: ComparisonBar[];
  valueFormatter: (value: number) => string;
};

export function ComparisonBars({
  title,
  items,
  valueFormatter
}: ComparisonBarsProps) {
  const maxValue = items.reduce((highest, item) => Math.max(highest, item.value), 0);

  return (
    <div className="mini-card">
      <div className="mini-card-header">
        <h3>{title}</h3>
      </div>
      <div className="comparison-list">
        {items.map((item) => {
          const width = maxValue === 0 ? 0 : (item.value / maxValue) * 100;

          return (
            <div key={item.label} className="comparison-row">
              <div className="comparison-copy">
                <span className="comparison-label">{item.label}</span>
                <strong>{item.primary}</strong>
                <span>{item.secondary}</span>
              </div>
              <div className="comparison-visual">
                <div className="comparison-track">
                  <div
                    className={`comparison-fill tone-${item.tone ?? "default"}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="comparison-value">{valueFormatter(item.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
