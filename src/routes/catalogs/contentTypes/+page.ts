import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const response = await fetch('/api/contentTypes');

	const json = await response.json();

	if (!response.ok) throw new Error(json.error || 'Falied to fetch content types');

	return { contentTypes: json.data };
}) satisfies PageLoad;
