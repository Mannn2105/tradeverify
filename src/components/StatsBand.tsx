import Stat from "./Stat";
import { getRegistryStats } from "@/lib/data";

export default async function StatsBand() {
  const stats = await getRegistryStats();

  return (
    <section className="border-b border-ink/15 bg-forest-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
