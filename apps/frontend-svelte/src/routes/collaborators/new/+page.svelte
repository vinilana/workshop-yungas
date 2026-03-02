<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { useClerkContext } from 'svelte-clerk';
	import { toast } from '$lib/stores/toast';
	import { createCollaborator, getFranchises } from '$lib/api';
	import { COLLABORATOR_ROLE_SUGGESTIONS } from '@franchise/shared';
	import type { CreateCollaboratorDTO, Franchise } from '@franchise/shared';

	const ctx = useClerkContext();

	let saving = $state(false);
	let franchises = $state<Franchise[]>([]);
	let form = $state<CreateCollaboratorDTO>({
		name: '',
		email: '',
		phone: '',
		role: '',
		franchiseId: 0
	});

	$effect(() => {
		if (ctx.isLoaded && !ctx.user) {
			goto('/');
		}
	});

	onMount(async () => {
		try {
			const response = await getFranchises();
			franchises = response.data;
		} catch (err) {
			toast.error('Failed to load franchises');
			console.error(err);
		}
	});

	const previewName = $derived(form.name.trim() || 'Collaborator Name');
	const previewRole = $derived(form.role.trim() || 'Role not set');
	const previewFranchise = $derived(
		franchises.find((f) => f.id === form.franchiseId)?.name || 'Franchise not selected'
	);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		try {
			await createCollaborator(form);
			toast.success('Collaborator created successfully');
			goto('/collaborators');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create collaborator');
		} finally {
			saving = false;
		}
	}
</script>

<div class="space-y-6">
	<header class="space-y-2">
		<a href="/collaborators" class="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">
			&larr; Back to Collaborators
		</a>
		<p class="text-xs font-bold uppercase tracking-[0.11em] text-blue-700">Team Onboarding</p>
		<h1 class="text-3xl font-extrabold text-slate-900">Add Collaborator</h1>
		<p class="max-w-2xl text-sm text-slate-600">
			Register a new team member and assign them to a franchise in your network.
		</p>
	</header>

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

			<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<a href="/collaborators" class="secondary-btn">Cancel</a>
				<button type="submit" disabled={saving} class="primary-btn">
					{saving ? 'Creating...' : 'Create Collaborator'}
				</button>
			</div>
		</div>

		<aside class="space-y-4">
			<section class="surface-card p-5">
				<p class="text-xs font-bold uppercase tracking-[0.1em] text-blue-700">Live Preview</p>
				<h2 class="mt-2 text-xl font-bold text-slate-900">{previewName}</h2>
				<p class="mt-1 text-sm text-slate-600">{previewRole}</p>
				<div class="mt-4 space-y-2 text-sm text-slate-600">
					<p><span class="font-semibold text-slate-700">Email:</span> {form.email || '-'}</p>
					<p><span class="font-semibold text-slate-700">Phone:</span> {form.phone || '-'}</p>
					<p><span class="font-semibold text-slate-700">Franchise:</span> {previewFranchise}</p>
				</div>
			</section>

			<section class="surface-card p-5">
				<p class="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Quality Checklist</p>
				<ul class="mt-3 space-y-2 text-sm text-slate-600">
					<li class="rounded-lg bg-slate-50 px-3 py-2">Verify the collaborator's email address before submitting.</li>
					<li class="rounded-lg bg-slate-50 px-3 py-2">
						Select the correct franchise assignment.
					</li>
					<li class="rounded-lg bg-slate-50 px-3 py-2">Use a descriptive role that reflects daily responsibilities.</li>
				</ul>
			</section>
		</aside>
	</form>
</div>
