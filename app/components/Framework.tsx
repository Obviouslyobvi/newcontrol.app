const steps = [
  "Headline / Opening Hook",
  "Lead Paragraph",
  "Why I'm Writing",
  "Problem / Need Identification",
  "Solution Introduction",
  "How It Works",
  "Benefits List (Primary)",
  "Social Proof",
  "Credibility Building",
  "More Benefits (Secondary)",
  "Handle Objections",
  "Risk Reversal (Guarantee)",
  "Offer Details",
  "Scarcity / Urgency",
  "Ease of Ordering",
  "Value Proposition Summary",
  "Call to Action",
  "Penalty for Inaction",
  "Reassurance",
  "Final CTA",
  "Signature",
  "P.S. Section",
];

export default function Framework() {
  return (
    <section id="framework" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-medium tracking-[0.18em] uppercase text-ember mb-4">
            The 22-step framework
          </div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02] mb-6">
            Twenty-two ordered moves.
            <br />
            None optional.
          </h2>
          <p className="text-lg text-fg/70 leading-relaxed">
            Every letter NewControl writes flows through the same 22
            psychological steps used by the controls that have generated billions
            in measured mail. Each step has one specific job. Nothing is wasted.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {steps.map((step, i) => (
            <div
              key={step}
              className="group border border-fg/10 rounded-2xl p-5 hover:border-ember hover:bg-surface transition-all"
            >
              <div className="text-[10px] text-ember font-mono tracking-widest mb-2">
                STEP {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-fg font-medium text-sm leading-snug">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
