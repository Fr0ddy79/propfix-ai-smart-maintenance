import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface TriageInput {
  title: string;
  description: string;
  category?: string;
}

interface TriageResult {
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  urgency: "low" | "medium" | "high" | "urgent";
  suggestedTrade: string;
  reasoning: string;
}

const CATEGORIES = ["Plumbing", "HVAC", "Electrical", "Appliance", "Pest Control", "Locksmith", "General Maintenance"];

const TRADE_MAP: Record<string, string> = {
  "Plumbing": "Plumber",
  "HVAC": "HVAC Technician",
  "Electrical": "Electrician",
  "Appliance": "Appliance Technician",
  "Pest Control": "Pest Control",
  "Locksmith": "Locksmith",
  "General Maintenance": "Handyman",
};

function contains(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (contains(text, ["leak", "pipe", "drip", "drain", "clog", "clogged", "toilet", "sink", "faucet", "water", "flood", "sewage", "garbage disposal", "burst"])) return "Plumbing";
  if (contains(text, ["ac", "air conditioning", "heating", "heat", "furnace", "thermostat", "vent", "cooling", "hvac", "air flow", "duct"])) return "HVAC";
  if (contains(text, ["outlet", "switch", "electrical", "wire", "breaker", "fuse", "power", "spark", "short circuit", "lighting"])) return "Electrical";
  if (contains(text, ["dishwasher", "washer", "dryer", "fridge", "refrigerator", "oven", "stove", "microwave", "range", "garbage disposal", "appliance"])) return "Appliance";
  if (contains(text, ["pest", "rodent", "rat", "mouse", "cockroach", "roach", "ant", "bed bug", "termite", "insect"])) return "Pest Control";
  if (contains(text, ["lock", "key", "door", "lockout", "rekey"])) return "Locksmith";

  return "General Maintenance";
}

function detectPriority(text: string): "low" | "medium" | "high" | "urgent" {
  if (contains(text, ["flood", "fire", "gas smell", "no electricity", "sewage", "burst pipe", "no water"])) return "urgent";
  if (contains(text, ["mold", "no heat", "no hot water", "flooding", "water damage", "electrical hazard", "carbon monoxide"])) return "high";
  if (contains(text, ["leak", "drip", "clog", "slow drain", "no cooling", "partial power", "fridge warm", "ac not working"])) return "medium";
  return "low";
}

function detectUrgency(text: string): "low" | "medium" | "high" | "urgent" {
  if (contains(text, ["flood", "fire", "gas smell", "sewage backup", "no electricity", "danger"])) return "urgent";
  if (contains(text, ["mold", "no heat winter", "no hot water", "refrigerator broken"])) return "high";
  if (contains(text, ["leak", "dripping", "clogged", "ac not cooling", "heater slow"])) return "medium";
  return "low";
}

function detectTrade(category: string): string {
  return TRADE_MAP[category] ?? "Handyman";
}

// Main entry point
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body: TriageInput = await req.json();
    const { title = "", description = "" } = body;
    const combined = `${title} ${description}`;

    const category = detectCategory(title, description);
    const priority = detectPriority(combined);
    const urgency = detectUrgency(combined);
    const suggestedTrade = detectTrade(category);
    const reasoning = `Detected ${category} issue with ${priority} priority based on keyword analysis. Recommended ${suggestedTrade} for assessment.`;

    // ─────────────────────────────────────────────────────────────
    // TODO (MVP): Replace keyword matching with real AI call here.
    //
    // Example with OpenAI:
    //   const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
    //   const completion = await openai.chat.completions.create({
    //     model: "gpt-4o-mini",
    //     messages: [{
    //       role: "system",
    //       content: `You are an expert property maintenance triage assistant.
    //                Given a tenant issue description, respond ONLY with valid JSON:
    //                { "category": "...", "priority": "low|medium|high|urgent",
    //                  "urgency": "low|medium|high|urgent", "suggestedTrade": "...",
    //                  "reasoning": "..." }`
    //     }, {
    //       role: "user",
    //       content: `Title: ${title}\nDescription: ${description}`
    //     }],
    //     response_format: { type: "json_object" },
    //   });
    //   const result = JSON.parse(completion.choices[0].message.content ?? "{}");
    // ─────────────────────────────────────────────────────────────

    const triage: TriageResult = {
      category,
      priority,
      urgency,
      suggestedTrade,
      reasoning,
    };

    return new Response(JSON.stringify(triage), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Triage failed", details: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
