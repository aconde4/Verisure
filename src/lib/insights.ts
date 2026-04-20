import { ALARM_BANDS } from "@/lib/derived";
import { formatPercent, formatSignedPoints } from "@/lib/format";
import { getAlarmBandMetrics, getNpsMetrics, getOnceAndDoneComparison, getSegmentRows, type GroupDimension } from "@/lib/metrics";
import type { EnrichedCustomer } from "@/types/customer";

function strongestSpread(customers: EnrichedCustomer[]) {
  const dimensions: { key: GroupDimension; label: string }[] = [
    { key: "alarmBand", label: "alarm bands" },
    { key: "npsCategory", label: "NPS category" },
    { key: "onceAndDone", label: "once-and-done" },
    { key: "customerType", label: "customer type" },
  ];

  const spreads = dimensions
    .map((dimension) => {
      const rows = getSegmentRows(customers, dimension.key).filter((row) => row.customers > 0);
      if (rows.length < 2) {
        return { ...dimension, spread: 0 };
      }

      const rates = rows.map((row) => row.cancelRate);
      return { ...dimension, spread: Math.max(...rates) - Math.min(...rates) };
    })
    .sort((left, right) => right.spread - left.spread);

  return spreads[0];
}

export function getSatisfactionInsight(customers: EnrichedCustomer[]) {
  const rows = getNpsMetrics(customers).filter((row) => row.customers > 0);
  if (!rows.length) {
    return "No satisfaction insight is available for the current selection.";
  }

  const sorted = [...rows].sort((left, right) => right.cancelRate - left.cancelRate);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];
  const gap = highest.cancelRate - lowest.cancelRate;

  if (gap < 0.01 || highest.label === lowest.label) {
    return `Cancellation rates stay relatively tight across the visible NPS categories in this slice.`;
  }

  return `${highest.label} show the highest cancellation rate at ${formatPercent(highest.cancelRate)}, versus ${formatPercent(lowest.cancelRate)} for ${lowest.label}.`;
}

export function getDriversInsight(customers: EnrichedCustomer[]) {
  const alarmRows = getAlarmBandMetrics(customers).filter((row) => row.customers > 0);
  if (!alarmRows.length) {
    return "No operational driver insight is available for the current selection.";
  }

  const highestRiskBand = [...alarmRows].sort((left, right) => right.cancelRate - left.cancelRate)[0];
  const lowestRiskBand = [...alarmRows].sort((left, right) => left.cancelRate - right.cancelRate)[0];
  const spread = highestRiskBand.cancelRate - lowestRiskBand.cancelRate;

  if (spread < 0.03) {
    return "Alarm intensity is visible, but churn differences remain limited under the active filters.";
  }

  return `${highestRiskBand.label} alarms is currently the riskiest band, with a ${formatPercent(highestRiskBand.cancelRate)} cancellation rate and a ${formatSignedPoints(spread * 100)} spread versus ${lowestRiskBand.label}.`;
}

export function getDynamicInsights(customers: EnrichedCustomer[]) {
  if (!customers.length) {
    return [];
  }

  const insights: string[] = [];
  const alarmRows = getAlarmBandMetrics(customers).filter((row) => row.customers > 0);
  const npsRows = getNpsMetrics(customers).filter((row) => row.customers > 0);
  const onceRows = getOnceAndDoneComparison(customers).filter((row) => row.customers > 0);

  const topAlarm = [...alarmRows].sort((left, right) => right.cancelRate - left.cancelRate)[0];
  if (topAlarm) {
    insights.push(`Within the current filters, customers with ${topAlarm.label} alarms have the highest cancellation rate.`);
  }

  const strongest = strongestSpread(customers);
  if (strongest && strongest.spread > 0) {
    insights.push(`The largest churn spread is observed across ${strongest.label} in the current view.`);
  }

  const onceYes = onceRows.find((row) => row.label === "YES");
  const onceNo = onceRows.find((row) => row.label === "NO");
  if (onceYes && onceNo && onceNo.cancelRate > onceYes.cancelRate) {
    insights.push(`Once-and-done remains associated with stronger retention, with a ${formatSignedPoints((onceNo.cancelRate - onceYes.cancelRate) * 100)} churn advantage versus NO.`);
  }

  const detractors = npsRows.find((row) => row.label === "Detractors");
  const promoters = npsRows.find((row) => row.label === "Promoters");
  if (detractors && promoters && detractors.cancelRate > promoters.cancelRate) {
    insights.push(`Detractors materially underperform promoters on retention, reinforcing satisfaction as a meaningful risk lens.`);
  }

  const topAlarmCountShare = topAlarm ? topAlarm.customers / customers.length : 0;
  const topAlarmCancelShare = topAlarm && topAlarm.cancelCount > 0
    ? topAlarm.cancelCount / customers.filter((customer) => customer.isCancelled).length
    : 0;
  if (topAlarm && topAlarmCountShare < 0.3 && topAlarmCancelShare > 0.35) {
    insights.push(`Risk is concentrated: ${topAlarm.label} alarms account for a disproportionate share of cancellations relative to their population size.`);
  }

  const highAlarmBands = new Set(ALARM_BANDS.slice(-2));
  const highAlarmCustomers = customers.filter((customer) => highAlarmBands.has(customer.alarmBand));
  const highAlarmCancelRate =
    highAlarmCustomers.length > 0
      ? highAlarmCustomers.filter((customer) => customer.isCancelled).length / highAlarmCustomers.length
      : 0;
  const baseCancelRate = customers.filter((customer) => customer.isCancelled).length / customers.length;
  if (highAlarmCustomers.length > 0 && highAlarmCancelRate > baseCancelRate * 1.35) {
    insights.push(`Higher-alarm customers are cancelling well above the filtered portfolio average, pointing to an operational churn cliff.`);
  }

  return insights.slice(0, 4);
}
