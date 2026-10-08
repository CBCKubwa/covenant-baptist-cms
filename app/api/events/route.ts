import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startsAt: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, startsAt, location, description, category, registrationUrl } = body;

    if (!title || !startsAt) {
      return NextResponse.json(
        { error: 'Event Title and Start Date are required' },
        { status: 400 }
      );
    }

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-');
    const slug = `${baseSlug}-${Date.now()}`;

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        startsAt: new Date(startsAt),
        location: location || null,
        description: description || null,
        category: category || null,
        registrationUrl: registrationUrl || null,
        status: 'PUBLISHED',
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create event' }, { status: 500 });
  }
}