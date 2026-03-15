import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Globe, Server, Cloud, Wifi, MonitorSmartphone, Laptop } from "lucide-react";

const platforms = [
  { icon: MonitorSmartphone, label: "Mobile" },
  { icon: Laptop, label: "Desktop" },
  { icon: Globe, label: "Any Browser" },
  { icon: Wifi, label: "Online" },
  { icon: Cloud, label: "No Cloud" },
  { icon: Server, label: "No Server" },
];

export function ScrollRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  const lineProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 100]);

  return (
    <section ref={containerRef} className="py-28 relative overflow-hidden" data-testid="section-scroll-reveal">
      <motion.div
        style={{ opacity, y: smoothY, scale: smoothScale }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-sm font-medium mb-5"
          >
            Works Everywhere
          </motion.span>
          <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight">
            One Platform, <span className="gradient-text">Every Device</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            No installation needed. Works on any device with a modern web browser.
          </p>
        </div>

        <div className="relative">
          <motion.div
            className="absolute top-1/2 left-[10%] right-[10%] h-[2px] -translate-y-1/2 hidden lg:block"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(6,182,212,0.3), transparent)",
            }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 origin-left"
              style={{
                scaleX: useTransform(lineProgress, (v) => v / 100),
              }}
            />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.label}
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="glass-card-premium rounded-2xl p-6 text-center group"
                data-testid={`platform-card-${platform.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4 group-hover:from-violet-500/20 group-hover:to-cyan-500/20 transition-all duration-500"
                >
                  <platform.icon className="w-7 h-7 text-violet-500 dark:text-violet-400 group-hover:text-violet-400 dark:group-hover:text-violet-300 transition-colors duration-300" />
                </motion.div>
                <span className="text-sm font-medium text-foreground">{platform.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
