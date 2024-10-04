import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { ContentType } from '../../../../types/contentType';
import db from '$lib/db';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async ({ params }) => {
	const { contentTypeId } = params;

	if (!contentTypeId || isNaN(Number(contentTypeId)))
		return json({ error: 'Id de categoría inválida' }, { status: 400, headers: header });

	const contentType = await getContentTypeById(contentTypeId);

	if (contentType) {
		const response = {
			type: 'contentTypes',
			id: contentType.id,
			attributes: {
				name: contentType.name
			}
		};

		return json(response, { status: 200, headers: header });
	} else
		return json({ error: 'Tipo de contenido no encontrada' }, { status: 404, headers: header });
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { name } = await request.json();
	const { contentTypeId } = params;

	if (!name || !contentTypeId || isNaN(Number(contentTypeId)))
		return json({ error: 'Falta información requerida' }, { status: 400, headers: header });

	const updatedContentType = await updateContentType(contentTypeId, { name });

	if (updatedContentType) {
		const response = {
			data: {
				type: 'contentTypes',
				id: updatedContentType.id,
				attributes: {
					name: updatedContentType.name
				}
			}
		};

		return json(response, { status: 200, headers: header });
	} else
		return json(
			{ error: 'Ocurrió un error al actualizar el tipo de contenido' },
			{ status: 500, headers: header }
		);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { contentTypeId } = params;

	if (!contentTypeId || isNaN(Number(contentTypeId)))
		return json({ error: 'Falta información requerida' }, { status: 400, headers: header });

	const deleted = await deleteContentType(contentTypeId);

	if (deleted) {
		return json({ message: 'Tipo de contenido borrado' }, { status: 200, headers: header });
	} else return json({ error: 'Ocurrió un error' }, { status: 500, headers: header });
};

const getContentTypeById = async (id: string): Promise<ContentType | null> => {
	try {
		const contentType = await db('content_type')
			.select('content_type_id', 'content_name')
			.where('content_type_id', id)
			.first();

		return {
			id: contentType.content_type_id,
			name: contentType.content_name
		};
	} catch (error) {
		console.error('Ocurrió un error al obtener el tipo de contenido');
		return null;
	}
};

const updateContentType = async (
	id: string,
	contentType: Omit<ContentType, 'id'>
): Promise<ContentType | null> => {
	try {
		await db('content_type').where('content_type_id', id).update({
			content_name: contentType.name
		});

		return getContentTypeById(id);
	} catch (error) {
		console.error('Ocurrió un error al actualizar el tipo de contenido: ', error);
		return null;
	}
};

const deleteContentType = async (id: string): Promise<boolean> => {
	try {
		const result = await db('content_type').where('content_type_id', id).del();
		return result > 0;
	} catch (error) {
		console.error('Ocurrió un error al borrar el tipo de contenido: ', error);
		return false;
	}
};
