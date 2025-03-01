/**
 * Landing Page Component
 * Simple landing page with a start button to begin the murder mystery
 */
export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
			{/* Main title card */}
			<div className="m-4 w-full max-w-2xl rounded-2xl border-2 border-gray-700 bg-gray-800 p-8 text-center">
				<h1 className="mb-6 text-4xl font-bold">Murder Mystery AI</h1>
				<p className="mb-8 text-gray-400">
					Investigate a murder by interrogating AI suspects. Can you solve the
					case?
				</p>
				{/* Link to story page */}
				<a
					href="/story"
					className="inline-block rounded-lg bg-red-700 px-6 py-3 text-lg font-semibold text-white hover:bg-red-600 transition-colors"
				>
					Begin Investigation
				</a>
			</div>
		</div>
	);
}
