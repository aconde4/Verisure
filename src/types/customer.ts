export type CustomerType = "Residential" | "Business";
export type YesNo = "YES" | "NO";
export type NpsCategory = "Detractors" | "Passives" | "Promoters";
export type AlarmBand = "0" | "1-3" | "4-6" | "7-10" | "11+";

export type Customer = {
  id: number | string;
  recommendationNote: number;
  alarmTriggers: number;
  maintenances: number;
  customerType: CustomerType;
  onceAndDone: YesNo;
  cancelled: YesNo;
};

export type EnrichedCustomer = Customer & {
  npsCategory: NpsCategory;
  alarmBand: AlarmBand;
  isCancelled: boolean;
  isOnceAndDone: boolean;
};

export type FilterOption<T extends string> = {
  label: string;
  value: T | "All";
};
