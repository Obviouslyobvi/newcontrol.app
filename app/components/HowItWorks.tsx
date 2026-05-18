const steps = [
  {
    number: "01",
    title: "Drop in your offer.",
    body: "Paste product details, target audience, source terms, and any existing mailers or ads. NewControl reads the fine print so the draft never overclaims on conditional benefits.",
  },
  {
    number: "02",
    title: "Pick your format.",
    body: "Eight-page sales letter. Cold email sequence. Landing page. Ad copy. Lead-gen invitation. Followup. Each format pulls the framework into the right shape and pacing for the channel.",
  },
  {
    number: "03",
    title: "Get a draft that already survived QC.",
    body: "Three adversarial passes run before you see anything. You get the corrected version, not the first attempt. Then you take it from there.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl mb-20">
          <div className="text-xs font-medium tracking-[0.18em] uppercase text-ember mb-4">
            How it works
          </div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02]">
            Three steps. Then a draft worth shipping.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((s) => (
            <div key={s.number}>
              <div className="font-serif text-7xl text-ember/40 mb-6 leading-none">
                {s.number}
              </div>
              <h3 className="font-serif text-2xl tracking-tight mb-4 leading-tight">
                {s.title}
              </h3>
              <p className="text-fg/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
