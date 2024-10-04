import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { Category } from '../../../../types/category';
import db from '$lib/db';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async ({ params }) => {
	const { categoryId } = params;

	if (!categoryId || isNaN(Number(categoryId)))
		return json({ error: 'Id de categoría inválida' }, { status: 400, headers: header });

	const category = await getCategoryById(categoryId);

	if (category) {
		const response = {
			type: 'categories',
			id: category.id,
			attributes: {
				name: category.name
			}
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: 'Categoría no encontrada' }, { status: 404, headers: header });
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { name } = await request.json();
	const { categoryId } = params;

	if (!name || !categoryId || isNaN(Number(categoryId)))
		return json({ error: 'Falta información requerida' }, { status: 400, headers: header });

	const updatedCategory = await updateCategory(categoryId, { name });

	if (updatedCategory) {
		const response = {
			data: {
				type: 'categories',
				id: updatedCategory.id,
				attributes: {
					name: updatedCategory.name
				}
			}
		};

		return json(response, { status: 200, headers: header });
	} else
		return json(
			{ error: 'Ocurrió un error al actualizar la cateogría' },
			{ status: 500, headers: header }
		);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { categoryId } = params;

	if (!categoryId || isNaN(Number(categoryId)))
		return json({ error: 'Falta información requerida' }, { status: 400, headers: header });

	const deleted = await deleteCategory(categoryId);

	if (deleted) {
		return json({ message: 'Categoría borrada' }, { status: 200, headers: header });
	} else return json({ error: 'Ocurrió un error' }, { status: 500, headers: header });
};

const getCategoryById = async (id: string): Promise<Category | null> => {
	try {
		const category = await db('category')
			.select('category_id', 'category_name')
			.where('category_id', id)
			.first();

		return {
			id: category.category_id,
			name: category.category_name
		};
	} catch (error) {
		console.error('Ocurrió un error al obtener la categoría');
		return null;
	}
};

const updateCategory = async (
	id: string,
	category: Omit<Category, 'id'>
): Promise<Category | null> => {
	try {
		await db('category').where('category_id', id).update({
			category_name: category.name
		});

		return getCategoryById(id);
	} catch (error) {
		console.error('Ocurrió un error al actualizar la categoría: ', error);
		return null;
	}
};

const deleteCategory = async (id: string): Promise<boolean> => {
	try {
		const result = await db('category').where('category_id', id).del();
		return result > 0;
	} catch (error) {
		console.error('Ocurrió un error al borrar la categoría: ', error);
		return false;
	}
};
