"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Franchise } from "@franchise/shared";
import { getFranchises } from "@/lib/api";
import FranchiseTable from "@/components/FranchiseTable";

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadFranchises(search);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Franchises</h1>
        <Link
          href="/franchises/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          New Franchise
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search franchises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Loading franchises...</p>
        </div>
      ) : (
        <FranchiseTable franchises={franchises} />
      )}
    </div>
  );
}
