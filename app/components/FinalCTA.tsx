export default function FinalCTA() {
  return (
    <section id="access" className="px-6 py-40">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1.04] mb-10">
          The control is what's already winning.
          <br />
          <span className="text-ember">
            NewControl is how you write the one that wins next.
          </span>
        </h2>
        <p className="text-xl text-fg/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          Early access is opening soon. Drop your email and we'll let you know
          first.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          action="https://formspree.io/f/your_form_id"
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
            className="bg-fg text-bg px-7 py-4 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
          >
            Get early access
          </button>
        </form>
        <p className="text-xs text-fg/40 mt-6">
          No spam. One email when access opens. Unsubscribe in one click.
        </p>
      </div>
    </section>
  );
}
