import Anthropic from "@anthropic-ai/sdk";

export type GenerationResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
};

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const MODEL = () => process.env.ANTHROPIC_MODEL ?? "claude-opus-4-6";
const MAX_TOKENS = () => Number(process.env.ANTHROPIC_MAX_TOKENS ?? 8192);

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      maxRetries: 3, // SDK retries 429/5xx with exponential backoff
      timeout: 120_000,
    });
  }
  return _client;
}

/**
 * One generation call. Streams internally (long outputs would otherwise risk
 * HTTP timeouts) and returns the final text plus usage.
 */
export async function generateCompletion(opts: {
  system: string;
  prompt: string;
  temperature?: number;
}): Promise<GenerationResult> {
  if (!isAiConfigured()) {
    throw new AiNotConfiguredError();
  }

  const client = getClient();
  const stream = client.messages.stream({
    model: MODEL(),
    max_tokens: MAX_TOKENS(),
    temperature: opts.temperature ?? 0.7,
    system: opts.system,
    messages: [{ role: "user", content: opts.prompt }],
  });

  const message = await stream.finalMessage();

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return {
    text,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
    model: message.model,
  };
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super(
      "ANTHROPIC_API_KEY is not set. Add it to your environment to enable real letter generation (see SETUP.md)."
    );
    this.name = "AiNotConfiguredError";
  }
}
