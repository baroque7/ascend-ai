import Link from "next/link";
import { Zap, X, Globe, MessageCircle } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    Support: ["Documentation", "Help Center", "Contact", "Status"],
  };

  return (
    <footer className="border-t border-[#1e1e3f] bg-[#060611]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" id="footer-logo">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <Logo size={18} />
            </Link>
            <p className="text-[#6060a0] text-sm leading-relaxed max-w-xs">
              AI-powered content intelligence to help creators, agencies, and brands ascend to any audience — globally.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
          {[X, Globe, MessageCircle].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg border border-[#1e1e3f] hover:border-[#8b5cf6] flex items-center justify-center text-[#6060a0] hover:text-[#a78bfa] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white text-sm font-semibold mb-4">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[#6060a0] hover:text-[#a78bfa] text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[#1e1e3f] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6060a0] text-sm">
            © 2025 GramScaling. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#6060a0] text-sm">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
