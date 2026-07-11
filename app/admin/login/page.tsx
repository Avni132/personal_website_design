"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Setup Turnstile callbacks on window
    (window as any).onTurnstileSuccess = (t: string) => {
      setToken(t);
    };
    (window as any).onTurnstileExpired = () => {
      setToken(null);
    };

    return () => {
      delete (window as any).onTurnstileSuccess;
      delete (window as any).onTurnstileExpired;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Lütfen güvenlik doğrulamasını tamamlayın.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        token,
      });

      if (res?.error) {
        setError("Geçersiz e-posta, şifre veya doğrulama.");
        setToken(null);
        if ((window as any).turnstile) {
          (window as any).turnstile.reset();
        }
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Bir hata oluştu.");
      if ((window as any).turnstile) {
        (window as any).turnstile.reset();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ECECEC] min-h-screen flex items-center justify-center px-6">
      {/* Cloudflare Turnstile script loading */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

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

          {/* Turnstile Widget */}
          <div className="flex justify-center">
            <div
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              data-callback="onTurnstileSuccess"
              data-expired-callback="onTurnstileExpired"
            ></div>
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
