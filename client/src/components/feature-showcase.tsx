import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Shield, Zap, Globe, Lock, Sparkles, Cpu } from "lucide-react";

const features = [
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy First",
    subtitle: "Your data stays on your device",
    description: "Every file is processed 100% locally in your browser using advanced WebAssembly technology. Nothing is ever uploaded to any server. Your documents remain completely private.",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-violet-600",
    stats: [
      { label: "Server Uploads", value: "Zero" },
      { label: "Data Stored", value: "None" },
      { label: "Privacy Score", value: "100%" },
    ],
  },
  {
    id: "speed",
    icon: Zap,
    title: "Lightning Fast",
    subtitle: "Instant processing, no queues",
    description: "Powered by cutting-edge WebAssembly, PDFNOVA processes files instantly right in your browser. No uploads, no waiting in queues, no server bottlenecks. Just pure speed.",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-cyan-600",
    stats: [
      { label: "Avg Speed", value: "< 3s" },
      { label: "Queue Time", value: "0ms" },
      { label: "Uptime", value: "100%" },
    ],
  },
  {
    id: "power",
    icon: Cpu,
    title: "Professional Grade",
    subtitle: "Enterprise tools, completely free",
    description: "28+ professional PDF tools that rival expensive desktop software. Edit, convert, merge, split, compress, sign, and much more — all with zero cost and no compromises.",
    color: "#ec4899",
    gradient: "from-pink-500 to-pink-600",
    stats: [
      { label: "Tools", value: "28+" },
      { label: "File Limit", value: "None" },
      { label: "Cost", value: "$0" },
    ],
  },
];

export function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const feature = features[active];

  return (
    <section className="py-28 relative" data-testid="section-feature-showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-300 text-sm font-medium mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
            Why PDFNOVA
          </motion.span>
          <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight">
            Built Different
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            See what makes PDFNOVA the most advanced PDF platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.button
                key={f.id}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-500 group ${
                  active === i
                    ? "glass-card-premium shadow-lg"
                    : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                }`}
                data-testid={`button-feature-${f.id}`}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={active === i ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      active === i
                        ? `bg-gradient-to-br ${f.gradient} shadow-lg`
                        : "bg-black/[0.04] dark:bg-white/5"
                    }`}
                  >
                    <f.icon className={`w-6 h-6 transition-colors duration-300 ${active === i ? "text-white" : "text-muted-foreground"}`} />
                  </motion.div>
                  <div>
                    <h3 className={`font-semibold mb-1 transition-colors duration-300 ${active === i ? "text-foreground" : "text-muted-foreground"}`}>
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{f.subtitle}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card-premium rounded-3xl p-10 relative overflow-hidden"
            >
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  background: `radial-gradient(circle, ${feature.color}40, transparent 70%)`,
                  filter: "blur(40px)",
                }}
              />
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient} shadow-xl`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-foreground mb-3"
                >
                  {feature.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-muted-foreground mb-8 leading-relaxed"
                >
                  {feature.description}
                </motion.p>

                <div className="grid grid-cols-3 gap-4">
                  {feature.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="text-center p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]"
                    >
                      <div className="text-xl font-bold text-foreground mb-0.5" style={{ color: feature.color }}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
