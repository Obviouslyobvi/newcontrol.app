const faqs = [
  {
    q: "Will it sound robotic?",
    a: "No — and that's the whole point. Generic AI tools write like a press release. NewControl writes inside a direct response discipline: conversational voice, short sentences, a real scene before any selling starts. Every draft also passes a three-stage quality check before you see it. And if a line doesn't sound like you, edit it or have the engine rewrite just that section.",
  },
  {
    q: "Can I edit the output?",
    a: "Everything. Each letter opens in an editor where you can rewrite any line, regenerate any section, and watch a live print preview as you work. Your edits auto-save, and exports always use your latest version.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT is a blank box — quality depends on the prompt you happen to write that day. NewControl is a system: a structured brief, a proven direct response architecture enforced on every letter, five deliberately different variations, a quality audit, and print-ready output with proper margins and fold marks. You answer questions about your offer; the discipline is built in.",
  },
  {
    q: "What if I'm not happy with the letters?",
    a: "Regenerate as many times as you like — every plan has unlimited campaigns, so there's no meter running. Adjust your brief, switch tone, change the length, or rewrite a single section. And the trial is free, so you can judge the quality on your own offer before paying anything.",
  },
  {
    q: "Do you support formats besides sales letters?",
    a: "Yes: postcards, emails, cold outreach, social ads, landing pages, lead-generation letters, and follow-ups. Direct mail is the foundation — the same persuasion architecture adapts to each format's length and pacing.",
  },
  {
    q: "Is my data secure?",
    a: "Your campaigns and brand details belong to your workspace and are never shared between accounts or used to write anyone else's copy. Passwords are encrypted, sessions are locked to secure cookies, and all traffic runs over HTTPS.",
  },
  {
    q: "Can my team use it?",
    a: "Yes. Professional includes 3 team members, Agency includes 10, and Enterprise is unlimited. Everyone shares the workspace's campaigns and brand voices.",
  },
  {
    q: "What happens after the trial?",
    a: "After 14 days you'll be asked to pick a plan. Nothing is deleted and nothing is held hostage — everything you created stays viewable, and subscribing picks up right where you left off.",
  },
  {
    q: "Do I need to know copywriting?",
    a: "No. The wizard asks plain questions — what you're offering, who it's for, why it matters. The framework turns your answers into structured persuasion. Knowing your customers is your job; the copywriting discipline is ours.",
  },
  {
    q: "Can it match my company's voice?",
    a: "Yes. Create a brand profile with your tone settings, words you use, words you avoid, and a few samples of past writing. Every campaign generated under that profile sounds like your company wrote it.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs font-medium tracking-[0.18em] uppercase text-ember mb-4">
          Questions
        </div>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02] mb-16">
          Asked and answered.
        </h2>
        <div className="divide-y divide-fg/10">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-6">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-lg font-medium">
                {faq.q}
                <span
                  aria-hidden
                  className="text-ember text-2xl leading-none transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-fg/70 leading-relaxed mt-4 pr-8">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
