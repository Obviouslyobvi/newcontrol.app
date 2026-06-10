import Link from "next/link";

export default function FinalCTA() {
  return (
    <section id="access" className="px-6 py-40">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1.04] mb-10">
          Write the <span className="text-ember">new control.</span>
        </h2>
        <p className="text-xl text-fg/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          14-day free trial. No credit card required. Unlimited campaigns from
          day one.
        </p>

        <div className="mb-14">
          <Link
            href="/sign-up"
            className="inline-block bg-fg text-bg px-9 py-4 rounded-full text-base font-medium hover:bg-ember hover:text-cream transition-colors"
          >
            Start free trial
          </Link>
          <p className="text-xs text-fg/40 mt-4">Cancel anytime. Your work stays yours.</p>
        </div>

        <p className="text-sm text-fg/50 mb-5">
          Not ready yet? Get product updates instead:
        </p>
        {/* Swap this Formspree action for the custom endpoint when GrowthKit lands. */}
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          action="https://formspree.io/f/xnjrqddn"
          method="POST"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="you@yourcompany.com"
            className="flex-1 px-6 py-4 rounded-full bg-surface border border-fg/15 text-fg placeholder:text-fg/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20"
          />
          <button
            type="submit"
            className="border border-fg/15 text-fg px-7 py-4 rounded-full font-medium hover:bg-fg/5 transition-colors"
          >
            Keep me posted
          </button>
        </form>
        <p className="text-xs text-fg/40 mt-6">
          No spam. Unsubscribe in one click.
        </p>
      </div>
    </section>
  );
}
