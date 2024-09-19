<script lang="ts">
	export let data: { categories: any[] };

	let categories = data.categories.map((category) => ({
		id: category.id,
		...category.attributes
	}));
</script>

<main>
	<h1>Categories</h1>
	{#if categories.length > 0}
		<ul>
			{#each categories as category}
				<li>{category.name}</li>
			{/each}
		</ul>
	{:else}
		<p>No categories available.</p>
	{/if}
</main>
