"use client";

import { useCallback, useEffect, useState } from "react";

type VerificationStatus = "pending" | "verified" | "rejected";

type ProviderSummary = {
  _id: string;
  businessName: string;
  trade: string;
  verificationStatus: string;
};

type VerificationRecord = {
  _id: string;
  providerId: ProviderSummary | string | null;
  type: string;
  documentUrl: string;
  status: VerificationStatus;
  notes?: string;
  createdAt: string;
  reviewedAt?: string;
};

const TABS: VerificationStatus[] = ["pending", "verified", "rejected"];

const TYPE_LABEL: Record<string, string> = {
  license: "License",
  insurance: "Insurance",
  background_check: "Background check",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function providerName(record: VerificationRecord): string {
  if (record.providerId && typeof record.providerId === "object") {
    return record.providerId.businessName;
  }
  return "Provider (deleted)";
}

export default function VerificationQueue() {
  const [tab, setTab] = useState<VerificationStatus>("pending");
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchRecords = useCallback(async (status: VerificationStatus) => {
    const res = await fetch(`/api/admin/verifications?status=${status}`);
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.error || "Failed to load the verification queue.");
    }
    return body.data as VerificationRecord[];
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchRecords(tab)
      .then((data) => {
        if (cancelled) return;
        setRecords(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || "Could not reach the server.");
        setRecords([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, fetchRecords]);

  function switchTab(next: VerificationStatus) {
    setTab(next);
    setLoading(true);
    setError(null);
    setRecords([]);
  }

  async function review(id: string, status: "verified" | "rejected") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: notes[id] || undefined }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setError(body.error || "Review failed.");
        return;
      }
      setNotes((n) => {
        const next = { ...n };
        delete next[id];
        return next;
      });
      const data = await fetchRecords(tab);
      setRecords(data);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not reach the server."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rust-600">
            Trust gate
          </p>
          <h1 className="mt-1 font-slab text-3xl font-bold text-ink">
            Verification queue
          </h1>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchTab(t)}
            className={`border-2 border-ink px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
              tab === t
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-ink-2 hover:text-paper"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 border-2 border-rust-600 bg-rust-50 px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-rust-600">
          {error}
        </p>
      )}

      <div className="mt-4">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
            Loading…
          </p>
        ) : records.length === 0 ? (
          <p className="border-2 border-dashed border-ink/30 bg-paper px-4 py-6 font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
            No {tab} submissions in the queue.
          </p>
        ) : (
          <ul className="space-y-4">
            {records.map((record) => (
              <li
                key={record._id}
                className="border-2 border-ink bg-paper shadow-[4px_4px_0_0_rgba(34,30,23,0.9)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/15 px-4 py-3">
                  <div>
                    <h2 className="font-slab text-lg font-bold text-ink">
                      {providerName(record)}
                    </h2>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                      {typeof record.providerId === "object" && record.providerId
                        ? `${record.providerId.trade} · status ${record.providerId.verificationStatus}`
                        : "trade unknown"}
                    </p>
                  </div>
                  <span
                    className={`rounded-sm border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
                      record.status === "verified"
                        ? "border-forest-600 bg-forest-50 text-forest-700"
                        : record.status === "rejected"
                          ? "border-rust-600 bg-rust-50 text-rust-600"
                          : "border-mustard-600 bg-mustard-50 text-mustard-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>

                <dl className="grid gap-x-6 gap-y-1 px-4 py-3 font-mono text-xs text-ink-2 sm:grid-cols-2">
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-ink-3">
                      Document type
                    </dt>
                    <dd className="font-bold text-ink">
                      {TYPE_LABEL[record.type] ?? record.type}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-ink-3">
                      Submitted
                    </dt>
                    <dd className="font-bold text-ink">
                      {formatDate(record.createdAt)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="uppercase tracking-[0.12em] text-ink-3">
                      Document
                    </dt>
                    <dd>
                      <a
                        href={record.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all font-bold text-forest-600 underline underline-offset-2 hover:text-forest-500"
                      >
                        {record.documentUrl}
                      </a>
                    </dd>
                  </div>
                  {record.notes && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.12em] text-ink-3">
                        Provider notes
                      </dt>
                      <dd className="whitespace-pre-wrap text-ink">
                        {record.notes}
                      </dd>
                    </div>
                  )}
                  {record.reviewedAt && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.12em] text-ink-3">
                        Reviewed
                      </dt>
                      <dd className="font-bold text-ink">
                        {formatDate(record.reviewedAt)}
                      </dd>
                    </div>
                  )}
                </dl>

                {record.status === "pending" && (
                  <div className="border-t border-ink/15 px-4 py-3">
                    <textarea
                      value={notes[record._id] ?? ""}
                      onChange={(e) =>
                        setNotes((n) => ({ ...n, [record._id]: e.target.value }))
                      }
                      placeholder="Optional review note…"
                      rows={2}
                      className="w-full resize-y border-2 border-ink bg-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-3 focus:border-forest-600 focus:outline-none"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={busyId === record._id}
                        onClick={() => review(record._id, "verified")}
                        className="border-2 border-ink bg-forest-700 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-forest-600 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === record._id}
                        onClick={() => review(record._id, "rejected")}
                        className="border-2 border-ink bg-rust-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-rust-500 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
