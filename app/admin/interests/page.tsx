import { db } from "@/lib/db";
import AdminLayout from "@/components/AdminLayout";
import InterestsManager from "@/components/admin/InterestsManager";

export const revalidate = 0;

export default async function AdminInterestsPage() {
  const interests = await db.interest.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold mb-2 text-[#171717]">
        İlgi Alanları Yönetimi
      </h1>
      <p className="text-xs text-neutral-500 mb-8 font-light">
        Ana sayfadaki ilgi alanları kartlarını buradan ekleyebilir, düzenleyebilir veya silebilirsiniz.
      </p>

      <InterestsManager initialInterests={interests} />
    </AdminLayout>
  );
}
