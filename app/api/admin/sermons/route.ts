import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(sermons);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sermons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, speaker, date, scripture, slug, youtubeUrl, audioUrl, description } = body;

    if (!title || !speaker || !date || !scripture) {
      return NextResponse.json({ error: 'Title, speaker, date, and scripture are required' }, { status: 400 });
    }

    const sermon = await prisma.sermon.create({
      data: {
        title,
        slug: slug || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        speaker,
        date: new Date(date),
        scripture,
        youtubeUrl: youtubeUrl || null,
        audioUrl: audioUrl || null,
        description: description || null,
      },
    });

    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sermon' }, { status: 500 });
  }
}