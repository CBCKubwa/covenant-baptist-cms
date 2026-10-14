/**
 * Database seed. Run with:  npm run db:seed
 *
 * 1. Creates (or updates) the admin account from the ADMIN_USER / ADMIN_PASSWORD
 *    environment variables.  SECURITY FIX: the old script had the real username
 *    and password written into the source code. Re-running this with a new
 *    ADMIN_PASSWORD is also how you change the admin password.
 * 2. Creates the site-settings row.
 * 3. Adds the church's existing sample sermon, photo album and ministries ONLY if
 *    the database has none yet, so the admin can manage (or delete) them.
 *
 * Safe to run more than once.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ministries } from "../lib/ministries";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USER?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("Set ADMIN_USER and ADMIN_PASSWORD in your environment (see .env.example) before seeding.");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  // 1. Admin account
  const hash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { username },
    update: { password: hash },
    create: { username, password: hash, role: "SUPER_ADMIN" },
  });
  console.log(`✔ Admin account ready: ${username}`);

  // 2. Site settings
  await prisma.siteSettings.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });
  console.log("✔ Site settings ready");

  // 3. Starter content (only into an empty database)
  if ((await prisma.sermon.count()) === 0) {
    const speaker = await prisma.speaker.create({ data: { name: "Rev'd Dr. Fajinmi Adetunji Matthew" } });
    await prisma.sermon.create({
      data: {
        title: "Divine Mandate for Harvest",
        slug: "divine-mandate-for-harvest",
        speakerId: speaker.id,
        scripture: "Matthew 9:35–39 | John 4",
        date: new Date(),
        publishedAt: new Date(),
      },
    });
    console.log("✔ Added sample sermon");
  }

  if ((await prisma.album.count()) === 0) {
    await prisma.album.create({
      data: {
        title: "Church Life",
        date: new Date("2026-01-01"),
        photos: {
          create: [
            { url: "/church-building.jpg", caption: "The church building, Byazhin-Kubwa", order: 0 },
            { url: "/choir.jpg", caption: "The Sanctuary Choir (CBSC)", order: 1 },
          ],
        },
      },
    });
    console.log("✔ Added sample photo album");
  }

  // The church's existing ministries, so they can be edited / reordered / deleted in the admin.
  if ((await prisma.ministry.count()) === 0) {
    for (const [index, m] of ministries.entries()) {
      await prisma.ministry.create({
        data: { name: m.name, slug: m.slug, blurb: m.blurb, image: m.image ?? null, sections: m.sections, order: index },
      });
    }
    console.log(`✔ Added ${ministries.length} ministries`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
