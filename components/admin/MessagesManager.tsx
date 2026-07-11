"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MessageItem {
  id: number;
  name: string;
  surname: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}

interface MessagesManagerProps {
  initialMessages: MessageItem[];
}

export default function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const router = useRouter();

  const handleToggleRead = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, isRead: !currentStatus } : msg))
        );
        router.refresh();
      } else {
        alert("Durum güncellenirken hata oluştu.");
      }
    } catch {
      alert("Sunucuyla bağlantı kurulamadı.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch("/api/admin/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        router.refresh();
      } else {
        alert("Silme sırasında hata oluştu.");
      }
    } catch {
      alert("Sunucuyla bağlantı kurulamadı.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-sm">
      {messages.length === 0 ? (
        <p className="text-sm text-neutral-500 font-light text-center py-8">Henüz mesaj alınmamış.</p>
      ) : (
        <div className="divide-y divide-neutral-100">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-6 ${
                !msg.isRead ? "bg-neutral-50/50 px-4 -mx-4 rounded-xl" : ""
              }`}
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {!msg.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" title="Okunmamış"></span>
                  )}
                  <h3 className="font-serif font-bold text-neutral-800 text-sm">
                    {msg.name} {msg.surname}
                  </h3>
                  <a href={`mailto:${msg.email}`} className="text-xs text-neutral-400 hover:underline">
                    {msg.email}
                  </a>
                  <span className="text-[10px] text-neutral-400 ml-auto md:ml-0 font-light">
                    {new Date(msg.createdAt).toLocaleString("tr-TR")}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-light leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => handleToggleRead(msg.id, msg.isRead)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                    msg.isRead
                      ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                      : "bg-neutral-800 hover:bg-neutral-900 text-white"
                  }`}
                >
                  {msg.isRead ? "OKUNMADI İŞARETLE" : "OKUNDU İŞARETLE"}
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  SİL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
