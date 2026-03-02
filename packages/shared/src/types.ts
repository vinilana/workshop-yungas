export interface Franchise {
  id: number;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  status: FranchiseStatus;
  createdAt: string;
  updatedAt: string;
}

export type FranchiseStatus = "active" | "inactive" | "pending";

export interface CreateFranchiseDTO {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  status?: FranchiseStatus;
}

export interface UpdateFranchiseDTO {
  name?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  status?: FranchiseStatus;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
