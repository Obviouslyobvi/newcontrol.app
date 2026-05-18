const features = [
  {
    eyebrow: "AAA Architecture",
    title: "Attention. Amplification. Action.",
    body: "The macro shape behind every winning letter. NewControl writes inside this three-act structure by default, then tunes the page-by-page pacing for the format you're writing in.",
  },
  {
    eyebrow: "The Draper Gate",
    title: "A human truth before the first word.",
    body: "Before any copy lands on the page, NewControl identifies the lived, felt, sensory moment your letter is really about. The product never opens the letter. A person in a situation does.",
  },
  {
    eyebrow: "WITHOUT vs WITH",
    title: "The contrast block that does the selling.",
    body: "Show the nightmare without your product. Then the relief with it. The gap between the two does more work than any feature list. NewControl drops these in where they land hardest.",
  },
  {
    eyebrow: "The Resolution Beat",
    title: "Urgency pushes. The Resolution Beat pulls.",
    body: "One quiet sentence of settled confidence before the final CTA, so the 80%-there reader feels ownership before they commit. Most AI copy is all push. NewControl knows when to pull.",
  },
  {
    eyebrow: "Protective Instinct",
    title: "Self-preservation is strong. Protecting family is stronger.",
    body: "When your offer covers a household, NewControl writes the scenario that puts someone the reader loves in the crisis, not just the reader. The second membership stops being a line item.",
  },
  {
    eyebrow: "3-Pass Adversarial QC",
    title: "You see the post-QC version, not the first draft.",
    body: "Every draft runs through Claim Discipline (no overclaims on conditional benefits), Rule-by-Rule Audit (17 writing rules, worst-offender hunting), and Checklist Verification before it ever reaches you.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="px-6 py-32 bg-surface border-y border-fg/5"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-20">
          <div className="text-xs font-medium tracking-[0.18em] uppercase text-ember mb-4">
            What's inside
          </div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02]">
            Not a prompt wrapper.
            <br />A persuasion engine.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {features.map((f) => (
            <div key={f.title} className="border-t border-fg/10 pt-8">
              <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-ember mb-4">
                {f.eyebrow}
              </div>
              <h3 className="font-serif text-3xl tracking-tight leading-[1.1] mb-4">
                {f.title}
              </h3>
              <p className="text-lg text-fg/70 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
