"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeroFormProps {
  initialTitle: string;
  initialDescription: string;
}

export default function HeroForm({ initialTitle, initialDescription }: HeroFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setStatus("error");
      setErrorMsg("Başlık ve açıklama boş bırakılamaz.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setStatus("success");
        router.refresh();
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "Güncelleme sırasında hata oluştu.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Sunucuyla bağlantı kurulamadı.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-2xl border border-neutral-200/60 shadow-sm">
      <div>
        <label htmlFor="title" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">
          Avatar Başlığı
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all font-serif text-lg font-bold"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">
          Avatar Açıklaması (Bio)
        </label>
        <textarea
          id="description"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all resize-none font-light"
          required
        ></textarea>
      </div>

      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
          Avatar içeriği başarıyla güncellendi!
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full md:w-auto px-8 py-4 bg-[#171717] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors duration-300 disabled:opacity-50 cursor-pointer"
      >
        {status === "loading" ? "KAYDEDİLİYOR..." : "KAYDET"}
      </button>
    </form>
  );
}
