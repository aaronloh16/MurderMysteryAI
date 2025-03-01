/**
 * Defines the structure of a suspect's data and context
 */
export interface Suspect {
	id: string;
	name: string;
	role: string;
	description: string;
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
	alex: {
		id: 'alex',
		name: 'Alex Thompson',
		role: 'Business Partner',
		description: 'A long-time business partner with a recent falling out.',
		context: {
			background: 'Co-founded the company with Thomas 15 years ago',
			personality: 'Ambitious and calculating, but maintains a friendly facade',
			alibi: 'Claims to have been in a business call during the time of murder',
			secrets: [
				'Recently discovered Thomas was planning to sell the company without consulting him',
				'Has been secretly moving company assets',
			],
		},
	},
	sarah: {
		id: 'sarah',
		name: 'Sarah Richardson',
		role: "Victim's Wife",
		description: "The victim's wife who stands to inherit his fortune.",
		context: {
			background: 'Married to Thomas for 8 years, second marriage',
			personality: 'Sophisticated and composed, with underlying stress',
			alibi: 'Says she was in the garden during the murder',
			secrets: [
				"Recently updated her husband's life insurance policy",
				'Has been meeting with a divorce lawyer',
			],
		},
	},
	// Add more suspects...
};
