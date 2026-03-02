import { writable, derived } from 'svelte/store';
import type { Clerk } from '@clerk/clerk-js';

interface AuthState {
	isLoaded: boolean;
	isSignedIn: boolean;
	clerk: Clerk | null;
}

const authState = writable<AuthState>({
	isLoaded: false,
	isSignedIn: false,
	clerk: null
});

export const auth = {
	subscribe: authState.subscribe,
	setClerk(clerk: Clerk) {
		authState.set({
			isLoaded: true,
			isSignedIn: !!clerk.user,
			clerk
		});
	},
	update(isSignedIn: boolean) {
		authState.update((state) => ({ ...state, isSignedIn }));
	}
};

export const isSignedIn = derived(authState, ($auth) => $auth.isSignedIn);
export const isLoaded = derived(authState, ($auth) => $auth.isLoaded);

export async function getToken(): Promise<string | null> {
	let state: AuthState | undefined;
	authState.subscribe((s) => (state = s))();
	if (!state?.clerk?.session) return null;
	const token = await state.clerk.session.getToken();
	return token;
}
