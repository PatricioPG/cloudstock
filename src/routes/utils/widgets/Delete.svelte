<script lang="ts">
	import { Button, CloseButton, Heading } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';

	export let hidden: boolean = true;
	export let productId: string;
	export let fetchProducts: () => Promise<void>;

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				alert('Producto borrado!');
				await fetchProducts();
				hidden = true;
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error}`);
			}
		} catch (error) {
			console.error('Ocurrió un error al borrar el producto:', error);
			alert('Ocurrió un error al borrar el producto');
		}
	};
</script>

<Heading tag="h5" class="mb-6 text-sm font-semibold uppercase">Borrar producto</Heading>
<CloseButton
	on:click={() => (hidden = true)}
	class="absolute right-2.5 top-2.5 text-gray-400 hover:text-black dark:text-white"
/>

<ExclamationCircleOutline class="mb-4 mt-8 h-10 w-10 text-red-600" />

<h3 class="mb-6 text-lg text-gray-500 dark:text-gray-400">
	¿Estás seguro/a que deseas eliminar este producto?
</h3>

<Button color="red" class="mr-2" on:click={handleDelete}>Sí, estoy seguro/a</Button>
<Button color="alternative" on:click={() => (hidden = true)}>No, cancelar</Button>
