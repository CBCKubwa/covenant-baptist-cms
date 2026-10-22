# Code review notes

## Problems found & fixed

### Critical (security)
1. **Admin API had no authentication.** Anyone could `PUT /api/admin/settings` or write data. → every `/api/admin/*` route now requires a valid session (checked in `proxy.ts` *and* in each route).
2. **Login "protection" was fakeable.** `proxy.ts` only checked that a cookie *named* `next-auth.session-token` existed, so typing any value got you in. → it now verifies the signed JWT with `getToken`.
3. **Public endpoints let anyone write to the database** (`POST /api/sermons`, `POST /api/events`). → removed; public routes are read-only.
4. **Real admin username + password were hard-coded** in `prisma/seed.ts` and `.env.example`. → now read from environment variables.
   **ACTION REQUIRED: that password was inside the zip you shared, so treat it as compromised. Choose a new one and re-run `npm run db:seed`.**
5. Login takes the same time for unknown usernames and wrong passwords (no username discovery); sessions expire after 8 hours; the `callbackUrl` redirect is limited to `/admin` paths.

### Bugs
- **Logo not showing on Vercel:** header and footer loaded `/logo.jpg`, which does not exist (the file is `cbc-logo.png`). → fixed with one shared `SiteLogo` component that has a built-in fallback. The 1.7 MB PNG is now also served optimized (~7 KB).
- **Login page showed the admin sidebar** and a stale banner (it sat inside the admin layout). → signed-in screens moved to a `(panel)` route group; URLs are unchanged.
- **Admin sermon list would crash** (rendered the `speaker` object as text). → fixed.
- `SermonForm` posted a field the database model does not accept, so saving failed. → rewritten.
- `Photo → Album` had no cascade, so an album with photos could never be deleted. → schema fixed (and the delete route also removes photos explicitly).
- Albums, Video/Audio and the settings form only *pretended* to save. → now real.
- Sermon/event slugs were `title-<timestamp>` (could collide); now random-suffix slugs.
- `next lint` script (removed in Next 16), unused `@types/bcryptjs`, `directUrl` missing from env docs, no `prisma.seed` config and no seed runner (`tsx`) → fixed.

### Cleanup
Removed unused `components/Navbar.tsx`, duplicate `components/AdminSidebar.tsx`, and a stray `CBC Abuja/package-lock.json`. Added comments throughout. Unified the admin look (some screens used a different blue/slate theme).

## New features
- Admin can **change the church logo** (cloud upload; reset to default).
- Admin can **delete** sermons, standalone video/audio, whole albums, single photos and events, with confirmation and automatic cleanup of uploaded files.
- Real **file upload** (audio, video, images) direct to Vercel Blob, with progress bars and type/size limits.
- Redesigned **admin login** (responsive, show/hide password, clear errors).
- Public **Teachings**, **Media** and the homepage **Featured Sermon** now read from the database. If the database is unreachable they fall back to the built-in sample content.

## Round 2 — the remaining items, now finished
- **Weekly Word** replaces the Daily Word everywhere (admin, API, homepage, sermon-form labels). One entry per week (Mon–Sun); the site switches at Monday 00:00 Nigerian time; if a week is skipped, the latest entry stays up. The existing database table is kept (no data loss).
- **Contact and Prayer forms** now save to the database, with a spam trap, email check and rate limit. **Messages** and **Prayer Requests** admin pages list them (unread highlighted, mark read/unread, delete) with unread badges in the sidebar and on the dashboard.
- **Articles** — create, edit, delete (with image upload); public Resources page and a reading page per article (plain-text rendering, so it is safe).
- **Ministries** — create, edit, reorder, delete (with photo upload); the public page reads them. Your seven existing ministries are carried over by `npm run db:seed`.
- **Pages** — Home intro, About intro/vision/mission, Visit text and **service times** are editable and live.
- **Public Events** page now shows admin-created events (until their date passes); removed the fake image-upload box from the event form.
- **Login rate-limiting** (5 wrong attempts per username / 20 per IP per 15 minutes), with a clear message on the login screen.

