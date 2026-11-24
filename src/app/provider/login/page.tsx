import Link from "next/link";
import ProviderLoginForm from "@/components/provider/ProviderLoginForm";

export const metadata = {
  title: "Provider sign in — On the Books",
  robots: { index: false, follow: false },
};

export default function ProviderLoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-12">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rust-600">Provider access</p>
      <h1 className="mt-2 font-slab text-3xl font-bold text-ink">Sign in to your business account</h1>
      <p className="mt-2 text-sm text-ink-2">Manage your profile and submit verification documents.</p>
      <ProviderLoginForm />
      <p className="mt-6 text-sm text-ink-2">New to the register? <Link className="font-bold text-forest-700 underline" href="/register">Create a provider account</Link>.</p>
    </main>
  );
}
