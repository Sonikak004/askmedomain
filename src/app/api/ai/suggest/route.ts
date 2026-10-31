import { NextRequest, NextResponse } from "next/server";
import { POPULAR_TLDS } from "@/config/pricing";

export interface AiDomainIdea {
  domain: string;
  name: string;
  extension: string;
  tagline: string;
  category: string;
  price: number;
  currencySymbol: string;
}

// Indian & Global business suffixes and prefixes for intelligent semantic generation
const PREFIXES = [
  "get",
  "my",
  "the",
  "pure",
  "prime",
  "smart",
  "pro",
  "neo",
  "true",
  "eco",
  "swift",
  "apex",
  "super",
  "urban",
  "zen",
];

const SUFFIXES = [
  "hub",
  "lab",
  "craft",
  "kart",
  "flow",
  "stack",
  "hq",
  "desk",
  "zone",
  "point",
  "works",
  "space",
  "nest",
  "base",
  "box",
];

const EXTENSIONS = [".com", ".in", ".co", ".store", ".tech", ".net", ".org"];

function getPriceForExt(ext: string): { price: number; symbol: string } {
  const match = POPULAR_TLDS.find((t) => t.extension.toLowerCase() === ext.toLowerCase());
  return {
    price: match ? match.registrationPrice : 860,
    symbol: match ? match.currencySymbol : "₹",
  };
}

/**
 * Intelligent semantic NLP domain generator (always free, zero setup required).
 */
function generateSemanticIdeas(prompt: string): AiDomainIdea[] {
  const words = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["for", "and", "the", "with", "from", "into", "best"].includes(w));

  const primary = words[0] || "brand";
  const secondary = words[1] || "";
  const ideas: AiDomainIdea[] = [];
  const seen = new Set<string>();

  const addIdea = (name: string, ext: string, tagline: string, category: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const domain = `${cleanName}${ext}`;
    if (!seen.has(domain) && cleanName.length >= 3 && cleanName.length <= 25) {
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

  // 1. Direct short combinations
  if (secondary) {
    addIdea(`${primary}${secondary}`, ".com", `Direct fusion of ${primary} & ${secondary}`, "Direct Match");
    addIdea(`${primary}${secondary}`, ".in", `Perfect for Indian customers and regional trust`, "India Focused");
    addIdea(`${secondary}${primary}`, ".co", `Modern startup & venture identity`, "Startup");
  } else {
    addIdea(`${primary}`, ".in", `The national Indian digital identity`, "India Focused");
    addIdea(`${primary}`, ".com", `Global gold standard domain`, "Global Match");
  }

  // 2. High impact prefix blends
  const pickedPrefixes = PREFIXES.sort(() => 0.5 - Math.random()).slice(0, 3);
  for (const p of pickedPrefixes) {
    const ext = p === "pure" || p === "eco" ? ".store" : ".com";
    addIdea(`${p}${primary}`, ext, `Action-oriented brand name (${p} + ${primary})`, "Brandable");
  }

  // 3. High impact suffix blends
  const pickedSuffixes = SUFFIXES.sort(() => 0.5 - Math.random()).slice(0, 3);
  for (const s of pickedSuffixes) {
    const ext = s === "kart" || s === "craft" ? ".in" : s === "stack" || s === "lab" ? ".tech" : ".com";
    addIdea(`${primary}${s}`, ext, `Dynamic modern name (${primary} + ${s})`, "Modern & Catchy");
  }

  // 4. Tech & Store specialty domains
  addIdea(`${primary}app`, ".tech", `Designed for software tools & digital applications`, "Tech & SaaS");
  addIdea(`${primary}store`, ".store", `Dedicated retail & e-commerce identity`, "Ecommerce");

  return ideas.slice(0, 8);
}

/**
 * Calls Google Gemini free tier API when GEMINI_API_KEY is available.
 */
async function callGeminiApi(prompt: string, apiKey: string): Promise<AiDomainIdea[] | null> {
  const modelsToTry = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite"];

  const systemInstruction = `You are an elite domain name branding consultant.
Generate 8 creative, brandable, and memorable domain names for the business idea or concept described.
Target valid extensions like .com, .in, .co, .store, .tech, .net, .org.

You MUST respond strictly with valid JSON conforming to this schema (no markdown formatting, no backticks):
[
  {
    "domain": "brandname.com",
    "name": "brandname",
    "extension": ".com",
    "tagline": "Brief 1-line reason why this name works",
    "category": "Brandable | India Focused | Startup | Tech & SaaS | Ecommerce"
  }
]`;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemInstruction}\n\nBusiness Idea: "${prompt}"` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 800,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`Gemini API call to ${model} returned status`, res.status);
        continue;
      }

      const data = await res.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) continue;

      // Clean any accidental markdown backticks
      const cleanedJson = textOutput.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedJson);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 8).map((item: any) => {
          const ext = item.extension?.startsWith(".") ? item.extension : `.${item.extension || "com"}`;
          const { price, symbol } = getPriceForExt(ext);
          return {
            domain: item.domain || `${item.name}${ext}`,
            name: item.name || item.domain.split(".")[0],
            extension: ext,
            tagline: item.tagline || "Brandable domain recommendation",
            category: item.category || "AI Curated",
            price,
            currencySymbol: symbol,
          };
        });
      }
    } catch (err) {
      console.warn(`Error calling Gemini API (${model}):`, err);
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = (body.prompt || body.query || "").trim();

    if (!prompt) {
      return NextResponse.json({ error: "Please provide a description or keyword for domain suggestions." }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    let ideas: AiDomainIdea[] | null = null;
    let source = "AskMeDomain AI Engine (Free)";

    // 1. Try Gemini API if free API key is configured
    if (geminiKey) {
      ideas = await callGeminiApi(prompt, geminiKey);
      if (ideas && ideas.length > 0) {
        source = "Google Gemini 1.5 Flash (Free Tier)";
      }
    }

    // 2. Intelligent zero-config NLP engine fallback (always active & free)
    if (!ideas || ideas.length === 0) {
      ideas = generateSemanticIdeas(prompt);
      source = "AskMeDomain Smart AI Engine (Free)";
    }

    return NextResponse.json({
      prompt,
      ideas,
      source,
      count: ideas.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unable to generate domain ideas." }, { status: 500 });
  }
}
