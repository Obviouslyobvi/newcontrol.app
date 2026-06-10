import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const planTierEnum = pgEnum("plan_tier", [
  "free_trial",
  "solo",
  "professional",
  "agency",
  "enterprise",
]);

export const campaignTypeEnum = pgEnum("campaign_type", [
  "sales_letter",
  "postcard",
  "email",
  "social_ad",
  "landing_page",
  "cold_email",
  "lead_gen",
  "followup",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "generating",
  "completed",
  "exported",
  "archived",
]);

export type ToneSettings = {
  formal: number;
  friendly: number;
  authoritative: number;
  casual: number;
  custom?: string;
};

export type CampaignBrief = {
  offer: string;
  audience: string;
  mainBenefit: string;
  painPoints: string[];
  proofElements: string[];
  competitors: string[];
  cta: string;
  specialRequirements: string;
  letterLength: "short" | "medium" | "long";
  tone: string;
  openingAnglePreference?: string;
};

export type VariationContent = {
  envelopeTeaser: string | null;
  johnsonBox: string | null;
  headline: string;
  opening: string;
  body: string;
  cta: string;
  guarantee: string | null;
  ps: string[];
  responseCard: string | null;
  fullText: string;
};

export type QualityScores = {
  clarity: number;
  persuasion: number;
  brandFit: number;
  overall: number;
  flags?: string[];
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  planTier: planTierEnum("plan_tier").notNull().default("free_trial"),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: uuid("owner_id").references(() => users.id),
  planTier: planTierEnum("plan_tier").notNull().default("free_trial"),
  paymentCustomerId: varchar("payment_customer_id", { length: 255 }),
  paymentSubscriptionId: varchar("payment_subscription_id", { length: 255 }),
  subscriptionStatus: varchar("subscription_status", { length: 50 })
    .notNull()
    .default("trialing"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orgMemberships = pgTable("org_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brandProfiles = pgTable("brand_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  toneSettings: jsonb("tone_settings").$type<ToneSettings>(),
  wordsToUse: text("words_to_use").array(),
  wordsToAvoid: text("words_to_avoid").array(),
  exampleCopy: text("example_copy").array(),
  uploadedDocUrls: text("uploaded_doc_urls").array(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const templates = pgTable(
  "templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    previewImageUrl: varchar("preview_image_url", { length: 500 }),
    category: varchar("category", { length: 100 }),
    industry: varchar("industry", { length: 100 }),
    campaignType: campaignTypeEnum("campaign_type"),
    briefTemplate: jsonb("brief_template").$type<Partial<CampaignBrief>>(),
    isPublic: boolean("is_public").notNull().default(true),
    usageCount: integer("usage_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_templates_category").on(table.category),
    index("idx_templates_industry").on(table.industry),
  ]
);

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    createdById: uuid("created_by_id").references(() => users.id),
    brandProfileId: uuid("brand_profile_id").references(() => brandProfiles.id),
    title: varchar("title", { length: 255 }).notNull(),
    campaignType: campaignTypeEnum("campaign_type").notNull(),
    status: campaignStatusEnum("status").notNull().default("draft"),
    brief: jsonb("brief").$type<CampaignBrief>().notNull(),
    templateId: uuid("template_id").references(() => templates.id),
    folderId: uuid("folder_id").references(() => folders.id),
    tags: text("tags").array(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_campaigns_org_id").on(table.orgId),
    index("idx_campaigns_status").on(table.status),
    index("idx_campaigns_created_at").on(table.createdAt.desc()),
  ]
);

export const campaignVariations = pgTable(
  "campaign_variations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    variationNumber: integer("variation_number").notNull(),
    content: jsonb("content").$type<VariationContent>().notNull(),
    openingAngle: varchar("opening_angle", { length: 100 }),
    qualityScores: jsonb("quality_scores").$type<QualityScores>(),
    isSelected: boolean("is_selected").notNull().default(false),
    isEdited: boolean("is_edited").notNull().default(false),
    editedContent: jsonb("edited_content").$type<VariationContent>(),
    modelUsed: varchar("model_used", { length: 100 }),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    generationTimeMs: integer("generation_time_ms"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("idx_variations_campaign_id").on(table.campaignId)]
);

export const campaignExports = pgTable("campaign_exports", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  variationId: uuid("variation_id").references(() => campaignVariations.id),
  exportedById: uuid("exported_by_id").references(() => users.id),
  exportType: varchar("export_type", { length: 50 }),
  fileUrl: varchar("file_url", { length: 500 }),
  fileSizeBytes: integer("file_size_bytes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usageLog = pgTable("usage_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id").references(() => organizations.id),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 50 }).notNull(),
  campaignId: uuid("campaign_id").references(() => campaigns.id),
  tokensUsed: integer("tokens_used"),
  costCents: integer("cost_cents"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type OrgMembership = typeof orgMemberships.$inferSelect;
export type BrandProfile = typeof brandProfiles.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type CampaignVariation = typeof campaignVariations.$inferSelect;
export type CampaignExport = typeof campaignExports.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type Folder = typeof folders.$inferSelect;
