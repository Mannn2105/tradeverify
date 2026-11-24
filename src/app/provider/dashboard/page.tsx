import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ProviderDashboard from "@/components/provider/ProviderDashboard";

export const metadata = {
  title: "Provider dashboard — On the Books",
  robots: { index: false, follow: false },
};

export default async function ProviderDashboardPage() {
  const session = await getSession();
  if (session?.role !== "provider") redirect("/provider/login");
  return <ProviderDashboard />;
}
