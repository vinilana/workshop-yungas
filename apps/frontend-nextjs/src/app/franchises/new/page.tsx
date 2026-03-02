"use client";

import { useAuth } from "@clerk/nextjs";
import type { CreateFranchiseDTO } from "@franchise/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FranchiseForm from "@/components/FranchiseForm";
import { createFranchise } from "@/lib/api";

export default function NewFranchisePage() {
  const { getToken } = useAuth();
  const router = useRouter();

  async function handleSubmit(data: CreateFranchiseDTO) {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    await createFranchise(token, data);
    router.push("/dashboard");
  }

  return (
    <div className="space-y-6" data-animate="lift">
      <section className="surface-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="tag-pill">New onboarding</span>
            <h1 className="page-title mt-4">Create a new franchise</h1>
            <p className="page-subtitle">
              Add a complete profile so your operations team can manage this
              unit from day one.
            </p>
          </div>
          <Link href="/dashboard" className="secondary-btn">
            Back to dashboard
          </Link>
        </div>
      </section>
      <FranchiseForm onSubmit={handleSubmit} submitLabel="Create Franchise" />
    </div>
  );
}
