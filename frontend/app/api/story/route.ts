import { NextResponse } from 'next/server';
import { db } from '@/db';
import { storyContext } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
	try {
		const story = await db.query.storyContext.findFirst({
			where: eq(storyContext.id, 'main'),
		});

		if (!story) {
			return NextResponse.json({ error: 'Story not found' }, { status: 404 });
		}

		return NextResponse.json(story);
	} catch (error) {
		console.error('Error fetching story:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch story' },
			{ status: 500 }
		);
	}
}
