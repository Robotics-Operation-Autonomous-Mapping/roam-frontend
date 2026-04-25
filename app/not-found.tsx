import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg text-cream flex items-center justify-center px-6">
      <div className="max-w-xl text-center border border-border bg-surface px-10 py-14">
        <p className="font-mono text-xs tracking-widest text-primary mb-4">[ 404 ]</p>
        <h1 className="font-display text-5xl md:text-6xl leading-none mb-6">
          PAGE NOT FOUND
        </h1>
        <p className="font-sans text-cream/80 mb-8">
          The route you requested does not exist. Return to the main site and continue exploring.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors font-sans uppercase tracking-widest"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}

