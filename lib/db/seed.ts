/**
 * Seeds the 25 launch templates. Run with: npm run db:seed
 * Safe to re-run — existing templates are matched by name and skipped.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { templates, type CampaignBrief } from "./schema";

type SeedTemplate = {
  name: string;
  description: string;
  category: string;
  industry: string | null;
  campaignType:
    | "sales_letter"
    | "postcard"
    | "email"
    | "social_ad"
    | "landing_page"
    | "cold_email"
    | "lead_gen"
    | "followup";
  briefTemplate: Partial<CampaignBrief>;
};

const SEED_TEMPLATES: SeedTemplate[] = [
  // ── ACQUISITION (8) ──
  {
    name: "New Customer Welcome Offer",
    description:
      "Introduce your business to new prospects with an irresistible first-time offer.",
    category: "acquisition",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "First-time customer discount or bonus for trying us",
      mainBenefit: "Experience the difference risk-free with a special new-customer deal",
      painPoints: ["Tired of being treated like a number", "Burned by unreliable providers before"],
      cta: "Call or visit our website to claim your new customer offer",
      letterLength: "medium",
      tone: "warm",
    },
  },
  {
    name: "Competitive Switch Offer",
    description:
      "Win customers away from competitors by making switching painless and rewarding.",
    category: "acquisition",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Switch-and-save deal that beats their current provider",
      mainBenefit: "Better service at a better price, with zero hassle to switch",
      painPoints: ["Paying too much for mediocre service", "Feeling stuck with current provider"],
      proofElements: ["Side-by-side price comparison", "Switcher testimonials"],
      cta: "Call for a free comparison quote",
      letterLength: "medium",
      tone: "authoritative",
    },
  },
  {
    name: "Free Trial / Free Consultation",
    description:
      "Lower the barrier to entry with a no-risk first experience.",
    category: "acquisition",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Free trial, consultation, or assessment with no obligation",
      mainBenefit: "See exactly what you'd get before spending a dime",
      painPoints: ["Skeptical of big promises", "Don't want to commit before seeing proof"],
      cta: "Schedule your free consultation today",
      letterLength: "short",
      tone: "friendly",
    },
  },
  {
    name: "Grand Opening Announcement",
    description:
      "Launch a new location or business with neighborhood-level excitement.",
    category: "acquisition",
    industry: null,
    campaignType: "postcard",
    briefTemplate: {
      offer: "Grand opening special for the local community",
      mainBenefit: "A brand new option right in your neighborhood",
      cta: "Visit us during opening week for exclusive deals",
      letterLength: "short",
      tone: "bold",
    },
  },
  {
    name: "Referral Request",
    description:
      "Turn happy customers into your sales force with a referral incentive.",
    category: "acquisition",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Reward for referring friends and family",
      mainBenefit: "Share something you already love and get rewarded for it",
      cta: "Pass along the enclosed referral card",
      letterLength: "short",
      tone: "warm",
    },
  },
  {
    name: "Cold Prospect Introduction",
    description:
      "A first-touch letter that earns attention from people who have never heard of you.",
    category: "acquisition",
    industry: null,
    campaignType: "cold_email",
    briefTemplate: {
      offer: "Introduction to your service with a low-commitment first step",
      mainBenefit: "Solve a nagging problem they assumed they had to live with",
      painPoints: ["Doesn't know your business exists", "Default skepticism toward unsolicited mail"],
      cta: "Reply or call for a quick, no-pressure chat",
      letterLength: "short",
      tone: "conversational",
    },
  },
  {
    name: "Event Invitation",
    description:
      "Fill seats at a workshop, open house, sale event, or seminar.",
    category: "event",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Invitation to an exclusive event with limited seats",
      mainBenefit: "Walk away with something valuable in a single visit",
      cta: "RSVP by the deadline to reserve your spot",
      letterLength: "short",
      tone: "urgent",
    },
  },
  {
    name: "Free Report / Lead Magnet Offer",
    description:
      "Generate leads by offering valuable information in exchange for contact details.",
    category: "acquisition",
    industry: null,
    campaignType: "lead_gen",
    briefTemplate: {
      offer: "Free guide/report that solves a specific problem",
      mainBenefit: "Insider knowledge that saves money or prevents costly mistakes",
      cta: "Request your free copy — no strings attached",
      letterLength: "medium",
      tone: "authoritative",
    },
  },

  // ── RETENTION (5) ──
  {
    name: "Membership Renewal",
    description:
      "Keep members on board with a renewal letter that re-sells the value.",
    category: "retention",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Membership renewal, ideally with an early-renewal bonus",
      mainBenefit: "Keep everything you've come to rely on, without interruption",
      painPoints: ["Forgetting what the membership actually does for them"],
      cta: "Renew today to lock in your current rate",
      letterLength: "medium",
      tone: "warm",
    },
  },
  {
    name: "Loyalty Reward",
    description:
      "Surprise your best customers with a thank-you reward that deepens the relationship.",
    category: "retention",
    industry: null,
    campaignType: "postcard",
    briefTemplate: {
      offer: "Exclusive reward for loyal customers only",
      mainBenefit: "Being a regular actually pays off here",
      cta: "Bring this card in to claim your reward",
      letterLength: "short",
      tone: "warm",
    },
  },
  {
    name: "Birthday / Anniversary Offer",
    description:
      "A personal touchpoint with a gift attached — among the highest-response mailings.",
    category: "retention",
    industry: null,
    campaignType: "postcard",
    briefTemplate: {
      offer: "Birthday or anniversary gift/discount",
      mainBenefit: "A genuine celebration perk, not a sales pitch",
      cta: "Come celebrate with us this month",
      letterLength: "short",
      tone: "friendly",
    },
  },
  {
    name: "Service Reminder",
    description:
      "Bring customers back for scheduled maintenance, checkups, or reorders.",
    category: "retention",
    industry: null,
    campaignType: "postcard",
    briefTemplate: {
      offer: "Timely service reminder, optionally with a small incentive to book now",
      mainBenefit: "Stay ahead of expensive problems with a quick visit",
      painPoints: ["Small issues become expensive emergencies when ignored"],
      cta: "Call or book online to schedule your service",
      letterLength: "short",
      tone: "professional",
    },
  },
  {
    name: "Thank You + Upsell",
    description:
      "Thank recent customers and introduce the natural next purchase.",
    category: "upsell",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Complementary product/service offer for recent buyers",
      mainBenefit: "Get even more out of what you just bought",
      cta: "Use your customer-only code at checkout",
      letterLength: "short",
      tone: "warm",
    },
  },

  // ── WIN-BACK (4) ──
  {
    name: "Lapsed Customer Reactivation",
    description:
      "Re-engage customers who haven't bought in 6+ months with a compelling reason to return.",
    category: "winback",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Welcome-back offer for customers who have drifted away",
      mainBenefit: "Everything you liked is still here — plus what's new since you left",
      painPoints: ["Life got busy and they simply forgot", "A past disappointment was never addressed"],
      cta: "Come back this month and your welcome-back deal is waiting",
      letterLength: "medium",
      tone: "warm",
    },
  },
  {
    name: "\"We Miss You\" Offer",
    description:
      "A softer, more personal win-back note for valued former customers.",
    category: "winback",
    industry: null,
    campaignType: "postcard",
    briefTemplate: {
      offer: "Personal note with a small gift to return",
      mainBenefit: "You were missed — genuinely",
      cta: "Stop by and let us make it right",
      letterLength: "short",
      tone: "empathetic",
    },
  },
  {
    name: "Expiring Benefit Warning",
    description:
      "Alert customers to points, credits, or benefits about to expire — strong honest urgency.",
    category: "winback",
    industry: null,
    campaignType: "email",
    briefTemplate: {
      offer: "Reminder of unexpired benefit with a clear deadline",
      mainBenefit: "Don't leave value you already earned on the table",
      cta: "Redeem before the expiration date",
      letterLength: "short",
      tone: "urgent",
    },
  },
  {
    name: "Last Chance Before Cancellation",
    description:
      "The final letter before an account or membership lapses for good.",
    category: "winback",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Final renewal opportunity, possibly with a save offer",
      mainBenefit: "One decision keeps everything intact — doing nothing ends it",
      cta: "Renew now — after the deadline, this rate is gone",
      letterLength: "medium",
      tone: "urgent",
    },
  },

  // ── SEASONAL (4) ──
  {
    name: "Holiday Promotion",
    description:
      "Capture year-end buying energy with a holiday-themed offer.",
    category: "seasonal",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Holiday special with a natural end-of-season deadline",
      mainBenefit: "Solve a gift or year-end need in one easy step",
      cta: "Order by the holiday deadline",
      letterLength: "medium",
      tone: "warm",
    },
  },
  {
    name: "Summer Sale",
    description:
      "A seasonal promotion built around summer needs and timing.",
    category: "seasonal",
    industry: null,
    campaignType: "postcard",
    briefTemplate: {
      offer: "Limited-time summer pricing",
      mainBenefit: "Get ready for the season before everyone else books up",
      cta: "Schedule before the summer rush",
      letterLength: "short",
      tone: "friendly",
    },
  },
  {
    name: "New Year Offer",
    description:
      "Ride the fresh-start mindset of January with a new-year improvement offer.",
    category: "seasonal",
    industry: null,
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "New year special tied to a fresh start",
      mainBenefit: "Make this the year the problem actually gets fixed",
      cta: "Start the year right — book in January",
      letterLength: "medium",
      tone: "aspirational",
    },
  },
  {
    name: "Back-to-School Campaign",
    description:
      "Reach families during the August/September reset window.",
    category: "seasonal",
    industry: null,
    campaignType: "postcard",
    briefTemplate: {
      offer: "Back-to-school timed offer for busy families",
      mainBenefit: "One less thing on the September to-do list",
      cta: "Book before the school year starts",
      letterLength: "short",
      tone: "friendly",
    },
  },

  // ── INDUSTRY-SPECIFIC (4) ──
  {
    name: "Real Estate: Just Listed / Open House",
    description:
      "Announce a new listing or open house to the surrounding neighborhood.",
    category: "announcement",
    industry: "real_estate",
    campaignType: "postcard",
    briefTemplate: {
      offer: "New listing announcement / open house invitation in their neighborhood",
      audience: "Homeowners in the immediate neighborhood of the listing",
      mainBenefit: "Know what homes near yours are selling for — and what yours might be worth",
      cta: "Visit the open house or call for a free home value estimate",
      letterLength: "short",
      tone: "professional",
    },
  },
  {
    name: "Home Services: Seasonal Maintenance Offer",
    description:
      "HVAC tune-ups, gutter cleaning, lawn care — timed to the season when demand peaks.",
    category: "acquisition",
    industry: "home_services",
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Seasonal maintenance special before the busy season",
      audience: "Homeowners in your service area",
      mainBenefit: "Avoid mid-season breakdowns and emergency-rate repair bills",
      painPoints: ["System failure on the hottest/coldest day of the year", "Emergency repairs cost 3x scheduled maintenance"],
      cta: "Call to schedule your tune-up before the season hits",
      letterLength: "medium",
      tone: "professional",
    },
  },
  {
    name: "Dental: New Patient Special",
    description:
      "Fill the chair with new patients via an exam + cleaning intro offer.",
    category: "acquisition",
    industry: "healthcare",
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "New patient exam, x-rays, and cleaning package at a special rate",
      audience: "Families who recently moved to the area or are between dentists",
      mainBenefit: "A dentist your whole family actually looks forward to seeing",
      painPoints: ["Dental anxiety", "Surprise bills", "Months-long waits for appointments"],
      cta: "Call to book your new patient visit",
      letterLength: "medium",
      tone: "warm",
    },
  },
  {
    name: "Insurance: Policy Review Invitation",
    description:
      "Invite policyholders and prospects to a free coverage review.",
    category: "acquisition",
    industry: "insurance",
    campaignType: "sales_letter",
    briefTemplate: {
      offer: "Free, no-obligation policy review",
      audience: "Households whose policies may be outdated or overpriced",
      mainBenefit: "Find coverage gaps and overcharges before they cost you",
      painPoints: ["Paying for coverage that no longer fits", "Discovering a gap only after a claim"],
      cta: "Call to schedule your free 20-minute review",
      letterLength: "medium",
      tone: "authoritative",
    },
  },
];

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to .env.local first (see SETUP.md).");
    process.exit(1);
  }
  const db = drizzle(neon(url));

  let inserted = 0;
  for (const t of SEED_TEMPLATES) {
    const existing = await db
      .select({ id: templates.id })
      .from(templates)
      .where(eq(templates.name, t.name));
    if (existing.length > 0) continue;
    await db.insert(templates).values({
      name: t.name,
      description: t.description,
      category: t.category,
      industry: t.industry,
      campaignType: t.campaignType,
      briefTemplate: t.briefTemplate,
      isPublic: true,
    });
    inserted++;
  }
  console.log(`Seed complete: ${inserted} templates inserted, ${SEED_TEMPLATES.length - inserted} already present.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
