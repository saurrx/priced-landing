import FadeIn from "./FadeIn";

const steps = [
  {
    number: "01",
    title: "Scroll",
    description: "Browse X like you normally do. Priced runs silently in the background.",
  },
  {
    number: "02",
    title: "Match",
    description: "We match tweets to live prediction markets with 92% accuracy in under 500ms.",
  },
  {
    number: "03",
    title: "Trade",
    description: "One-click trading via Solana Blinks. No app switching. No friction.",
  },
];

export default function Steps() {
  return (
    <section className="dot-grid-bg relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <h2 className="gradient-text text-center text-3xl font-black tracking-tight sm:text-4xl">
            How it works
          </h2>
        </FadeIn>
        <div className="mt-16 grid grid-cols-1 gap-0 sm:grid-cols-3">
          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.12}>
              <div className="relative flex flex-col items-center px-8 py-8 text-center sm:items-start sm:text-left">
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-14 right-0 hidden h-px w-full bg-gradient-to-r from-border-subtle to-transparent sm:block" style={{ left: '60%', width: '80%' }} />
                )}
                <span className="font-mono text-sm text-text-tertiary">
                  {step.number}
                </span>
                <h3 className="mt-3 text-3xl font-black text-text-primary sm:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-base leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
