<script lang="ts">
	export let data: { products: any[] };

	let products = data.products.map((product) => ({
		id: product.id,
		...product.attributes
	}));
</script>

<main>
	<h1>Products</h1>
	{#if products.length > 0}
		<ul>
			{#each products as product}
				<li>{product.name} - {product.category}</li>
			{/each}
		</ul>
	{:else}
		<p>No products available.</p>
	{/if}
</main>
