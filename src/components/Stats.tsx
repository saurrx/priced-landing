import FadeIn from "./FadeIn";

const stats = [
  { value: "395+", label: "Markets tracked daily" },
  { value: "92%", label: "Match accuracy" },
  { value: "<0.5s", label: "Average match time" },
];

export default function Stats() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.12}>
            <div className="rounded-2xl border border-border-subtle px-8 py-10 text-center transition-all duration-300 hover:border-border-hover hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="font-sans text-5xl font-black text-white sm:text-[56px]">
                {stat.value}
              </p>
              <p className="mt-3 text-base text-text-secondary">{stat.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
