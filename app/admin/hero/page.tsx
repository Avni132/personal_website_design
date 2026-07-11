import { db } from "@/lib/db";
import AdminLayout from "@/components/AdminLayout";
import HeroForm from "@/components/admin/HeroForm";

export const revalidate = 0;

export default async function AdminHeroPage() {
  let hero = await db.heroContent.findUnique({
    where: { id: 1 },
  });

  if (!hero) {
    hero = {
      id: 1,
      title: "",
      description: "",
      updatedAt: new Date(),
    };
  }

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold mb-2 text-[#171717]">
        Avatar Bölümü Yönetimi
      </h1>
      <p className="text-xs text-neutral-500 mb-8 font-light">
        Ana sayfadaki giriş başlığı ve avatar biyografi metnini buradan düzenleyebilirsiniz.
      </p>

      <HeroForm initialTitle={hero.title} initialDescription={hero.description} />
    </AdminLayout>
  );
}
