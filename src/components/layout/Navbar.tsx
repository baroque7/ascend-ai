"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Dashboard", href: "#dashboard" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060611]/90 backdrop-blur-xl border-b border-[#1e1e3f]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-shadow duration-300">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <Logo size={20} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#a0a0c0] hover:text-white text-sm font-medium transition-colors duration-200 hover:text-[#a78bfa]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            id="nav-signin"
            className="text-[#a0a0c0] hover:text-white text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-[#1a1a38]"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            id="nav-start-trial"
            className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Start Free Trial
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          id="nav-mobile-toggle"
          className="md:hidden text-[#a0a0c0] hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0d0d1f]/95 backdrop-blur-xl border-b border-[#1e1e3f] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#a0a0c0] hover:text-white font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e1e3f]">
            <Link 
              href="/login"
              className="text-[#a0a0c0] text-sm font-medium py-2 text-left"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              id="nav-mobile-trial"
              className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white text-sm font-semibold px-5 py-2.5 rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
