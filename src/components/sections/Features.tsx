"use client";

import {
  FolderLock,
  TrendingUp,
  ShieldCheck,
  LayoutDashboard,
  BellRing,
} from "lucide-react";

const features = [
  {
    id: "account-vault",
    icon: FolderLock,
    gradient: "from-[#8b5cf6] to-[#6d28d9]",
    glowColor: "rgba(139,92,246,0.3)",
    tag: "Account Vault",
    title: "Manage Every Creator Account in One Secure Place",
    description:
      "Add TikTok and Instagram accounts, select target countries, and permanently attach dedicated proxies to TikTok accounts for maximum reach. Instagram uses pure content strategy.",
    bullets: [
      "Permanent proxy binding for TikTok",
      "Target any country market",
      "Instagram content strategy mode",
      "Encrypted credential storage",
    ],
  },
  {
    id: "growth-intelligence",
    icon: TrendingUp,
    gradient: "from-[#3b82f6] to-[#1d4ed8]",
    glowColor: "rgba(59,130,246,0.3)",
    tag: "Growth Intelligence",
    title: "AI Analyzes What's Trending Daily in Your Target Country",
    description:
      "Every morning, our AI scans trending content in your target country and generates 5 tailored content ideas per creator — with captions, hashtags, and optimal posting times.",
    bullets: [
      "5 AI ideas per creator, daily",
      "Country-specific trend analysis",
      "Caption & hashtag suggestions",
      "Best posting times by timezone",
    ],
  },
  {
    id: "safety-checker",
    icon: ShieldCheck,
    gradient: "from-[#06b6d4] to-[#0284c7]",
    glowColor: "rgba(6,182,212,0.3)",
    tag: "Safety Checker",
    title: "Know Your Risk Score Before You Post",
    description:
      "Upload any video and let AI analyze it against platform guidelines. Get a clear Green / Yellow / Red risk score — and a safer alternative content suggestion if needed.",
    bullets: [
      "Green / Yellow / Red risk rating",
      "Platform guideline detection",
      "AI safer content alternative",
      "Works for TikTok & Instagram",
    ],
  },
  {
    id: "multi-dashboard",
    icon: LayoutDashboard,
    gradient: "from-[#a78bfa] to-[#8b5cf6]",
    glowColor: "rgba(167,139,250,0.3)",
    tag: "Multi-Account Dashboard",
    title: "Agencies Get a Bird's-Eye View of Every Creator",
    description:
      "Manage dozens of creator accounts from one premium dashboard. See health scores, target countries, proxy status, and today's content ideas — all in a single view.",
    bullets: [
      "Per-account health score",
      "Country & proxy status at a glance",
      "Content ideas per creator",
      "Role-based team access",
    ],
  },
  {
    id: "alerts",
    icon: BellRing,
    gradient: "from-[#f59e0b] to-[#d97706]",
    glowColor: "rgba(245,158,11,0.3)",
    tag: "Smart Alerts",
    title: "Never Miss a Flag, Proxy Issue, or Shadow Ban",
    description:
      "Real-time notifications the moment something goes wrong. Account flagged, proxy down, or shadow ban detected — you'll know instantly.",
    bullets: [
      "Account flagging notifications",
      "Proxy health monitoring",
      "Shadow ban early detection",
      "Email, push & in-app alerts",
    ],
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.07),transparent)]" />
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#111128] border border-[#2e2e5e] rounded-full px-4 py-1.5 text-sm text-[#a78bfa] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
            Everything you need to grow globally
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Five powerful tools,{" "}
            <span className="gradient-text">one platform</span>
          </h2>
          <p className="text-[#a0a0c0] text-lg max-w-2xl mx-auto">
            From account management to AI trend analysis, safety checks to real-time alerts — Ascend.ai gives you everything you need.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLast = index === features.length - 1;
            return (
              <div
                key={feature.id}
                id={`feature-${feature.id}`}
                className={`group relative glass-card rounded-2xl p-8 hover:border-[#3b3b70] transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)] ${isLast ? "md:col-span-2" : ""}`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: `0 8px 24px ${feature.glowColor}` }}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className={`inline-block text-xs font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent mb-2`}>
                  {feature.tag}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">{feature.title}</h3>
                <p className="text-[#a0a0c0] text-sm leading-relaxed mb-5">{feature.description}</p>
                <ul className={`grid gap-2 ${isLast ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1"}`}>
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-[#a0a0c0]">
                      <span className={`mt-1 w-4 h-4 flex-shrink-0 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top right, ${feature.glowColor}, transparent 70%)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
