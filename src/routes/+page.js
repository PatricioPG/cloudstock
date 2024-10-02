// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import * as dashboard from './dashboard/+page';
/** @type {import("./dashboard/$types").PageLoad} */

export function load(request) {
	return dashboard.load(request);
}
