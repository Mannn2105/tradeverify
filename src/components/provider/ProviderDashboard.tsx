"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Provider = { _id: string; businessName: string; trade: string; verificationStatus: string; verifiedAt?: string };
type Verification = { _id: string; type: string; documentUrl: string; status: string; createdAt: string; notes?: string };

const documentTypes = ["license", "insurance", "background_check"];

export default function ProviderDashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [records, setRecords] = useState<Verification[]>([]);
  const [type, setType] = useState("license");
  const [documentUrl, setDocumentUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ businessName: "", trade: "electrician", bio: "", years: "0", lat: "", lng: "", radius: "25" });

  async function load() {
    const response = await fetch("/api/providers/me");
    const body = await response.json();
    if (!response.ok || !body.success) throw new Error(body.error || "Could not load provider profile.");
    if (!body.data) { setProvider(null); setRecords([]); return; }
    setProvider(body.data);
    const submissions = await fetch(`/api/providers/${body.data._id}/verification`);
    const submissionBody = await submissions.json();
    if (!submissions.ok || !submissionBody.success) throw new Error(submissionBody.error || "Could not load document submissions.");
    setRecords(submissionBody.data);
  }

  useEffect(() => {
    load().catch(err => setError(err instanceof Error ? err.message : "Could not load dashboard.")).finally(() => setLoading(false));
  }, []);

  async function createProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: profileDraft.businessName,
          trade: profileDraft.trade,
          bio: profileDraft.bio || undefined,
          yearsInBusiness: Number(profileDraft.years),
          serviceArea: { lat: Number(profileDraft.lat), lng: Number(profileDraft.lng), radiusKm: Number(profileDraft.radius) },
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.error || "Could not create business profile.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create business profile.");
    } finally {
      setSaving(false);
    }
  }

  async function submitDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!provider) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/providers/${provider._id}/verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, documentUrl, notes: notes || undefined }),
      });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.error || "Document submission failed.");
      setDocumentUrl("");
      setNotes("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document submission failed.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/provider/login");
    router.refresh();
  }

  if (loading) return <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 font-mono text-xs uppercase tracking-wider text-ink-3">Loading provider dashboard…</main>;

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-ink pb-5">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rust-600">Provider workspace</p>
          <h1 className="mt-2 font-slab text-3xl font-bold text-ink">Business dashboard</h1>
          {provider && <p className="mt-1 text-sm text-ink-2">{provider.businessName} · {provider.trade.replaceAll("_", " ")}</p>}
        </div>
        <button onClick={logout} className="border-2 border-ink px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink">Sign out</button>
      </header>

      {error && <p role="alert" className="mt-5 border-2 border-rust-600 bg-rust-50 px-3 py-2 font-mono text-xs text-rust-600">{error}</p>}

      {!provider ? (
        <section className="mt-8 border-2 border-ink bg-paper p-5">
          <h2 className="font-slab text-xl font-bold text-ink">Business profile not found</h2>
          <p className="mt-2 text-sm text-ink-2">Your provider account exists, but its business profile has not been completed.</p>
          <p className="mt-2 text-sm text-ink-2">Please contact registry support to complete profile setup before submitting documents.</p>
        </section>
      ) : (
        <>
          <section className="mt-7 border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_rgba(34,30,23,0.85)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">Verification status</p>
            <p className="mt-2 font-slab text-2xl font-bold capitalize text-ink">{provider.verificationStatus}</p>
            <p className="mt-2 text-sm text-ink-2">Your business appears in public search only after the required documents have been reviewed and approved.</p>
          </section>

          <section className="mt-8">
            <h2 className="font-slab text-2xl font-bold text-ink">Submit verification documents</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">Provide a secure, accessible URL to the document. Do not use a public link containing sensitive personal information. File uploads are not enabled in this version.</p>
            <form onSubmit={submitDocument} className="mt-4 space-y-4 border-2 border-ink bg-paper p-5">
              <label className="block">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-2">Document type</span>
                <select value={type} onChange={e => setType(e.target.value)} className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 text-sm text-ink">{documentTypes.map(item => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select>
              </label>
              <label className="block">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-2">Secure document URL</span>
                <input type="url" required value={documentUrl} onChange={e => setDocumentUrl(e.target.value)} placeholder="https://…" className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 text-sm text-ink" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-2">Notes (optional)</span>
                <textarea rows={2} maxLength={1000} value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 text-sm text-ink" />
              </label>
              <button disabled={saving} className="border-2 border-ink bg-forest-700 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-paper disabled:opacity-60">{saving ? "Submitting…" : "Submit document for review"}</button>
            </form>
          </section>

          <section className="mt-8">
            <h2 className="font-slab text-2xl font-bold text-ink">Submission history</h2>
            {records.length === 0 ? <p className="mt-3 border-2 border-dashed border-ink/30 p-5 font-mono text-xs uppercase tracking-wider text-ink-3">No documents submitted yet.</p> : <ul className="mt-3 space-y-3">{records.map(record => <li key={record._id} className="border-2 border-ink bg-paper p-4"><div className="flex flex-wrap justify-between gap-2"><strong className="capitalize text-ink">{record.type.replaceAll("_", " ")}</strong><span className="font-mono text-xs uppercase text-ink-3">{record.status}</span></div><a href={record.documentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-sm text-forest-700 underline">{record.documentUrl}</a><p className="mt-1 font-mono text-[11px] text-ink-3">Submitted {new Date(record.createdAt).toLocaleString()}</p>{record.notes && <p className="mt-2 text-sm text-ink-2">{record.notes}</p>}</li>)}</ul>}
          </section>
        </>
      )}
    </main>
  );
}
