"use client";

const CTA_URL = "#waitlist";

export default function Nav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-b-2xl border-b border-border-subtle bg-bg-deepest/70 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-accent-amber">
            PRICED
          </span>
        </div>
        <a
          href={CTA_URL}
          onClick={() => console.log("cta_click", { location: "nav" })}
          className="rounded-full bg-accent-amber px-5 py-2.5 text-sm font-bold text-bg-deepest transition-opacity hover:opacity-90"
        >
          Add to Chrome
        </a>
      </div>
    </nav>
  );
}
