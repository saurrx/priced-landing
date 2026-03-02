const footerLinks: Record<string, { label: string; href: string; external?: boolean }[]> = {
  Product: [
    { label: "Docs", href: "https://github.com/saurrx/priced/blob/master/docs/ARCHITECTURE.md", external: true },
    { label: "Chrome Extension", href: "https://github.com/saurrx/priced" },
    { label: "Portfolio", href: "/portfolio" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  Community: [
    { label: "Twitter / X", href: "https://x.com/SeerumAI", external: true },
    { label: "Telegram", href: "https://t.me/+dz78jeyPwk5lZTI1", external: true },
    { label: "GitHub", href: "https://github.com/saurrx/priced", external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="Priced logo"
                className="h-7 w-7 rounded-md"
              />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-accent-amber">
                  PRICED
                </span>
                <span className="text-[9px] font-medium tracking-wide text-text-tertiary">
                  by SeerumAI
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
              Every opinion has a price.
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-text-tertiary">
              Markets powered by{" "}
              <span className="font-medium text-text-secondary">Jupiter</span>
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                {heading}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border-subtle pt-6 text-center text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} Priced by Seerum. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
