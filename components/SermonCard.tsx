import { getYouTubeEmbedUrl } from "@/lib/media";

type Props = {
  title: string;
  speaker?: string;
  scripture?: string;
  /** Formatted date, e.g. "12 Oct 2026" */
  dateLabel?: string;
  audioUrl?: string | null;
  videoUrl?: string | null;
  youtubeUrl?: string | null;
  href?: string;
};

/** One sermon in the Teachings library, with whatever media was uploaded for it. */
export default function SermonCard({ title, speaker, scripture, dateLabel, audioUrl, videoUrl, youtubeUrl, href }: Props) {
  const embed = getYouTubeEmbedUrl(youtubeUrl);

  const content = (
    <div className="rounded-sm overflow-hidden border border-navy/10 h-full flex flex-col bg-white">
      <div className="h-[86px] shrink-0" style={{ background: "linear-gradient(135deg, #0E1A2B, #09111D)" }} />
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <div className="font-serif text-[15.5px] text-navy leading-snug">{title}</div>
          <div className="mt-1.5 text-[12px] text-ink-soft leading-relaxed">
            {speaker}
            {scripture && <><br />{scripture}</>}
            {dateLabel && <><br /><span className="text-ink-soft/70">{dateLabel}</span></>}
          </div>
        </div>

        {videoUrl && <video controls preload="metadata" className="w-full rounded-sm bg-black aspect-video" src={videoUrl} />}
        {embed && (
          <iframe
            src={embed}
            title={`${title} — video`}
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video rounded-sm"
          />
        )}
        {youtubeUrl && !embed && (
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-[12.5px] text-navy underline underline-offset-2">Watch video</a>
        )}
        {audioUrl && <audio controls preload="none" className="w-full" src={audioUrl} aria-label={`Audio: ${title}`} />}
      </div>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
