import { suspects } from '@/data/suspects';
import { SuspectCard } from '@/components/suspects/SuspectCard';

/**
 * Story Page Component
 * Displays the murder story and list of suspects
 * Users can click on suspects to begin interrogation
 */
export default function StoryPage() {
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
								{/* Use Object.values to convert the suspects object to an array */}
								{Object.values(suspects).map((suspect) => (
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
