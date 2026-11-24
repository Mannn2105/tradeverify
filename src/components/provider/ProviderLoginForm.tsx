"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProviderLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.error || "Sign in failed.");
      if (body.data.role !== "provider") {
        await fetch("/api/auth/logout", { method: "POST" });
        throw new Error("This account is not a provider account.");
      }
      router.replace("/provider/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_rgba(34,30,23,0.9)]">
      <label className="block">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Email</span>
        <input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-forest-600 focus:outline-none" />
      </label>
      <label className="block">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Password</span>
        <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-forest-600 focus:outline-none" />
      </label>
      {error && <p role="alert" className="border-2 border-rust-600 bg-rust-50 px-3 py-2 font-mono text-xs text-rust-600">{error}</p>}
      <button disabled={loading} className="w-full border-2 border-ink bg-forest-700 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
