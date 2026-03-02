"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Franchise, CreateFranchiseDTO } from "@franchise/shared";
import {
  getFranchise,
  updateFranchise,
  deleteFranchise,
} from "@/lib/api";
import FranchiseForm from "@/components/FranchiseForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

export default function FranchiseDetailPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadFranchise = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) return;
      const response = await getFranchise(token, id);
      setFranchise(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load franchise"
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, id]);

  useEffect(() => {
    loadFranchise();
  }, [loadFranchise]);

  async function handleUpdate(data: CreateFranchiseDTO) {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    await updateFranchise(token, id, data);
    router.push("/dashboard");
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      await deleteFranchise(token, id);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete franchise"
      );
      setDeleting(false);
      setShowDelete(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Loading franchise...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
        {error}
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Franchise not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Franchise
        </h1>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>

      <FranchiseForm
        initialData={franchise}
        onSubmit={handleUpdate}
        submitLabel="Update Franchise"
      />

      <DeleteConfirmDialog
        open={showDelete}
        franchiseName={franchise.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
