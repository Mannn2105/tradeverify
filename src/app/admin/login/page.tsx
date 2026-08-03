import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin sign in — On the Books",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");

  return (
    <div className="mx-auto mt-8 max-w-md">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rust-600">
        Restricted area
      </p>
      <h1 className="mt-2 font-slab text-3xl font-bold text-ink">
        Administrator sign in
      </h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
        Municipal registry · verification queue
      </p>
      <LoginForm />
    </div>
  );
}
