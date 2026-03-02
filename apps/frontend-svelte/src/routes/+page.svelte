<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getClerk } from '$lib/clerk';
	import { isSignedIn, isLoaded } from '$lib/stores/auth';

	let signInContainer = $state<HTMLDivElement | null>(null);
	let mounted = $state(false);

	$effect(() => {
		if ($isLoaded && $isSignedIn) {
			goto('/dashboard');
		}
	});

	$effect(() => {
		if ($isLoaded && !$isSignedIn && signInContainer && mounted) {
			const clerk = getClerk();
			if (clerk) {
				clerk.mountSignIn(signInContainer);
			}
		}
	});

	onMount(() => {
		mounted = true;
	});
</script>

{#if $isLoaded && !$isSignedIn}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="w-full max-w-md">
			<h1 class="mb-8 text-center text-3xl font-bold text-gray-900">
				Franchise Manager
			</h1>
			<div bind:this={signInContainer}></div>
		</div>
	</div>
{/if}
