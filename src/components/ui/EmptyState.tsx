import { Card } from "@/components/ui/Card";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "No data available for the current selection",
  description = "Reset filters or widen the segment to continue exploring the dataset.",
}: EmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Card>
  );
}
