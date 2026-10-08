import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      include: {
        speaker: true, // Includes the relational Speaker object
      },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(sermons);
  } catch (error: any) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch sermons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, speakerName, scripture, date, youtubeUrl, audioUrl, description, category } = body;

    if (!title || !speakerName || !scripture) {
      return NextResponse.json(
        { error: 'Title, Speaker Name, and Scripture are required' },
        { status: 400 }
      );
    }

    // 1. Find existing Speaker by name or create a new one
    let speaker = await prisma.speaker.findFirst({
      where: { name: speakerName.trim() },
    });

    if (!speaker) {
      speaker = await prisma.speaker.create({
        data: { name: speakerName.trim() },
      });
    }

    // 2. Generate a unique slug from title
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-');
    const slug = `${baseSlug}-${Date.now()}`;

    // 3. Create the Sermon connected to the Speaker ID
    const sermon = await prisma.sermon.create({
      data: {
        title,
        slug,
        speakerId: speaker.id,
        scripture,
        category: category || null,
        date: date ? new Date(date) : new Date(),
        publishedAt: new Date(),
        youtubeUrl: youtubeUrl || null,
        audioUrl: audioUrl || null,
        description: description || null,
      },
      include: {
        speaker: true,
      },
    });

    return NextResponse.json(sermon, { status: 201 });
  } catch (error: any) {
    console.error('Error creating sermon:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create sermon' }, { status: 500 });
  }
}