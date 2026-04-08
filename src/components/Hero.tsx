"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "#about", label: "关于我" },
  { href: "#resume", label: "简历" },
  { href: "#projects", label: "项目" },
  { href: "#experience", label: "经历" },
  { href: "#awards", label: "荣誉" },
  { href: "#social", label: "社交" },
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

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
    const colors = ["#8b5cf6", "#3b82f6", "#ec4899", "#06b6d4", "#f59e0b"];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    }
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      }}
    >
      {/* Animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full opacity-15 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Avatar placeholder */}
          <div className="mx-auto mb-6 w-32 h-32 rounded-full border-4 border-purple-400 flex items-center justify-center text-5xl"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
            👤
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight"
        >
          苏天润
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {["金融科技", "AI产品", "数据分析", "全栈开发"].map((tag, i) => (
            <span
              key={i}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-white"
              style={{
                background: [
                  "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  "linear-gradient(135deg, #ec4899, #be185d)",
                  "linear-gradient(135deg, #06b6d4, #0e7490)",
                ][i],
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
        >
          上海理工大学 · 中国社会科学院研究生院 · 金融 · 硕士 · 2027届
          <br />
          热爱用技术解决金融领域的真实问题 🚀
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4 mt-8"
        >
          <a
            href="#projects"
            className="px-8 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            查看项目 ✨
          </a>
          <a
            href="#resume"
            className="px-8 py-3 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
          >
            我的简历 📄
          </a>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-6 left-0 right-0 flex justify-center gap-6 z-20"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors hover:scale-105 inline-block"
          >
            {link.label}
          </a>
        ))}
      </motion.nav>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs">向下滚动</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
