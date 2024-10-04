<script lang="ts">
	import { Button, CloseButton, Heading } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let hidden: boolean = true;
	export let itemId: string | null = null;
	export let itemType: string = 'products'; // Default to 'products'
	export let fetchItems: () => Promise<void>;

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/${itemType}/${itemId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				alert(`¡Borrado exitoso!`);
				await fetchItems();
				hidden = true;
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error}`);
			}
		} catch (error) {
			console.error('Ocurrió un error al borrar: ', error);
			alert('¡Ocurrió un error al borrar!');
		}
	};
</script>

<Heading tag="h5" class="mb-6 text-sm font-semibold uppercase"
	>Borrar {itemType.slice(0, -1)}</Heading
>
<CloseButton
	on:click={() => (hidden = true)}
	class="absolute right-2.5 top-2.5 text-gray-400 hover:text-black dark:text-white"
/>

<ExclamationCircleOutline class="mb-4 mt-8 h-10 w-10 text-red-600" />

<h3 class="mb-6 text-lg text-gray-500 dark:text-gray-400">
	¿Estás seguro/a que deseas eliminar este elemento?
</h3>

<Button color="red" class="mr-2" on:click={handleDelete}>Sí, estoy seguro/a</Button>
<Button color="alternative" on:click={() => (hidden = true)}>No, cancelar</Button>
