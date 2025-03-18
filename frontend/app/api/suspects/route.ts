import { NextResponse } from 'next/server';
import { db } from '@/db';
import { suspects, contexts, secrets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
	try {
		// Fetch all suspects with their contexts and secrets
		const allSuspects = await db.query.suspects.findMany({
			with: {
				context: true,
				secrets: true,
			},
		});

		// Transform to match current structure
		const formattedSuspects = allSuspects.reduce((acc, suspect) => {
			acc[suspect.id] = {
				id: suspect.id,
				name: suspect.name,
				role: suspect.role,
				description: suspect.description,
				isGuilty: suspect.isGuilty,
				gender: suspect.gender,
				context: {
					background: suspect.context?.background || '',
					personality: suspect.context?.personality || '',
					alibi: suspect.context?.alibi || '',
					secrets: suspect.secrets.map((s) => s.content),
				},
			};
			return acc;
		}, {} as Record<string, any>);

		return NextResponse.json(formattedSuspects);
	} catch (error) {
		console.error('Error fetching suspects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch suspects' },
			{ status: 500 }
		);
	}
}
