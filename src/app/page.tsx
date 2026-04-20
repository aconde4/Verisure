import { Suspense } from "react";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { EmptyState } from "@/components/ui/EmptyState";
import { customers } from "@/data/customers";

export default function Home() {
  return (
    <Suspense fallback={<main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8"><EmptyState title="Loading dashboard" description="Preparing the interactive analysis view." /></main>}>
      <DashboardClient customers={customers} />
    </Suspense>
  );
}
