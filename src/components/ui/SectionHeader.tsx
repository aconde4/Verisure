type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
        {eyebrow}
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  );
}
