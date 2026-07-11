import { db } from "@/lib/db";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboard() {
  const messageCount = await db.contactMessage.count();
  const unreadMessageCount = await db.contactMessage.count({
    where: { isRead: false },
  });
  const interestCount = await db.interest.count();
  const hero = await db.heroContent.findUnique({
    where: { id: 1 },
  });

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold mb-8 text-[#171717]">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-sm">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Gelen Mesajlar</span>
          <span className="block text-4xl font-bold mt-2 text-[#171717]">
            {messageCount}
          </span>
          {unreadMessageCount > 0 && (
            <span className="inline-block mt-2 text-[10px] font-semibold bg-red-50 text-red-700 px-2.5 py-1 rounded-full">
              {unreadMessageCount} okunmamış
            </span>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-sm">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">İlgi Alanları</span>
          <span className="block text-4xl font-bold mt-2 text-[#171717]">
            {interestCount}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-sm">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Avatar Durumu</span>
          <span className="block text-sm font-semibold mt-4 text-green-700 bg-green-50 px-3 py-1.5 rounded-xl w-fit">
            {hero ? "Oluşturuldu" : "Oluşturulmadı"}
          </span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200/60 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-[#171717] mb-4">
          Hızlı İşlemler
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/hero"
            className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300"
          >
            <span>Avatar Düzenle</span>
            <span>&rarr;</span>
          </Link>
          <Link
            href="/admin/interests"
            className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300"
          >
            <span>İlgi Alanları Yönet</span>
            <span>&rarr;</span>
          </Link>
          <Link
            href="/admin/contact"
            className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300"
          >
            <span>Mesajları Oku</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
