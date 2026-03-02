"use client";

import { useAuth } from "@clerk/nextjs";
import type { Franchise } from "@franchise/shared";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import FranchiseTable from "@/components/FranchiseTable";
import { getFranchises } from "@/lib/api";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFranchises = useCallback(
    async (searchTerm?: string) => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        if (!token) return;
        const response = await getFranchises(token, searchTerm);
        setFranchises(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load franchises"
        );
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  useEffect(() => {
    loadFranchises();
  }, [loadFranchises]);

  const normalizedSearch = search.trim().toLowerCase();
  const visibleFranchises = normalizedSearch
    ? franchises.filter((franchise) =>
        [
          franchise.name,
          franchise.ownerName,
          franchise.email,
          franchise.city,
          franchise.state,
          franchise.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : franchises;

  const statusSummary = franchises.reduce(
    (acc, franchise) => {
      acc.total += 1;
      if (franchise.status === "active") acc.active += 1;
      if (franchise.status === "pending") acc.pending += 1;
      if (franchise.status === "inactive") acc.inactive += 1;
      return acc;
    },
    { total: 0, active: 0, pending: 0, inactive: 0 }
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadFranchises(search);
  }

  function handleReset() {
    setSearch("");
    loadFranchises();
  }

  return (
    <div className="space-y-6" data-animate="lift">
      <section className="surface-card overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <span className="tag-pill">Operations Hub</span>
            <h1 className="page-title mt-4">Franchise portfolio</h1>
            <p className="page-subtitle">
              Manage your entire network in one place with fast search, clear
              status visibility, and streamlined updates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="metric-card">
              <p className="metric-label">Total</p>
              <p className="metric-value">{statusSummary.total}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Active</p>
              <p className="metric-value">{statusSummary.active}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Pending</p>
              <p className="metric-value">{statusSummary.pending}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Inactive</p>
              <p className="metric-value">{statusSummary.inactive}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="9"
                cy="9"
                r="6"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M13.6 13.6L17 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, owner, status, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="soft-input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="primary-btn">
              Search
            </button>
            <button type="button" onClick={handleReset} className="secondary-btn">
              Reset
            </button>
            <Link href="/franchises/new" className="primary-btn">
              New franchise
            </Link>
          </div>
        </form>
      </section>

      {error && (
        <div className="alert-error" role="alert">{error}</div>
      )}

      {loading ? (
        <div className="surface-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              Loading franchises
            </p>
            <span className="tag-pill">Syncing data</span>
          </div>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((item) => (
              <div key={item} className="loading-pulse h-14" />
            ))}
          </div>
        </div>
      ) : (
        <FranchiseTable franchises={visibleFranchises} />
      )}
    </div>
  );
}
