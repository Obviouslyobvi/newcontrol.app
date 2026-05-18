const without = [
  "You stare at a blank page and start with the product.",
  "Generic objection handling that names no actual fear.",
  'Benefits stated abstractly. "Save money." "Peace of mind."',
  "The P.S. is an afterthought.",
  "You ship a first draft and hope.",
];

const withControl = [
  "A real person in a real situation opens the letter.",
  "Objections written in the reader's own voice, dismantled with evidence.",
  'Concrete numbers. "Save $847 this year." "27 spots left."',
  "The P.S. is the second-most-read line, treated that way.",
  "You ship the post-QC version. Then iterate.",
];

export default function WithoutWith() {
  return (
    <section className="px-6 py-32 bg-ink text-cream dark:bg-cream dark:text-ink transition-colors">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs font-medium tracking-[0.18em] uppercase text-ember mb-4">
          The technique, applied to itself
        </div>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02] mb-20 max-w-3xl">
          See what your copy looks like before and after.
        </h2>
        <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-cream/10 dark:border-ink/10">
          <div className="p-10 bg-cream/[0.04] dark:bg-ink/[0.03]">
            <div className="text-[10px] font-mono tracking-[0.22em] uppercase opacity-50 mb-8">
              Without NewControl
            </div>
            <ul className="space-y-5 text-lg leading-relaxed opacity-60">
              {without.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="opacity-50 mt-1.5 shrink-0">x</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-10 bg-ember/[0.08] border-t md:border-t-0 md:border-l border-ember/20">
            <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-ember mb-8">
              With NewControl
            </div>
            <ul className="space-y-5 text-lg leading-relaxed">
              {withControl.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="text-ember mt-1.5 shrink-0">+</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
