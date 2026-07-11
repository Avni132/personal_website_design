import { db } from "@/lib/db";
import AdminLayout from "@/components/AdminLayout";
import MessagesManager from "@/components/admin/MessagesManager";

export const revalidate = 0;

export default async function AdminContactPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold mb-2 text-[#171717]">
        Mesaj Yönetimi
      </h1>
      <p className="text-xs text-neutral-500 mb-8 font-light">
        İletişim formu aracılığıyla gönderilen tüm mesajları buradan görüntüleyebilir, okundu olarak işaretleyebilir veya silebilirsiniz.
      </p>

      <MessagesManager initialMessages={messages} />
    </AdminLayout>
  );
}
