"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, ArrowRight, Lightbulb, CheckCircle2, Search, Zap } from "lucide-react";
import { AiDomainIdea } from "@/app/api/ai/suggest/route";

interface AiDomainAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDomain?: (domain: string) => void;
}

const EXAMPLE_PROMPTS = [
  "Organic chai & tea brand in India",
  "AI tool for accountants & freelancers",
  "Direct-to-consumer apparel store",
  "Cloud kitchen delivery in Mumbai",
  "Fitness gym & coaching app",
];

export const AiDomainAssistantModal: React.FC<AiDomainAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectDomain,
}) => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [ideas, setIdeas] = useState<AiDomainIdea[]>([]);
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 3);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleGenerate = async (queryText?: string) => {
    const textToUse = (queryText || prompt).trim();
    if (!textToUse) return;

    if (queryText) setPrompt(queryText);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToUse }),
      });

      if (!res.ok) {
        throw new Error("Unable to generate ideas. Please try again.");
      }

      const data = await res.json();
      setIdeas(data.ideas || []);
      setSource(data.source || "AskMeDomain AI");
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleChooseDomain = (domain: string) => {
    onClose();
    if (onSelectDomain) {
      onSelectDomain(domain);
    } else {
      router.push(`/domains?q=${encodeURIComponent(domain)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052FF] to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  AI Domain Assistant
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Describe your business idea and get high-impact, brandable domains
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1">
          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="space-y-3"
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              What are you building or selling?
            </label>
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Organic cold-pressed juice delivery in Bangalore"
                className="w-full pl-4 pr-32 py-3.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0052FF] focus:ring-4 focus:ring-blue-500/10"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Example Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Try:
            </span>
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex}
                type="button"
                disabled={loading}
                onClick={() => handleGenerate(ex)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Active Loading Progress Banner */}
          {loading && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3 animate-in fade-in duration-200">
              <div className="w-5 h-5 rounded-full border-2 border-[#0052FF] border-t-transparent animate-spin shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {
                    [
                      "Brainstorming high-impact, brandable domain names...",
                      "Consulting Google Gemini naming models...",
                      "Matching verified extension wholesale pricing...",
                    ][loadingStep]
                  }
                </p>
                <p className="text-[11px] text-slate-500">
                  Crafting memorable names for &ldquo;{prompt}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Results Display */}
          {ideas.length > 0 && (
            <div className="pt-3 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-900">
                  AI Suggestions for &ldquo;{prompt}&rdquo;
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {source}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ideas.map((idea) => (
                  <div
                    key={idea.domain}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#0052FF] hover:shadow-md transition-all bg-white flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-extrabold text-slate-900 group-hover:text-[#0052FF] transition-colors break-all">
                          {idea.domain}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          {idea.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {idea.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900">
                        {idea.currencySymbol}
                        {idea.price.toLocaleString("en-IN")}/yr
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChooseDomain(idea.domain)}
                        className="px-3 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Check</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Google Gemini & NLP Powered · Always Free</span>
          <span className="font-semibold text-[#0052FF]">Real-time availability checked via Dynadot</span>
        </div>
      </div>
    </div>
  );
};
