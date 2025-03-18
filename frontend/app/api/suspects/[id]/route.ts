import { NextResponse } from 'next/server';
import { db } from '@/db';
import { suspects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const suspectId = params.id;

		const suspect = await db.query.suspects.findFirst({
			where: eq(suspects.id, suspectId),
			with: {
				context: true,
				secrets: true,
			},
		});

		if (!suspect) {
			return NextResponse.json({ error: 'Suspect not found' }, { status: 404 });
		}

		const formattedSuspect = {
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

		return NextResponse.json(formattedSuspect);
	} catch (error) {
		console.error(`Error fetching suspect ${params.id}:`, error);
		return NextResponse.json(
			{ error: 'Failed to fetch suspect' },
			{ status: 500 }
		);
	}
}
