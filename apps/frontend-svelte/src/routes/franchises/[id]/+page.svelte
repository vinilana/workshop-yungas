<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { useClerkContext } from 'svelte-clerk';
	import { toast } from '$lib/stores/toast';
	import { getFranchise, updateFranchise, deleteFranchise } from '$lib/api';
	import { BRAZILIAN_STATES, FRANCHISE_STATUSES } from '@franchise/shared';
	import type { UpdateFranchiseDTO } from '@franchise/shared';

	const ctx = useClerkContext();

	let loading = $state(true);
	let saving = $state(false);
	let deleteConfirm = $state(false);
	let deleting = $state(false);
	let form = $state<UpdateFranchiseDTO>({
		name: '',
		ownerName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		state: '',
		status: 'pending'
	});

	const previewName = $derived(form.name.trim() || 'Franchise Name');
	const previewOwner = $derived(form.ownerName.trim() || 'Owner Name');
	const previewLocation = $derived(
		form.city.trim() && form.state ? `${form.city.trim()}, ${form.state}` : 'Location not set'
	);

	$effect(() => {
		if (ctx.isLoaded && !ctx.user) {
			goto('/');
		}
	});

	onMount(async () => {
		try {
			const id = $page.params.id;
			const response = await getFranchise(id);
			const franchise = response.data;
			form = {
				name: franchise.name,
				ownerName: franchise.ownerName,
				email: franchise.email,
				phone: franchise.phone,
				address: franchise.address,
				city: franchise.city,
				state: franchise.state,
				status: franchise.status
			};
		} catch (err) {
			toast.error('Failed to load franchise');
			goto('/dashboard');
		} finally {
			loading = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		try {
			const id = $page.params.id;
			await updateFranchise(id, form);
			toast.success('Franchise updated successfully');
			goto('/dashboard');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to update franchise');
		} finally {
			saving = false;
		}
	}

	async function handleDelete() {
		deleting = true;
		try {
			const id = $page.params.id;
			await deleteFranchise(id);
			toast.success('Franchise deleted successfully');
			goto('/dashboard');
		} catch (err) {
			toast.error('Failed to delete franchise');
		} finally {
			deleting = false;
			deleteConfirm = false;
		}
	}
</script>

<div class="space-y-6">
	<header class="space-y-2">
		<a href="/dashboard" class="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">
			&larr; Back to Dashboard
		</a>
		<p class="text-xs font-bold uppercase tracking-[0.11em] text-blue-700">Franchise Record</p>
		<h1 class="text-3xl font-extrabold text-slate-900">Edit Franchise</h1>
		<p class="max-w-2xl text-sm text-slate-600">
			Update contact and operational details while keeping your portfolio information accurate.
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
					<h2 class="mt-1 section-title">Business Identity</h2>
					<div class="mt-5 grid gap-5 sm:grid-cols-2">
						<div>
							<label for="name" class="field-label">Franchise Name</label>
							<input id="name" type="text" required bind:value={form.name} class="form-control" />
						</div>
						<div>
							<label for="ownerName" class="field-label">Owner Name</label>
							<input
								id="ownerName"
								type="text"
								required
								bind:value={form.ownerName}
								class="form-control"
							/>
						</div>
					</div>
				</section>

				<section class="glass-panel p-5 sm:p-6">
					<p class="section-kicker">Section 2</p>
					<h2 class="mt-1 section-title">Contact Details</h2>
					<div class="mt-5 grid gap-5 sm:grid-cols-2">
						<div>
							<label for="email" class="field-label">Email</label>
							<input id="email" type="email" required bind:value={form.email} class="form-control" />
						</div>
						<div>
							<label for="phone" class="field-label">Phone</label>
							<input id="phone" type="tel" required bind:value={form.phone} class="form-control" />
						</div>
					</div>
				</section>

				<section class="glass-panel p-5 sm:p-6">
					<p class="section-kicker">Section 3</p>
					<h2 class="mt-1 section-title">Location & Status</h2>
					<div class="mt-5 space-y-5">
						<div>
							<label for="address" class="field-label">Address</label>
							<input
								id="address"
								type="text"
								required
								bind:value={form.address}
								class="form-control"
							/>
						</div>

						<div class="grid gap-5 sm:grid-cols-2">
							<div>
								<label for="city" class="field-label">City</label>
								<input id="city" type="text" required bind:value={form.city} class="form-control" />
							</div>
							<div>
								<label for="state" class="field-label">State</label>
								<select id="state" required bind:value={form.state} class="form-control">
									<option value="">Select a state</option>
									{#each BRAZILIAN_STATES as st}
										<option value={st}>{st}</option>
									{/each}
								</select>
							</div>
						</div>

						<div>
							<label for="status" class="field-label">Operational Status</label>
							<select id="status" bind:value={form.status} class="form-control">
								{#each FRANCHISE_STATUSES as status}
									<option value={status}>{status}</option>
								{/each}
							</select>
						</div>
					</div>
				</section>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
					<button type="button" onclick={() => (deleteConfirm = true)} class="danger-soft-btn">
						Delete Franchise
					</button>
					<div class="flex flex-col-reverse gap-3 sm:flex-row">
						<a href="/dashboard" class="secondary-btn">Cancel</a>
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
					<p class="mt-1 text-sm text-slate-600">{previewOwner}</p>
					<div class="mt-4 space-y-2 text-sm text-slate-600">
						<p><span class="font-semibold text-slate-700">Email:</span> {form.email || '-'}</p>
						<p><span class="font-semibold text-slate-700">Phone:</span> {form.phone || '-'}</p>
						<p><span class="font-semibold text-slate-700">Location:</span> {previewLocation}</p>
						<p><span class="font-semibold text-slate-700">Status:</span> {form.status}</p>
					</div>
				</section>

				<section class="surface-card p-5">
					<p class="text-xs font-bold uppercase tracking-[0.1em] text-rose-600">Risk Actions</p>
					<h3 class="mt-2 text-lg font-bold text-slate-900">Deletion is permanent</h3>
					<p class="mt-2 text-sm text-slate-600">
						Only delete when this franchise should be fully removed from operational history.
					</p>
					<button
						type="button"
						onclick={() => (deleteConfirm = true)}
						class="danger-btn mt-4 w-full"
					>
						Delete Franchise
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
			<h2 class="mt-2 text-2xl font-bold text-slate-900">Delete franchise permanently?</h2>
			<p class="mt-2 text-sm text-slate-600">
				This action removes the franchise and cannot be undone.
			</p>

			<div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<button onclick={() => (deleteConfirm = false)} class="secondary-btn">Cancel</button>
				<button
					onclick={handleDelete}
					disabled={deleting}
					class="danger-btn"
				>
					{deleting ? 'Deleting...' : 'Delete Franchise'}
				</button>
			</div>
		</div>
	</div>
{/if}
