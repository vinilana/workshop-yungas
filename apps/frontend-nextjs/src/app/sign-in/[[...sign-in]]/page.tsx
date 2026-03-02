import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div
      className="mx-auto grid min-h-[78vh] max-w-5xl gap-6 py-4 lg:grid-cols-[1.1fr_1fr]"
      data-animate="lift"
    >
      <section className="surface-card hidden p-8 lg:flex lg:flex-col lg:justify-between">
        <div>
          <span className="tag-pill">Welcome back</span>
          <h1 className="page-title mt-4">Run every franchise with confidence</h1>
          <p className="page-subtitle">
            Access your command center to monitor units, update records, and
            keep operations aligned across your entire network.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-slate-600">
          <p className="tag-pill w-fit">Fast search and status tracking</p>
          <p className="tag-pill w-fit">Consistent data for every location</p>
          <p className="tag-pill w-fit">One workspace for owners and ops</p>
        </div>
      </section>

      <section className="surface-card flex items-center justify-center p-4 sm:p-6">
        <SignIn
          routing="path"
          path="/sign-in"
          appearance={{
            variables: {
              colorPrimary: "#0f766e",
              colorText: "#0f172a",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "shadow-none",
              footerActionLink: "text-emerald-700 hover:text-emerald-800",
            },
          }}
        />
      </section>

      <p className="text-center text-xs text-slate-500 lg:col-span-2">
        New here? Contact your workspace admin to request access.
        <Link href="/dashboard" className="ml-1 font-semibold text-emerald-700">
          Open dashboard
        </Link>
      </p>
    </div>
  );
}
