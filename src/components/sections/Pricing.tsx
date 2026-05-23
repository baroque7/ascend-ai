"use client";

import { useState } from "react";
import { Check, Zap, Building2, Rocket } from "lucide-react";

const plans = [
  {
    id: "creator",
    icon: Zap,
    name: "Creator",
    price: 19.99,
    description: "Perfect for individual creators ready to grow their audience globally.",
    gradient: "from-[#8b5cf6] to-[#6d28d9]",
    glowColor: "rgba(139,92,246,0.35)",
    borderColor: "#8b5cf6",
    popular: false,
    features: [
      "Up to 3 creator accounts",
      "1 target country per account",
      "5 AI content ideas daily",
      "Captions & hashtag generation",
      "Safety checker (10 videos/mo)",
      "TikTok proxy attachment",
      "Basic alerts",
      "Email support",
    ],
  },
  {
    id: "agency",
    icon: Building2,
    name: "Agency",
    price: 69.99,
    description: "For growing agencies managing multiple creators across markets.",
    gradient: "from-[#3b82f6] to-[#8b5cf6]",
    glowColor: "rgba(59,130,246,0.4)",
    borderColor: "#3b82f6",
    popular: true,
    features: [
      "Up to 25 creator accounts",
      "Multiple target countries",
      "5 AI content ideas per creator",
      "Captions, hashtags & posting times",
      "Safety checker (100 videos/mo)",
      "TikTok proxy management",
      "Multi-account dashboard",
      "Real-time alerts (all channels)",
      "Priority support",
      "Team access (3 seats)",
    ],
  },
  {
    id: "agency-pro",
    icon: Rocket,
    name: "Agency Pro",
    price: 199.99,
    description: "For large agencies and brands operating at scale globally.",
    gradient: "from-[#06b6d4] to-[#3b82f6]",
    glowColor: "rgba(6,182,212,0.3)",
    borderColor: "#06b6d4",
    popular: false,
    features: [
      "Unlimited creator accounts",
      "All countries — no limits",
      "5 AI ideas per creator, daily",
      "Full content intelligence suite",
      "Unlimited safety checks",
      "Advanced proxy management",
      "White-label dashboard",
      "Custom alert workflows",
      "Dedicated account manager",
      "Unlimited team seats",
      "API access",
      "SLA guarantee",
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const discount = 0.2;

  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.06)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#111128] border border-[#2e2e5e] rounded-full px-4 py-1.5 text-sm text-[#a78bfa] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
            Simple, transparent pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Start free, <span className="gradient-text">scale fast</span>
          </h2>
          <p className="text-[#a0a0c0] text-lg max-w-xl mx-auto mb-8">
            Every plan includes a 5-day free trial. No credit card required to start.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-[#111128] border border-[#1e1e3f] rounded-full p-1.5">
            <button
              id="billing-monthly"
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                billing === "monthly"
                  ? "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white shadow-lg"
                  : "text-[#a0a0c0] hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              id="billing-annual"
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                billing === "annual"
                  ? "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white shadow-lg"
                  : "text-[#a0a0c0] hover:text-white"
              }`}
            >
              Annual
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price =
              billing === "annual"
                ? (plan.price * (1 - discount)).toFixed(2)
                : plan.price.toFixed(2);

            return (
              <div
                key={plan.id}
                id={`plan-${plan.id}`}
                className={`relative glass-card rounded-2xl p-8 transition-all duration-500 ${
                  plan.popular
                    ? "border-[#3b82f6]/50 shadow-[0_0_60px_rgba(59,130,246,0.15)] scale-105"
                    : "hover:border-[#2e2e5e] hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]"
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Icon & name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}
                    style={{ boxShadow: `0 4px 20px ${plan.glowColor}` }}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-none">{plan.name}</h3>
                    <p className="text-[#6060a0] text-xs mt-0.5">5-day free trial</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-end gap-1">
                    <span className="text-[#6060a0] text-lg font-medium">$</span>
                    <span className="text-5xl font-black text-white leading-none">{price.split(".")[0]}</span>
                    <span className="text-xl text-[#a0a0c0] font-bold">.{price.split(".")[1]}</span>
                  </div>
                  <div className="text-[#6060a0] text-sm mt-1">
                    per month{billing === "annual" ? ", billed annually" : ""}
                  </div>
                  {billing === "annual" && (
                    <div className="text-emerald-400 text-xs font-semibold mt-1">
                      Save ${(plan.price * discount * 12).toFixed(0)}/year
                    </div>
                  )}
                </div>

                <p className="text-[#a0a0c0] text-sm mb-6 leading-relaxed">{plan.description}</p>

                {/* CTA */}
                <button
                  id={`plan-${plan.id}-cta`}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 mb-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                      : "border border-[#2e2e5e] text-white hover:border-[#8b5cf6] hover:bg-[#111128] hover:scale-[1.02]"
                  }`}
                >
                  Start Free Trial
                </button>

                {/* Divider */}
                <div className="border-t border-[#1e1e3f] mb-6" />

                {/* Features */}
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-[#a0a0c0]">
                      <span
                        className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}
                      >
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="text-center text-[#6060a0] text-sm mt-10">
          All plans include a 5-day free trial. Cancel anytime. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
