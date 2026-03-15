import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { Search, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { tools, toolCategories, getToolsByCategory } from "@/lib/tools-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground, GridPattern, ScrollProgress } from "@/components/animated-background";
import { use3DTilt, cardReveal, sectionReveal, smoothEase, heroVariants, heroChildVariants } from "@/hooks/use-animations";

function AnimatedText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function ToolCard({ tool, index }: { tool: (typeof tools)[0]; index: number }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(10);

  return (
    <Link href={tool.path}>
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
        className="glass-card-premium rounded-xl p-5 cursor-pointer group"
        data-testid={`card-tool-${tool.id}`}
      >
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110"
          style={{
            background: `${tool.color}15`,
            boxShadow: `0 0 0 1px ${tool.color}10`,
            transform: "translateZ(20px)",
          }}
          whileHover={{ rotate: [0, -8, 8, 0] }}
        >
          <tool.icon className="w-5 h-5 transition-all duration-500 group-hover:drop-shadow-lg" style={{ color: tool.color }} />
        </motion.div>
        <h3 className="text-sm font-semibold text-foreground mb-1" style={{ transform: "translateZ(12px)" }}>{tool.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2" style={{ transform: "translateZ(8px)" }}>{tool.description}</p>
      </motion.div>
    </Link>
  );
}

export default function ToolsDirectory() {
  const [search, setSearch] = useState("");

  const filtered = search
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords.some((k) => k.includes(search.toLowerCase()))
      )
    : null;

  return (
    <div className="min-h-screen bg-background noise-bg transition-colors duration-500">
      <AnimatedBackground />
      <ScrollProgress />
      <Navbar />

      <div className="relative pt-28 pb-20">
        <GridPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-14"
          >
            <motion.span
              variants={heroChildVariants}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-300 text-sm font-medium mb-5"
            >
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>
              {tools.length}+ Professional Tools
            </motion.span>

            <motion.h1
              variants={heroChildVariants}
              data-testid="text-tools-title"
              className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight"
            >
              <AnimatedText text="All PDF" delay={0.2} />
              {" "}
              <span className="gradient-text">Tools</span>
            </motion.h1>
            <motion.p
              variants={heroChildVariants}
              className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg"
            >
              Everything you need to edit, convert, compress, and manage PDF files — completely free.
            </motion.p>

            <motion.div
              variants={heroChildVariants}
              className="relative max-w-md mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                data-testid="input-search-tools"
                type="search"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-black/[0.05] dark:focus:bg-white/[0.07] transition-all duration-300 focus:shadow-lg focus:shadow-violet-500/10"
              />
            </motion.div>
          </motion.div>

          {filtered ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {filtered.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <p className="text-muted-foreground text-lg">No tools found matching "{search}"</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="space-y-16">
              {toolCategories.map((cat) => {
                const catTools = getToolsByCategory(cat.id);
                if (catTools.length === 0) return null;
                return (
                  <motion.div
                    key={cat.id}
                    variants={sectionReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: smoothEase }}
                      className="mb-6"
                    >
                      <h2 className="text-2xl font-semibold text-foreground mb-1">{cat.name}</h2>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                      {catTools.map((tool, i) => (
                        <ToolCard key={tool.id} tool={tool} index={i} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
