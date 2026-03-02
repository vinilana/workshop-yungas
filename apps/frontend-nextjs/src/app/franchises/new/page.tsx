"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { CreateFranchiseDTO } from "@franchise/shared";
import { createFranchise } from "@/lib/api";
import FranchiseForm from "@/components/FranchiseForm";

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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        New Franchise
      </h1>
      <FranchiseForm onSubmit={handleSubmit} submitLabel="Create Franchise" />
    </div>
  );
}
