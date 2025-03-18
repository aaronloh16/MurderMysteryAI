import { db } from './index';
import { suspects, contexts, secrets, storyContext } from './schema';
import { suspects as suspectData } from '../data/suspects';

// Define a static story context since it's not exported from suspects.ts
const storyData = {
	title: 'The Banhammer Murder',
	description:
		"On a chaotic afternoon at TechVision's open-plan office, CEO Thomas Richardson was found dead at his desk, crushed under a giant novelty keyboard labeled 'The Banhammer.' The cause of death was blunt force trauma from the oversized keyboard, a gag gift from last year's holiday party that turned deadly. The time of death is estimated between 1:00 PM and 1:30 PM, during a heated Slack debate about the company's glitchy app that had everyone on edge.",
	location: 'TechVision Headquarters',
	victim: 'Thomas Richardson (CEO)',
	murderWeapon: "Giant novelty keyboard called 'The Banhammer'",
};

async function main() {
	console.log('Seeding database...');

	try {
		// Clear existing data
		console.log('Clearing existing data...');
		await db.delete(secrets);
		await db.delete(contexts);
		await db.delete(suspects);
		await db.delete(storyContext);

		console.log('Existing data cleared');

		// Insert suspects
		for (const [id, suspect] of Object.entries(suspectData)) {
			console.log(`Adding suspect: ${suspect.name}`);

			// Insert suspect
			await db.insert(suspects).values({
				id,
				name: suspect.name,
				role: suspect.role,
				description: suspect.description,
				isGuilty: suspect.isGuilty,
				gender: suspect.gender,
			});

			// Insert context
			await db.insert(contexts).values({
				background: suspect.context.background,
				personality: suspect.context.personality,
				alibi: suspect.context.alibi,
				suspectId: id,
			});

			// Insert secrets
			for (const content of suspect.context.secrets) {
				await db.insert(secrets).values({
					content,
					suspectId: id,
				});
			}
		}

		console.log('Suspects added successfully');

		// Insert story context
		console.log('Adding story context');
		await db.insert(storyContext).values({
			id: 'main',
			title: storyData.title,
			description: storyData.description,
			location: storyData.location,
			victim: storyData.victim,
			murderWeapon: storyData.murderWeapon,
		});

		console.log('Database seeded successfully!');
	} catch (error) {
		console.error('Error during seeding:', error);
		throw error;
	}
}

main()
	.catch((e) => {
		console.error('Error seeding database:', e);
		process.exit(1);
	})
	.finally(() => {
		console.log('Seed process complete');
		process.exit(0);
	});
