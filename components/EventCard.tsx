type Props = {
  title: string;
  /** Used when there is no exact date (e.g. "Dec 2026"). */
  dateLabel?: string;
  /** Exact date parts shown in the navy badge. */
  month?: string;
  day?: string;
  timeLabel?: string | null;
  location?: string | null;
  description?: string | null;
  registrationUrl?: string | null;
};

/** One event card: date badge, title, time/location, description and optional sign-up link. */
export default function EventCard({ title, dateLabel, month, day, timeLabel, location, description, registrationUrl }: Props) {
  return (
    <div className="flex gap-4 border border-navy/10 rounded-sm p-4">
      <div className="shrink-0 w-[56px] h-[56px] rounded-sm bg-navy text-parchment flex flex-col items-center justify-center text-center leading-tight font-semibold">
        {month && day ? (
          <>
            <span className="text-[10.5px] uppercase tracking-wide text-gold-light">{month}</span>
            <span className="text-lg font-serif">{day}</span>
          </>
        ) : (
          <span className="text-[10.5px]">{dateLabel || "TBC"}</span>
        )}
      </div>
      <div className="text-ink-soft text-[13px] leading-relaxed min-w-0">
        <strong className="text-navy block">{title}</strong>
        {(timeLabel || location) && <span className="block text-ink">{[timeLabel, location].filter(Boolean).join(" · ")}</span>}
        {description && <span className="block mt-1 whitespace-pre-line">{description}</span>}
        {registrationUrl && (
          <a href={registrationUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-navy font-semibold underline underline-offset-2">
            Register / learn more
          </a>
        )}
      </div>
    </div>
  );
}
