interface HeroProps {
  title: string;
  description: string;
}

export default function Hero({ title, description }: HeroProps) {
  return (
    <section className="py-20 md:py-32 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
      <div className="flex-1 max-w-2xl">
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight tracking-tight text-[#171717]">
          {title}
        </h1>
        <p className="mt-8 font-sans text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
          {description}
        </p>
      </div>
      <div className="w-full md:w-1/3 flex justify-end">
        <div className="w-24 h-24 rounded-full bg-neutral-800 opacity-10 flex items-center justify-center">
          {/* Subtle design element */}
        </div>
      </div>
    </section>
  );
}
