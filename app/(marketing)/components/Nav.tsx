import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-fg/5">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          NewControl
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-fg/70">
          <a href="/#features" className="hover:text-fg transition-colors">
            Framework
          </a>
          <a href="/#how" className="hover:text-fg transition-colors">
            How it works
          </a>
          <a href="/#pricing" className="hover:text-fg transition-colors">
            Pricing
          </a>
          <a href="/#faq" className="hover:text-fg transition-colors">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="hidden sm:block text-sm text-fg/70 hover:text-fg transition-colors px-2"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm bg-fg text-bg px-4 py-2 rounded-full hover:bg-ember hover:text-cream transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </header>
  );
}
