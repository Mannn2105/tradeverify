import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export const metadata = {
  title: "Admin — On the Books",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-paper texture-blueprint">
      <header className="sticky top-0 z-10 border-b-2 border-ink bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            href="/admin"
            className="font-slab text-lg font-bold tracking-tight text-ink"
          >
            On the Books
            <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-ink-3">
              · Administrator
            </span>
          </Link>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
