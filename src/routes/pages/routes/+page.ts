import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const response = await fetch('/api/routes');

	const json = await response.json();

	if (!response.ok) throw new Error(json.error || 'Failed to fetch routes');

	return { routes: json.data };
}) satisfies PageLoad;
