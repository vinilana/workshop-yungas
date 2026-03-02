<script lang="ts">
	import { onMount } from 'svelte';
	import { initClerk, getClerk } from '$lib/clerk';
	import { auth, isSignedIn, isLoaded } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import '../app.css';

	let { children } = $props();

	onMount(async () => {
		try {
			const clerk = await initClerk();
			auth.setClerk(clerk);

			clerk.addListener((resources) => {
				auth.update(!!resources.user);
			});
		} catch (err) {
			console.error('Failed to initialize Clerk:', err);
		}
	});

	async function signOut() {
		const clerk = getClerk();
		if (clerk) {
			await clerk.signOut();
		}
	}
</script>

{#if !$isLoaded}
	<div class="flex h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<div
				class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
			></div>
			<p class="mt-4 text-gray-600">Loading...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50">
		{#if $isSignedIn}
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
						<button
							onclick={signOut}
							class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
						>
							Sign Out
						</button>
					</nav>
				</div>
			</header>
		{/if}

		<main>
			{@render children()}
		</main>
	</div>

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
{/if}
