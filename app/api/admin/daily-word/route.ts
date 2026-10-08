import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() { return NextResponse.json(await prisma.dailyWord.findMany({ orderBy:{date:"desc"} })); }
export async function POST(request: Request) { const b=await request.json(); const row=await prisma.dailyWord.upsert({ where:{date:new Date(b.date)}, update:{quote:b.quote,quoteBy:b.quoteBy,question:b.question,prayer:b.prayer,scripture:b.scripture}, create:{date:new Date(b.date),quote:b.quote,quoteBy:b.quoteBy,question:b.question,prayer:b.prayer,scripture:b.scripture} }); return NextResponse.json(row,{status:201}); }
