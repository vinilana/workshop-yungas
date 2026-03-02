"use client";

import type { FranchiseStatus } from "@franchise/shared";

const statusStyles: Record<FranchiseStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export default function StatusBadge({ status }: { status: FranchiseStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
