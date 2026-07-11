"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    message: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMsg("Lütfen tüm alanları doldurun.");
      return;
    }

    if (!token) {
      setStatus("error");
      setErrorMsg("Lütfen güvenlik doğrulamasını tamamlayın.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", surname: "", email: "", message: "" });
        setToken(null);
        // Reset turnstile widget
        if ((window as any).turnstile) {
          (window as any).turnstile.reset();
        }
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "Bir hata oluştu.");
        // Reset turnstile on error so user can try again
        if ((window as any).turnstile) {
          (window as any).turnstile.reset();
        }
      }
    } catch {
      setStatus("error");
      setErrorMsg("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* Cloudflare Turnstile script loading */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      <div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight tracking-tight text-[#171717]">
          Let's Start a<br />Conversation
        </h2>
        <p className="mt-6 font-sans text-neutral-600 font-light leading-relaxed">
          Benimle iletişime geçmek için formu doldurabilir veya doğrudan e-posta gönderebilirsiniz. 
          Mesajlarınıza en kısa sürede dönüş yapacağım.
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-neutral-400">EMAIL</span>
            <a href="mailto:contact@avniarslan.com" className="font-sans text-neutral-800 hover:underline">
              contact@avniarslan.com
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl border border-neutral-200/60 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">Ad</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">Soyad</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-neutral-500 mb-2 uppercase">Mesaj</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-800 text-sm transition-all resize-none font-light"
              required
            ></textarea>
          </div>

          {/* Turnstile Widget */}
          <div className="flex justify-start">
            <div
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              data-callback="onTurnstileSuccess"
              data-expired-callback="onTurnstileExpired"
            ></div>
          </div>

          {status === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
              Mesajınız başarıyla gönderildi! Teşekkürler.
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
            {status === "loading" ? "SENDING..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </section>
  );
}
