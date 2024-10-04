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
	import Route from '../../utils/widgets/Route.svelte';
	import type { ComponentType } from 'svelte';

	export let data: { routes: any[] };

	let routes = data.routes.map((route) => ({
		id: route.id,
		...route.attributes
	}));

	let hidden: boolean = true;
	let drawerComponent: ComponentType = Route;
	let selectedRouteId: string | null = null;

	const toggle = (component: ComponentType, routeId: string | null = null) => {
		drawerComponent = component;
		selectedRouteId = routeId;
		hidden = !hidden;
	};

	const fetchRoutes = async () => {
		const response = await fetch('/api/routes');
		const data = await response.json();
		routes = data.data.map((route: any) => ({
			id: route.id,
			...route.attributes
		}));
	};

	const path: string = '/pages/routes';
	const description: string = 'Routes CRUD Page';
	const title: string = 'CloudStock Admin Dashboard - Routes';
	const subtitle: string = 'CRUD Routes';
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
			<BreadcrumbItem home>Inicio</BreadcrumbItem>
			<BreadcrumbItem>Rutas</BreadcrumbItem>
		</Breadcrumb>
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl"
			>Rutas</Heading
		>
		<Toolbar embedded class="w-full py-4 text-gray-500 dark:text-gray-400">
			<!-- <Input placeholder="Buscar una categoría" class="me-6 w-80 border xl:w-96" /> -->
			<div class="space-x-2">
				<Button class="whitespace-nowrap" on:click={() => toggle(Route)}>Nueva ruta</Button>
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			<TableHeadCell class="w-4 p-4"><Checkbox /></TableHeadCell>
			{#each ['Nombre', 'Acciones'] as title}
				<TableHeadCell class="ps-4 font-normal">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each routes as route}
				<TableBodyRow class="text-base">
					<TableBodyCell class="w-4 p-4"><Checkbox /></TableBodyCell>
					<TableBodyCell class="flex items-center space-x-6 whitespace-nowrap p-4">
						<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
							<div class="text-base font-semibold text-gray-900 dark:text-white">
								{route.name}
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell class="space-x-2">
						<Button size="sm" class="gap-2 px-3" on:click={() => toggle(Route, route.id)}>
							<EditOutline size="sm" /> Editar
						</Button>
						<Button
							size="sm"
							color="red"
							class="gap-2 px-3"
							on:click={() => toggle(Delete, route.id)}
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
		routeId={selectedRouteId}
		itemId={selectedRouteId}
		itemType="routes"
		fetchItems={fetchRoutes}
		{fetchRoutes}
	/>
</Drawer>
