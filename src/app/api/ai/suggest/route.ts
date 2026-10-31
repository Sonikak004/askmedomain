import { NextRequest, NextResponse } from "next/server";
import { POPULAR_TLDS } from "@/config/pricing";
import dns from "dns";

// Prefer IPv4 to avoid Node.js connection stalls on dual-stack environments
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore in environments where not supported
}

export interface AiDomainIdea {
  domain: string;
  name: string;
  extension: string;
  tagline: string;
  category: string;
  price: number;
  currencySymbol: string;
}

const DEFAULT_TIMEOUT_MS = 15000; // Generous 15s timeout for thorough LLM generation

function getPriceForExt(ext: string): { price: number; symbol: string } {
  const match = POPULAR_TLDS.find((t) => t.extension.toLowerCase() === ext.toLowerCase());
  return {
    price: match ? match.registrationPrice : 860,
    symbol: match ? match.currencySymbol : "₹",
  };
}

/**
 * Creative semantic fallback generator (used if LLM is offline).
 * Generates modern, startup-grade names instead of generic robotic compounds.
 */
function generateCreativeFallback(prompt: string): AiDomainIdea[] {
  const words = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["for", "and", "the", "with", "from", "into", "best", "near"].includes(w));

  const keyword = words[0] || "brand";
  const modifier = words[1] || "";

  // Industry-specific creative root words
  const ideas: AiDomainIdea[] = [];
  const seen = new Set<string>();

  const add = (name: string, ext: string, tagline: string, category: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const domain = `${cleanName}${ext}`;
    if (!seen.has(domain) && cleanName.length >= 3 && cleanName.length <= 18) {
      seen.add(domain);
      const { price, symbol } = getPriceForExt(ext);
      ideas.push({
        domain,
        name: cleanName,
        extension: ext,
        tagline,
        category,
        price,
        currencySymbol: symbol,
      });
    }
  };

  // Modern startup style names
  add(`${keyword}ly`, ".com", `Punchy and memorable, perfect for a digital brand`, "Brandable");
  add(`${keyword}io`, ".tech", `Modern tech & software platform identity`, "Tech & SaaS");
  add(`get${keyword}`, ".com", `Action-oriented, confident call-to-action domain`, "Action Brand");
  add(`the${keyword}`, ".in", `Authoritative national brand identity for Indian audiences`, "India Focused");

  if (modifier) {
    add(`${modifier}${keyword}`, ".in", `Clean two-word combination with strong regional trust`, "India Focused");
    add(`${keyword}${modifier}`, ".co", `Short, startup-friendly business domain`, "Startup");
    add(`${modifier}craft`, ".store", `Artisanal, premium consumer shopping experience`, "Ecommerce");
    add(`${keyword}verse`, ".com", `Expansive ecosystem branding for modern ventures`, "Brandable");
  } else {
    add(`${keyword}craft`, ".store", `Crafted, customer-centric retail destination`, "Ecommerce");
    add(`${keyword}hub`, ".in", `Central community & commerce destination in India`, "India Focused");
    add(`${keyword}nest`, ".com", `Welcoming, premium lifestyle identity`, "Brandable");
    add(`urban${keyword}`, ".co", `Chic, contemporary city-focused venture`, "Startup");
  }

  return ideas.slice(0, 8);
}

/**
 * Calls Google Gemini API using models verified to support generateContent on free tier.
 */
async function callGeminiApi(prompt: string, apiKey: string): Promise<AiDomainIdea[] | null> {
  const modelsToTry = [
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
  ];

  const systemPrompt = `You are a world-class domain naming consultant specializing in high-value, memorable startup and business domains (like Zepto, Blinkit, Ovenstory, Theobroma, Chaayos, Razorpay, Freshworks).
Generate 8 ultra-creative, brandable, punchy domain names for: "${prompt}".

STRICT NAMING RULES:
1. MAX 1-2 words (ideally 5-10 letters). NO hyphens, no numbers.
2. Must sound like real funded startups or premium retail brands.
3. NEVER generate clumsy or boring literal names like "superbakery" or "thebestonlinestore".
4. Provide a diverse mix:
   - 2 Catchy invented/brandable names (e.g. Crustly, Bakora, Vixor, Zopl)
   - 2 Modern compound names (e.g. PinkOven, DoughLab, SoleFlow)
   - 2 Indian-focused .in names (e.g. JaipurBakes.in, DesiCrust.in, Kadam.in)
   - 2 Specialty .store or .co names (e.g. Ovenstory.store, Treadly.co)
5. Target valid extensions: .com, .in, .co, .store, .tech.

Respond STRICTLY with a valid JSON array conforming to this schema (no markdown, no backticks, no text outside JSON):
[
  {
    "domain": "pinkoven.com",
    "name": "pinkoven",
    "extension": ".com",
    "tagline": "Blends Jaipur's Pink City heritage with warm artisanal baking",
    "category": "Brandable"
  }
]`;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 950,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`Gemini (${model}) returned HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) continue;

      // Extract JSON cleanly from potential code blocks
      const cleaned = textOutput
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        const validated: AiDomainIdea[] = [];
        for (const item of parsed) {
          if (!item.domain && !item.name) continue;
          let ext = item.extension || "";
          if (!ext.startsWith(".")) {
            ext = "." + (ext || "com");
          }
          const baseName = (item.name || item.domain.split(".")[0] || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          if (!baseName || baseName.length < 3) continue;

          const fullDomain = `${baseName}${ext}`;
          const { price, symbol } = getPriceForExt(ext);

          validated.push({
            domain: fullDomain,
            name: baseName,
            extension: ext,
            tagline: item.tagline || "Brandable domain recommendation",
            category: item.category || "Brandable",
            price,
            currencySymbol: symbol,
          });

          if (validated.length >= 8) break;
        }

        if (validated.length >= 4) {
          return validated;
        }
      }
    } catch (err: any) {
      console.warn(`Gemini call to ${model} failed:`, err?.message || err);
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = (body.prompt || body.query || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide a business idea or concept to generate domain names." },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    let ideas: AiDomainIdea[] | null = null;
    let source = "AskMeDomain AI Engine";

    // 1. Try Gemini API first with our verified model & enhanced prompt
    if (geminiKey) {
      ideas = await callGeminiApi(prompt, geminiKey);
      if (ideas && ideas.length > 0) {
        source = "Google Gemini AI";
      }
    }

    // 2. High-quality semantic fallback if LLM is unreachable
    if (!ideas || ideas.length === 0) {
      ideas = generateCreativeFallback(prompt);
      source = "AskMeDomain Smart Generator";
    }

    return NextResponse.json({
      prompt,
      ideas,
      source,
      count: ideas.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unable to generate domain ideas right now." },
      { status: 500 }
    );
  }
}
