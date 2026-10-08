// ---------------------------------------------------------------------------
// Sample content for the homepage. Once the CMS + database are connected
// (Phase 3), these will be replaced by live queries. Everything here is
// either taken directly from the church's own materials, or clearly marked
// as a placeholder — nothing here is invented as fact.
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

export const todaysWord = {
  date: "Wednesday, August 18, 2026",
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
