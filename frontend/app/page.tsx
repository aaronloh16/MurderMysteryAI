import Link from 'next/link';

/**
 * Landing Page Component
 * An immersive landing page for the Murder Mystery AI game
 */
export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white relative overflow-hidden">
			{/* Background effect */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent opacity-70"></div>

			{/* Main content */}
			<div className="relative z-10 max-w-4xl w-full px-6 py-12 text-center">
				<h1 className="mb-4 text-6xl font-extrabold tracking-tight">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
						Murder Mystery AI
					</span>
				</h1>

				<p className="mb-8 text-xl text-gray-300 max-w-2xl mx-auto">
					Become the detective in an interactive murder investigation powered by
					AI.
				</p>

				{/* Game description */}
				<div className="mb-12 backdrop-blur-sm bg-gray-800/50 p-8 rounded-2xl border border-gray-700 max-w-3xl mx-auto shadow-2xl">
					<h2 className="text-2xl font-bold mb-4 text-red-400">The Mystery</h2>
					<p className="text-gray-300 mb-4">
						Tech mogul Thomas Richardson has been found dead in his office at
						TechVision headquarters. Four suspects were in the building that
						night, each with their own motives.
					</p>
					<p className="text-gray-300 mb-4">
						Your mission: interrogate each suspect using natural voice
						conversations, gather evidence, and solve the case by identifying
						the killer.
					</p>
					<div className="flex flex-wrap gap-4 justify-center mt-6">
						<div className="bg-gray-700/50 rounded-lg p-3 max-w-[180px]">
							<h3 className="font-semibold text-purple-300">
								Voice Interrogation
							</h3>
							<p className="text-sm text-gray-400">
								Talk to suspects using your voice
							</p>
						</div>
						<div className="bg-gray-700/50 rounded-lg p-3 max-w-[180px]">
							<h3 className="font-semibold text-purple-300">
								Collect Evidence
							</h3>
							<p className="text-sm text-gray-400">
								Find clues through conversation
							</p>
						</div>
						<div className="bg-gray-700/50 rounded-lg p-3 max-w-[180px]">
							<h3 className="font-semibold text-purple-300">
								Make Accusations
							</h3>
							<p className="text-sm text-gray-400">
								Identify the killer when ready
							</p>
						</div>
					</div>
				</div>

				{/* CTA button */}
				<Link
					href="/story"
					className="inline-block px-8 py-4 text-xl font-bold text-white rounded-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-800/50 transform hover:-translate-y-1"
				>
					Begin Investigation
				</Link>
			</div>

			{/* Footer info */}
			<div className="absolute bottom-4 text-sm text-gray-500">
				Murder Mystery AI - Voice-enabled detective game
			</div>
		</div>
	);
}
