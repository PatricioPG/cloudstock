<script lang="ts">
	import Dashboard from '../utils/dashboard/Dashboard.svelte';
	import MetaTag from '../utils/MetaTag.svelte';
	import Footer from '../Footer.svelte';

	export let data;

	const path: string = '/dashboard';
	const description: string = 'Dashboard Page';
	const title: string = 'CloudStock Admin Dashboard';
	const subtitle: string = 'Dashboard';
</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="p-4">
	<Dashboard {data} />
</main>
<Footer />
