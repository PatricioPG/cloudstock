import db from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { ContentType } from '../../../types/contentType';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async () => {
	const contentTypes: ContentType[] | null = await getContentTypes();

	if (contentTypes) {
		const response = {
			data: contentTypes.map((contentType) => ({
				type: 'contentTypes',
				id: contentType.id,
				attributes: {
					name: contentType.name
				}
			}))
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: 'No se encontraron productos' }, { status: 404, headers: header });
};

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	if (!name)
		return json(
			{ error: 'El nombre del tipo de contenido es requerido' },
			{ status: 400, headers: header }
		);

	const newContentType = await saveContentType({ name });

	if (newContentType) {
		const response = {
			data: {
				type: 'contentType',
				id: newContentType.id,
				attributes: {
					name: newContentType.name
				}
			}
		};

		return json(response, { status: 200, headers: header });
	} else
		return json(
			{ error: 'Ocurrió un error al guardar el tipo de contenido' },
			{ status: 500, headers: header }
		);
};

const getContentTypes = async (): Promise<ContentType[] | null> => {
	const dbData = await db('content_type').select('content_type_id', 'content_name');

	if (!dbData || dbData.length === 0) return null;

	return dbData.map((row: any) => ({
		id: row.content_type_id,
		name: row.content_name
	}));
};

const saveContentType = async (
	contentType: Omit<ContentType, 'id'>
): Promise<ContentType | null> => {
	try {
		const [insertedId] = await db('content_type').insert({ content_name: contentType.name });

		const newContentType = await db('content_type')
			.select('content_type_id', 'content_name')
			.where('content_type_id', insertedId)
			.first();

		return {
			id: newContentType.content_type_id,
			name: newContentType.content_name
		};
	} catch (error) {
		console.error('Ocurrió un error al guardar el tipo de contenido: ', error);
		return null;
	}
};
