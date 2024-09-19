import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const response = await fetch('/api/products');

	const json = await response.json();

	if (!response.ok) throw new Error(json.error || 'Failed to fetch products');

	return { products: json.data };
}) satisfies PageLoad;
