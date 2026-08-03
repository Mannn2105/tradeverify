import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import VerificationQueue from "@/components/admin/VerificationQueue";

export const metadata = {
  title: "Admin — On the Books",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/admin/login");

  return <VerificationQueue />;
}
