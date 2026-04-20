"use client";

import { startTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DynamicInsights } from "@/components/dashboard/DynamicInsights";
import { DriversSection } from "@/components/dashboard/DriversSection";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { RiskMatrix } from "@/components/dashboard/RiskMatrix";
import { SatisfactionSection } from "@/components/dashboard/SatisfactionSection";
import { SegmentExplorer } from "@/components/dashboard/SegmentExplorer";
import { EmptyState } from "@/components/ui/EmptyState";
import { enrichCustomers } from "@/lib/derived";
import {
  applyFilters,
  hasActiveFilters,
  nextSearchParams,
  parseFilters,
  type FilterState,
} from "@/lib/filters";
import { getDriversInsight, getDynamicInsights, getSatisfactionInsight } from "@/lib/insights";
import {
  getAlarmBandMetrics,
  getKpis,
  getNpsMetrics,
  getPortfolioComposition,
  getRecommendationDistribution,
  getRiskMatrix,
  getSegmentRows,
  getOnceAndDoneComparison,
} from "@/lib/metrics";
import type { Customer } from "@/types/customer";

type DashboardClientProps = {
  customers: Customer[];
};

export function DashboardClient({ customers }: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const enrichedCustomers = enrichCustomers(customers);
  const filters = parseFilters(searchParams);
  const filteredCustomers = applyFilters(enrichedCustomers, filters);
  const kpis = getKpis(filteredCustomers);
  const portfolioComposition = getPortfolioComposition(filteredCustomers);
  const npsMetrics = getNpsMetrics(filteredCustomers);
  const scoreDistribution = getRecommendationDistribution(filteredCustomers);
  const alarmMetrics = getAlarmBandMetrics(filteredCustomers);
  const onceAndDoneMetrics = getOnceAndDoneComparison(filteredCustomers);
  const riskMatrix = getRiskMatrix(filteredCustomers);
  const segmentRows = {
    customerType: getSegmentRows(filteredCustomers, "customerType"),
    npsCategory: getSegmentRows(filteredCustomers, "npsCategory"),
    alarmBand: getSegmentRows(filteredCustomers, "alarmBand"),
    onceAndDone: getSegmentRows(filteredCustomers, "onceAndDone"),
  };
  const satisfactionInsight = getSatisfactionInsight(filteredCustomers);
  const driversInsight = getDriversInsight(filteredCustomers);
  const dynamicInsights = getDynamicInsights(filteredCustomers);

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const params = nextSearchParams(searchParams, key, value);
    const nextQuery = params.toString();
    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    });
  }

  function resetFilters() {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  const activeFilters = hasActiveFilters(filters);

  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-white/60 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.9))] px-6 py-8 text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.8)] sm:px-8">
        <div className="max-w-4xl space-y-4">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
            Interactive case exploration
          </span>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Verisure CX & Churn Analysis Dashboard
            </h1>
            <p className="text-lg text-white/80">Interactive case exploration</p>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-white/78 sm:text-base">
            Explore customer experience, operational friction, and cancellation patterns through dynamic filtering and
            segment analysis. The dashboard derives every KPI and insight from row-level customer data.
          </p>
        </div>
      </section>

      <FilterBar
        filters={filters}
        filteredCount={filteredCustomers.length}
        totalCount={customers.length}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      {!filteredCustomers.length ? (
        <EmptyState />
      ) : (
        <>
          <KpiCards kpis={kpis} />
          <OverviewSection customers={filteredCustomers} composition={portfolioComposition} />
          <SatisfactionSection
            npsMetrics={npsMetrics}
            scoreDistribution={scoreDistribution}
            insight={satisfactionInsight}
          />
          <DriversSection
            alarmMetrics={alarmMetrics}
            onceAndDoneMetrics={onceAndDoneMetrics}
            insight={driversInsight}
          />
          <RiskMatrix matrix={riskMatrix} />
          <SegmentExplorer dataByDimension={segmentRows} />
          <DynamicInsights insights={dynamicInsights} />
        </>
      )}

      {activeFilters ? (
        <p className="pb-4 text-center text-sm text-slate-500">
          URL state is enabled. Share this page and the current filter selection will persist.
        </p>
      ) : null}
    </main>
  );
}
