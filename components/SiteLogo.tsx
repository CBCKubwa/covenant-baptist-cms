import Image from "next/image";

/** Bundled fallback logo (public/cbc-logo.png). */
const DEFAULT_LOGO = "/cbc-logo.png";

/**
 * The church logo. `src` comes from Site Settings (admin-uploaded); when it is
 * empty we fall back to the bundled file, so a logo ALWAYS displays.
 *
 * `object-contain` matters: the emblem is round with transparent corners and
 * its edge lettering would be cut off by `object-cover`.
 */
export default function SiteLogo({
  src,
  size,
  className = "",
  priority = false,
  alt = "Covenant Baptist Church logo",
}: {
  src?: string | null;
  size: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <Image
      src={src || DEFAULT_LOGO}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
