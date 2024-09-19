import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { Product } from '../../../../types/product';
import db from '$lib/db';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async ({ params }) => {
	const { productId } = params;

	if (!productId || isNaN(Number(productId)))
		return json({ error: 'Id de producto inválido' }, { status: 400, headers: header });

	const product = await getProductById(productId);

	if (product) {
		const response = {
			data: {
				type: 'products',
				id: product.id,
				attributes: {
					name: product.name,
					content: product.content,
					content_type: product.content_type,
					category: product.category
				}
			}
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: `Producto no encontrado` }, { status: 404, headers: header });
};

const getProductById = async (id: string): Promise<Product | null> => {
	let product: Product = {
		id: '',
		name: '',
		content: 0,
		content_type: '',
		category: ''
	};

	const dbData = await db('product')
		.leftJoin('category', 'product.category_id', '=', 'category.category_id')
		.leftJoin('content_type', 'product.content_type_id', '=', 'content_type.content_type_id')
		.where({ 'product.product_id': id })
		.select(
			'product.product_id',
			'product.name',
			'product.content',
			'content_type.content_name',
			'category.category_name'
		);

	if (!dbData || dbData.length === 0) return null;

	product.id = dbData[0]['product_id'];
	product.name = dbData[0]['name'];
	product.content = dbData[0]['content'];
	product.content_type = dbData[0]['content_name'];
	product.category = dbData[0]['category_name'];

	return product;
};
