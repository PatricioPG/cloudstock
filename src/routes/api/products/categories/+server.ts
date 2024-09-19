import db from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { Category } from '../../../../types/category';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async () => {
	const categories: Category[] | null = await getProducts();

	if (categories) {
		const response = {
			data: categories.map((category) => ({
				type: 'categories',
				id: category.id,
				attributes: {
					name: category.name
				}
			}))
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: 'No se encontraron productos' }, { status: 404, headers: header });
};

const getProducts = async (): Promise<Category[] | null> => {
	const dbData = await db('category').select('category_id', 'category_name');

	if (!dbData || dbData.length === 0) return null;

	return dbData.map((row: any) => ({
		id: row.category_id,
		name: row.category_name
	}));
};
