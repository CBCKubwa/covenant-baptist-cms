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

## Heads-up about behaviour
- Once the database is reachable, the public site shows **database content only**. Run `npm run db:seed` once to carry over the sample sermon, "Church Life" album and the seven ministries. The sample "Children's Christmas Carol" event is not seeded (its date was never confirmed) — add it under Events when ready.
- Re-run `npm run db:push` after updating (new columns/tables for ministries, page text and rate limiting).
- Removing a file inside an *unsaved* upload form leaves an orphan file in storage (harmless).
- Sermons, events and albums can be created and deleted but not edited after saving (delete and re-create; articles and ministries can be edited).

## Not verified
Not tested against a live database or live Blob store (none available while reviewing). Verified: type-check, production build, every public and admin page rendering, auth/redirect/forged-cookie behaviour, input validation, the spam trap, and the week-boundary logic. Please test the first real upload, delete, form submission and login lockout after deploying.
