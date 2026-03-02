<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { useClerkContext } from 'svelte-clerk';
	import { toast } from '$lib/stores/toast';
	import { getFranchises, deleteFranchise } from '$lib/api';
	import type { Franchise } from '@franchise/shared';

	const ctx = useClerkContext();

	let franchises = $state<Franchise[]>([]);
	let loading = $state(true);
	let search = $state('');
	let searchTimeout: ReturnType<typeof setTimeout>;
	let deleteConfirm = $state<Franchise | null>(null);
	let deleting = $state(false);
	const totalCount = $derived(franchises.length);
	const activeCount = $derived(franchises.filter((franchise) => franchise.status === 'active').length);
	const pendingCount = $derived(franchises.filter((franchise) => franchise.status === 'pending').length);
	const inactiveCount = $derived(franchises.filter((franchise) => franchise.status === 'inactive').length);
	const resultLabel = $derived(
		search.trim() ? `Results for "${search.trim()}"` : 'Showing all franchises'
	);

	$effect(() => {
		if (ctx.isLoaded && !ctx.user) {
			goto('/');
		}
	});

	onMount(() => {
		loadFranchises();
	});

	async function loadFranchises() {
		loading = true;
		try {
			const response = await getFranchises(search || undefined);
			franchises = response.data;
		} catch (err) {
			toast.error('Failed to load franchises');
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function handleSearch() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			loadFranchises();
		}, 300);
	}

	function clearSearch() {
		search = '';
		loadFranchises();
	}

	async function confirmDelete() {
		if (!deleteConfirm) return;
		deleting = true;
		try {
			await deleteFranchise(deleteConfirm.id);
			toast.success('Franchise deleted successfully');
			deleteConfirm = null;
			await loadFranchises();
		} catch (err) {
			toast.error('Failed to delete franchise');
			console.error(err);
		} finally {
			deleting = false;
		}
	}

	function statusClass(status: string): string {
		switch (status) {
			case 'active':
				return 'status-pill status-pill-active';
			case 'pending':
				return 'status-pill status-pill-pending';
			case 'inactive':
				return 'status-pill status-pill-inactive';
			default:
				return 'status-pill status-pill-default';
		}
	}

	function statusLabel(status: string): string {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}
</script>

