<script lang="ts">
	import { Button, CloseButton, Heading, Input, Label, Select } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import type { SelectItems } from '../../../types/selectIems';

	export let hidden: boolean = true;
	export let productId: string | null = null;
	export let fetchProducts: () => Promise<void>;

	let name: string = '';
	let content: string = '';
	let contentTypeId: string = '';
	let categoryId: string = '';
	let categories: SelectItems[] = [];
	let contentTypes: SelectItems[] = [];

	onMount(async () => {
		//Fetch categories
		const categoriesResponse = await fetch('/api/products/categories');
		const categoriesData = await categoriesResponse.json();
		categories = categoriesData.data.map((category: any) => ({
			value: String(category.id),
			name: category.attributes.name
		}));

		//Fetch contentTypes
		const contentTypesResponse = await fetch('/api/products/contentTypes');
		const contentTypesData = await contentTypesResponse.json();
		contentTypes = contentTypesData.data.map((contentType: any) => ({
			value: String(contentType.id),
			name: contentType.attributes.name
		}));

		//Fetch product data if productId is provided
		if (productId) {
			const response = await fetch(`/api/products/${productId}`);
			const data = await response.json();
			const product = data.data.attributes;

			name = product.name;
			content = product.content;
			contentTypeId = String(product.contentTypeId);
			categoryId = String(product.categoryId);
		}
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const product = { name, content, contentTypeId, categoryId };
		const method = productId ? 'PUT' : 'POST';
		const url = productId ? `/api/products/${productId}` : `/api/products`;

		try {
			console.log(product);
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(product)
			});

			if (response.ok) {
				alert('¡Producto guardado!');
				await fetchProducts();
				hidden = true;
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error}`);
			}
		} catch (error) {
			console.error('Ocurrió un error:', error);
			alert('¡Ocurrió un error!');
		}
	};
</script>

<Heading tag="h5" class="mb-6 text-sm font-semibold uppercase"
	>{productId ? 'Editar producto' : 'Agregar producto'}</Heading
>
<CloseButton
	on:click={() => (hidden = true)}
	class="absolute right-2.5 top-2.5 text-gray-400 hover:text-black dark:text-white"
/>

<form on:submit={handleSubmit}>
	<div class="space-y-4">
		<Label class="space-y-2">
			<span>Nombre</span>
			<Input
				name="name"
				class="border font-normal outline-none"
				placeholder="Ingrese el nombre del producto"
				required
				bind:value={name}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Contenido</span>
			<Input
				name="content"
				class="border font-normal outline-none"
				placeholder="500"
				required
				bind:value={content}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Tipo de contenido</span>
			<Select
				class="border-gray-300 font-normal outline-none"
				bind:value={contentTypeId}
				items={contentTypes}
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Categoría</span>
			<Select
				class="border-gray-300 font-normal outline-none"
				bind:value={categoryId}
				items={categories}
				required
			/>
		</Label>
		<div class="bottom-0 left-0 flex w-full justify-center space-x-4 pb-4 md:absolute md:px-4">
			<Button type="submit" class="w-full">Guardar</Button>
			<Button color="alternative" class="w-full" on:click={() => (hidden = true)}>
				<CloseOutline />
				Cancelar
			</Button>
		</div>
	</div>
</form>
