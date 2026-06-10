"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Solo",
    monthly: 49,
    blurb: "For the owner who writes their own marketing.",
    features: [
      "Unlimited campaigns & exports",
      "1 brand profile",
      "1 team member",
      "Full framework access",
      "Print-ready PDF output",
      "Email support",
    ],
  },
  {
    name: "Professional",
    monthly: 149,
    blurb: "For businesses running mail every month.",
    popular: true,
    features: [
      "Unlimited campaigns & exports",
      "3 brand profiles",
      "3 team members",
      "Full framework access",
      "PDF + Word output",
      "Advanced voice training",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    monthly: 299,
    blurb: "For agencies writing for many clients.",
    features: [
      "Unlimited campaigns & exports",
      "10 brand profiles",
      "10 team members",
      "Full framework library",
      "All output formats",
      "Advanced voice training",
      "Dedicated support",
    ],
  },
  {
    name: "Enterprise",
    monthly: 997,
    blurb: "For direct mail at serious volume.",
    features: [
      "Unlimited everything",
      "Unlimited brand profiles & team",
      "Custom frameworks & templates",
      "Custom onboarding session",
      "Quarterly strategy calls",
      "Dedicated account manager",
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="px-6 py-32 bg-surface border-y border-fg/5">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-medium tracking-[0.18em] uppercase text-ember mb-4">
            Pricing
          </div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02] mb-6">
            Flat rate. Unlimited campaigns.
            <br />
            No credits to count.
          </h2>
          <p className="text-lg text-fg/70 leading-relaxed">
            Every plan includes unlimited campaigns and unlimited exports.
            Generate five variations as many times as it takes — the price
            never moves.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-12">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${!annual ? "border-ember text-ember bg-ember/5" : "border-fg/15 text-fg/60"}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${annual ? "border-ember text-ember bg-ember/5" : "border-fg/15 text-fg/60"}`}
          >
            Annual <span className="opacity-70">(save 20%)</span>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const price = annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 flex flex-col bg-bg ${
                  plan.popular ? "border-ember ring-2 ring-ember/20" : "border-fg/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{plan.name}</h3>
                  {plan.popular && (
                    <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-ember">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-fg/55 mb-4">{plan.blurb}</p>
                <div className="mb-5">
                  <span className="font-serif text-4xl tracking-tight">${price}</span>
                  <span className="text-sm text-fg/50">/month</span>
                  {annual && (
                    <div className="text-xs text-fg/45 mt-1">billed annually</div>
                  )}
                </div>
                <ul className="space-y-2.5 text-sm text-fg/70 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className="text-ember shrink-0">+</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`text-center text-sm px-4 py-3 rounded-full font-medium transition-colors ${
                    plan.popular
                      ? "bg-fg text-bg hover:bg-ember hover:text-cream"
                      : "border border-fg/15 hover:bg-fg/5"
                  }`}
                >
                  Start free trial
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-fg/45 mt-10">
          14-day free trial on every plan. No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
