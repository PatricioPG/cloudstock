import db from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { Category } from '../../../types/category';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async () => {
	const categories: Category[] | null = await getCategories();

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

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	if (!name) {
		return json({ error: 'El nombre es requerido' }, { status: 400, headers: header });
	}

	const newCategory = await saveCategory({ name });

	if (newCategory) {
		const response = {
			data: {
				type: 'categories',
				id: newCategory.id,
				attributes: {
					name: newCategory.name
				}
			}
		};

		return json(response, { status: 200, headers: header });
	} else
		return json(
			{ error: 'Ocurrió un error al guardar la categoría' },
			{ status: 500, headers: header }
		);
};

const getCategories = async (): Promise<Category[] | null> => {
	const dbData = await db('category').select('category_id', 'category_name');

	if (!dbData || dbData.length === 0) return null;

	return dbData.map((row: any) => ({
		id: row.category_id,
		name: row.category_name
	}));
};

const saveCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
	try {
		const [insertedId] = await db('category').insert({ category_name: category.name });

		const newCategory = await db('category')
			.select('category_id', 'category_name')
			.where('category_id', insertedId)
			.first();

		return {
			id: newCategory.category_id,
			name: newCategory.category_name
		};
	} catch (error) {
		console.error('Ocurrió un error al guardar la categoría ', error);
		return null;
	}
};
