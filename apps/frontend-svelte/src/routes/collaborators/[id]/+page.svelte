<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { useClerkContext } from 'svelte-clerk';
	import { toast } from '$lib/stores/toast';
	import { getCollaborator, updateCollaborator, deleteCollaborator, getFranchises } from '$lib/api';
	import { COLLABORATOR_ROLE_SUGGESTIONS } from '@franchise/shared';
	import type { UpdateCollaboratorDTO, Franchise } from '@franchise/shared';

	const ctx = useClerkContext();

	let loading = $state(true);
	let saving = $state(false);
	let deleteConfirm = $state(false);
	let deleting = $state(false);
	let franchises = $state<Franchise[]>([]);
	let form = $state<UpdateCollaboratorDTO>({
		name: '',
		email: '',
		phone: '',
		role: '',
		franchiseId: 0
	});

	const previewName = $derived((form.name ?? '').trim() || 'Collaborator Name');
	const previewRole = $derived((form.role ?? '').trim() || 'Role not set');
	const previewFranchise = $derived(
		franchises.find((f) => f.id === form.franchiseId)?.name || 'Franchise not selected'
	);

	$effect(() => {
		if (ctx.isLoaded && !ctx.user) {
			goto('/');
		}
	});

	onMount(async () => {
		try {
			const id = $page.params.id;
			const [collabResponse, franchisesResponse] = await Promise.all([
				getCollaborator(id),
				getFranchises()
			]);
			const collab = collabResponse.data;
			franchises = franchisesResponse.data;
			form = {
				name: collab.name,
				email: collab.email,
				phone: collab.phone,
				role: collab.role,
				franchiseId: collab.franchiseId
			};
		} catch (err) {
			toast.error('Failed to load collaborator');
			goto('/collaborators');
		} finally {
			loading = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		try {
			const id = $page.params.id;
			await updateCollaborator(id, form);
			toast.success('Collaborator updated successfully');
			goto('/collaborators');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to update collaborator');
		} finally {
			saving = false;
		}
	}

	async function handleDelete() {
		deleting = true;
		try {
			const id = $page.params.id;
			await deleteCollaborator(id);
			toast.success('Collaborator deleted successfully');
			goto('/collaborators');
		} catch (err) {
			toast.error('Failed to delete collaborator');
		} finally {
			deleting = false;
			deleteConfirm = false;
		}
	}
</script>

<div class="space-y-6">
	<header class="space-y-2">
		<a href="/collaborators" class="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">
			&larr; Back to Collaborators
		</a>
		<p class="text-xs font-bold uppercase tracking-[0.11em] text-blue-700">Team Record</p>
		<h1 class="text-3xl font-extrabold text-slate-900">Edit Collaborator</h1>
		<p class="max-w-2xl text-sm text-slate-600">
			Update contact details, role and franchise assignment for this team member.
		</p>
	</header>

	{#if loading}
		<div class="surface-card p-6 sm:p-8">
			<div class="animate-pulse space-y-3">
				<div class="h-5 w-1/3 rounded bg-slate-200"></div>
				<div class="h-4 w-full rounded bg-slate-200"></div>
				<div class="h-4 w-5/6 rounded bg-slate-200"></div>
				<div class="h-4 w-4/6 rounded bg-slate-200"></div>
			</div>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
			<div class="space-y-6">
				<section class="glass-panel p-5 sm:p-6">
					<p class="section-kicker">Section 1</p>
					<h2 class="mt-1 section-title">Personal Information</h2>
					<div class="mt-5 grid gap-5 sm:grid-cols-2">
						<div>
							<label for="name" class="field-label">Full Name</label>
							<input id="name" type="text" required bind:value={form.name} class="form-control" />
						</div>
						<div>
							<label for="email" class="field-label">Email</label>
							<input id="email" type="email" required bind:value={form.email} class="form-control" />
						</div>
						<div class="sm:col-span-2">
							<label for="phone" class="field-label">Phone</label>
							<input id="phone" type="tel" bind:value={form.phone} class="form-control" />
						</div>
					</div>
				</section>

				<section class="glass-panel p-5 sm:p-6">
					<p class="section-kicker">Section 2</p>
					<h2 class="mt-1 section-title">Role & Franchise</h2>
					<div class="mt-5 grid gap-5 sm:grid-cols-2">
						<div>
							<label for="role" class="field-label">Role</label>
							<input
								id="role"
								type="text"
								required
								bind:value={form.role}
								list="role-suggestions"
								class="form-control"
								placeholder="Type or select a role"
							/>
							<datalist id="role-suggestions">
								{#each COLLABORATOR_ROLE_SUGGESTIONS as suggestion}
									<option value={suggestion}></option>
								{/each}
							</datalist>
						</div>
						<div>
							<label for="franchiseId" class="field-label">Franchise</label>
							<select
								id="franchiseId"
								required
								bind:value={form.franchiseId}
								class="form-control"
							>
								<option value={0} disabled>Select a franchise</option>
								{#each franchises as franchise}
									<option value={franchise.id}>{franchise.name}</option>
								{/each}
							</select>
						</div>
					</div>
				</section>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
					<button type="button" onclick={() => (deleteConfirm = true)} class="danger-soft-btn">
						Delete Collaborator
					</button>
					<div class="flex flex-col-reverse gap-3 sm:flex-row">
						<a href="/collaborators" class="secondary-btn">Cancel</a>
						<button type="submit" disabled={saving} class="primary-btn">
							{saving ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</div>
			</div>

			<aside class="space-y-4">
				<section class="surface-card p-5">
					<p class="text-xs font-bold uppercase tracking-[0.1em] text-blue-700">Current Snapshot</p>
					<h2 class="mt-2 text-xl font-bold text-slate-900">{previewName}</h2>
					<p class="mt-1 text-sm text-slate-600">{previewRole}</p>
					<div class="mt-4 space-y-2 text-sm text-slate-600">
						<p><span class="font-semibold text-slate-700">Email:</span> {form.email || '-'}</p>
						<p><span class="font-semibold text-slate-700">Phone:</span> {form.phone || '-'}</p>
						<p><span class="font-semibold text-slate-700">Franchise:</span> {previewFranchise}</p>
					</div>
				</section>

				<section class="surface-card p-5">
					<p class="text-xs font-bold uppercase tracking-[0.1em] text-rose-600">Risk Actions</p>
					<h3 class="mt-2 text-lg font-bold text-slate-900">Deletion is permanent</h3>
					<p class="mt-2 text-sm text-slate-600">
						Only delete when this team member should be fully removed from operational records.
					</p>
					<button
						type="button"
						onclick={() => (deleteConfirm = true)}
						class="danger-btn mt-4 w-full"
					>
						Delete Collaborator
					</button>
				</section>
			</aside>
		</form>
	{/if}
</div>

{#if deleteConfirm}
	<div class="modal-overlay z-50 flex items-center justify-center p-4">
		<div class="glass-panel w-full max-w-lg p-6 sm:p-7">
			<p class="text-xs font-bold uppercase tracking-[0.1em] text-rose-600">Danger Zone</p>
			<h2 class="mt-2 text-2xl font-bold text-slate-900">Delete collaborator permanently?</h2>
			<p class="mt-2 text-sm text-slate-600">
				This action removes the collaborator and cannot be undone.
			</p>

			<div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<button onclick={() => (deleteConfirm = false)} class="secondary-btn">Cancel</button>
				<button
					onclick={handleDelete}
					disabled={deleting}
					class="danger-btn"
				>
					{deleting ? 'Deleting...' : 'Delete Collaborator'}
				</button>
			</div>
		</div>
	</div>
{/if}
