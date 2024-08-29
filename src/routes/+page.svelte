<script lang="ts">
	import type { PageData } from './$types';
	import Dashboard from './utils/dashboard/Dashboard.svelte';
	import MetaTag from './utils/MetaTag.svelte';

	export let data: PageData;

	const path: string = '';
	const description: string = 'Admin Dashboard';
	const title: string = 'CloudStock Admin Dashboard - Home';
	const subtitle: string = 'Admin Dashboard';
</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="p-4">
	<Dashboard {data} />
</main>
