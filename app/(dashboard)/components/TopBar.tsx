"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/app/(marketing)/components/ThemeToggle";

export default function TopBar({
  userName,
  userEmail,
}: {
  userName: string | null;
  userEmail: string;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  }

  const initial = (userName ?? userEmail).charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 backdrop-blur-md bg-bg/70 border-b border-fg/10 px-4 md:px-8 flex items-center justify-between">
      <div className="md:hidden font-serif text-xl tracking-tight">
        NewControl
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-ember/10 text-ember flex items-center justify-center text-sm font-medium">
            {initial}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-medium">{userName ?? "Account"}</div>
            <div className="text-xs text-fg/50">{userEmail}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          aria-label="Sign out"
          title="Sign out"
          className="h-9 w-9 rounded-full border border-fg/15 hover:border-fg/30 hover:bg-fg/5 transition-colors flex items-center justify-center text-fg/60"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
