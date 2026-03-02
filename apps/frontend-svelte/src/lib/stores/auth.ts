export async function getToken(): Promise<string | null> {
	const clerk = (window as any).Clerk;
	if (!clerk?.session) return null;
	return clerk.session.getToken();
}
