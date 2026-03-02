"use client";

import type { FranchiseStatus } from "@franchise/shared";

const statusStyles: Record<
  FranchiseStatus,
  { chip: string; dot: string; label: string }
> = {
  active: {
    chip: "border-emerald-200 bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-600",
    label: "Active",
  },
  inactive: {
    chip: "border-red-200 bg-red-100 text-red-800",
    dot: "bg-red-600",
    label: "Inactive",
  },
  pending: {
    chip: "border-amber-200 bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
    label: "Pending",
  },
};

export default function StatusBadge({ status }: { status: FranchiseStatus }) {
  const tone = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone.chip}`}
    >
      <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
      {tone.label}
    </span>
  );
}
