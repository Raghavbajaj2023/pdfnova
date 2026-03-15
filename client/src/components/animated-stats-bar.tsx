import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const statBars = [
  { label: "File Size Reduction", value: 90, color: "from-violet-500 to-violet-600", suffix: "%" },
  { label: "Processing Speed", value: 97, color: "from-cyan-500 to-cyan-600", suffix: "%" },
  { label: "User Satisfaction", value: 99, color: "from-pink-500 to-pink-600", suffix: "%" },
  { label: "Privacy Score", value: 100, color: "from-emerald-500 to-emerald-600", suffix: "%" },
];

export function AnimatedStatsBars() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 relative" data-testid="section-stats-bars">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            By the <span className="gradient-text">Numbers</span>
          </h2>
          <p className="text-muted-foreground text-lg">Performance metrics that speak for themselves</p>
        </motion.div>

        <div className="space-y-8">
          {statBars.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`stat-bar-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{stat.label}</span>
                <motion.span
                  className="text-sm font-bold text-foreground tabular-nums"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.12 + 0.5, duration: 0.3 }}
                >
                  {stat.value}{stat.suffix}
                </motion.span>
              </div>
              <div className="h-3 rounded-full bg-black/[0.04] dark:bg-white/[0.04] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color} relative overflow-hidden`}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${stat.value}%` } : {}}
                  transition={{ delay: i * 0.12 + 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="absolute inset-0 rounded-full opacity-30 animate-shimmer-once"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
