'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * SuspectCard Component
 * Displays information about a suspect and links to their interrogation
 */
export function SuspectCard({
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
		<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
			{/* Card header with suspect image (fallback to gradient if no image) */}
			<div className="h-32 bg-gradient-to-r from-gray-700 to-gray-600 relative">
				{/* We'll try to load the image, but it's fine if it doesn't exist */}
				<div className="absolute inset-0 opacity-50">
					<Image
						src={`/images/suspects/${id}.webp`}
						alt={name}
						fill
						className="object-cover"
						priority={false}
						onError={(e) => {
							// If image fails to load, we already have a gradient background
							const target = e.target as HTMLImageElement;
							target.style.display = 'none';
						}}
					/>
				</div>

				<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-gray-900 to-transparent">
					<h3 className="text-xl font-bold">{name}</h3>
				</div>
			</div>

			{/* Card content */}
			<div className="p-5">
				<div className="flex items-center mb-3">
					<span className="bg-red-800 text-xs px-2 py-1 rounded text-white font-medium">
						{role}
					</span>
				</div>

				<p className="text-gray-300 text-sm mb-5 line-clamp-3">{description}</p>

				<Link
					href={`/interrogate/${id}`}
					className="w-full block text-center bg-gradient-to-r from-red-800 to-red-600 text-white font-medium py-2 px-4 rounded-md hover:from-red-700 hover:to-red-500 transition-colors"
				>
					Interrogate
				</Link>
			</div>
		</div>
	);
}
