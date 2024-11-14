import db from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { Route } from '../../../types/route';

const header = new Headers({
	'Content-Type': 'application/vnd.api+json'
});

export const GET: RequestHandler = async () => {
	const routes: Route[] | null = await getRoutes();

	if (routes) {
		const response = {
			data: routes.map((route) => ({
				type: 'routes',
				id: route.id,
				attributes: {
					name: route.name,
					machineId: route.machineId,
					machineAlias: route.machineAlias,
					userId: route.userId,
					userName: route.userName
				}
			}))
		};

		return json(response, { status: 200, headers: header });
	} else return json({ error: 'No se encontraron rutas' }, { status: 404, headers: header });
};

const getRoutes = async (): Promise<Route[] | null> => {
	const dbData = await db('route')
		.innerJoin('vending_machine', 'route.machine_id', '=', 'vending_machine.machine_id')
		.leftJoin('user', 'route.user_id', '=', 'user.user_id')
		.select(
			'route.route_id',
			'route.route_name',
			'vending_machine.machine_id',
			'vending_machine.alias',
			'user.user_id',
			'user.user_name'
		);

	if (!dbData || dbData.length === 0) return null;

	return dbData.map((row: any) => ({
		id: row.route_id,
		name: row.route_name,
		machineId: row.machine_id,
		machineAlias: row.alias,
		userId: row.user_id,
		userName: row.user_name
	}));
};
