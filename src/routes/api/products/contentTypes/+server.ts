import db from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { ContentType } from '../../../../types/contentType';

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

const getContentTypes = async (): Promise<ContentType[] | null> => {
	const dbData = await db('content_type').select('content_type_id', 'content_name');

	if (!dbData || dbData.length === 0) return null;

	return dbData.map((row: any) => ({
		id: row.content_type_id,
		name: row.content_name
	}));
};
