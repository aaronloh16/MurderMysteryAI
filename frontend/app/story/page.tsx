'use client';

import { SuspectCard } from '@/components/suspects/SuspectCard';
import Link from 'next/link';
import { useSuspects, useStoryContext } from '@/hooks/useData';

/**
 * Story Page Component
 * Displays the murder story and list of suspects
 * Users can click on suspects to begin interrogation
 */
export default function StoryPage() {
	const {
		suspects,
		loading: suspectsLoading,
		error: suspectsError,
	} = useSuspects();
	const {
		storyContext,
		loading: storyLoading,
		error: storyError,
	} = useStoryContext();

	const isLoading = suspectsLoading || storyLoading;
	const hasError = suspectsError || storyError;

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

				{isLoading && (
					<div className="text-center py-12">
						<div className="animate-pulse text-xl text-gray-400">
							Loading case details...
						</div>
					</div>
				)}

				{hasError && (
					<div className="text-center py-12">
						<div className="text-red-500 text-xl">
							Error loading case details. Please try again later.
						</div>
					</div>
				)}

				{!isLoading && !hasError && (
					<>
						{/* Story overview */}
						<div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-gray-700 shadow-xl">
							<h2 className="text-2xl font-bold mb-4 text-red-400">
								{storyContext?.title || 'Murder Mystery'}
							</h2>
							<div className="prose prose-lg prose-invert max-w-none">
								<p className="text-gray-300 leading-relaxed">
									{storyContext?.description}
								</p>
								<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg">
										<span className="font-semibold text-red-400">
											Location:
										</span>{' '}
										{storyContext?.location}
									</div>
									<div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg">
										<span className="font-semibold text-red-400">Victim:</span>{' '}
										{storyContext?.victim}
									</div>
									<div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg col-span-2">
										<span className="font-semibold text-red-400">
											Murder Weapon:
										</span>{' '}
										{storyContext?.murderWeapon}
									</div>
								</div>
							</div>
						</div>

						{/* Suspects grid */}
						<div>
							<h2 className="text-2xl font-bold mb-6 text-red-400">
								The Suspects
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{Object.entries(suspects).map(([id, suspect]) => (
									<SuspectCard
										key={id}
										id={id}
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
					</>
				)}
			</div>
		</div>
	);
}
