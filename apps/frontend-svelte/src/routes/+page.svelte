<script lang="ts">
	import { goto } from '$app/navigation';
	import { SignIn, SignedIn, SignedOut, useClerkContext } from 'svelte-clerk';

	const ctx = useClerkContext();

	$effect(() => {
		if (ctx.isLoaded && ctx.user) {
			goto('/dashboard');
		}
	});
</script>

<SignedOut>
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="w-full max-w-md">
			<h1 class="mb-8 text-center text-3xl font-bold text-gray-900">
				Franchise Manager
			</h1>
			<SignIn />
		</div>
	</div>
</SignedOut>
