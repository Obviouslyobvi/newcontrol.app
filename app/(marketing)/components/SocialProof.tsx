/*
 * Social proof section.
 *
 * IMPORTANT: The testimonials below are PLACEHOLDERS, visibly marked as
 * examples. Replace each quote/name with a real customer before promoting
 * the site, then delete the "Example" badges. No performance statistics are
 * shown anywhere until real, verifiable numbers exist — slots for them are
 * in comments at the bottom.
 */

const placeholders = [
  {
    quote:
      "Replace this with a real customer quote — e.g. what they mailed, what surprised them, what happened to response.",
    name: "Customer name",
    role: "Title, Company — placeholder",
  },
  {
    quote:
      "Replace this with a second real quote. The strongest ones name a number: a response rate, a job booked, hours saved.",
    name: "Customer name",
    role: "Title, Company — placeholder",
  },
  {
    quote:
      "Replace this with a third real quote, ideally from a different industry than the first two.",
    name: "Customer name",
    role: "Title, Company — placeholder",
  },
];

export default function SocialProof() {
  return (
    <section className="px-6 py-32 bg-surface border-y border-fg/5">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs font-medium tracking-[0.18em] uppercase text-ember mb-4">
          The pedigree
        </div>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02] mb-8 max-w-3xl">
          Built on 50+ years of direct response craft.
        </h2>
        <p className="text-lg text-fg/70 leading-relaxed max-w-2xl mb-20">
          NewControl isn&apos;t trained on blog posts. Its framework is distilled
          from control packages — the letters that kept winning head-to-head
          tests for decades — and developed with veteran direct response
          counsel. The discipline that made those letters work is enforced on
          every draft.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {placeholders.map((t, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-dashed border-fg/20 p-7 relative"
            >
              <span className="absolute -top-2.5 left-6 text-[10px] font-mono tracking-[0.18em] uppercase bg-bg px-2 text-fg/40">
                Example — replace with real quote
              </span>
              <blockquote className="text-fg/55 leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-sm">
                <div className="font-medium text-fg/70">{t.name}</div>
                <div className="text-fg/45">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/*
          Stats band — restore when real, verifiable numbers exist:
          <div className="mt-16 grid sm:grid-cols-3 gap-8 text-center">
            <div><div className="font-serif text-5xl">+XX%</div><div className="text-sm text-fg/50">avg response lift</div></div>
            <div><div className="font-serif text-5xl">X,XXX</div><div className="text-sm text-fg/50">campaigns generated</div></div>
            <div><div className="font-serif text-5xl">XX</div><div className="text-sm text-fg/50">NPS</div></div>
          </div>

          Client logo strip — add real client logos here when available.
        */}
      </div>
    </section>
  );
}
