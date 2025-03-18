import { useEffect, useState } from 'react';
import { Suspect } from '@/data/suspects'; // Only importing the type

export function useSuspects() {
	const [suspects, setSuspects] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function fetchSuspects() {
			try {
				const response = await fetch('/api/suspects');
				if (!response.ok) throw new Error('Failed to fetch suspects');
				const data = await response.json();
				setSuspects(data);
			} catch (err) {
				setError(err instanceof Error ? err : new Error(String(err)));
			} finally {
				setLoading(false);
			}
		}

		fetchSuspects();
	}, []);

	return { suspects, loading, error };
}

export function useSuspect(id: string) {
	const [suspect, setSuspect] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function fetchSuspect() {
			try {
				const response = await fetch(`/api/suspects/${id}`);
				if (!response.ok) throw new Error(`Failed to fetch suspect ${id}`);
				const data = await response.json();
				setSuspect(data);
			} catch (err) {
				setError(err instanceof Error ? err : new Error(String(err)));
			} finally {
				setLoading(false);
			}
		}

		if (id) {
			fetchSuspect();
		}
	}, [id]);

	return { suspect, loading, error };
}

export function useStoryContext() {
	const [storyContext, setStoryContext] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function fetchStoryContext() {
			try {
				const response = await fetch('/api/story');
				if (!response.ok) throw new Error('Failed to fetch story context');
				const data = await response.json();
				setStoryContext(data);
			} catch (err) {
				setError(err instanceof Error ? err : new Error(String(err)));
			} finally {
				setLoading(false);
			}
		}

		fetchStoryContext();
	}, []);

	return { storyContext, loading, error };
}
