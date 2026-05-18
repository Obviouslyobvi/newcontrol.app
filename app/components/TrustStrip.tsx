const controls = [
  "NRA Emergency Assistance Plus",
  "Discover Home Equity",
  "Healthspan+ Montecito",
];

export default function TrustStrip() {
  return (
    <section className="border-y border-fg/10 py-12 px-6 bg-bg">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium tracking-[0.18em] uppercase text-fg/50 mb-6 text-center">
          Built on the principles behind proven controls
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
          {controls.map((c) => (
            <span
              key={c}
              className="text-fg/70 text-sm md:text-base font-medium"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
