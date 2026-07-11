interface InterestItem {
  id: number;
  title: string;
  description: string;
}

interface InterestsProps {
  interests: InterestItem[];
}

export default function Interests({ interests }: InterestsProps) {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-[#171717]">
        İlgi Alanlarım
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {interests.map((interest) => (
          <div
            key={interest.id}
            className="bg-white p-8 rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 font-bold mb-6 group-hover:bg-neutral-800 group-hover:text-white transition-colors duration-300">
              {interest.title.charAt(0)}
            </div>
            <h3 className="font-serif text-xl font-bold text-[#171717] mb-3">
              {interest.title}
            </h3>
            <p className="font-sans text-neutral-600 font-light leading-relaxed text-sm">
              {interest.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
