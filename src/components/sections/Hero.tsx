"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Sparkles, Shield } from "lucide-react";

const floatingStats = [
  { label: "Creators Managed", value: "12,400+" },
  { label: "Countries Targeted", value: "78" },
  { label: "Content Ideas Daily", value: "62,000+" },
  { label: "Avg. Audience Growth", value: "340%" },
];

const badges = [
  { icon: Globe, text: "Global Reach" },
  { icon: Sparkles, text: "AI-Powered" },
  { icon: Shield, text: "Safety First" },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#a78bfa"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 bg-[#000000]"
    >
      {/* Animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Radial gradient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.15)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Launch badge */}
        <div className="inline-flex items-center gap-2 bg-[#111128] border border-[#2e2e5e] rounded-full px-4 py-1.5 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
          <span className="text-[#a0a0c0]">Introducing Ascend.ai — Global Content Intelligence</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8b5cf6]" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6">
          Your US TikTok and Instagram. Done For You.
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-[#a0a0c0] max-w-2xl mx-auto leading-relaxed mb-10">
          AI-powered content intelligence for creators, agencies, and brands.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/signup"
            id="hero-start-trial"
            className="group relative bg-[#FFD700] text-black font-bold px-8 py-4 rounded-xl text-base hover:bg-[#FFA500] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Get Started — $89.99/month
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        </div>
    </section>
  );
}
