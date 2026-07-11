"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InterestItem {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface InterestsManagerProps {
  initialInterests: InterestItem[];
}

export default function InterestsManager({ initialInterests }: InterestsManagerProps) {
  const [interests, setInterests] = useState<InterestItem[]>(initialInterests);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", order: 0 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleEditClick = (item: InterestItem) => {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description, order: item.order });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", order: 0 });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setStatus("error");
      setErrorMsg("Başlık ve açıklama boş bırakılamaz.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/admin/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newItem = await res.json();
        setInterests((prev) => [...prev, newItem].sort((a, b) => a.order - b.order));
        setFormData({ title: "", description: "", order: 0 });
        setStatus("success");
        router.refresh();
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "Ekleme sırasında hata oluştu.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Sunucuyla bağlantı kurulamadı.");
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null || !formData.title.trim() || !formData.description.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/admin/interests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...formData }),
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setInterests((prev) =>
          prev.map((item) => (item.id === editingId ? updatedItem : item)).sort((a, b) => a.order - b.order)
        );
        setEditingId(null);
        setFormData({ title: "", description: "", order: 0 });
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

  const handleDeleteClick = async (id: number) => {
    if (!confirm("Bu ilgi alanını silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch("/api/admin/interests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setInterests((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      } else {
        alert("Silme sırasında hata oluştu.");
      }
    } catch {
      alert("Sunucuyla bağlantı kurulamadı.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Existing Interests List */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-[#171717] mb-6">Mevcut İlgi Alanları</h2>
        {interests.length === 0 ? (
          <p className="text-sm text-neutral-500 font-light">Henüz ilgi alanı eklenmemiş.</p>
        ) : (
          <div className="space-y-4">
            {interests.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-neutral-50 border border-neutral-200/60 rounded-xl gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                      Sıra: {item.order}
                    </span>
                    <h3 className="font-serif font-bold text-neutral-800">{item.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-600 font-light mt-1 max-w-xl">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    DÜZENLE
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
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

      {/* Form (Add or Edit) */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-sm max-w-2xl">
        <h2 className="font-serif text-xl font-bold text-[#171717] mb-6">
          {editingId !== null ? "İlgi Alanını Düzenle" : "Yeni İlgi Alanı Ekle"}
        </h2>
        <form onSubmit={editingId !== null ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-title" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">
                Başlık
              </label>
              <input
                type="text"
                id="form-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="form-order" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">
                Sıra No
              </label>
              <input
                type="number"
                id="form-order"
                value={formData.order}
                onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) }))}
                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="form-description" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">
              Açıklama
            </label>
            <textarea
              id="form-description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all resize-none font-light"
              required
            ></textarea>
          </div>

          {status === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
              İşlem başarıyla gerçekleştirildi!
            </div>
          )}

          {status === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3.5 bg-[#171717] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors duration-300 disabled:opacity-50 cursor-pointer"
            >
              {status === "loading" ? "KAYDEDİLİYOR..." : editingId !== null ? "GÜNCELLE" : "EKLE"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-6 py-3.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs uppercase tracking-widest rounded-full transition-colors duration-300 cursor-pointer"
              >
                İPTAL
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
