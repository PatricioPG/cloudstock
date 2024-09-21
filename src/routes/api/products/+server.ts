import db from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { Product } from '../../../types/product';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async () => {
	const products: Product[] | null = await getProducts();

	if (products) {
		const response = {
			data: products.map((product) => ({
				type: 'products',
				id: product.id,
				attributes: {
					name: product.name,
					content: product.content,
					contentType: product.contentType,
					category: product.category
				}
			}))
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: 'No se encontraron productos' }, { status: 404, headers: header });
};

const getProducts = async (): Promise<Product[] | null> => {
	const dbData = await db('product')
		.leftJoin('category', 'product.category_id', '=', 'category.category_id')
		.leftJoin('content_type', 'product.content_type_id', '=', 'content_type.content_type_id')
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
		contentType: row.content_name,
		category: row.category_name
	}));
};
