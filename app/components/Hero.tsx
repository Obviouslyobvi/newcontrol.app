export default function Hero() {
  return (
    <section className="relative px-6 pt-24 pb-32 md:pt-32 md:pb-40">
      <div className="mx-auto max-w-5xl">
        <div className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.18em] uppercase text-ember mb-10">
          <span className="h-px w-10 bg-ember" />
          Direct response copy, engineered
        </div>

        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.92] tracking-tight mb-4">
          The control is what&apos;s already winning.
        </h1>
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-ember mb-10">
          NewControl is how you write the one that wins next.
        </h2>

        <p className="text-xl md:text-2xl text-fg/70 max-w-2xl leading-relaxed mb-12">
          NewControl turns your offer into sales letters, cold emails, landing
          pages, and ad copy using the 22-step framework behind direct mail
          winners that have generated billions in measured revenue.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#access"
            className="bg-fg text-bg px-7 py-4 rounded-full text-base font-medium hover:bg-ember hover:text-cream transition-colors"
          >
            Get early access
          </a>
          <a
            href="#framework"
            className="px-7 py-4 rounded-full text-base font-medium text-fg hover:bg-fg/5 transition-colors inline-flex items-center gap-2"
          >
            See the framework
            <span aria-hidden>{"→"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
