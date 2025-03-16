import { useState } from 'react';
import { suspects } from '@/data/suspects';

/**
 * AccusationButton Component
 *
 * This component allows players to make an accusation against the current suspect.
 * The accusation process has three states:
 *
 * 1. Initial state - Shows the "Accuse [suspect]" button
 * 2. Confirmation state - Shows a confirmation dialog
 * 3. Result state - Shows whether the accusation was correct or incorrect
 *
 * The component checks the suspect's isGuilty property to determine
 * if the accusation is correct. Each suspect's guilt is defined in
 * the suspects data structure.
 *
 * Usage:
 * <AccusationButton suspectId="alex" />
 */
interface AccusationButtonProps {
	suspectId: string;
}

export function AccusationButton({ suspectId }: AccusationButtonProps) {
	// Track the current state of the accusation flow
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [accusationResult, setAccusationResult] = useState<
		'correct' | 'incorrect' | null
	>(null);

	// Get the current suspect data
	const suspect = suspects[suspectId];

	/**
	 * Handles the confirmation of an accusation
	 * Checks if the accused suspect is guilty and updates the result state
	 */
	const handleAccuse = () => {
		// Check if the accused suspect is guilty
		const result = suspect.isGuilty ? 'correct' : 'incorrect';
		setAccusationResult(result);
		setShowConfirmation(false);
	};

	/**
	 * Resets the accusation state to allow for another accusation
	 */
	const handleReset = () => {
		setAccusationResult(null);
	};

	return (
		<div className="mt-4">
			{/* Step 1: Initial accusation button */}
			{!accusationResult && !showConfirmation && (
				<button
					className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
					onClick={() => setShowConfirmation(true)}
				>
					Accuse {suspect.name}
				</button>
			)}

			{/* Step 2: Confirmation dialog */}
			{showConfirmation && (
				<div className="bg-gray-800 border border-gray-700 p-4 rounded-md mt-4 transition-opacity duration-200">
					<p className="mb-4">
						Are you sure you want to accuse {suspect.name} of the murder?
					</p>
					<div className="flex space-x-3">
						<button
							onClick={handleAccuse}
							className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
						>
							Yes, Accuse
						</button>
						<button
							onClick={() => setShowConfirmation(false)}
							className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors duration-200"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* Step 3: Accusation result */}
			{accusationResult && (
				<div
					className={`p-4 rounded-md mt-4 transition-opacity duration-200 ${
						accusationResult === 'correct'
							? 'bg-green-800 border border-green-700'
							: 'bg-red-800 border border-red-700'
					}`}
				>
					<h3 className="text-xl font-bold mb-2">
						{accusationResult === 'correct' ? 'Correct!' : 'Incorrect!'}
					</h3>
					<p className="mb-4">
						{accusationResult === 'correct'
							? `You correctly identified ${suspect.name} as the murderer.`
							: `${suspect.name} is not the murderer. Continue your investigation.`}
					</p>
					<button
						onClick={handleReset}
						className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors duration-200"
					>
						Continue Investigation
					</button>
				</div>
			)}
		</div>
	);
}
