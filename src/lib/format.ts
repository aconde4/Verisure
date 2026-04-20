export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export function formatDecimal(value: number, digits = 1) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${formatDecimal(value * 100, digits)}%`;
}

export function formatSignedPoints(value: number, digits = 1) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatDecimal(value, digits)} pts`;
}
