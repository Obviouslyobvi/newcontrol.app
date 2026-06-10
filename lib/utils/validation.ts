import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().max(255).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const campaignTypeSchema = z.enum([
  "sales_letter",
  "postcard",
  "email",
  "social_ad",
  "landing_page",
  "cold_email",
  "lead_gen",
  "followup",
]);

export const briefSchema = z.object({
  offer: z.string().trim().min(1, "Tell us what you're offering"),
  audience: z.string().trim().min(1, "Tell us who this is for"),
  mainBenefit: z.string().trim().min(1, "Tell us the main benefit"),
  painPoints: z.array(z.string().trim()).default([]),
  proofElements: z.array(z.string().trim()).default([]),
  competitors: z.array(z.string().trim()).default([]),
  cta: z.string().trim().default(""),
  specialRequirements: z.string().trim().default(""),
  letterLength: z.enum(["short", "medium", "long"]).default("medium"),
  tone: z.string().trim().default("warm"),
  openingAnglePreference: z.string().trim().optional(),
});

export const createCampaignSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  campaignType: campaignTypeSchema,
  brief: briefSchema,
  brandProfileId: z.string().uuid().optional().nullable(),
  templateId: z.string().uuid().optional().nullable(),
});

export const updateCampaignSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  campaignType: campaignTypeSchema.optional(),
  brief: briefSchema.optional(),
  brandProfileId: z.string().uuid().nullable().optional(),
  status: z
    .enum(["draft", "generating", "completed", "exported", "archived"])
    .optional(),
  tags: z.array(z.string().trim()).optional(),
});

export const toneSettingsSchema = z.object({
  formal: z.number().min(0).max(1).default(0.5),
  friendly: z.number().min(0).max(1).default(0.5),
  authoritative: z.number().min(0).max(1).default(0.5),
  casual: z.number().min(0).max(1).default(0.5),
  custom: z.string().trim().optional(),
});

export const brandProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  description: z.string().trim().default(""),
  toneSettings: toneSettingsSchema.default({
    formal: 0.5,
    friendly: 0.5,
    authoritative: 0.5,
    casual: 0.5,
  }),
  wordsToUse: z.array(z.string().trim()).default([]),
  wordsToAvoid: z.array(z.string().trim()).default([]),
  exampleCopy: z.array(z.string().trim()).default([]),
  uploadedDocUrls: z.array(z.string().trim()).default([]),
  isDefault: z.boolean().default(false),
});

export const generateSchema = z.object({
  variationCount: z.number().int().min(1).max(5).default(5),
});

export const regenerateSchema = z.object({
  variationId: z.string().uuid(),
  section: z.enum(["headline", "opening", "body", "cta", "ps", "full"]),
});

export const exportSchema = z.object({
  variationId: z.string().uuid(),
  format: z.enum(["pdf_print", "pdf_digital", "docx", "txt"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type BrandProfileInput = z.infer<typeof brandProfileSchema>;