<div class="space-y-6">
	<section class="glass-panel relative overflow-hidden p-6 sm:p-8">
		<div class="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-blue-200/60 blur-2xl">
		</div>
		<div
			class="pointer-events-none absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-emerald-200/50 blur-2xl"
		></div>

		<div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-2xl space-y-3">
				<p class="text-xs font-bold uppercase tracking-[0.11em] text-blue-700">
					Network Command Center
				</p>
				<h1 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">Franchise Portfolio</h1>
				<p class="text-sm text-slate-600 sm:text-base">
					Track operational status, update franchise records and keep leadership visibility high with
					a cleaner day-to-day workflow.
				</p>
			</div>
			<a href="/franchises/new" class="primary-btn w-full sm:w-auto">+ New Franchise</a>
		</div>
	</section>

	<section class="grid-metrics">
		<div class="metric-card">
			<p class="metric-label">Total Franchises</p>
			<p class="mt-2 metric-value">{totalCount}</p>
			<p class="mt-1 text-xs font-semibold text-slate-500">Current records in your network</p>
		</div>
		<div class="metric-card">
			<p class="metric-label">Active</p>
			<p class="mt-2 metric-value">{activeCount}</p>
			<p class="mt-1 text-xs font-semibold text-emerald-700">Healthy operations</p>
		</div>
		<div class="metric-card">
			<p class="metric-label">Pending</p>
			<p class="mt-2 metric-value">{pendingCount}</p>
			<p class="mt-1 text-xs font-semibold text-amber-700">Need onboarding follow-up</p>
		</div>
		<div class="metric-card">
			<p class="metric-label">Inactive</p>
			<p class="mt-2 metric-value">{inactiveCount}</p>
			<p class="mt-1 text-xs font-semibold text-rose-700">Require reactivation plan</p>
		</div>
	</section>

	<section class="surface-card p-4 sm:p-5">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<label class="relative block w-full lg:max-w-xl">
				<span
					class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.09em] text-slate-400"
				>
					Find
				</span>
				<input
					type="text"
					placeholder="name, owner, email or location"
					bind:value={search}
					oninput={handleSearch}
					class="form-control pl-16"
				/>
			</label>

			<div class="flex items-center gap-2">
				{#if search.trim()}
					<button type="button" onclick={clearSearch} class="secondary-btn">Clear</button>
				{/if}
				<div
					class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
				>
					{resultLabel}
				</div>
			</div>
		</div>
	</section>

	{#if loading}
		<div class="surface-card p-6 sm:p-8">
			<div class="animate-pulse space-y-3">
				<div class="h-5 w-1/3 rounded bg-slate-200"></div>
				<div class="h-4 w-full rounded bg-slate-200"></div>
				<div class="h-4 w-5/6 rounded bg-slate-200"></div>
				<div class="h-4 w-4/6 rounded bg-slate-200"></div>
			</div>
		</div>
	{:else if franchises.length === 0}
		<div class="glass-panel p-10 text-center">
			<h2 class="text-2xl font-bold text-slate-900">No franchises found</h2>
			<p class="mt-2 text-sm text-slate-600">
				Create your first franchise entry to start tracking your network.
			</p>
			<a href="/franchises/new" class="primary-btn mt-6">Create first franchise</a>
		</div>
	{:else}
		<div class="space-y-3 md:hidden">
			{#each franchises as franchise (franchise.id)}
				<article class="surface-card p-4">
					<div class="flex items-start justify-between gap-3">
						<div>
							<h2 class="text-base font-bold text-slate-900">{franchise.name}</h2>
							<p class="text-sm text-slate-600">{franchise.ownerName}</p>
						</div>
						<span class={statusClass(franchise.status)}>{statusLabel(franchise.status)}</span>
					</div>

					<div class="mt-3 space-y-1 text-sm text-slate-600">
						<p>{franchise.email}</p>
						<p>{franchise.city}/{franchise.state}</p>
					</div>

					<div class="mt-4 flex gap-2">
						<a href="/franchises/{franchise.id}" class="secondary-btn">Edit</a>
						<button onclick={() => (deleteConfirm = franchise)} class="danger-soft-btn">Delete</button>
					</div>
				</article>
			{/each}
		</div>

		<div class="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
			<div class="overflow-x-auto">
				<table class="data-table min-w-full divide-y divide-slate-200">
					<thead class="bg-slate-50/80">
						<tr>
							<th class="px-6 py-3 text-left">Name</th>
							<th class="px-6 py-3 text-left">Owner</th>
							<th class="px-6 py-3 text-left">Email</th>
							<th class="px-6 py-3 text-left">City/State</th>
							<th class="px-6 py-3 text-left">Status</th>
							<th class="px-6 py-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200 bg-white">
						{#each franchises as franchise (franchise.id)}
							<tr>
								<td class="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
									{franchise.name}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
									{franchise.ownerName}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
									{franchise.email}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
									{franchise.city}/{franchise.state}
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span class={statusClass(franchise.status)}>{statusLabel(franchise.status)}</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm">
									<div class="flex items-center gap-3">
										<a
											href="/franchises/{franchise.id}"
											class="font-semibold text-blue-700 transition-colors hover:text-blue-900"
										>
											Edit
										</a>
										<button
											onclick={() => (deleteConfirm = franchise)}
											class="font-semibold text-rose-600 transition-colors hover:text-rose-800"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

{#if deleteConfirm}
	<div class="modal-overlay z-50 flex items-center justify-center p-4">
		<div class="glass-panel w-full max-w-lg p-6 sm:p-7">
			<p class="text-xs font-bold uppercase tracking-[0.1em] text-rose-600">Danger Zone</p>
			<h2 class="mt-2 text-2xl font-bold text-slate-900">Delete franchise permanently?</h2>
			<p class="mt-2 text-sm text-slate-600">
				You are about to delete <strong>{deleteConfirm.name}</strong>. This operation cannot be
				undone.
			</p>

			<div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<button onclick={() => (deleteConfirm = null)} class="secondary-btn">Cancel</button>
				<button
					onclick={confirmDelete}
					disabled={deleting}
					class="danger-btn"
				>
					{deleting ? 'Deleting...' : 'Delete Franchise'}
				</button>
			</div>
		</div>
	</div>
{/if}