## Final audit — does everything saved in the admin show on the public site?
Every admin field was traced to the public page that displays it. Gaps found and fixed in this pass:
- **Service times** (saved but the homepage strip was hard-coded) → now shown on the homepage and Visit page.
- **Contact page** ignored the edited address / phone / WhatsApp → now reads them. One shared helper (`resolveContact`) now feeds the footer, Contact, Visit and homepage strip, so an edit shows everywhere at once.
- **Email, Facebook, YouTube, Instagram** were saved but displayed nowhere → now in the footer and on the Contact page.
- **Vision / Mission** edits still printed the old Bible-verse citation underneath → the citation now only appears with the built-in wording.
- **Footer vision text** ignored edits → now follows Admin → Pages.
- **Sermon form** had three fields (quote / question / prayer) that were never displayed anywhere → removed (the Weekly Word covers this).
- **Plan Your Visit photo** → editable (Admin → Pages).
- Links and email saved in Church Info are now validated (a `javascript:` link can no longer be stored).

Automated scans (all clean): every admin API route checks the session; every route that changes data refreshes the public site; every page that reads the database is cached for at most 60 seconds; no unused components; no leftover debug code.

### Round 3 — the last hard-coded items are now editable
- **Homepage banner:** picture, headline, line under it, sentence, and both button labels (Admin → Pages).
- **Pastor** on the About page: name, optional title, and photo (Admin → Pages).
- **Menu labels:** every menu item, the gold header button, and the footer prayer link (Admin → Menu & Footer). The pages they open never change; labels are limited to 30 characters.
- **Footer copyright line** (Admin → Menu & Footer). `{year}` always shows the current year — the old line had "2026" typed in and would have gone stale.
- **Browser-tab icon** (Admin → Church Info & Logo). The old `app/icon.jpg` file was moved to `public/favicon.jpg`, because a file in `/app` always wins and the icon could never have been changed from the admin.
- The hidden search-engine data (address and phone that Google reads) now follows the contact details you edit.
- The logic that picks "admin's value or default" lives in one tested file (`lib/site-content.ts`). Re-run `npm run db:push` for the new columns.

### Round 4 — church name and search-engine text
- **Church name + location line** (Admin → Church Info & Logo) now drive the header, footer, login page, admin sidebar, banner headline, copyright line, weekly-word share text, About heading, image descriptions and the hidden search-engine data. Clearing the name restores the built-in one (the database column is required, so a blank is never saved).
- **Search Appearance** (new admin page): title + description for all 10 public pages, with a Google-style preview and length guidance. Empty boxes keep using the built-in text, which follows the church name automatically.
- **Bug fixed:** every page title had the church name twice ("Teachings | Covenant Baptist Church | Covenant Baptist Church") because the site adds it automatically *and* each page typed it in. Now it appears once, and a title the admin types is used exactly as typed.
- Link previews (WhatsApp / Facebook) now show each page's own title and description instead of the homepage's.
- The admin sidebar no longer cuts off a long church name.

