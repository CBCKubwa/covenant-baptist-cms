export default function EventCard({
  title,
  dateLabel,
  description,
}: {
  title: string;
  dateLabel?: string;
  description?: string;
}) {
  return (
    <div className="flex gap-4 border border-navy/10 rounded-sm p-4">
      <div className="shrink-0 w-[52px] h-[52px] rounded-sm bg-navy text-parchment flex flex-col items-center justify-center text-[10.5px] text-center leading-tight font-semibold">
        {dateLabel || "TBC"}
      </div>
      <div className="text-ink-soft text-[13px] leading-relaxed">
        <strong className="text-navy block">{title}</strong>
        {description}
      </div>
    </div>
  );
}
