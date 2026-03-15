import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  spin: number;
  shape: "circle" | "square" | "triangle";
}

const COLORS = ["#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b", "#22c55e", "#a78bfa", "#22d3ee"];
const SHAPES: Particle["shape"][] = ["circle", "square", "triangle"];

export function useConfetti() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fire = useCallback((e: React.MouseEvent) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: Date.now() + i,
      x: originX,
      y: originY,
      color: COLORS[i % COLORS.length],
      size: 4 + Math.random() * 6,
      angle: (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.5,
      velocity: 200 + Math.random() * 300,
      spin: (Math.random() - 0.5) * 720,
      shape: SHAPES[i % 3],
    }));

    setParticles(newParticles);
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) setParticles([]);
      timerRef.current = null;
    }, 1500);
  }, []);

  const ConfettiCanvas = useCallback(() => (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {particles.map((p) => {
            const targetX = p.x + Math.cos(p.angle) * p.velocity;
            const targetY = p.y + Math.sin(p.angle) * p.velocity - 100 + Math.random() * 400;

            return (
              <motion.div
                key={p.id}
                initial={{ x: p.x, y: p.y, opacity: 1, scale: 1, rotate: 0 }}
                animate={{
                  x: targetX,
                  y: targetY + 200,
                  opacity: [1, 1, 0],
                  scale: [1, 1.2, 0.5],
                  rotate: p.spin,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : "0",
                  clipPath: p.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  ), [particles]);

  return { fire, ConfettiCanvas };
}
