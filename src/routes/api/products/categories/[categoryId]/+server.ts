import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { Product } from '../../../../../types/product';
import db from '$lib/db';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async ({ params }) => {
	const { categoryId } = params;

	if (!categoryId || isNaN(Number(categoryId)))
		return json({ error: 'Id de producto inválido' }, { status: 400, headers: header });

	const products = await getProductsByCategory(categoryId);

	if (products) {
		const response = {
			data: products.map((product) => ({
				type: 'products',
				id: product.id,
				attributes: {
					name: product.name,
					content: product.content,
					content_type: product.content_type,
					category: product.category
				}
			}))
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: 'No se encontraron productos' }, { status: 404, headers: header });
};

const getProductsByCategory = async (id: string): Promise<Product[] | null> => {
	const dbData = await db('product')
		.leftJoin('category', 'product.category_id', '=', 'category.category_id')
		.leftJoin('content_type', 'product.content_type_id', '=', 'content_type.content_type_id')
		.where({ 'product.category_id': id })
		.select(
			'product.product_id',
			'product.name',
			'product.content',
			'content_type.content_name',
			'category.category_name'
		);

	if (!dbData || dbData.length === 0) return null;

	return dbData.map((row: any) => ({
		id: row.id,
		name: row.name,
		content: row.content,
		content_type: row.content_name,
		category: row.category_name
	}));
};
