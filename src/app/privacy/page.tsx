import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Priced by SeerumAI — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <h1 className="mb-2 text-4xl font-black tracking-tight text-text-primary sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mb-12 text-sm text-text-tertiary">
          Last updated: March 3, 2026
        </p>

        <p className="mb-8 text-text-secondary">
          Priced (&ldquo;the Extension&rdquo;) is a Chrome browser extension
          developed and operated by SeerumAI (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;). This privacy policy
          describes how Priced collects, uses, and shares data when you use the
          Extension.
        </p>

        {/* What Priced Does */}
        <Section title="What Priced Does">
          <p>
            Priced is a Chrome extension that matches tweets on X (Twitter) to
            live Polymarket prediction markets and displays interactive trading
            cards with real-time odds directly below matched tweets. Users can
            trade through Solana Blinks without leaving their feed.
          </p>
        </Section>

        {/* Data We Collect */}
        <Section title="Data We Collect">
          <h3 className="mb-2 mt-6 text-lg font-bold text-text-primary">
            Tweet Text
          </h3>
          <p>
            When you scroll your X (Twitter) timeline, Priced reads the text
            content of visible tweets and sends it to our backend server at
            api.seerum.ai over HTTPS for semantic matching against active
            Polymarket prediction markets. We do not store tweet text after
            matching is complete. Tweet text is processed in real time and
            discarded immediately after a match result is returned.
          </p>

          <h3 className="mb-2 mt-6 text-lg font-bold text-text-primary">
            Invite Code
          </h3>
          <p>
            Your invite code is stored locally in your browser using
            chrome.storage.local. It is sent to api.seerum.ai over HTTPS to
            verify access. We store invite codes on our server to manage access
            control.
          </p>

          <h3 className="mb-2 mt-6 text-lg font-bold text-text-primary">
            Extension Preferences
          </h3>
          <p>
            Your settings (such as enabled/disabled state) are stored locally in
            your browser using chrome.storage.local. These are never transmitted
            to any server.
          </p>
        </Section>

        {/* Data We Do NOT Collect */}
        <Section title="Data We Do NOT Collect">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>No wallet private keys</strong> — Priced never accesses or
              stores wallet private keys
            </li>
            <li>
              <strong>No clipboard data</strong> — Priced does not access your
              clipboard
            </li>
            <li>
              <strong>No browsing history</strong> — Priced does not access or
              record any browsing activity outside of x.com and twitter.com
            </li>
            <li>
              <strong>No personal information</strong> — We do not collect
              names, email addresses, IP addresses, or any personally
              identifiable information
            </li>
            <li>
              <strong>No analytics or telemetry</strong> — Priced does not use
              any analytics, tracking pixels, or telemetry services
            </li>
            <li>
              <strong>No cookies</strong> — Priced does not set or read any
              cookies
            </li>
          </ul>
        </Section>

        {/* How We Use Data */}
        <Section title="How We Use Data">
          <p className="mb-4">
            We use the data described above solely to provide the core
            functionality of the Extension: matching tweets to Polymarket
            prediction markets and displaying trading cards. Specifically:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Tweet text is used only to perform semantic matching against
              Polymarket markets and is not stored, logged, or used for any
              other purpose
            </li>
            <li>Invite codes are used only for access control</li>
            <li>
              Extension preferences are used only to maintain your settings
              locally
            </li>
          </ul>
          <p className="mt-4">
            We do not use any data for advertising, marketing, analytics, or any
            purpose unrelated to the Extension&rsquo;s core functionality.
          </p>
        </Section>

        {/* Data Sharing */}
        <Section title="Data Sharing">
          <p className="mb-4">
            We do not sell, trade, rent, or transfer any user data to third
            parties.
          </p>
          <p className="mb-4">
            Tweet text is transmitted to our backend server (api.seerum.ai)
            solely for the purpose of semantic matching. No other third parties
            receive any user data from Priced.
          </p>
          <p>
            When you initiate a trade through a Solana Blink, that transaction
            is between you, your wallet, and the Solana blockchain. Priced does
            not intermediate, log, or store any transaction data.
          </p>
        </Section>

        {/* Data Security */}
        <Section title="Data Security">
          <p>
            All data transmitted between the Extension and our servers is
            encrypted using HTTPS. We do not store personal or sensitive user
            data on our servers. Local data stored via chrome.storage.local is
            protected by your browser&rsquo;s built-in security.
          </p>
        </Section>

        {/* Permissions */}
        <Section title="Permissions">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-3 pr-4 font-semibold text-text-primary">
                    Permission
                  </th>
                  <th className="py-3 font-semibold text-text-primary">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border-subtle/50">
                  <td className="py-3 pr-4 font-mono text-xs">storage</td>
                  <td className="py-3">
                    Store invite code and extension preferences locally
                  </td>
                </tr>
                <tr className="border-b border-border-subtle/50">
                  <td className="py-3 pr-4 font-mono text-xs">
                    host_permissions (api.seerum.ai)
                  </td>
                  <td className="py-3">
                    Send tweet text for semantic matching
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs">
                    host_permissions (x.com, twitter.com)
                  </td>
                  <td className="py-3">
                    Inject trading cards below matched tweets
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Priced requests only the minimum permissions necessary to function.
            We do not request access to tabs, webRequest, scripting, or any
            other broad permissions.
          </p>
        </Section>

        {/* Limited Use Disclosure */}
        <Section title="Limited Use Disclosure">
          <p>
            The use of information received from Google APIs will adhere to the{" "}
            <span className="text-text-primary">
              Chrome Web Store User Data Policy
            </span>
            , including the Limited Use requirements. Priced&rsquo;s use of data
            is limited to providing and improving the single purpose of the
            Extension: matching tweets to prediction markets and enabling
            trading via Solana Blinks.
          </p>
        </Section>

        {/* Children's Privacy */}
        <Section title="Children&rsquo;s Privacy">
          <p>
            Priced is not intended for use by anyone under the age of 18. We do
            not knowingly collect data from children.
          </p>
        </Section>

        {/* Changes to This Policy */}
        <Section title="Changes to This Policy">
          <p>
            We may update this privacy policy from time to time. Changes will be
            posted on this page with an updated revision date. Continued use of
            the Extension after changes constitutes acceptance of the updated
            policy.
          </p>
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <p className="mb-4">
            If you have questions about this privacy policy, contact us at:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Email:{" "}
              <a
                href="mailto:seerum.ai2@gmail.com"
                className="text-accent-amber underline-offset-2 hover:underline"
              >
                seerum.ai2@gmail.com
              </a>
            </li>
            <li>
              Twitter:{" "}
              <a
                href="https://x.com/SeerumAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-amber underline-offset-2 hover:underline"
              >
                @SeerumAI
              </a>
            </li>
            <li>
              Website:{" "}
              <a
                href="https://priced.seerum.ai"
                className="text-accent-amber underline-offset-2 hover:underline"
              >
                priced.seerum.ai
              </a>
            </li>
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-2xl font-bold text-text-primary">{title}</h2>
      <div className="space-y-2 text-text-secondary leading-relaxed">
        {children}
      </div>
    </section>
  );
}
