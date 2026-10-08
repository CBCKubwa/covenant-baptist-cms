import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.type || !body.message) return NextResponse.json({ error: "Type and message are required." }, { status: 400 });
    const submission = await prisma.formSubmission.create({
      data: { type: body.type, name: body.name || "Anonymous", email: body.email || null, phone: body.phone || null, message: body.message },
    });
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save submission." }, { status: 500 });
  }
}
