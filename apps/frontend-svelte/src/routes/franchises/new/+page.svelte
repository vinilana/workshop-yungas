<script lang="ts">
	import { goto } from '$app/navigation';
	import { useClerkContext } from 'svelte-clerk';
	import { toast } from '$lib/stores/toast';
	import { createFranchise } from '$lib/api';
	import { BRAZILIAN_STATES, FRANCHISE_STATUSES } from '@franchise/shared';
	import type { CreateFranchiseDTO } from '@franchise/shared';

	const ctx = useClerkContext();

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
		if (ctx.isLoaded && !ctx.user) {
			goto('/');
		}
	});

	const previewName = $derived(form.name.trim() || 'Franchise Name');
	const previewOwner = $derived(form.ownerName.trim() || 'Owner Name');
	const previewLocation = $derived(
		form.city.trim() && form.state ? `${form.city.trim()}, ${form.state}` : 'Location not set'
	);

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

<div class="space-y-6">
	<header class="space-y-2">
		<a href="/dashboard" class="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">
			&larr; Back to Dashboard
		</a>
		<p class="text-xs font-bold uppercase tracking-[0.11em] text-blue-700">Onboarding</p>
		<h1 class="text-3xl font-extrabold text-slate-900">Create Franchise</h1>
		<p class="max-w-2xl text-sm text-slate-600">
			Add operational details to onboard a new franchise and keep your network data clean from day one.
		</p>
	</header>

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

			<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<a href="/dashboard" class="secondary-btn">Cancel</a>
				<button type="submit" disabled={saving} class="primary-btn">
					{saving ? 'Creating...' : 'Create Franchise'}
				</button>
			</div>
		</div>

		<aside class="space-y-4">
			<section class="surface-card p-5">
				<p class="text-xs font-bold uppercase tracking-[0.1em] text-blue-700">Live Preview</p>
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
				<p class="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Quality Checklist</p>
				<ul class="mt-3 space-y-2 text-sm text-slate-600">
					<li class="rounded-lg bg-slate-50 px-3 py-2">Use a unique and recognizable franchise name.</li>
					<li class="rounded-lg bg-slate-50 px-3 py-2">
						Confirm owner email before submitting.
					</li>
					<li class="rounded-lg bg-slate-50 px-3 py-2">Set initial status to match onboarding stage.</li>
				</ul>
			</section>
		</aside>
	</form>
</div>
