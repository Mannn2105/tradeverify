"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const trades = ["electrician", "plumber", "hvac", "mobile_groomer", "handyman", "landscaper", "cleaner", "other"];

export default function ProviderOnboardingForm() {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "", phone: "", businessName: "", trade: "electrician", bio: "", years: "0", lat: "", lng: "", radius: "25" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const change = (key: keyof typeof values, value: string) => setValues(current => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const account = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, password: values.password, phone: values.phone || undefined, role: "provider" }),
      });
      const accountBody = await account.json();
      if (!account.ok || !accountBody.success) throw new Error(accountBody.error || "Could not create your account.");

      const profile = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: values.businessName,
          trade: values.trade,
          bio: values.bio || undefined,
          yearsInBusiness: Number(values.years),
          serviceArea: { lat: Number(values.lat), lng: Number(values.lng), radiusKm: Number(values.radius) },
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        }),
      });
      const profileBody = await profile.json();
      if (!profile.ok || !profileBody.success) {
        throw new Error(profileBody.error || "Your account was created, but the business profile needs to be completed. Sign in to continue.");
      }
      router.replace("/provider/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete registration.");
    } finally {
      setLoading(false);
    }
  }

  const field = (key: keyof typeof values, label: string, type = "text", required = true) => (
    <label className="block" key={key}>
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2">{label}</span>
      <input type={type} step={key === "years" ? "1" : type === "number" ? "any" : undefined} min={key === "years" ? "0" : key === "radius" ? "1" : key === "lat" ? "-90" : key === "lng" ? "-180" : undefined} max={key === "years" ? "100" : key === "radius" ? "200" : key === "lat" ? "90" : key === "lng" ? "180" : undefined} value={values[key]} onChange={e => change(key, e.target.value)} className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 text-sm text-ink focus:border-forest-600 focus:outline-none" />
    </label>
  );

  return (
    <form onSubmit={submit} className="mt-8 space-y-6 border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_rgba(34,30,23,0.9)] sm:p-7">
      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-slab text-xl font-bold text-ink sm:col-span-2">Account details</h2>
        {field("name", "Your name")}
        {field("email", "Email", "email")}
        {field("password", "Password (at least 8 characters)", "password")}
        {field("phone", "Phone", "tel", false)}
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-slab text-xl font-bold text-ink sm:col-span-2">Business profile</h2>
        {field("businessName", "Business name")}
        <label className="block">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2">Trade</span>
          <select value={values.trade} onChange={e => change("trade", e.target.value)} className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 text-sm text-ink">{trades.map(trade => <option key={trade} value={trade}>{trade.replaceAll("_", " ")}</option>)}</select>
        </label>
        {field("years", "Years in business", "number", false)}
        <label className="block sm:col-span-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2">Business description</span>
          <textarea rows={3} value={values.bio} onChange={e => change("bio", e.target.value)} className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 text-sm text-ink focus:border-forest-600 focus:outline-none" />
        </label>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <h2 className="font-slab text-xl font-bold text-ink sm:col-span-3">Service area</h2>
        {field("lat", "Latitude", "number")}
        {field("lng", "Longitude", "number")}
        {field("radius", "Service radius (km)", "number")}
        <p className="text-xs leading-relaxed text-ink-3 sm:col-span-3">Enter the coordinates for your business location. You can find them by searching your address on a map. These coordinates are used to define your service area and are not shown in the public register.</p>
      </section>
      {error && <p role="alert" className="border-2 border-rust-600 bg-rust-50 px-3 py-2 font-mono text-xs text-rust-600">{error}</p>}
      <button disabled={loading} className="w-full border-2 border-ink bg-forest-700 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper disabled:opacity-60">{loading ? "Creating account…" : "Create provider account"}</button>
      <p className="text-xs leading-relaxed text-ink-3">By continuing, you create a provider account and business profile. Verification is a separate step; your business is not listed publicly until approved.</p>
    </form>
  );
}
