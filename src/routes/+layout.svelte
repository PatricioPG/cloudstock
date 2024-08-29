<script>
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Sidebar from './Sidebar.svelte';
	import '../app.css';
</script>

<header
	class="fixed top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
>
	<Header />
</header>

<div class="overflow-hidden lg:flex">
	<Sidebar />
	<div class="relative h-full w-full overflow-y-auto lg:ml-64 pt-[70px]">
		<slot />
	</div>
</div>
