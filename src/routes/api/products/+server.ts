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
					contentTypeId: product.contentTypeId,
					contentType: product.contentType,
					categoryId: product.categoryId,
					category: product.category
				}
			}))
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: 'No se encontraron productos' }, { status: 404, headers: header });
};

export const POST: RequestHandler = async ({ request }) => {
	const { name, content, contentTypeId, categoryId } = await request.json();

	if (!name || !content || !contentTypeId || !categoryId) {
		return json({ error: 'Falta información requerida' }, { status: 400, headers: header });
	}

	const newProduct = await saveProduct({ name, content, contentTypeId, categoryId });

	if (newProduct) {
		const response = {
			data: {
				type: 'products',
				id: newProduct.id,
				attributes: {
					name: newProduct.name,
					content: newProduct.content,
					contentType: newProduct.contentType,
					category: newProduct.category
				}
			}
		};

		return json(response, { status: 200, headers: header });
	} else
		return json(
			{ error: 'Ocurrió un error al guardar el producto' },
			{ status: 500, headers: header }
		);
};

const getProducts = async (): Promise<Product[] | null> => {
	const dbData = await db('product')
		.leftJoin('category', 'product.category_id', '=', 'category.category_id')
		.leftJoin('content_type', 'product.content_type_id', '=', 'content_type.content_type_id')
		.select(
			'product.product_id',
			'product.name',
			'product.content',
			'content_type.content_type_id',
			'content_type.content_name',
			'category.category_id',
			'category.category_name'
		);

	if (!dbData || dbData.length === 0) return null;

	return dbData.map((row: any) => ({
		id: row.product_id,
		name: row.name,
		content: row.content,
		contentTypeId: row.content_type_id,
		contentType: row.content_name,
		categoryId: row.category_id,
		category: row.category_name
	}));
};

const saveProduct = async (product: Product): Promise<Product | null> => {
	try {
		const [insertedId] = await db('Product').insert({
			name: product.name,
			content: product.content,
			content_type_id: product.contentTypeId,
			category_id: product.categoryId
		});

		const newProduct = await db('product')
			.join('category', 'product.category_id', '=', 'category.category_id')
			.join('content_type', 'product.content_type_id', '=', 'content_type.content_type_id')
			.select(
				'product.product_id',
				'product.name',
				'product.content',
				'content_type.content_type_id',
				'content_type.content_name',
				'category.category_id',
				'category.category_name'
			)
			.where('product.product_id', insertedId)
			.first();

		return {
			id: newProduct.product_id,
			name: newProduct.name,
			content: newProduct.content,
			contentTypeId: newProduct.content_type_id,
			contentType: newProduct.content_name,
			categoryId: newProduct.category_id,
			category: newProduct.category_name
		};
	} catch (error) {
		console.error('Ocurrió un error al guardar el producto', error);
		return null;
	}
};
