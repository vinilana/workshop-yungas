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

<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-6">
		<a href="/dashboard" class="text-sm text-blue-600 hover:underline">&larr; Back to Dashboard</a>
		<h1 class="mt-2 text-2xl font-bold text-gray-900">Edit Franchise</h1>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
			></div>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
				<input
					id="name"
					type="text"
					required
					bind:value={form.name}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label for="ownerName" class="block text-sm font-medium text-gray-700">Owner Name</label>
				<input
					id="ownerName"
					type="text"
					required
					bind:value={form.ownerName}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
					<input
						id="email"
						type="email"
						required
						bind:value={form.email}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
					<input
						id="phone"
						type="tel"
						required
						bind:value={form.phone}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div>
				<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
				<input
					id="address"
					type="text"
					required
					bind:value={form.address}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<label for="city" class="block text-sm font-medium text-gray-700">City</label>
					<input
						id="city"
						type="text"
						required
						bind:value={form.city}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="state" class="block text-sm font-medium text-gray-700">State</label>
					<select
						id="state"
						required
						bind:value={form.state}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="">Select a state</option>
						{#each BRAZILIAN_STATES as st}
							<option value={st}>{st}</option>
						{/each}
					</select>
				</div>
			</div>

			<div>
				<label for="status" class="block text-sm font-medium text-gray-700">Status</label>
				<select
					id="status"
					bind:value={form.status}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					{#each FRANCHISE_STATUSES as status}
						<option value={status}>{status}</option>
					{/each}
				</select>
			</div>

			<div class="flex items-center justify-between">
				<button
					type="button"
					onclick={() => (deleteConfirm = true)}
					class="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
				>
					Delete Franchise
				</button>
				<div class="flex gap-3">
					<a
						href="/dashboard"
						class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</a>
					<button
						type="submit"
						disabled={saving}
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
					>
						{saving ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>
		</form>
	{/if}
</div>

<!-- Delete confirmation dialog -->
{#if deleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			<h2 class="text-lg font-semibold text-gray-900">Delete Franchise</h2>
			<p class="mt-2 text-sm text-gray-600">
				Are you sure you want to delete this franchise? This action cannot be undone.
			</p>
			<div class="mt-4 flex justify-end gap-3">
				<button
					onclick={() => (deleteConfirm = false)}
					class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					onclick={handleDelete}
					disabled={deleting}
					class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
				>
					{deleting ? 'Deleting...' : 'Delete'}
				</button>
			</div>
		</div>
	</div>
{/if}
