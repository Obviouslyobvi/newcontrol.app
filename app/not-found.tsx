import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-serif text-8xl text-ember/40 mb-6">404</div>
        <h1 className="font-serif text-3xl tracking-tight mb-4">
          This page doesn&apos;t exist.
        </h1>
        <p className="text-fg/55 mb-8 leading-relaxed">
          The letter you&apos;re looking for was never written — or it moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-fg text-bg px-7 py-3.5 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
        >
          Back to NewControl
        </Link>
      </div>
    </main>
  );
}
