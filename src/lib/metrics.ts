import { ALARM_BANDS, NPS_CATEGORIES } from "@/lib/derived";
import type { AlarmBand, EnrichedCustomer, NpsCategory } from "@/types/customer";

export type MetricRow = {
  key: string;
  label: string;
  customers: number;
  cancelCount: number;
  cancelRate: number;
  avgRecommendation: number;
  avgAlarmTriggers: number;
  avgMaintenances: number;
  onceAndDoneRate: number;
};

export type KpiSet = {
  totalCustomers: number;
  cancelCount: number;
  cancelRate: number;
  averageRecommendation: number;
  onceAndDoneRate: number;
  averageAlarmTriggers: number;
  averageMaintenances: number;
  npsScore: number;
};

export type RiskCell = MetricRow & {
  npsCategory: NpsCategory;
  alarmBand: AlarmBand;
};

export type GroupDimension = "customerType" | "npsCategory" | "alarmBand" | "onceAndDone";

function average(values: number[]): number {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getCancelCount(customers: EnrichedCustomer[]) {
  return customers.filter((customer) => customer.isCancelled).length;
}

export function getCancelRate(customers: EnrichedCustomer[]) {
  if (!customers.length) {
    return 0;
  }

  return getCancelCount(customers) / customers.length;
}

export function getAvgRecommendation(customers: EnrichedCustomer[]) {
  return average(customers.map((customer) => customer.recommendationNote));
}

export function getOnceAndDoneRate(customers: EnrichedCustomer[]) {
  if (!customers.length) {
    return 0;
  }

  return customers.filter((customer) => customer.isOnceAndDone).length / customers.length;
}

export function getAvgAlarmTriggers(customers: EnrichedCustomer[]) {
  return average(customers.map((customer) => customer.alarmTriggers));
}

export function getAvgMaintenances(customers: EnrichedCustomer[]) {
  return average(customers.map((customer) => customer.maintenances));
}

export function getNpsScore(customers: EnrichedCustomer[]) {
  if (!customers.length) {
    return 0;
  }

  const promoters = customers.filter((customer) => customer.npsCategory === "Promoters").length / customers.length;
  const detractors = customers.filter((customer) => customer.npsCategory === "Detractors").length / customers.length;

  return (promoters - detractors) * 100;
}

export function getKpis(customers: EnrichedCustomer[]): KpiSet {
  return {
    totalCustomers: customers.length,
    cancelCount: getCancelCount(customers),
    cancelRate: getCancelRate(customers),
    averageRecommendation: getAvgRecommendation(customers),
    onceAndDoneRate: getOnceAndDoneRate(customers),
    averageAlarmTriggers: getAvgAlarmTriggers(customers),
    averageMaintenances: getAvgMaintenances(customers),
    npsScore: getNpsScore(customers),
  };
}

export function buildMetricRow(label: string, customers: EnrichedCustomer[]): MetricRow {
  return {
    key: label,
    label,
    customers: customers.length,
    cancelCount: getCancelCount(customers),
    cancelRate: getCancelRate(customers),
    avgRecommendation: getAvgRecommendation(customers),
    avgAlarmTriggers: getAvgAlarmTriggers(customers),
    avgMaintenances: getAvgMaintenances(customers),
    onceAndDoneRate: getOnceAndDoneRate(customers),
  };
}

export function getNpsMetrics(customers: EnrichedCustomer[]) {
  return NPS_CATEGORIES.map((category) =>
    buildMetricRow(
      category,
      customers.filter((customer) => customer.npsCategory === category),
    ),
  );
}

export function getRecommendationDistribution(customers: EnrichedCustomer[]) {
  return Array.from({ length: 11 }, (_, score) =>
    buildMetricRow(
      String(score),
      customers.filter((customer) => customer.recommendationNote === score),
    ),
  );
}

export function getAlarmBandMetrics(customers: EnrichedCustomer[]) {
  return ALARM_BANDS.map((band) =>
    buildMetricRow(
      band,
      customers.filter((customer) => customer.alarmBand === band),
    ),
  );
}

export function getOnceAndDoneComparison(customers: EnrichedCustomer[]) {
  return ["YES", "NO"].map((value) =>
    buildMetricRow(
      value,
      customers.filter((customer) => customer.onceAndDone === value),
    ),
  );
}

export function getPortfolioComposition(customers: EnrichedCustomer[]) {
  const total = customers.length || 1;

  return {
    customerType: ["Residential", "Business"].map((segment) => {
      const count = customers.filter((customer) => customer.customerType === segment).length;
      return { label: segment, count, share: count / total };
    }),
    cancelled: ["NO", "YES"].map((segment) => {
      const count = customers.filter((customer) => customer.cancelled === segment).length;
      return { label: segment, count, share: count / total };
    }),
    onceAndDone: ["YES", "NO"].map((segment) => {
      const count = customers.filter((customer) => customer.onceAndDone === segment).length;
      return { label: segment, count, share: count / total };
    }),
  };
}

export function getRiskMatrix(customers: EnrichedCustomer[]): RiskCell[] {
  return NPS_CATEGORIES.flatMap((npsCategory) =>
    ALARM_BANDS.map((alarmBand) => {
      const segment = customers.filter(
        (customer) => customer.npsCategory === npsCategory && customer.alarmBand === alarmBand,
      );

      return {
        ...buildMetricRow(`${npsCategory}-${alarmBand}`, segment),
        npsCategory,
        alarmBand,
      };
    }),
  );
}

export function getSegmentRows(customers: EnrichedCustomer[], dimension: GroupDimension): MetricRow[] {
  const groups = new Map<string, EnrichedCustomer[]>();

  for (const customer of customers) {
    const key = customer[dimension];
    const existing = groups.get(key) ?? [];
    existing.push(customer);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([label, rows]) => buildMetricRow(label, rows));
}
