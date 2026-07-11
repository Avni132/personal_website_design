import { db } from "@/lib/db";
import Hero from "@/components/Hero";
import Interests from "@/components/Interests";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export const revalidate = 0; // Disable caching to reflect admin changes instantly

export default async function Home() {
  // Fetch Hero content
  let hero = await db.heroContent.findUnique({
    where: { id: 1 },
  });

  if (!hero) {
    hero = {
      id: 1,
      title: "Helping You Shine Online",
      description: "I am Avni, a developer passionate about building clean interfaces and solving complex database and economics problems.",
      updatedAt: new Date(),
    };
  }

  // Fetch Interests sorted by order
  const interests = await db.interest.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-[#ECECEC] min-h-screen text-[#171717]">
      {/* Premium minimal header */}
      <header className="py-6 px-6 max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Avni Arslan
        </Link>
        <nav className="flex items-center gap-6 text-xs uppercase tracking-widest font-semibold">
          <a href="#about" className="hover:opacity-75 transition-opacity">About</a>
          <a href="#contact" className="hover:opacity-75 transition-opacity">Contact</a>
          <Link href="/admin/dashboard" className="hover:opacity-75 transition-opacity bg-neutral-800 text-white px-3 py-1.5 rounded-full text-[10px]">
            Admin
          </Link>
        </nav>
      </header>

      <main className="pb-24">
        <div id="about">
          <Hero title={hero.title} description={hero.description} />
        </div>
        <Interests interests={interests} />
        <div id="contact">
          <ContactForm />
        </div>
      </main>

      <footer className="py-8 border-t border-neutral-300/40 text-center text-xs text-neutral-500 font-light">
        <p>&copy; {new Date().getFullYear()} Avni Arslan. All rights reserved.</p>
      </footer>
    </div>
  );
}
