<script lang="ts">
	import { Button, CloseButton, Heading, Input, Label } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	export let hidden: boolean = true;
	export let contentTypeId: string | null = null;
	export let fetchContentTypes: () => Promise<void>;

	let name: string = '';

	onMount(async () => {
		//Fetch category data if cateryId is provided
		if (contentTypeId) {
			const response = await fetch(`/api/contentTypes/${contentTypeId}`);
			const data = await response.json();
			const contentType = data.attributes;

			name = contentType.name;
		}
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const contentType = { name };
		const method = contentTypeId ? 'PUT' : 'POST';
		const url = contentTypeId ? `/api/contentTypes/${contentTypeId}` : '/api/contentTypes';

		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(contentType)
			});

			if (response.ok) {
				alert('Tipo de contenido guardado!');
				await fetchContentTypes();
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
	>{contentTypeId ? 'Editar tipo de contenido' : 'Nuevo de contenido'}</Heading
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
		<div class="bottom-0 left-0 flex w-full justify-center space-x-4 pb-4 md:absolute md:px-4">
			<Button type="submit" class="w-full">Guardar</Button>
			<Button color="alternative" class="w-full" on:click={() => (hidden = true)}>
				<CloseOutline />
				Cancelar
			</Button>
		</div>
	</div>
</form>
