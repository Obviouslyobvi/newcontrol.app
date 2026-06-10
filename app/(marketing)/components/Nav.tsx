import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-fg/5">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-serif text-2xl tracking-tight">
          NewControl
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-fg/70">
          <a href="#framework" className="hover:text-fg transition-colors">
            Framework
          </a>
          <a href="#features" className="hover:text-fg transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-fg transition-colors">
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#access"
            className="text-sm bg-fg text-bg px-4 py-2 rounded-full hover:bg-ember hover:text-cream transition-colors"
          >
            Get early access
          </a>
        </div>
      </div>
    </header>
  );
}
