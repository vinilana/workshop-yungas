"use client";

import { useAuth } from "@clerk/nextjs";
import type { CreateFranchiseDTO, Franchise } from "@franchise/shared";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import FranchiseForm from "@/components/FranchiseForm";
import StatusBadge from "@/components/StatusBadge";
import { deleteFranchise, getFranchise, updateFranchise } from "@/lib/api";

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
      <div className="surface-card p-8">
        <div className="loading-pulse h-7 w-40" />
        <div className="loading-pulse mt-3 h-4 w-72" />
        <div className="loading-pulse mt-8 h-12 w-full" />
        <div className="loading-pulse mt-3 h-12 w-full" />
        <div className="loading-pulse mt-3 h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="alert-error">{error}</div>
        <Link href="/dashboard" className="secondary-btn">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="surface-card py-12 text-center">
        <p className="text-base font-semibold text-slate-900">
          Franchise not found
        </p>
        <p className="mt-2 text-sm text-slate-600">
          This record may have been removed or is no longer available.
        </p>
        <Link href="/dashboard" className="secondary-btn mt-5">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-animate="lift">
      <section className="surface-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="tag-pill">Franchise record</span>
            <h1 className="page-title mt-4">{franchise.name}</h1>
            <p className="page-subtitle">
              Update operational details, contact info, and status to keep this
              unit aligned with your network.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard" className="secondary-btn">
              Back
            </Link>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="danger-btn"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <StatusBadge status={franchise.status} />
          <span className="tag-pill">{franchise.city}/{franchise.state}</span>
          <span className="tag-pill">{franchise.email}</span>
          <span className="tag-pill">{franchise.phone}</span>
        </div>
      </section>

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
