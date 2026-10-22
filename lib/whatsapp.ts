/**
 * WhatsApp link handling. Pure functions (no server or database code), so the admin form,
 * the settings API and the public pages all share exactly the same rules.
 *
 * The admin can type EITHER:
 *   - a phone number:  "0703 137 5406", "+234 703 137 5406", "2347031375406"
 *   - a WhatsApp link: https://wa.me/2347031375406, a WhatsApp Business link
 *     (https://wa.me/message/XXXX or https://wa.link/XXXX), a group/channel invite link
 *     (https://chat.whatsapp.com/XXXX), or an api.whatsapp.com/send?phone=... link.
 * Either way the website ends up with ONE valid https link.
 */

/** Only genuine WhatsApp addresses are accepted, so a Facebook link pasted here by mistake is caught. */
const ALLOWED_HOSTS = new Set([
  "wa.me",
  "wa.link", // popular WhatsApp Business short-link service
  "api.whatsapp.com",
  "web.whatsapp.com",
  "chat.whatsapp.com",
  "whatsapp.com",
  "www.whatsapp.com",
]);

/** Hosts whose links must carry a ?phone= number instead of a path. */
const PHONE_QUERY_HOSTS = new Set(["api.whatsapp.com", "web.whatsapp.com"]);

export type WhatsAppResult = { ok: true; url: string } | { ok: false; error: string };

const HELP = "Type your WhatsApp number with the country code (for example +234 703 137 5406) or paste your WhatsApp link (for example https://wa.me/2347031375406).";

/** Turn what the admin typed into one valid https WhatsApp link, or explain what is wrong. */
export function normalizeWhatsApp(input: string): WhatsAppResult {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false, error: "Enter a WhatsApp number or link." };
  if (raw.length > 500) return { ok: false, error: "That is too long to be a WhatsApp link." };

  // ---------- A phone number (only digits, spaces and + - ( ) .) ----------
  if (/^[\d\s+\-().]+$/.test(raw)) {
    let digits = raw.replace(/\D/g, "");
    const international = raw.startsWith("+") || digits.startsWith("00");

    if (digits.startsWith("00")) digits = digits.slice(2); // 00234... -> 234...
    else if (!international && digits.startsWith("0")) digits = `234${digits.slice(1)}`; // 0703... -> 234703... (Nigerian local format)
    else if (!international && digits.length === 10 && /^[789]/.test(digits)) digits = `234${digits}`; // 703... -> 234703...

    if (digits.length < 8 || digits.length > 15) {
      return { ok: false, error: `That doesn't look like a complete phone number. ${HELP}` };
    }
    return { ok: true, url: `https://wa.me/${digits}` };
  }

  // ---------- A link ----------
  let parsed: URL;
  try {
    // Allow "wa.me/234..." typed without https://
    parsed = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, error: `That doesn't look like a WhatsApp number or link. ${HELP}` };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, error: `Only web links are allowed. ${HELP}` };
  }
  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) {
    return { ok: false, error: `That isn't a WhatsApp link (it should start with https://wa.me/ or https://chat.whatsapp.com/). ${HELP}` };
  }

  const hasPath = parsed.pathname.replace(/\/+$/, "").length > 1; // more than just "/"
  if (PHONE_QUERY_HOSTS.has(host)) {
    if (!/^\d{8,15}$/.test((parsed.searchParams.get("phone") ?? "").replace(/\D/g, ""))) {
      return { ok: false, error: "That WhatsApp link doesn't include a phone number." };
    }
  } else if (!hasPath) {
    return { ok: false, error: "That WhatsApp link is incomplete: it needs a number or invite code after the address." };
  }

  parsed.protocol = "https:"; // always https
  parsed.username = "";
  parsed.password = "";
  parsed.hash = "";
  return { ok: true, url: parsed.toString() };
}

/**
 * The link the public WhatsApp buttons should open.
 *  - the admin's saved value (number or link) when it is valid,
 *  - otherwise the church's built-in number.
 * It never returns a broken link, even if an old, badly-typed value is still in the database.
 */
export function whatsappUrlFromStored(stored: string | null | undefined, fallbackNumber: string): string {
  if (stored && stored.trim()) {
    const result = normalizeWhatsApp(stored);
    if (result.ok) return result.url;
  }
  const fallback = normalizeWhatsApp(fallbackNumber);
  return fallback.ok ? fallback.url : `https://wa.me/${fallbackNumber.replace(/\D/g, "")}`;
}
