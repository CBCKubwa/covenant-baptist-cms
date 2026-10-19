// ---------------------------------------------------------------------------
// Built-in content for the public site.
//
// - `church` and `nav` are used directly (contact details can be overridden from
//   Admin -> Church Info & Logo; the footer already does this).
// - `weeklyWordSample`, `pageContent`, and the sample `featuredSermon` / `albums` are
//   fallbacks: sermons and albums come from the database whenever it is reachable.
// ---------------------------------------------------------------------------

export const church = {
  name: "Covenant Baptist Church",
  location: "Byazhin-Kubwa, Abuja",
  address: "Yerima Street, Byazhin-Kubwa, Opp. YAM Market, Kubwa, Abuja, Nigeria",
  phone: "+234 703 137 5406",
  whatsapp: "2347031375406",
  email: null as string | null, // TODO: church to confirm — the brief listed "fajimn?", not a usable address
  visionShort:
    "Know Christ deeply. Live in the power of His resurrection. Share in the fellowship of His sufferings.",
  visionFull:
    "That I may know Him and the power of His resurrection, and the fellowship of His sufferings, being made conformable unto His death.",
  visionRef: "Philippians 3:10",
  missionStatement:
    "That He might present it to Himself a glorious church, not having spot, or wrinkle, or any such thing, but that it should be holy and without blemish.",
  missionRef: "Ephesians 5:27",
};

// Built-in wording / images for the parts of the site the admin can now change
// (Admin -> Pages, Menu & Footer, Church Info). Each is used until the admin saves their own.
export const heroDefaults = {
  title: church.name,
  tagline: church.location,
  subtitle: church.visionShort,
  primaryLabel: "Plan Your Visit",
  secondaryLabel: "Watch a Sermon",
  image: "/church-building.jpg",
};

export const pastorDefaults = {
  name: "Rev\u2019d Dr. Fajinmi Adetunji Matthew",
  title: "",
  photo: "/pastor.jpg",
};

/** Labels for the two menu items that are not in `nav`: the header button and the footer prayer link. */
export const menuDefaults = {
  ctaLabel: "Plan Your Visit",
  prayerLabel: "Prayer Requests",
};

/** Placeholders are filled in automatically: {year} = current year, {name} = church name, {location} = location line. */
export const footerDefaults = {
  copyright: "\u00A9 {year} {name}, {location}. All rights reserved.",
};

export const FAVICON_DEFAULT = "/favicon.jpg";

// Sample Weekly Word, shown only if the database cannot be reached.
export const weeklyWordSample = {
  weekLabel: "",
  quote:
    "What Christ comes for is eternal life. Do you have a relationship with Jesus that is beyond religious language, beyond rhetoric, and beyond how you feel?",
  quoteBy: "Rev'd Dr. Fajinmi Adetunji Matthew",
  question:
    "Is Jesus truly reigning in your life, or are you simply surrounded by the language and activities of Christianity?",
  prayer:
    "Lord Jesus, search my heart and expose every area where I have substituted religious activities for a genuine relationship with You\u2026",
};

export const featuredSermon = {
  title: "Divine Mandate for Harvest",
  scripture: "Matthew 9:35\u201339 | John 4",
  speaker: "Rev'd Dr. Fajinmi Adetunji Matthew",
  audioUrl: undefined as string | undefined,
};

export const pageContent = {
  homeIntro:
    "Covenant Baptist Church gathers in Byazhin-Kubwa, Abuja, around one pursuit: not the language of Christ, but Christ Himself \u2014 known, followed, and shared in both resurrection power and suffering.",
  aboutIntro: "The fuller story of how this church began, and where it's headed, goes here once written.",
  visitWhatToExpect:
    "You don't need to know what to expect \u2014 just come. Someone will be glad to point you in the right direction.",
};

export const albums = [
  {
    slug: "church-life",
    title: "Church Life",
    date: "2026",
    photos: [
      {
        src: "/church-building.jpg",
        alt: "Covenant Baptist Church building, Byazhin-Kubwa, Abuja",
        caption: "The church building, Byazhin-Kubwa",
      },
      {
        src: "/choir.jpg",
        alt: "The Covenant Baptist Sanctuary Choir (CBSC)",
        caption: "The Sanctuary Choir (CBSC)",
      },
    ],
  },
];

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Teachings", href: "/teachings" },
  { label: "Ministries", href: "/ministries" },
  { label: "Events", href: "/events" },
  { label: "Media", href: "/media" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];
