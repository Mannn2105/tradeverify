import Link from "next/link";
import ProviderOnboardingForm from "@/components/provider/ProviderOnboardingForm";

export const metadata = {
  title: "List your business — On the Books",
  robots: { index: false, follow: false },
};

export default function ProviderRegisterPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <Link href="/" className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-forest-700 underline">← Back to register</Link>
      <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rust-600">Free provider application</p>
      <h1 className="mt-2 font-slab text-3xl font-bold text-ink sm:text-4xl">Put your business on the books.</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">Create your provider account and business profile. You can then submit document links for an administrator to review. Your business will not appear in public search until it is verified.</p>
      <ProviderOnboardingForm />
      <p className="mt-6 text-sm text-ink-2">Already registered? <Link className="font-bold text-forest-700 underline" href="/provider/login">Sign in</Link>.</p>
    </main>
  );
}