### Round 5 — WhatsApp button + full admin-to-website verification
- **Cause of the broken WhatsApp button:** the green button in the Weekly Word section was a *share* button (it opens WhatsApp's "choose who to send this to" screen), not a link to the church. The four "Message on WhatsApp" links (footer, Contact, Plan Your Visit, Contact-form thank-you) also stripped everything except digits from what the admin typed, so a pasted link or a local number (`0703…`) produced a broken link.
- **Fix:** one admin field (Church Info & Logo → *WhatsApp link or number*) accepts a number in any common format (`0703 137 5406`, `+234 703 137 5406`, `2347031375406`) **or** a WhatsApp link (`wa.me`, WhatsApp Business `wa.me/message/…` / `wa.link`, group or channel invite, `api.whatsapp.com/send?phone=`). It is validated and saved as one clean https link, shows exactly what the buttons will open, and has a *Test it* link. Non-WhatsApp links, `javascript:` and look-alike domains are rejected. Old badly-typed values already in the database are repaired automatically, and never produce a broken link.
- The green Weekly Word button now says **"Chat with us on WhatsApp"** and opens the church chat; sharing the quote on WhatsApp remains as a small separate link.

### How "admin changes reach the live website" was verified
No real database, Vercel or WhatsApp was available while reviewing, so an in-memory stand-in for the database, the login check and the cache-refresh call was used, and **the real admin save/create/edit/delete handlers and the real public and admin pages** were run against it:
- **Settings → site (163 checks):** WhatsApp, church name, contact details, service times, banner, menu labels, copyright, pastor, page text, logo, tab icon, search titles. Each save was checked to reach every page that shows it, to trigger a site refresh, and to be reversible by clearing the field.
- **Content + security (129 checks):** sermons, albums/photos, video/audio, events, articles, ministries, weekly word, contact/prayer forms and the admin inbox. Create → appears on the site → edit → delete → disappears, and uploaded files are removed from storage on delete. Every admin endpoint was also called while signed out and refused (database untouched).
- **The tests were themselves tested:** the code was deliberately sabotaged 20 times (for example "delete leaves files in storage", "past events still show", "no spam limit", "signed-out visitors can delete"). Every sabotage was caught; one slipped through at first because a test was missing, and that test was added.
- Not covered: the real Supabase database, real file uploads to Vercel storage, and the real WhatsApp app. Those need the quick checks on the live site listed in the hand-over message.

## Round 2 — the remaining items, now finished
- **Weekly Word** replaces the Daily Word everywhere (admin, API, homepage, sermon-form labels). One entry per week (Mon–Sun); the site switches at Monday 00:00 Nigerian time; if a week is skipped, the latest entry stays up. The existing database table is kept (no data loss).
- **Contact and Prayer forms** now save to the database, with a spam trap, email check and rate limit. **Messages** and **Prayer Requests** admin pages list them (unread highlighted, mark read/unread, delete) with unread badges in the sidebar and on the dashboard.
- **Articles** — create, edit, delete (with image upload); public Resources page and a reading page per article (plain-text rendering, so it is safe).
- **Ministries** — create, edit, reorder, delete (with photo upload); the public page reads them. Your seven existing ministries are carried over by `npm run db:seed`.
- **Pages** — Home intro, About intro/vision/mission, Visit text and **service times** are editable and live.
- **Public Events** page now shows admin-created events (until their date passes); removed the fake image-upload box from the event form.
- **Login rate-limiting** (5 wrong attempts per username / 20 per IP per 15 minutes), with a clear message on the login screen.

## Final audit — does everything saved in the admin show on the public site?
Every admin field was traced to the public page that displays it. Gaps found and fixed in this pass:
- **Service times** (saved but the homepage strip was hard-coded) → now shown on the homepage and Visit page.
- **Contact page** ignored the edited address / phone / WhatsApp → now reads them. One shared helper (`resolveContact`) now feeds the footer, Contact, Visit and homepage strip, so an edit shows everywhere at once.
- **Email, Facebook, YouTube, Instagram** were saved but displayed nowhere → now in the footer and on the Contact page.
- **Vision / Mission** edits still printed the old Bible-verse citation underneath → the citation now only appears with the built-in wording.
- **Footer vision text** ignored edits → now follows Admin → Pages.
- **Sermon form** had three fields (quote / question / prayer) that were never displayed anywhere → removed (the Weekly Word covers this).
- **Plan Your Visit photo** → editable (Admin → Pages).
- Links and email saved in Church Info are now validated (a `javascript:` link can no longer be stored).

Automated scans (all clean): every admin API route checks the session; every route that changes data refreshes the public site; every page that reads the database is cached for at most 60 seconds; no unused components; no leftover debug code.

### Round 3 — the last hard-coded items are now editable
- **Homepage banner:** picture, headline, line under it, sentence, and both button labels (Admin → Pages).
- **Pastor** on the About page: name, optional title, and photo (Admin → Pages).
- **Menu labels:** every menu item, the gold header button, and the footer prayer link (Admin → Menu & Footer). The pages they open never change; labels are limited to 30 characters.
- **Footer copyright line** (Admin → Menu & Footer). `{year}` always shows the current year — the old line had "2026" typed in and would have gone stale.
- **Browser-tab icon** (Admin → Church Info & Logo). The old `app/icon.jpg` file was moved to `public/favicon.jpg`, because a file in `/app` always wins and the icon could never have been changed from the admin.
- The hidden search-engine data (address and phone that Google reads) now follows the contact details you edit.
- The logic that picks "admin's value or default" lives in one tested file (`lib/site-content.ts`). Re-run `npm run db:push` for the new columns.

### Round 4 — church name and search-engine text
- **Church name + location line** (Admin → Church Info & Logo) now drive the header, footer, login page, admin sidebar, banner headline, copyright line, weekly-word share text, About heading, image descriptions and the hidden search-engine data. Clearing the name restores the built-in one (the database column is required, so a blank is never saved).
- **Search Appearance** (new admin page): title + description for all 10 public pages, with a Google-style preview and length guidance. Empty boxes keep using the built-in text, which follows the church name automatically.
- **Bug fixed:** every page title had the church name twice ("Teachings | Covenant Baptist Church | Covenant Baptist Church") because the site adds it automatically *and* each page typed it in. Now it appears once, and a title the admin types is used exactly as typed.
- Link previews (WhatsApp / Facebook) now show each page's own title and description instead of the homepage's.
- The admin sidebar no longer cuts off a long church name.

### Still in code (not in the admin)
The long-form wording inside pages other than what is listed above (for example the section headings on the About page and the tips on the Visit page), the colours, and the visual design. Search engines also need your real web address to index the site; add a sitemap later if you want faster indexing.

## Round 2 — the remaining items, now finished
- **Weekly Word** replaces the Daily Word everywhere (admin, API, homepage, sermon-form labels). One entry per week (Mon–Sun); the site switches at Monday 00:00 Nigerian time; if a week is skipped, the latest entry stays up. The existing database table is kept (no data loss).
- **Contact and Prayer forms** now save to the database, with a spam trap, email check and rate limit. **Messages** and **Prayer Requests** admin pages list them (unread highlighted, mark read/unread, delete) with unread badges in the sidebar and on the dashboard.
- **Articles** — create, edit, delete (with image upload); public Resources page and a reading page per article (plain-text rendering, so it is safe).
- **Ministries** — create, edit, reorder, delete (with photo upload); the public page reads them. Your seven existing ministries are carried over by `npm run db:seed`.
- **Pages** — Home intro, About intro/vision/mission, Visit text and **service times** are editable and live.
- **Public Events** page now shows admin-created events (until their date passes); removed the fake image-upload box from the event form.
- **Login rate-limiting** (5 wrong attempts per username / 20 per IP per 15 minutes), with a clear message on the login screen.

## Final audit — does everything saved in the admin show on the public site?
Every admin field was traced to the public page that displays it. Gaps found and fixed in this pass:
- **Service times** (saved but the homepage strip was hard-coded) → now shown on the homepage and Visit page.
- **Contact page** ignored the edited address / phone / WhatsApp → now reads them. One shared helper (`resolveContact`) now feeds the footer, Contact, Visit and homepage strip, so an edit shows everywhere at once.
- **Email, Facebook, YouTube, Instagram** were saved but displayed nowhere → now in the footer and on the Contact page.
- **Vision / Mission** edits still printed the old Bible-verse citation underneath → the citation now only appears with the built-in wording.
- **Footer vision text** ignored edits → now follows Admin → Pages.
- **Sermon form** had three fields (quote / question / prayer) that were never displayed anywhere → removed (the Weekly Word covers this).
- **Plan Your Visit photo** → editable (Admin → Pages).
- Links and email saved in Church Info are now validated (a `javascript:` link can no longer be stored).

Automated scans (all clean): every admin API route checks the session; every route that changes data refreshes the public site; every page that reads the database is cached for at most 60 seconds; no unused components; no leftover debug code.

### Round 3 — the last hard-coded items are now editable
- **Homepage banner:** picture, headline, line under it, sentence, and both button labels (Admin → Pages).
- **Pastor** on the About page: name, optional title, and photo (Admin → Pages).
- **Menu labels:** every menu item, the gold header button, and the footer prayer link (Admin → Menu & Footer). The pages they open never change; labels are limited to 30 characters.
- **Footer copyright line** (Admin → Menu & Footer). `{year}` always shows the current year — the old line had "2026" typed in and would have gone stale.
- **Browser-tab icon** (Admin → Church Info & Logo). The old `app/icon.jpg` file was moved to `public/favicon.jpg`, because a file in `/app` always wins and the icon could never have been changed from the admin.
- The hidden search-engine data (address and phone that Google reads) now follows the contact details you edit.
- The logic that picks "admin's value or default" lives in one tested file (`lib/site-content.ts`). Re-run `npm run db:push` for the new columns.

### Still in code (not in the admin)
The church name written next to the logo in the header/footer, and the page titles/descriptions search engines show.

## Round 2 — the remaining items, now finished
- **Weekly Word** replaces the Daily Word everywhere (admin, API, homepage, sermon-form labels). One entry per week (Mon–Sun); the site switches at Monday 00:00 Nigerian time; if a week is skipped, the latest entry stays up. The existing database table is kept (no data loss).
- **Contact and Prayer forms** now save to the database, with a spam trap, email check and rate limit. **Messages** and **Prayer Requests** admin pages list them (unread highlighted, mark read/unread, delete) with unread badges in the sidebar and on the dashboard.
- **Articles** — create, edit, delete (with image upload); public Resources page and a reading page per article (plain-text rendering, so it is safe).
- **Ministries** — create, edit, reorder, delete (with photo upload); the public page reads them. Your seven existing ministries are carried over by `npm run db:seed`.
- **Pages** — Home intro, About intro/vision/mission, Visit text and **service times** are editable and live.
- **Public Events** page now shows admin-created events (until their date passes); removed the fake image-upload box from the event form.
- **Login rate-limiting** (5 wrong attempts per username / 20 per IP per 15 minutes), with a clear message on the login screen.

## Final audit — does everything saved in the admin show on the public site?
Every admin field was traced to the public page that displays it. Gaps found and fixed in this pass:
- **Service times** (saved but the homepage strip was hard-coded) → now shown on the homepage and Visit page.
- **Contact page** ignored the edited address / phone / WhatsApp → now reads them. One shared helper (`resolveContact`) now feeds the footer, Contact, Visit and homepage strip, so an edit shows everywhere at once.
- **Email, Facebook, YouTube, Instagram** were saved but displayed nowhere → now in the footer and on the Contact page.
- **Vision / Mission** edits still printed the old Bible-verse citation underneath → the citation now only appears with the built-in wording.
- **Footer vision text** ignored edits → now follows Admin → Pages.
- **Sermon form** had three fields (quote / question / prayer) that were never displayed anywhere → removed (the Weekly Word covers this).
- **Plan Your Visit photo** → editable (Admin → Pages).
- Links and email saved in Church Info are now validated (a `javascript:` link can no longer be stored).

Automated scans (all clean): every admin API route checks the session; every route that changes data refreshes the public site; every page that reads the database is cached for at most 60 seconds; no unused components; no leftover debug code.

### Still edited in code, not in the admin
Homepage banner picture and wording, the pastor's name and photo (About → Leadership), the menu labels, the footer copyright line, and the browser-tab icon.

## Heads-up about behaviour
- Once the database is reachable, the public site shows **database content only**. Run `npm run db:seed` once to carry over the sample sermon, "Church Life" album and the seven ministries. The sample "Children's Christmas Carol" event is not seeded (its date was never confirmed) — add it under Events when ready.
- Re-run `npm run db:push` after updating (new columns/tables for ministries, page text and rate limiting).
- Removing a file inside an *unsaved* upload form leaves an orphan file in storage (harmless).
- Sermons, events and albums can be created and deleted but not edited after saving (delete and re-create; articles and ministries can be edited).

## Not verified
Not tested against a live database or live Blob store (none available while reviewing). Verified: type-check, production build, every public and admin page rendering, auth/redirect/forged-cookie behaviour, input validation, the spam trap, and the week-boundary logic. Please test the first real upload, delete, form submission and login lockout after deploying.
