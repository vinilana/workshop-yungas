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
	<section class="grid min-h-[calc(100vh-7rem)] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
		<div class="space-y-6">
			<div
				class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.11em] text-blue-700"
			>
				Franchise Intelligence Platform
			</div>

			<h1 class="max-w-2xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
				Scale your network with clarity, not chaos.
			</h1>

			<p class="max-w-xl text-base text-slate-600 sm:text-lg">
				Franchise Manager centralizes franchise operations, onboarding and status tracking in one
				clear control center for your team.
			</p>

			<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div class="surface-card p-4">
					<p class="metric-label">Real-time control</p>
					<p class="mt-2 text-xl font-bold text-slate-900">24/7 visibility</p>
					<p class="mt-1 text-sm text-slate-600">Monitor the full portfolio in one place.</p>
				</div>
				<div class="surface-card p-4">
					<p class="metric-label">Faster workflows</p>
					<p class="mt-2 text-xl font-bold text-slate-900">Less manual work</p>
					<p class="mt-1 text-sm text-slate-600">Search, edit and update without spreadsheets.</p>
				</div>
				<div class="surface-card p-4">
					<p class="metric-label">Data quality</p>
					<p class="mt-2 text-xl font-bold text-slate-900">Trusted records</p>
					<p class="mt-1 text-sm text-slate-600">Structured forms reduce inconsistencies.</p>
				</div>
			</div>

			<div class="glass-panel p-5">
				<h2 class="text-lg font-bold text-slate-900">Built for operational teams</h2>
				<ul class="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
					<li class="rounded-lg bg-white/75 px-3 py-2">Unified franchise dashboard</li>
					<li class="rounded-lg bg-white/75 px-3 py-2">Quick status monitoring</li>
					<li class="rounded-lg bg-white/75 px-3 py-2">Secure authenticated access</li>
					<li class="rounded-lg bg-white/75 px-3 py-2">Mobile-friendly daily usage</li>
				</ul>
			</div>
		</div>

		<div class="glass-panel mx-auto w-full max-w-md p-6 sm:p-8">
			<p class="text-xs font-bold uppercase tracking-[0.11em] text-blue-700">Welcome Back</p>
			<h2 class="mt-2 text-3xl font-extrabold text-slate-900">Sign in to continue</h2>
			<p class="mt-2 text-sm text-slate-600">
				Access your workspace and continue managing your franchise network.
			</p>

			<div class="mt-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
				<SignIn />
			</div>
		</div>
	</section>
</SignedOut>
