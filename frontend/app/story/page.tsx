import { suspects } from '@/data/suspects';
import { SuspectCard } from '@/components/suspects/SuspectCard';
import Link from 'next/link';

/**
 * Story Page Component
 * Displays the murder story and list of suspects
 * Users can click on suspects to begin interrogation
 */
export default function StoryPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
			<div className="max-w-7xl mx-auto">
				{/* Page header with navigation */}
				<header className="mb-10 flex justify-between items-center">
					<Link
						href="/"
						className="text-gray-400 hover:text-white transition-colors flex items-center"
					>
						<svg
							className="w-5 h-5 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back to Home
					</Link>
					<h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
						The Case
					</h1>
					<div className="w-20"></div> {/* Spacer for alignment */}
				</header>

				{/* Story overview */}
				<div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-gray-700 shadow-xl">
					<h2 className="text-2xl font-bold mb-4 text-red-400">
						The Murder of Thomas Richardson
					</h2>
					<div className="prose prose-lg prose-invert max-w-none">
						<p className="text-gray-300 leading-relaxed">
							On a stormy night at the TechVision headquarters, CEO and founder
							Thomas Richardson was found dead in his executive office on the
							top floor. The cause of death: a single gunshot wound to the
							chest. The murder weapon, his own custom engraved handgun, is
							missing.
						</p>
						<p className="text-gray-300 leading-relaxed mt-4">
							The time of death is estimated between 9:30 PM and 10:15 PM.
							Security footage shows four people were present in the building
							during that timeframe - all with their own potential motives. As
							the lead detective on this case, your job is to interrogate each
							suspect and determine who is responsible for Thomas
							Richardson&apos;s murder.
						</p>
						<p className="text-gray-300 leading-relaxed mt-4">
							Tension had been building at TechVision for months. Rumors of a
							controversial merger, financial irregularities, and internal power
							struggles created a pressure cooker environment. Someone finally
							snapped - but who?
						</p>
					</div>
				</div>

				{/* Suspects grid */}
				<div>
					<h2 className="text-2xl font-bold mb-6 text-red-400">The Suspects</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

				{/* Evidence board - placeholder for future feature */}
				<div className="mt-12 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
					<h2 className="text-2xl font-bold mb-4 text-red-400">
						Evidence Board
					</h2>
					<p className="text-gray-400 italic">
						Evidence you collect during interrogations will appear here.
					</p>
				</div>
			</div>
		</div>
	);
}
