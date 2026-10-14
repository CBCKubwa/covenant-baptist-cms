export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-navy pt-[140px] pb-16 px-6">
      <div className="max-w-[1180px] mx-auto">
        <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold-light mb-4">
          {eyebrow}
        </span>
        <h1 className="font-serif text-[clamp(2rem,5vw,3.4rem)] text-white leading-tight">{title}</h1>
        {description && (
          <p className="mt-5 max-w-[60ch] text-parchment/75 text-base leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
