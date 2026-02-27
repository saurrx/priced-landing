import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-deepest">
      <h1 className="font-sans text-6xl font-black text-text-primary">404</h1>
      <p className="text-lg text-text-secondary">This page doesn't exist.</p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-accent-amber px-6 py-3 text-sm font-bold text-bg-deepest transition-opacity hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
}
