"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setError(body.error || "Sign in failed.");
        return;
      }
      if (body.data.role !== "admin") {
        setError("This account is not an administrator.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 border-2 border-ink bg-paper shadow-[6px_6px_0_0_rgba(34,30,23,0.9)]"
    >
      <p className="border-b border-ink/15 bg-forest-50 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
        Session cookie required · httpOnly
      </p>
      <div className="space-y-4 px-5 py-5">
        <label className="block">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-3 focus:border-forest-600 focus:outline-none"
            placeholder="you@registry.gov"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">
            Password
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-3 focus:border-forest-600 focus:outline-none"
          />
        </label>

        {error && (
          <p className="border-2 border-rust-600 bg-rust-50 px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-rust-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full border-2 border-ink bg-forest-700 px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.14em] text-paper shadow-[4px_4px_0_0_rgba(34,30,23,1)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(34,30,23,1)] disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
