"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Geçersiz e-posta veya şifre.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ECECEC] min-h-screen flex items-center justify-center px-6">
      <div className="bg-white p-8 md:p-10 rounded-2xl border border-neutral-200/60 shadow-sm max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
            Avni Arslan
          </Link>
          <p className="mt-2 text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            Admin Girişi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#171717] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
          </button>
        </form>
      </div>
    </div>
  );
}
