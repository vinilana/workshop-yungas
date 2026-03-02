"use client";

import type { Franchise } from "@franchise/shared";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

interface FranchiseTableProps {
  franchises: Franchise[];
}

export default function FranchiseTable({ franchises }: FranchiseTableProps) {
  if (franchises.length === 0) {
    return (
      <div className="surface-card py-12 text-center">
        <p className="text-base font-semibold text-slate-900">No franchises found</p>
        <p className="mt-2 text-sm text-slate-600">
          Adjust your filters or create a new unit to get started.
        </p>
        <Link href="/franchises/new" className="primary-btn mt-5">
          Create first franchise
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-animate="lift">
      <div className="space-y-3 md:hidden">
        {franchises.map((franchise) => (
          <article key={franchise.id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {franchise.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{franchise.ownerName}</p>
              </div>
              <StatusBadge status={franchise.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Email
                </p>
                <p className="mt-1 text-slate-700">{franchise.email}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Location
                </p>
                <p className="mt-1 text-slate-700">
                  {franchise.city}/{franchise.state}
                </p>
              </div>
            </div>
            <Link
              href={`/franchises/${franchise.id}`}
              className="secondary-btn mt-4 w-full"
            >
              Open record
            </Link>
          </article>
        ))}
      </div>

      <div className="surface-card hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead className="bg-slate-50/90">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Franchise
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Owner
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {franchises.map((franchise) => (
              <tr
                key={franchise.id}
                className="group transition-colors hover:bg-emerald-50/45"
              >
                <td className="px-6 py-4 align-top">
                  <p className="text-sm font-semibold text-slate-900">
                    {franchise.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{franchise.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {franchise.ownerName}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {franchise.city}/{franchise.state}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={franchise.status} />
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/franchises/${franchise.id}`}
                    className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-600 hover:text-emerald-700"
                  >
                    Open record
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
