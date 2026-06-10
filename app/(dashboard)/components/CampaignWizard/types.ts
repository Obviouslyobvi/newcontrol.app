import type { CampaignBrief, Template, BrandProfile } from "@/lib/db/schema";

export type CampaignType =
  | "sales_letter"
  | "postcard"
  | "email"
  | "social_ad"
  | "landing_page"
  | "cold_email"
  | "lead_gen"
  | "followup";

export type WizardState = {
  campaignType: CampaignType;
  title: string;
  titleEdited: boolean;
  brief: CampaignBrief;
  brandProfileId: string | null;
  templateId: string | null;
};

export const EMPTY_BRIEF: CampaignBrief = {
  offer: "",
  audience: "",
  mainBenefit: "",
  painPoints: [],
  proofElements: [],
  competitors: [],
  cta: "",
  specialRequirements: "",
  letterLength: "medium",
  tone: "warm",
};

export type WizardData = {
  templates: Template[];
  brandProfiles: BrandProfile[];
};

export const CAMPAIGN_TYPES: {
  value: CampaignType;
  label: string;
  description: string;
}[] = [
  {
    value: "sales_letter",
    label: "Sales Letter",
    description: "Long-form direct mail letter. Our specialty — the full 22-step treatment.",
  },
  {
    value: "postcard",
    label: "Postcard",
    description: "Short, punchy direct mail with one offer and one call to action.",
  },
  {
    value: "email",
    label: "Email",
    description: "A direct response email to your list — promotion, launch, or nurture.",
  },
  {
    value: "social_ad",
    label: "Social Ad",
    description: "Scroll-stopping ad copy for Facebook, Instagram, or LinkedIn.",
  },
  {
    value: "landing_page",
    label: "Landing Page",
    description: "Conversion-focused page copy from headline to final CTA.",
  },
  {
    value: "cold_email",
    label: "Cold Email",
    description: "First-touch outreach to people who don't know you yet.",
  },
  {
    value: "lead_gen",
    label: "Lead Gen",
    description: "Free report, guide, or consultation offer that captures leads.",
  },
  {
    value: "followup",
    label: "Follow-up",
    description: "The second touch — for non-responders or warm leads going cold.",
  },
];

export const TONES = [
  "warm",
  "professional",
  "urgent",
  "friendly",
  "authoritative",
  "conversational",
  "empathetic",
  "bold",
  "custom",
] as const;

export const OPENING_ANGLES = [
  { value: "", label: "Let NewControl vary them (recommended)" },
  { value: "fear", label: "Fear / loss — what happens without it" },
  { value: "aspiration", label: "Aspiration — picture life with it" },
  { value: "story", label: "Story — a real person in a situation" },
  { value: "problem-agitate", label: "Problem-agitate — name the pain hard" },
  { value: "curiosity", label: "Curiosity — an unexpected fact or question" },
];
