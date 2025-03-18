/**
 * Defines the structure of a suspect's data and context
 */
export interface Suspect {
	id: string;
	name: string;
	role: string;
	description: string;
	isGuilty: boolean;
	gender: string; // For proper pronoun usage
	context: {
		background: string;
		personality: string;
		alibi: string;
		secrets: string[];
	};
}

/**
 * Database of suspects and their information
 */
export const suspects: Record<string, Suspect> = {
	alexandra: {
		id: 'alexandra',
		name: 'Alexandra Morgan',
		role: 'Business Partner',
		description: 'A shrewd investor who co-founded the company with Thomas.',
		isGuilty: true,
		gender: 'female',
		context: {
			background:
				'Co-founded the tech company with Thomas 10 years ago after working on Wall Street',
			personality:
				'Ambitious, analytical, and strategic with a calculated demeanor',
			alibi:
				'Claims to have been on a video conference call with overseas investors during the murder',
			secrets: [
				'Discovered Thomas was planning to dilute her shares through a controversial merger',
				'Has been secretly negotiating with competitors to establish a rival company',
			],
		},
	},
	sarah: {
		id: 'sarah',
		name: 'Sarah Richardson',
		role: "Victim's Wife",
		description: "The victim's wife who stands to inherit his fortune.",
		isGuilty: false,
		gender: 'female',
		context: {
			background: 'Married to Thomas for 8 years, his second marriage',
			personality: 'Sophisticated and composed, with underlying stress',
			alibi: 'Claims she was in the garden during the murder',
			secrets: [
				"Recently updated her husband's life insurance policy",
				'Has been meeting with a divorce lawyer',
			],
		},
	},
	victoria: {
		id: 'victoria',
		name: 'Victoria Chen',
		role: 'Chief Financial Officer',
		description: 'The meticulous CFO who managed all company finances.',
		isGuilty: false,
		gender: 'female',
		context: {
			background:
				'Worked with Thomas for 7 years, responsible for the company financial growth',
			personality:
				'Detail-oriented, reserved, and extremely efficient with numbers',
			alibi:
				'Says she was reviewing quarterly reports in her office with the door locked',
			secrets: [
				'Has been covering up financial irregularities at the request of Thomas',
				'Was being pressured by Thomas to falsify documents for investors',
			],
		},
	},
	james: {
		id: 'james',
		name: 'James Wilson',
		role: 'Head of Security',
		description:
			'The ex-military security chief with a strict code of conduct.',
		isGuilty: false,
		gender: 'male',
		context: {
			background:
				'Former military intelligence officer hired 3 years ago to revamp security',
			personality: 'Disciplined, observant, and intensely loyal to protocol',
			alibi:
				'Says he was patrolling the east wing of the building during the incident',
			secrets: [
				'Discovered Thomas was selling company secrets to foreign investors',
				'Has been conducting unauthorized surveillance on all executives',
			],
		},
	},
};
