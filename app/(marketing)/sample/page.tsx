import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Sample letter — NewControl",
  description:
    "A complete sample sales letter showing the structure and voice NewControl generates.",
};

/*
 * Demonstration letter for a fictional business (Hartwell Heating & Air).
 * Written in the NewControl house style to show prospects what the engine
 * produces. All names, numbers, and offers herein are illustrative.
 */
export default function SamplePage() {
  return (
    <main className="relative">
      <Nav />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.18em] uppercase text-ember mb-6">
              <span className="h-px w-10 bg-ember" />
              Sample output
              <span className="h-px w-10 bg-ember" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02] mb-6">
              One letter, start to finish.
            </h1>
            <p className="text-lg text-fg/70 max-w-xl mx-auto leading-relaxed">
              Generated for a fictional HVAC company from a three-minute brief.
              Every campaign produces five letters like this, each opening from
              a different angle.
            </p>
          </div>

          {/* The printed page */}
          <div className="bg-white text-neutral-900 rounded-lg shadow-2xl px-8 py-12 md:px-16 md:py-16 mb-12">
            <div className="border-2 border-neutral-800 px-5 py-4 mb-10 text-center font-semibold leading-relaxed text-sm md:text-base">
              FOR HOMEOWNERS IN MAPLE GROVE WITH AIR CONDITIONERS OVER 8 YEARS
              OLD: A $89 visit in May could save you a $4,000 emergency in July.
            </div>

            <h2 className="font-serif text-2xl md:text-3xl leading-snug mb-8">
              The Hottest Friday of Last Summer, the Hendersons&apos; Air
              Conditioner Quietly Decided It Was Done
            </h2>

            <div className="space-y-5 text-[15px] md:text-base leading-relaxed">
              <p>It was 4:45 in the afternoon. 97 degrees.</p>
              <p>
                Sarah Henderson heard a cough from the basement — then silence.
                Not the good kind. The kind where you stand very still at the
                top of the stairs and already know.
              </p>
              <p>
                By 6:00, the house was 84 degrees. By 9:00, the kids were
                sleeping on the living room floor in front of a box fan. The
                first repair company that answered the phone could come
                Tuesday. The second one could come sooner — for an emergency
                rate that made Tuesday sound reasonable.
              </p>
              <p>
                The bill came to $3,840. And here&apos;s the part that stings:
                the failed part had been wearing out, visibly, for two years.
                Anyone who opened that unit in spring would have caught it for
                the cost of a dinner out.
              </p>
              <p>I&apos;m writing to you because nobody opened the unit.</p>
              <p>
                My name is Mike Hartwell. My family has repaired furnaces and
                air conditioners in this county for 26 years, and you&apos;re
                getting this letter because your neighborhood was built in the
                same stretch of years as the Hendersons&apos; — which means
                your system is in the same season of life as theirs was.
              </p>
              <p>
                Most air conditioners don&apos;t die suddenly. They announce it
                for months — in electrical connections nobody checks, in
                refrigerant pressure nobody measures, in a capacitor that reads
                &ldquo;weak&rdquo; long before it reads &ldquo;dead.&rdquo;
                That&apos;s why we built our{" "}
                <strong>21-Point Pre-Season Inspection</strong>: it opens every
                place failures start, not just the places that are easy to
                reach.
              </p>
              <p>Here&apos;s what that means for you:</p>
              <p>
                <strong>Catch the $40 part before it becomes the $4,000
                emergency.</strong>{" "}
                Nineteen of the twenty-one points exist because we&apos;ve
                watched each one take down a system in July.
              </p>
              <p>
                <strong>Cut the bills you&apos;re already paying.</strong> A
                tuned system pulls less power every hour it runs. Most homes
                see the inspection pay for itself over the summer.
              </p>
              <p>
                <strong>Sleep through the heat wave.</strong> When the first
                100-degree week hits and the phones light up, you get to be the
                house that doesn&apos;t need to call anyone.
              </p>
              <p>
                Through May 31, the full 21-Point Pre-Season Inspection is{" "}
                <strong>$89</strong> — it&apos;s $149 the rest of the year. We
                cap spring slots at what our crews can do without rushing, and
                when they&apos;re booked, they&apos;re booked.
              </p>
              <p>
                And it carries our plain-English guarantee: if your system
                suffers a breakdown this summer in any of the 21 points we
                inspected, the service call to fix it is free. We put that in
                writing on your inspection report.
              </p>
              <p>
                <strong>
                  Call (555) 201-4400 and say &ldquo;spring tune-up,&rdquo;
                </strong>{" "}
                or book online at hartwellair.example/spring. The visit takes
                about 50 minutes. You&apos;ll get a written report — every
                point, plain English, no surprises.
              </p>
              <p>
                Sincerely,
                <br />
                Mike Hartwell
                <br />
                Hartwell Heating &amp; Air
              </p>
              <p>
                <strong>P.S.</strong> The $89 spring rate ends May 31, and our
                calendar usually fills a week or two before that. If you only
                do one thing for your house this spring, make it the call that
                keeps July boring: (555) 201-4400.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-fg/60 mb-6">
              Your offer. Your customers. Five letters like this in about 90
              seconds.
            </p>
            <Link
              href="/sign-up"
              className="inline-block bg-fg text-bg px-8 py-4 rounded-full font-medium hover:bg-ember hover:text-cream transition-colors"
            >
              Write yours — free for 14 days
            </Link>
            <p className="text-xs text-fg/40 mt-4">
              Hartwell Heating &amp; Air is a fictional business; this letter is
              a product demonstration.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
