<script lang="ts">
	import { Button, CloseButton, Heading, Input, Label, Select } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';

	export let hidden: boolean = true;
</script>

<Heading tag="h5" class="mb-6 text-sm font-semibold uppercase">Add new product</Heading>
<CloseButton
	on:click={() => (hidden = true)}
	class="absolute right-2.5 top-2.5 text-gray-400 hover:text-black dark:text-white"
/>

<form action="#">
	<div class="space-y-4">
		<Label class="space-y-2">
			<span>Nombre</span>
			<Input
				name="name"
				class="border font-normal outline-none"
				placeholder="Ingrese el nombre del producto"
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Contenido</span>
			<Input name="content" class="border font-normal outline-none" placeholder="500" required />
		</Label>
		<Label class="space-y-2">
			<span>Tipo de contenido</span>
			<Select class="border-gray-300 font-normal outline-none">
				<option selected>Selecciona un tipo de contenido</option>
				<option>g</option>
				<option>kg</option>
				<option>l</option>
				<option>ml</option>
			</Select>
		</Label>
		<Label class="space-y-2">
			<span>Categoría</span>
			<Select class="border-gray-300 font-normal outline-none">
				<option selected>Selecciona una categoría del product</option>
				<option>Galletas</option>
				<option>Agua</option>
				<option>Refrescos</option>
				<option>Bebida energética</option>
				<option>Botana</option>
			</Select>
		</Label>
		<div class="bottom-0 left-0 flex w-full justify-center space-x-4 pb-4 md:absolute md:px-4">
			<Button type="submit" class="w-full">Add product</Button>
			<Button color="alternative" class="w-full" on:click={() => (hidden = true)}>
				<CloseOutline />
				Cancel
			</Button>
		</div>
	</div>
</form>
