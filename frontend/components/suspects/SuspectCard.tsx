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
