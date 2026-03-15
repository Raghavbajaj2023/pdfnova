import { motion, useScroll, useSpring } from "framer-motion";
import { useMemo } from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        animate={{
          x: [0, 80, -50, 30, 0],
          y: [0, -90, 50, -60, 0],
          scale: [1, 1.3, 0.85, 1.15, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] left-[5%] w-[700px] h-[700px] animate-morph opacity-[0.2] dark:opacity-[0.12]"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, #7c3aed 40%, transparent 70%)", filter: "blur(80px)" }}
      />
      <motion.div
        animate={{
          x: [0, -90, 60, -30, 0],
          y: [0, 60, -80, 40, 0],
          scale: [1, 0.8, 1.25, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] right-[0%] w-[800px] h-[800px] animate-morph opacity-[0.18] dark:opacity-[0.1]"
        style={{ background: "radial-gradient(circle, #06b6d4 0%, #0891b2 40%, transparent 70%)", filter: "blur(90px)", animationDelay: "-5s" }}
      />
      <motion.div
        animate={{
          x: [0, 50, -60, 20, 0],
          y: [0, -50, 60, -30, 0],
          scale: [1, 1.1, 0.9, 1.2, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] left-[45%] w-[600px] h-[600px] animate-morph opacity-[0.12] dark:opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #ec4899 0%, #db2777 40%, transparent 70%)", filter: "blur(100px)", animationDelay: "-10s" }}
      />
      <motion.div
        animate={{
          x: [0, -40, 50, -20, 0],
          y: [0, 70, -40, 60, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[55%] left-[15%] w-[500px] h-[500px] animate-morph opacity-[0.1] dark:opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", filter: "blur(90px)", animationDelay: "-15s" }}
      />
    </div>
  );
}

export function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" className="stroke-primary/[0.04] dark:stroke-primary/[0.06]" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ y: [-20, 20, -20], x: [0, 15, 0], rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[12%] right-[18%] w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 dark:from-violet-500/10 dark:to-cyan-500/6 border border-violet-500/15 dark:border-violet-500/8 backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [15, -25, 15], x: [-10, 10, -10], rotate: [0, -180, -360] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[42%] left-[6%] w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/12 to-pink-500/10 dark:from-cyan-500/8 dark:to-pink-500/5 border border-cyan-500/12 dark:border-cyan-500/6 backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [10, -30, 10], x: [5, -15, 5], rotate: [45, 135, 225, 315, 405] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[22%] right-[10%] w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500/12 to-amber-500/10 dark:from-pink-500/7 dark:to-amber-500/5 border border-pink-500/12 dark:border-pink-500/6 backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [-15, 25, -15], x: [-8, 12, -8] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[65%] left-[22%] w-14 h-14 rounded-lg bg-gradient-to-br from-amber-500/10 to-violet-500/10 dark:from-amber-500/6 dark:to-violet-500/4 border border-amber-500/10 dark:border-amber-500/6"
      />
      <motion.div
        animate={{ y: [-25, 15, -25], x: [10, -10, 10], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] left-[38%] w-8 h-8 rounded-full bg-violet-400/20 dark:bg-violet-400/10"
      />
      <motion.div
        animate={{ y: [20, -20, 20], x: [-5, 8, -5], scale: [1, 0.8, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[35%] right-[28%] w-6 h-6 rounded-full bg-cyan-400/20 dark:bg-cyan-400/10"
      />
    </div>
  );
}

const PARTICLE_SEEDS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 3 + (((i * 7 + 3) % 10) / 10) * 5,
  x: 5 + (((i * 13 + 7) % 18) / 18) * 90,
  y: 5 + (((i * 11 + 5) % 17) / 17) * 90,
  duration: 8 + (((i * 9 + 2) % 12) / 12) * 12,
  delay: ((i * 3 + 1) % 5),
  color: i % 4 === 0 ? "139, 92, 246" : i % 4 === 1 ? "6, 182, 212" : i % 4 === 2 ? "236, 72, 153" : "245, 158, 11",
}));

export function FloatingParticles() {
  const particles = PARTICLE_SEEDS;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -60, 25, -40, 0],
            x: [0, 30, -25, 35, 0],
            opacity: [0.2, 0.7, 0.3, 0.8, 0.2],
            scale: [1, 1.5, 0.8, 1.3, 1],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, rgba(${p.color}, 0.9) 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]"
        style={{
          background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
        style={{
          background: "conic-gradient(from 0deg, transparent, rgba(139,92,246,0.1), transparent, rgba(6,182,212,0.08), transparent)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 z-[60]"
    />
  );
}
