import type {
  Franchise,
  CreateFranchiseDTO,
  UpdateFranchiseDTO,
  ApiResponse,
} from "@franchise/shared";
import { API_ROUTES } from "@franchise/shared";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchWithAuth<T>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Request failed",
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function getFranchises(
  token: string,
  search?: string
): Promise<ApiResponse<Franchise[]>> {
  const params = search ? `?search=${search}` : "";
  return fetchWithAuth<ApiResponse<Franchise[]>>(
    `${API_ROUTES.FRANCHISES}${params}`,
    token
  );
}

export async function getFranchise(
  token: string,
  id: number | string
): Promise<ApiResponse<Franchise>> {
  return fetchWithAuth<ApiResponse<Franchise>>(
    API_ROUTES.FRANCHISE_BY_ID(id),
    token
  );
}

export async function createFranchise(
  token: string,
  data: CreateFranchiseDTO
): Promise<ApiResponse<Franchise>> {
  return fetchWithAuth<ApiResponse<Franchise>>(
    API_ROUTES.FRANCHISES,
    token,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateFranchise(
  token: string,
  id: number | string,
  data: UpdateFranchiseDTO
): Promise<ApiResponse<Franchise>> {
  return fetchWithAuth<ApiResponse<Franchise>>(
    API_ROUTES.FRANCHISE_BY_ID(id),
    token,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteFranchise(
  token: string,
  id: number | string
): Promise<void> {
  await fetchWithAuth<void>(API_ROUTES.FRANCHISE_BY_ID(id), token, {
    method: "DELETE",
  });
}
