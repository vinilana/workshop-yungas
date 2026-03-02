<script lang="ts">
	import { ClerkProvider, ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from 'svelte-clerk';
	import { toast } from '$lib/stores/toast';
	import '../app.css';

	let { children, data } = $props();
</script>

<ClerkProvider {...data}>
	<ClerkLoading>
		<div class="flex h-screen items-center justify-center bg-gray-50">
			<div class="text-center">
				<div
					class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
				></div>
				<p class="mt-4 text-gray-600">Loading...</p>
			</div>
		</div>
	</ClerkLoading>

	<ClerkLoaded>
		<div class="min-h-screen bg-gray-50">
			<SignedIn>
				<header class="border-b border-gray-200 bg-white shadow-sm">
					<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
						<a href="/dashboard" class="text-xl font-bold text-gray-900">
							Franchise Manager
						</a>
						<nav class="flex items-center gap-4">
							<a href="/dashboard" class="text-sm font-medium text-gray-700 hover:text-gray-900">
								Dashboard
							</a>
							<a href="/franchises/new" class="text-sm font-medium text-gray-700 hover:text-gray-900">
								New Franchise
							</a>
							<UserButton />
						</nav>
					</div>
				</header>
			</SignedIn>

			<main>
				{@render children()}
			</main>
		</div>
	</ClerkLoaded>

	<!-- Toast notifications -->
	<div class="fixed right-4 top-4 z-50 flex flex-col gap-2">
		{#each $toast as t (t.id)}
			<div
				class="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg"
				class:bg-green-600={t.type === 'success'}
				class:bg-red-600={t.type === 'error'}
				class:bg-blue-600={t.type === 'info'}
			>
				<span>{t.message}</span>
				<button onclick={() => toast.remove(t.id)} class="ml-2 text-white/80 hover:text-white">
					&times;
				</button>
			</div>
		{/each}
	</div>
</ClerkProvider>
