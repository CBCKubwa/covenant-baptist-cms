import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client.
 *
 * In development Next.js hot-reloads modules, which would otherwise create a
 * new database connection on every reload and exhaust the connection pool.
 * Caching the client on `globalThis` avoids that.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
