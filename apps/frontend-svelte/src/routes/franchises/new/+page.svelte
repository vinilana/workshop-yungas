<script lang="ts">
	import { goto } from '$app/navigation';
	import { isSignedIn } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import { createFranchise } from '$lib/api';
	import { BRAZILIAN_STATES, FRANCHISE_STATUSES } from '@franchise/shared';
	import type { CreateFranchiseDTO, FranchiseStatus } from '@franchise/shared';

	let saving = $state(false);
	let form = $state<CreateFranchiseDTO>({
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
		if (!$isSignedIn) {
			goto('/');
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		try {
			await createFranchise(form);
			toast.success('Franchise created successfully');
			goto('/dashboard');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create franchise');
		} finally {
			saving = false;
		}
	}
</script>

<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-6">
		<a href="/dashboard" class="text-sm text-blue-600 hover:underline">&larr; Back to Dashboard</a>
		<h1 class="mt-2 text-2xl font-bold text-gray-900">New Franchise</h1>
	</div>

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

		<div class="flex justify-end gap-3">
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
				{saving ? 'Creating...' : 'Create Franchise'}
			</button>
		</div>
	</form>
</div>
