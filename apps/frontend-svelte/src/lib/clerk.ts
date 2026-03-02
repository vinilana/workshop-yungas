import pkg from '@clerk/clerk-js';
import type { Clerk as ClerkType } from '@clerk/clerk-js';

const { Clerk } = pkg;

let clerkInstance: ClerkType | null = null;

export async function initClerk(): Promise<ClerkType> {
	if (clerkInstance) return clerkInstance;

	const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
	if (!publishableKey) {
		throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not set');
	}

	const clerk = new Clerk(publishableKey);
	await clerk.load();
	clerkInstance = clerk;
	return clerk;
}

export function getClerk(): ClerkType | null {
	return clerkInstance;
}
