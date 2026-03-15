import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground, ScrollProgress } from "@/components/animated-background";
import { tools, type Tool } from "@/lib/tools-data";
import { useRef } from "react";
import { use3DTilt, cardReveal, sectionReveal, smoothEase, snappySpring } from "@/hooks/use-animations";

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  steps?: string[];
  faqs?: { q: string; a: string }[];
}

function RelatedToolCard({ t, index }: { t: Tool; index: number }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(12);
  return (
    <Link href={t.path}>
      <motion.div
        ref={ref}
        custom={index}
        variants={cardReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass-card-premium rounded-xl p-5 text-center cursor-pointer group"
      >
        <motion.div
          className="w-11 h-11 rounded-lg flex items-center justify-center mx-auto mb-2 transition-all duration-500 group-hover:scale-110"
          style={{ background: `${t.color}15`, transform: "translateZ(20px)" }}
          whileHover={{ rotate: [0, -10, 10, 0] }}
        >
          <t.icon className="w-5 h-5" style={{ color: t.color }} />
        </motion.div>
        <span className="text-xs font-medium text-foreground" style={{ transform: "translateZ(10px)" }}>{t.name}</span>
      </motion.div>
    </Link>
  );
}

export function ToolPageLayout({ tool, children, steps, faqs }: ToolPageLayoutProps) {
  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background noise-bg transition-colors duration-500">
      <AnimatedBackground />
      <ScrollProgress />
      <Navbar />

      <div className="relative pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-6 w-[72px] h-[72px]"
              style={{ background: `${tool.color}15`, boxShadow: `0 0 40px ${tool.color}15, 0 0 0 1px ${tool.color}10` }}
            >
              <tool.icon className="w-9 h-9" style={{ color: tool.color }} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.7, ease: smoothEase }}
              data-testid="text-tool-title"
              className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight"
            >
              {tool.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-muted-foreground max-w-lg mx-auto text-lg"
            >
              {tool.description}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: smoothEase }}
            className="mb-20"
          >
            {children}
          </motion.div>

          {steps && steps.length > 0 && (
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-20"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-semibold text-foreground mb-8 text-center"
              >
                How It Works
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={cardReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={snappySpring}
                    className="glass-card-premium rounded-xl p-6 text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-4"
                    >
                      <span className="text-base font-bold text-violet-600 dark:text-violet-300">{i + 1}</span>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {faqs && faqs.length > 0 && (
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-20"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-semibold text-foreground mb-8 text-center"
              >
                FAQ
              </motion.h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <motion.details
                    key={i}
                    custom={i}
                    variants={cardReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="glass-card-premium rounded-xl group faq-item"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                      <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                      <motion.div whileHover={{ scale: 1.2 }}>
                        <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-500 group-open:rotate-180 flex-shrink-0" />
                      </motion.div>
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.details>
                ))}
              </div>
            </motion.div>
          )}

          {relatedTools.length > 0 && (
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-semibold text-foreground mb-8 text-center"
              >
                Related Tools
              </motion.h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {relatedTools.map((t, i) => (
                  <RelatedToolCard key={t.id} t={t} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
