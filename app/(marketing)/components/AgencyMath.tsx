const columns = [
  {
    label: "A traditional agency",
    rows: [
      ["Timeline", "6–8 weeks"],
      ["Cost per campaign", "$5,000–$25,000"],
      ["Versions to test", "1, maybe 2"],
      ["Revisions", "Rounds of approval meetings"],
    ],
    muted: true,
  },
  {
    label: "NewControl",
    rows: [
      ["Timeline", "About 90 seconds"],
      ["Cost", "From $49/month, unlimited campaigns"],
      ["Versions to test", "5 per campaign, different angles"],
      ["Revisions", "Edit anything, rewrite any section"],
    ],
    muted: false,
  },
];

export default function AgencyMath() {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs font-medium tracking-[0.18em] uppercase text-ember mb-4">
          The math
        </div>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02] mb-20 max-w-3xl">
          Agency quality. Without the agency invoice.
        </h2>
        <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-fg/10">
          {columns.map((col) => (
            <div
              key={col.label}
              className={
                col.muted
                  ? "p-10 bg-fg/[0.03]"
                  : "p-10 bg-ember/[0.06] border-t md:border-t-0 md:border-l border-ember/20"
              }
            >
              <div
                className={`text-[10px] font-mono tracking-[0.22em] uppercase mb-8 ${col.muted ? "text-fg/40" : "text-ember"}`}
              >
                {col.label}
              </div>
              <dl className="space-y-5">
                {col.rows.map(([k, v]) => (
                  <div key={k} className={col.muted ? "opacity-60" : ""}>
                    <dt className="text-sm text-fg/50 mb-0.5">{k}</dt>
                    <dd className="text-lg font-medium leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
