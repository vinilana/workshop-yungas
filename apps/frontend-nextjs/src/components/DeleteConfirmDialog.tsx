"use client";

interface DeleteConfirmDialogProps {
  open: boolean;
  franchiseName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  franchiseName,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="surface-card relative w-full max-w-md p-6 sm:p-7" data-animate="lift">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-100 text-red-700">
          !
        </span>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
          Delete franchise
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          You are about to permanently remove{" "}
          <span className="font-semibold text-slate-900">{franchiseName}</span>.
          This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="secondary-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="danger-btn"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
