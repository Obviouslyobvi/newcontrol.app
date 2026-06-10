import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          NewControl
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <footer className="px-6 py-8 text-center text-xs text-fg/40">
        © {new Date().getFullYear()} NewControl
      </footer>
    </main>
  );
}
