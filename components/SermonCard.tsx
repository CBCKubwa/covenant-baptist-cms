export default function SermonCard({
  title,
  speaker,
  scripture,
  href,
}: {
  title: string;
  speaker?: string;
  scripture?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-sm overflow-hidden border border-navy/10 hover:-translate-y-1 hover:shadow-md transition h-full">
      <div className="h-[86px]" style={{ background: "linear-gradient(135deg, #0E1A2B, #09111D)" }} />
      <div className="p-4">
        <div className="font-serif text-[15.5px] text-navy leading-snug">{title}</div>
        <div className="mt-1.5 text-[12px] text-ink-soft leading-relaxed">
          {speaker}
          {scripture ? (
            <>
              <br />
              {scripture}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
