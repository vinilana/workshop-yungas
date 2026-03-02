"use client";

import type {
  CreateFranchiseDTO,
  Franchise,
} from "@franchise/shared";
import { BRAZILIAN_STATES, FRANCHISE_STATUSES } from "@franchise/shared";
import { useState } from "react";

interface FranchiseFormProps {
  initialData?: Franchise;
  onSubmit: (data: CreateFranchiseDTO) => Promise<void>;
  submitLabel: string;
}

export default function FranchiseForm({
  initialData,
  onSubmit,
  submitLabel,
}: FranchiseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateFranchiseDTO>({
    name: initialData?.name || "",
    ownerName: initialData?.ownerName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    status: initialData?.status || "pending",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const fieldLabelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-card max-w-4xl space-y-8 p-6 sm:p-8"
      data-animate="lift"
    >
      <div>
        <span className="tag-pill">Franchise profile</span>
        <p className="mt-3 text-sm text-slate-600">
          Keep this data accurate to simplify support, expansion, and reporting.
        </p>
      </div>

      {error && (
        <div className="alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={fieldLabelClass}>
            Franchise Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Golden Bean Coffee - Sao Paulo"
            className="soft-input"
          />
        </div>

        <div>
          <label htmlFor="ownerName" className={fieldLabelClass}>
            Owner Name
          </label>
          <input
            id="ownerName"
            name="ownerName"
            type="text"
            required
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Full legal name"
            className="soft-input"
          />
        </div>

        <div>
          <label htmlFor="email" className={fieldLabelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="owner@brand.com"
            className="soft-input"
          />
        </div>

        <div>
          <label htmlFor="phone" className={fieldLabelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+55 (11) 98888-8888"
            className="soft-input"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className={fieldLabelClass}>
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Avenue, number, district"
            className="soft-input"
          />
        </div>

        <div>
          <label htmlFor="city" className={fieldLabelClass}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="Sao Paulo"
            className="soft-input"
          />
        </div>

        <div>
          <label htmlFor="state" className={fieldLabelClass}>
            State
          </label>
          <select
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            className="soft-input"
          >
            <option value="">Select a state</option>
            {BRAZILIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className={fieldLabelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="soft-input"
          >
            {FRANCHISE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t pt-6">
        <button
          type="submit"
          disabled={loading}
          className="primary-btn min-w-40"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
        <p className="text-xs text-slate-500">
          Updates are visible immediately in the dashboard.
        </p>
      </div>
    </form>
  );
}
