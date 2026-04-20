import type { FilterOption, AlarmBand, CustomerType, EnrichedCustomer, NpsCategory, YesNo } from "@/types/customer";
import { ALARM_BANDS, NPS_CATEGORIES } from "@/lib/derived";

type SearchParamsLike = {
  get(name: string): string | null;
  toString(): string;
};

export type FilterState = {
  customerType: CustomerType | "All";
  npsCategory: NpsCategory | "All";
  alarmBand: AlarmBand | "All";
  onceAndDone: YesNo | "All";
  cancelled: YesNo | "All";
};

export const defaultFilters: FilterState = {
  customerType: "All",
  npsCategory: "All",
  alarmBand: "All",
  onceAndDone: "All",
  cancelled: "All",
};

export const customerTypeOptions: FilterOption<CustomerType>[] = [
  { label: "All", value: "All" },
  { label: "Residential", value: "Residential" },
  { label: "Business", value: "Business" },
];

export const npsCategoryOptions: FilterOption<NpsCategory>[] = [
  { label: "All", value: "All" },
  ...NPS_CATEGORIES.map((value) => ({ label: value, value })),
];

export const alarmBandOptions: FilterOption<AlarmBand>[] = [
  { label: "All", value: "All" },
  ...ALARM_BANDS.map((value) => ({ label: value, value })),
];

export const yesNoOptions: FilterOption<YesNo>[] = [
  { label: "All", value: "All" },
  { label: "YES", value: "YES" },
  { label: "NO", value: "NO" },
];

const allowedCustomerTypes = new Set<CustomerType>(["Residential", "Business"]);
const allowedNpsCategories = new Set<NpsCategory>(NPS_CATEGORIES);
const allowedAlarmBands = new Set<AlarmBand>(ALARM_BANDS);
const allowedYesNo = new Set<YesNo>(["YES", "NO"]);

export function parseFilters(searchParams: SearchParamsLike): FilterState {
  const customerType = searchParams.get("customerType");
  const npsCategory = searchParams.get("npsCategory");
  const alarmBand = searchParams.get("alarmBand");
  const onceAndDone = searchParams.get("onceAndDone");
  const cancelled = searchParams.get("cancelled");

  return {
    customerType: customerType && allowedCustomerTypes.has(customerType as CustomerType) ? (customerType as CustomerType) : "All",
    npsCategory: npsCategory && allowedNpsCategories.has(npsCategory as NpsCategory) ? (npsCategory as NpsCategory) : "All",
    alarmBand: alarmBand && allowedAlarmBands.has(alarmBand as AlarmBand) ? (alarmBand as AlarmBand) : "All",
    onceAndDone: onceAndDone && allowedYesNo.has(onceAndDone as YesNo) ? (onceAndDone as YesNo) : "All",
    cancelled: cancelled && allowedYesNo.has(cancelled as YesNo) ? (cancelled as YesNo) : "All",
  };
}

export function applyFilters(customers: EnrichedCustomer[], filters: FilterState): EnrichedCustomer[] {
  return customers.filter((customer) => {
    if (filters.customerType !== "All" && customer.customerType !== filters.customerType) {
      return false;
    }

    if (filters.npsCategory !== "All" && customer.npsCategory !== filters.npsCategory) {
      return false;
    }

    if (filters.alarmBand !== "All" && customer.alarmBand !== filters.alarmBand) {
      return false;
    }

    if (filters.onceAndDone !== "All" && customer.onceAndDone !== filters.onceAndDone) {
      return false;
    }

    if (filters.cancelled !== "All" && customer.cancelled !== filters.cancelled) {
      return false;
    }

    return true;
  });
}

export function hasActiveFilters(filters: FilterState): boolean {
  return Object.values(filters).some((value) => value !== "All");
}

export function nextSearchParams(current: SearchParamsLike, key: keyof FilterState, value: FilterState[keyof FilterState]) {
  const params = new URLSearchParams(current.toString());

  if (value === "All") {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  return params;
}
