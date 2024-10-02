<script lang="ts">
	import { Button, CloseButton, Heading, Input, Label } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';

	export let hidden: boolean = true;
</script>

<Heading tag="h5" class="mb-6 text-sm font-semibold uppercase">Add new category</Heading>
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
		<div class="bottom-0 left-0 flex w-full justify-center space-x-4 pb-4 md:absolute md:px-4">
			<Button type="submit" class="w-full">Add category</Button>
			<Button color="alternative" class="w-full" on:click={() => (hidden = true)}>
				<CloseOutline />
				Cancel
			</Button>
		</div>
	</div>
</form>
