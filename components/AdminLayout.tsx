"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Avatar Bölümü", href: "/admin/hero" },
    { name: "İlgi Alanları", href: "/admin/interests" },
    { name: "Mesajlar", href: "/admin/contact" },
  ];

  return (
    <div className="min-h-screen bg-[#ECECEC] flex flex-col md:flex-row text-[#171717]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <Link href="/" className="font-serif text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              Avni Arslan
            </Link>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold mt-1">
              Yönetim Paneli
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 space-y-2">
          <Link
            href="/"
            className="block text-center w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-300"
          >
            SİTEYE DÖN
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-300 cursor-pointer"
          >
            ÇIKIŞ YAP
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
