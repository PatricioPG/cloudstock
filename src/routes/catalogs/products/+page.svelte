<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Checkbox,
		Drawer,
		Heading,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toolbar
	} from 'flowbite-svelte';
	import { EditOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';
	import MetaTag from '../../utils/MetaTag.svelte';
	import Delete from '../../utils/widgets/Delete.svelte';
	import Product from '../../utils/widgets/Product.svelte';
	import type { ComponentType } from 'svelte';

	export let data: { products: any[] };

	let products = data.products.map((product) => ({
		id: product.id,
		...product.attributes
	}));

	let hidden: boolean = true;
	let drawerComponent: ComponentType = Product;
	let selectedProductId: string | null = null;

	const toggle = (component: ComponentType, productId: string | null = null) => {
		drawerComponent = component;
		selectedProductId = productId;
		hidden = !hidden;
	};

	const fetchProducts = async () => {
		const response = await fetch('/api/products');
		const data = await response.json();
		products = data.data.map((product: any) => ({
			id: product.id,
			...product.attributes
		}));
	};

	const path: string = '/catalogs/products';
	const description: string = 'Products CRUD Page';
	const title: string = 'CloudStock Admin Dashboard - Products Catalog';
	const subtitle: string = 'CRUD Products';
	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	};
</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Breadcrumb class="mb-5">
			<BreadcrumbItem home>Home</BreadcrumbItem>
			<BreadcrumbItem>Products</BreadcrumbItem>
		</Breadcrumb>
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl"
			>Productos</Heading
		>
		<Toolbar embedded class="w-full py-4 text-gray-500 dark:text-gray-400">
			<Input placeholder="Buscar un producto" class="me-6 w-80 border xl:w-96" />
			<div class="space-x-2" slot="end">
				<Button class="whitespace-nowrap" on:click={() => toggle(Product)}
					>Agregar nuevo producto</Button
				>
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			<TableHeadCell class="w-4 p-4"><Checkbox /></TableHeadCell>
			{#each ['Nombre', 'Contenido', 'Acciones'] as title}
				<TableHeadCell class="ps-4 font-normal">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each products as product}
				<TableBodyRow class="text-base">
					<TableBodyCell class="w-4 p-4"><Checkbox /></TableBodyCell>
					<TableBodyCell class="flex items-center space-x-6 whitespace-nowrap p-4">
						<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
							<div class="text-base font-semibold text-gray-900 dark:text-white">
								{product.name}
							</div>
							<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
								{product.category}
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell class="p-4">{product.content} {product.contentType}</TableBodyCell>
					<TableBodyCell class="space-x-2">
						<Button size="sm" class="gap-2 px-3" on:click={() => toggle(Product, product.id)}>
							<EditOutline size="sm" /> Editar
						</Button>
						<Button
							size="sm"
							color="red"
							class="gap-2 px-3"
							on:click={() => toggle(Delete, product.id)}
						>
							<TrashBinSolid size="sm" /> Borrar
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</main>

<Drawer placement="right" transitionType="fly" {transitionParams} bind:hidden>
	<svelte:component
		this={drawerComponent}
		bind:hidden
		productId={selectedProductId}
		{fetchProducts}
	/>
</Drawer>
