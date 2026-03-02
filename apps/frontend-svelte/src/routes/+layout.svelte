<script lang="ts">
	import { page } from '$app/stores';
	import { ClerkProvider, ClerkLoaded, ClerkLoading, SignedIn, UserButton } from 'svelte-clerk';
	import { toast } from '$lib/stores/toast';
	import '../app.css';

	let { children, data } = $props();

	const navItems = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/franchises/new', label: 'New Franchise' },
		{ href: '/collaborators', label: 'Collaborators' }
	];

	function isActive(path: string): boolean {
		if (path === '/dashboard') {
			return $page.url.pathname === '/dashboard';
		}
		return $page.url.pathname.startsWith(path);
	}

	function toastTone(type: 'success' | 'error' | 'info'): string {
		switch (type) {
			case 'success':
				return 'border-emerald-200 shadow-emerald-100/80';
			case 'error':
				return 'border-rose-200 shadow-rose-100/80';
			default:
				return 'border-blue-200 shadow-blue-100/80';
		}
	}

	function toastDot(type: 'success' | 'error' | 'info'): string {
		switch (type) {
			case 'success':
				return 'bg-emerald-500';
			case 'error':
				return 'bg-rose-500';
			default:
				return 'bg-blue-500';
		}
	}
</script>

<ClerkProvider {...data}>
	<ClerkLoading>
		<div class="flex min-h-screen items-center justify-center px-4 py-8">
			<div class="glass-panel w-full max-w-md p-8 text-center">
				<div
					class="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-blue-200 border-t-blue-600"
				></div>
				<p class="mt-5 text-sm font-semibold tracking-wide text-slate-600">Preparing your workspace</p>
				<p class="mt-1 text-sm text-slate-500">Checking authentication and loading data.</p>
			</div>
		</div>
	</ClerkLoading>

	<ClerkLoaded>
		<div class="app-shell min-h-screen">
			<SignedIn>
				<header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
					<div
						class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
					>
						<a href="/dashboard" class="inline-flex items-center gap-3 self-start lg:self-auto">
							<span
								class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-sm font-black text-white shadow-lg shadow-blue-300/60"
							>
								FM
							</span>
							<span>
								<span class="block text-xs font-bold uppercase tracking-[0.11em] text-slate-500">
									Franchise Manager
								</span>
								<span class="block text-lg font-bold text-slate-900">Operations Cockpit</span>
							</span>
						</a>

						<nav class="flex flex-wrap items-center gap-2">
							{#each navItems as item}
								<a href={item.href} class={`nav-pill ${isActive(item.href) ? 'nav-pill-active' : ''}`}>
									{item.label}
								</a>
							{/each}
						</nav>

						<div class="flex items-center justify-between gap-3 lg:justify-end">
							<div
								class="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-600 shadow-sm sm:block"
							>
								Authenticated workspace
							</div>
							<div class="rounded-full border border-slate-200 bg-white p-1 shadow-sm">
								<UserButton />
							</div>
						</div>
					</div>
				</header>
			</SignedIn>

			<main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
				{@render children()}
			</main>
		</div>
	</ClerkLoaded>

	<div class="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
		{#each $toast as t (t.id)}
			<div
				class={`pointer-events-auto overflow-hidden rounded-2xl border bg-white/95 shadow-xl backdrop-blur ${toastTone(t.type)}`}
			>
				<div class="flex items-start gap-3 px-4 py-3">
					<span class={`mt-1 h-2.5 w-2.5 rounded-full ${toastDot(t.type)}`}></span>
					<p class="flex-1 text-sm font-semibold text-slate-800">{t.message}</p>
					<button
						onclick={() => toast.remove(t.id)}
						class="text-sm font-bold leading-none text-slate-400 transition-colors hover:text-slate-700"
						aria-label="Dismiss notification"
					>
						x
					</button>
				</div>
			</div>
		{/each}
	</div>
</ClerkProvider>
