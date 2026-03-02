import { API_ROUTES } from '@franchise/shared';
import type {
	Franchise,
	CreateFranchiseDTO,
	UpdateFranchiseDTO,
	Collaborator,
	CreateCollaboratorDTO,
	UpdateCollaboratorDTO,
	ApiResponse,
	ApiErrorResponse
} from '@franchise/shared';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
let cachedToken: string | null = null;

async function getToken(): Promise<string | null> {
	if (cachedToken) return cachedToken;
	const clerk = (window as any).Clerk;
	if (!clerk?.session) return null;
	cachedToken = await clerk.session.getToken();
	return cachedToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const token = await getToken();
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {})
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers
	});

	if (!response.ok) {
		const errorBody: ApiErrorResponse = await response.json().catch(() => ({
			error: 'Request failed',
			message: response.statusText,
			statusCode: response.status
		}));
		throw new Error(errorBody.message || errorBody.error || 'Request failed');
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}

export async function getFranchises(search?: string): Promise<ApiResponse<Franchise[]>> {
	const query = search ? `?search=${encodeURIComponent(search)}` : '';
	return request<ApiResponse<Franchise[]>>(`${API_ROUTES.FRANCHISES}${query}`);
}

export async function getFranchise(id: number | string): Promise<ApiResponse<Franchise>> {
	return request<ApiResponse<Franchise>>(API_ROUTES.FRANCHISE_BY_ID(id));
}

export async function createFranchise(data: CreateFranchiseDTO): Promise<ApiResponse<Franchise>> {
	return request<ApiResponse<Franchise>>(API_ROUTES.FRANCHISES, {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function updateFranchise(
	id: number | string,
	data: UpdateFranchiseDTO
): Promise<ApiResponse<Franchise>> {
	return request<ApiResponse<Franchise>>(API_ROUTES.FRANCHISE_BY_ID(id), {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
}

export async function deleteFranchise(id: number | string): Promise<void> {
	return request<void>(API_ROUTES.FRANCHISE_BY_ID(id), {
		method: 'DELETE'
	});
}

// Collaborator API

export async function getCollaborators(search?: string): Promise<ApiResponse<Collaborator[]>> {
	const query = search ? `?search=${encodeURIComponent(search)}` : '';
	return request<ApiResponse<Collaborator[]>>(`${API_ROUTES.COLLABORATORS}${query}`);
}

export async function getCollaborator(id: number | string): Promise<ApiResponse<Collaborator>> {
	return request<ApiResponse<Collaborator>>(API_ROUTES.COLLABORATOR_BY_ID(id));
}

export async function createCollaborator(data: CreateCollaboratorDTO): Promise<ApiResponse<Collaborator>> {
	return request<ApiResponse<Collaborator>>(API_ROUTES.COLLABORATORS, {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function updateCollaborator(
	id: number | string,
	data: UpdateCollaboratorDTO
): Promise<ApiResponse<Collaborator>> {
	return request<ApiResponse<Collaborator>>(API_ROUTES.COLLABORATOR_BY_ID(id), {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
}

export async function deleteCollaborator(id: number | string): Promise<void> {
	return request<void>(API_ROUTES.COLLABORATOR_BY_ID(id), {
		method: 'DELETE'
	});
}
