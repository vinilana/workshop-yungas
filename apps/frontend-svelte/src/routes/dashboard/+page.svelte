<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isSignedIn } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import { getFranchises, deleteFranchise } from '$lib/api';
	import type { Franchise } from '@franchise/shared';

	let franchises = $state<Franchise[]>([]);
	let loading = $state(true);
	let search = $state('');
	let searchTimeout: ReturnType<typeof setTimeout>;
	let deleteConfirm = $state<Franchise | null>(null);
	let deleting = $state(false);

	$effect(() => {
		if (!$isSignedIn) {
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

	function statusColor(status: string): string {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'inactive':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Franchises</h1>
		<a
			href="/franchises/new"
			class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
		>
			+ New Franchise
		</a>
	</div>

	<div class="mb-6">
		<input
			type="text"
			placeholder="Search franchises..."
			bind:value={search}
			oninput={handleSearch}
			class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-sm"
		/>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
			></div>
		</div>
	{:else if franchises.length === 0}
		<div class="rounded-lg border border-gray-200 bg-white py-12 text-center">
			<p class="text-gray-500">No franchises found.</p>
			<a href="/franchises/new" class="mt-2 inline-block text-sm text-blue-600 hover:underline">
				Create your first franchise
			</a>
		</div>
	{:else}
		<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Name
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Owner
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Email
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								City/State
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each franchises as franchise (franchise.id)}
							<tr class="hover:bg-gray-50">
								<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
									{franchise.name}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
									{franchise.ownerName}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
									{franchise.email}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
									{franchise.city}/{franchise.state}
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span
										class="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 {statusColor(franchise.status)}"
									>
										{franchise.status}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm">
									<div class="flex gap-2">
										<a
											href="/franchises/{franchise.id}"
											class="text-blue-600 hover:text-blue-800"
										>
											Edit
										</a>
										<button
											onclick={() => (deleteConfirm = franchise)}
											class="text-red-600 hover:text-red-800"
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

<!-- Delete confirmation dialog -->
{#if deleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			<h2 class="text-lg font-semibold text-gray-900">Delete Franchise</h2>
			<p class="mt-2 text-sm text-gray-600">
				Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot
				be undone.
			</p>
			<div class="mt-4 flex justify-end gap-3">
				<button
					onclick={() => (deleteConfirm = null)}
					class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					onclick={confirmDelete}
					disabled={deleting}
					class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
				>
					{deleting ? 'Deleting...' : 'Delete'}
				</button>
			</div>
		</div>
	</div>
{/if}
