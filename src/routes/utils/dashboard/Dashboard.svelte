<script lang="ts">
	import type { PageData } from '../../$types';
	import ChartWidget from '../widgets/ChartWidget.svelte';
	import getChartOptions from '../../dashboard/chart_options';
	import { onMount } from 'svelte';

	export let data: PageData;

	let chartOptions = getChartOptions(false);
	chartOptions.series = data.series;

	let dark: boolean = false;

	function handler(ev: Event) {
		if ('detail' in ev && typeof ev.detail === 'boolean') {
			chartOptions = getChartOptions(ev.detail);
			chartOptions.series = data.series;
			dark = !!ev.detail;
		}
	}

	onMount(() => {
		document.addEventListener('dark', handler);
		return () => document.removeEventListener('dark', handler);
	});
</script>

<div class="mt-px space-y-4">
	<div class="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
		<ChartWidget {chartOptions} title="$45,385" subtitle="Sales this week" />
	</div>
</div>
