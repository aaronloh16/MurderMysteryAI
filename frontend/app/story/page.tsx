/**
 * Story Page Component
 * Displays the murder story and list of suspects
 * Users can click on suspects to begin interrogation
 */
export default function StoryPage() {
	// We can move this to a separate data file later
	const suspects = [
		{
			id: 'alex',
			name: 'Alex Thompson',
			role: 'Business Partner',
			description: 'A long-time business partner with a recent falling out.',
		},
		{
			id: 'sarah',
			name: 'Sarah Richardson',
			role: "Victim's Wife",
			description: "The victim's wife who stands to inherit his fortune.",
		},
		{
			id: 'james',
			name: 'James Butler',
			role: 'House Staff',
			description: 'The butler who discovered the body.',
		},
	];

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6">
			<div className="max-w-7xl mx-auto">
				{/* Page header */}
				<h1 className="text-3xl font-bold text-center mb-8">The Case</h1>

				{/* Two-column layout */}
				<div className="flex flex-col md:flex-row gap-6">
					{/* Story section */}
					<div className="flex-1">
						<div className="bg-gray-800 rounded-lg p-6">
							<h2 className="text-xl font-bold mb-4">The Story</h2>
							<div className="prose prose-invert">
								<p className="text-gray-300">
									On a stormy night at the old mansion, the wealthy businessman
									Thomas Richardson was found dead in his study. The cause of
									death: a single gunshot wound. The murder weapon is missing,
									and several suspects were present at the time of the murder.
								</p>
								{/* Add more story details as needed */}
							</div>
						</div>
					</div>

					{/* Suspects section */}
					<div className="flex-1">
						<div className="bg-gray-800 rounded-lg p-6">
							<h2 className="text-xl font-bold mb-4">Suspects</h2>
							<div className="grid gap-4">
								{suspects.map((suspect) => (
									<SuspectCard
										key={suspect.id}
										id={suspect.id}
										name={suspect.name}
										role={suspect.role}
										description={suspect.description}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * SuspectCard Component
 * Displays information about a suspect and links to their interrogation
 */
function SuspectCard({
	id,
	name,
	role,
	description,
}: {
	id: string;
	name: string;
	role: string;
	description: string;
}) {
	return (
		<div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
			<h3 className="text-lg font-semibold">{name}</h3>
			<p className="text-sm text-gray-400 mb-2">{role}</p>
			<p className="text-sm text-gray-300 mb-4">{description}</p>
			<a
				href={`/interrogate/${id}`}
				className="inline-block bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
			>
				Interrogate
			</a>
		</div>
	);
}
