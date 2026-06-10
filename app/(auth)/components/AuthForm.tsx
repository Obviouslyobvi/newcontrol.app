"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Mode = "sign-in" | "sign-up";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        isSignUp ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isSignUp ? { email, password, name } : { email, password }
          ),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.error?.code === "SETUP_REQUIRED") {
          setSetupRequired(true);
          return;
        }
        setError(data?.error?.message ?? "Something went wrong. Please try again.");
        return;
      }
      router.push(search.get("next") ?? "/campaigns");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (setupRequired) {
    return (
      <div className="bg-surface border border-fg/10 rounded-3xl p-8 text-center">
        <h1 className="font-serif text-3xl tracking-tight mb-4">
          Almost ready
        </h1>
        <p className="text-fg/70 leading-relaxed mb-6">
          NewControl accounts aren&apos;t open quite yet — we&apos;re putting the
          finishing touches on the platform. Leave your email on the home page
          and you&apos;ll be the first to know when doors open.
        </p>
        <Link
          href="/#access"
          className="inline-block bg-fg text-bg px-7 py-3.5 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
        >
          Get early access
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-4xl tracking-tight mb-2 text-center">
        {isSignUp ? "Start your free trial" : "Welcome back"}
      </h1>
      <p className="text-fg/60 text-center mb-8">
        {isSignUp
          ? "14 days. Every feature unlocked. No credit card."
          : "Sign in to your NewControl workspace."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="w-full px-6 py-4 rounded-full bg-surface border border-fg/15 text-fg placeholder:text-fg/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourcompany.com"
          autoComplete="email"
          className="w-full px-6 py-4 rounded-full bg-surface border border-fg/15 text-fg placeholder:text-fg/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignUp ? "Password (8+ chars, 1 uppercase, 1 number)" : "Password"}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          className="w-full px-6 py-4 rounded-full bg-surface border border-fg/15 text-fg placeholder:text-fg/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20"
        />

        {error && (
          <p className="text-sm text-ember text-center" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-fg text-bg px-7 py-4 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors disabled:opacity-60"
        >
          {loading
            ? "One moment…"
            : isSignUp
              ? "Start free trial"
              : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-fg/50 text-center mt-6">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-fg underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to NewControl?{" "}
            <Link href="/sign-up" className="text-fg underline-offset-4 hover:underline">
              Start your free trial
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
