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
					contentTypeId: product.contentTypeId,
					contentType: product.contentType,
					categoryId: product.categoryId,
					category: product.category
				}
			}
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: `Producto no encontrado` }, { status: 404, headers: header });
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { name, content, contentTypeId, categoryId } = await request.json();
	const { productId } = params;

	console.log(productId);

	if (
		!name ||
		!content ||
		!contentTypeId ||
		!categoryId ||
		!productId ||
		typeof productId === 'undefined'
	) {
		return json({ error: 'Falta información requerida' }, { status: 400, headers: header });
	}

	const updatedProduct = await updateProduct(productId, {
		name,
		content,
		contentTypeId,
		categoryId
	});

	if (updatedProduct) {
		const response = {
			data: {
				type: 'products',
				id: updatedProduct.id,
				attributes: {
					name: updatedProduct.name,
					content: updatedProduct.content,
					contentTypeId: updatedProduct.contentTypeId,
					contentType: updatedProduct.contentType,
					categoryId: updatedProduct.categoryId,
					category: updatedProduct.category
				}
			}
		};

		return json(response, { status: 200, headers: header });
	} else
		return json(
			{ error: 'Ocurrió un error al actualizar el producto' },
			{ status: 500, headers: header }
		);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { productId } = params;

	if (!productId || typeof productId === 'undefined' || isNaN(Number(productId)))
		return json({ error: 'Falta información requerida' }, { status: 400, headers: header });

	const deleted = await deleteProduct(productId);

	if (deleted) {
		return json({ message: 'Producto borrado' }, { status: 200, headers: header });
	} else return json({ error: 'Ocurrió un error' }, { status: 500, headers: header });
};

const getProductById = async (id: string): Promise<Product | null> => {
	let product: Product = {
		id: '',
		name: '',
		content: 0,
		contentTypeId: '',
		contentType: '',
		categoryId: '',
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
			'content_type.content_type_id',
			'content_type.content_name',
			'category.category_id',
			'category.category_name'
		);

	if (!dbData || dbData.length === 0) return null;

	product.id = dbData[0]['product_id'];
	product.name = dbData[0]['name'];
	product.content = dbData[0]['content'];
	product.contentTypeId = dbData[0]['content_type_id'];
	product.contentType = dbData[0]['content_name'];
	product.categoryId = dbData[0]['category_id'];
	product.category = dbData[0]['category_name'];

	return product;
};

const updateProduct = async (id: string, product: Omit<Product, 'id'>): Promise<Product | null> => {
	try {
		await db('product').where('product_id', id).update({
			name: product.name,
			content: product.content,
			content_type_id: product.contentTypeId,
			category_id: product.categoryId
		});

		return getProductById(typeof id === 'undefined' ? '' : id);
	} catch (error) {
		console.error('Error updating product:', error);
		return null;
	}
};

const deleteProduct = async (id: string): Promise<boolean> => {
	try {
		const result = await db('product').where('product_id', id).del();
		return result > 0;
	} catch (error) {
		console.error('Error deleting product:', error);
		return false;
	}
};
