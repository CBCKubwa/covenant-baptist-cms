# Covenant Baptist Church — Website & Admin CMS

Next.js 16 · Prisma + PostgreSQL (Supabase) · NextAuth · Vercel Blob (file storage)

## 1. Environment variables
Copy `.env.example` to `.env` (local) and add the same names in **Vercel → Project → Settings → Environment Variables**.

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Supabase **pooled** connection string (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase **direct** connection string (port 5432), used by `db push` |
| `NEXTAUTH_SECRET` | Random string: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` locally, your real `https://…` URL on Vercel |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Used **only** by the seed command to create the admin (12+ chars) |
| `BLOB_READ_WRITE_TOKEN` | Added automatically when you connect a Blob store (step 2) |

## 2. One-time setup
1. **Create a Blob store** — Vercel dashboard → *Storage* → *Create* → *Blob* → connect it to this project.
   This is where the logo, photos, sermon audio and video are stored. Without it, uploads will fail.
2. **Create/update the tables** (run on your computer, with `.env` filled in):
   ```bash
   npm install
   npm run db:push     # creates/updates tables (safe to re-run after every update)
   npm run db:seed     # creates the admin account from ADMIN_USER / ADMIN_PASSWORD
   ```
3. Deploy (push to GitHub → Vercel builds automatically).

To **change the admin password later**: edit `ADMIN_PASSWORD` in `.env` and run `npm run db:seed` again.

## 3. Using the admin (`/admin`)
| Task | Where |
|---|---|
| Change the **church name**, logo, browser-tab icon, address, phone, WhatsApp, email, social links | **Church Info & Logo** |
| Homepage banner picture + wording, pastor's name and photo, Home / About / Visit text, service times, Plan Your Visit photo | **Pages** |
| Rename the menu items and change the footer copyright line (`{year}`, `{name}` and `{location}` are filled in automatically) | **Menu & Footer** |
| Change the title and description Google shows for each page (and the preview when a link is shared on WhatsApp/Facebook) | **Search Appearance** |
| Add / delete sermons (with audio & video) | **Sermons** |
| Schedule the **Weekly Word** (quote, question, prayer — one per week, Mon–Sun) | **Weekly Word** |
| Add / delete events (shown on the public Events page until their date passes) | **Events** |
| Write, edit and delete articles | **Articles** |
| Add, edit, reorder and delete ministries | **Ministries** |
| Create albums, upload photos, delete photos or albums | **Photos & Albums** |
| Standalone video & audio | **Video & Audio** |
| Read, mark and delete Contact messages and Prayer requests (unread counts show in the sidebar) | **Messages**, **Prayer Requests** |

Every delete asks for confirmation and also removes the uploaded files from storage.

### Security notes
- Sign-in is limited to 5 wrong attempts per username (and 20 per IP) per 15 minutes. Public forms allow 5 submissions per visitor per hour and include a hidden spam trap.
- For extra protection you can also add a Vercel Firewall rate-limit rule on `/api/auth/*`.

## 4. Local development
```bash
npm run dev          # http://localhost:3000
npm run typecheck    # TypeScript check
```

## 5. Project layout
```
app/(marketing)/        public website pages
app/admin/login/        sign-in page (full screen)
app/admin/(panel)/      signed-in admin screens (share the sidebar layout)
app/api/admin/*         admin-only API (every route checks the session)
app/api/{sermons,events,submissions}   public API (read-only / form intake)
components/admin/       admin UI (forms, uploader, delete button, logo manager)
lib/auth.ts             NextAuth options + session helpers
lib/blob.ts             delete uploaded files from storage
lib/settings.ts         site settings (logo, contact details)
lib/queries.ts          database reads for the public site
proxy.ts                blocks /admin and /api/admin unless signed in
prisma/                 schema + seed
```
