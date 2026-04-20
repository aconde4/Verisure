import type { AlarmBand, Customer, EnrichedCustomer, NpsCategory } from "@/types/customer";

export const NPS_CATEGORIES: NpsCategory[] = ["Detractors", "Passives", "Promoters"];
export const ALARM_BANDS: AlarmBand[] = ["0", "1-3", "4-6", "7-10", "11+"];

export function getNpsCategory(recommendationNote: number): NpsCategory {
  if (recommendationNote <= 6) {
    return "Detractors";
  }

  if (recommendationNote <= 8) {
    return "Passives";
  }

  return "Promoters";
}

export function getAlarmBand(alarmTriggers: number): AlarmBand {
  if (alarmTriggers === 0) {
    return "0";
  }

  if (alarmTriggers <= 3) {
    return "1-3";
  }

  if (alarmTriggers <= 6) {
    return "4-6";
  }

  if (alarmTriggers <= 10) {
    return "7-10";
  }

  return "11+";
}

export function enrichCustomer(customer: Customer): EnrichedCustomer {
  return {
    ...customer,
    npsCategory: getNpsCategory(customer.recommendationNote),
    alarmBand: getAlarmBand(customer.alarmTriggers),
    isCancelled: customer.cancelled === "YES",
    isOnceAndDone: customer.onceAndDone === "YES",
  };
}

export function enrichCustomers(customers: Customer[]): EnrichedCustomer[] {
  return customers.map(enrichCustomer);
}
