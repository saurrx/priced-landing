const partners = ["Kalshi", "DFlow", "Solana"];

export default function TrustBar() {
  return (
    <section className="border-y border-border-subtle px-6 py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
        {partners.map((name) => (
          <span
            key={name}
            className="text-lg font-medium tracking-wide text-text-tertiary"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
