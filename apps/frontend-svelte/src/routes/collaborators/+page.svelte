<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { useClerkContext } from 'svelte-clerk';
	import { toast } from '$lib/stores/toast';
	import { getCollaborators, deleteCollaborator } from '$lib/api';
	import type { Collaborator } from '@franchise/shared';

	const ctx = useClerkContext();

	let collaborators = $state<Collaborator[]>([]);
	let loading = $state(true);
	let search = $state('');
	let searchTimeout: ReturnType<typeof setTimeout>;
	let deleteConfirm = $state<Collaborator | null>(null);
	let deleting = $state(false);
	const totalCount = $derived(collaborators.length);
	const resultLabel = $derived(
		search.trim() ? `Results for "${search.trim()}"` : 'Showing all collaborators'
	);

	$effect(() => {
		if (ctx.isLoaded && !ctx.user) {
			goto('/');
		}
	});

	onMount(() => {
		loadCollaborators();
	});

	async function loadCollaborators() {
		loading = true;
		try {
			const response = await getCollaborators(search || undefined);
			collaborators = response.data;
		} catch (err) {
			toast.error('Failed to load collaborators');
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function handleSearch() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			loadCollaborators();
		}, 300);
	}

	function clearSearch() {
		search = '';
		loadCollaborators();
	}

	async function confirmDelete() {
		if (!deleteConfirm) return;
		deleting = true;
		try {
			await deleteCollaborator(deleteConfirm.id);
			toast.success('Collaborator deleted successfully');
			deleteConfirm = null;
			await loadCollaborators();
		} catch (err) {
			toast.error('Failed to delete collaborator');
			console.error(err);
		} finally {
			deleting = false;
		}
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
					Team Management
				</p>
				<h1 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">Collaborators</h1>
				<p class="text-sm text-slate-600 sm:text-base">
					Manage team members across your franchise network. Track roles, contact details and franchise assignments.
				</p>
			</div>
			<a href="/collaborators/new" class="primary-btn w-full sm:w-auto">+ New Collaborator</a>
		</div>
	</section>

	<section class="grid-metrics">
		<div class="metric-card">
			<p class="metric-label">Total Collaborators</p>
			<p class="mt-2 metric-value">{totalCount}</p>
			<p class="mt-1 text-xs font-semibold text-slate-500">Team members in your network</p>
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
					placeholder="name, email, role or franchise"
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
	{:else if collaborators.length === 0}
		<div class="glass-panel p-10 text-center">
			<h2 class="text-2xl font-bold text-slate-900">No collaborators found</h2>
			<p class="mt-2 text-sm text-slate-600">
				Add your first team member to start managing your franchise workforce.
			</p>
			<a href="/collaborators/new" class="primary-btn mt-6">Add first collaborator</a>
		</div>
	{:else}
		<div class="space-y-3 md:hidden">
			{#each collaborators as collab (collab.id)}
				<article class="surface-card p-4">
					<div class="flex items-start justify-between gap-3">
						<div>
							<h2 class="text-base font-bold text-slate-900">{collab.name}</h2>
							<p class="text-sm text-slate-600">{collab.role}</p>
						</div>
						<span class="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
							{collab.franchiseName}
						</span>
					</div>

					<div class="mt-3 space-y-1 text-sm text-slate-600">
						<p>{collab.email}</p>
						<p>{collab.phone}</p>
					</div>

					<div class="mt-4 flex gap-2">
						<a href="/collaborators/{collab.id}" class="secondary-btn">Edit</a>
						<button onclick={() => (deleteConfirm = collab)} class="danger-soft-btn">Delete</button>
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
							<th class="px-6 py-3 text-left">Email</th>
							<th class="px-6 py-3 text-left">Phone</th>
							<th class="px-6 py-3 text-left">Role</th>
							<th class="px-6 py-3 text-left">Franchise</th>
							<th class="px-6 py-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200 bg-white">
						{#each collaborators as collab (collab.id)}
							<tr>
								<td class="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
									{collab.name}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
									{collab.email}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
									{collab.phone}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
									{collab.role}
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span class="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
										{collab.franchiseName}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm">
									<div class="flex items-center gap-3">
										<a
											href="/collaborators/{collab.id}"
											class="font-semibold text-blue-700 transition-colors hover:text-blue-900"
										>
											Edit
										</a>
										<button
											onclick={() => (deleteConfirm = collab)}
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
			<h2 class="mt-2 text-2xl font-bold text-slate-900">Delete collaborator permanently?</h2>
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
					{deleting ? 'Deleting...' : 'Delete Collaborator'}
				</button>
			</div>
		</div>
	</div>
{/if}
