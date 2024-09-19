import type { RequestHandler } from './$types';

const header = new Headers({
	'Content-Type': 'application/json'
});

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify({ data: 'Welcome to CloudStock API' }), {
		status: 200,
		headers: header
	});
};
