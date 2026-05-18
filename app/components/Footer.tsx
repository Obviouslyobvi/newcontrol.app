export default function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-fg/10">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="font-serif text-xl">NewControl</div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-fg/50">
          <a
            href="https://newcontrol.app"
            className="hover:text-fg transition-colors"
          >
            newcontrol.app
          </a>
          <a
            href="https://github.com/Obviouslyobvi/newcontrol.app"
            className="hover:text-fg transition-colors"
          >
            GitHub
          </a>
          <span>© {new Date().getFullYear()} NewControl</span>
        </div>
      </div>
    </footer>
  );
}
