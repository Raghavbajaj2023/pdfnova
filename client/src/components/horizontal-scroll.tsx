import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import {
  FileText, Merge, Scissors, Archive, RotateCw, Image, Lock, PenTool,
  Type, Stamp, Shield, Crop, ArrowRight
} from "lucide-react";
import { Link } from "wouter";

const showcaseTools = [
  { icon: FileText, name: "PDF Editor", desc: "Full-featured editor with text, drawing, and annotation tools", path: "/edit-pdf", color: "#8b5cf6", gradient: "from-violet-500 to-violet-600" },
  { icon: Merge, name: "Merge PDFs", desc: "Combine multiple PDF files into one document instantly", path: "/merge-pdf", color: "#7c3aed", gradient: "from-purple-500 to-purple-600" },
  { icon: Scissors, name: "Split PDF", desc: "Extract specific pages or split into multiple documents", path: "/split-pdf", color: "#ec4899", gradient: "from-pink-500 to-pink-600" },
  { icon: Archive, name: "Compress", desc: "Reduce file sizes up to 90% without quality loss", path: "/compress-pdf", color: "#f59e0b", gradient: "from-amber-500 to-amber-600" },
  { icon: Image, name: "PDF to Image", desc: "Convert PDF pages to high-quality JPG or PNG images", path: "/pdf-to-jpg", color: "#06b6d4", gradient: "from-cyan-500 to-cyan-600" },
  { icon: PenTool, name: "Sign PDF", desc: "Add electronic signatures to documents in seconds", path: "/sign-pdf", color: "#22c55e", gradient: "from-emerald-500 to-emerald-600" },
  { icon: Lock, name: "Protect PDF", desc: "Add password protection and encryption to your files", path: "/protect-pdf", color: "#ef4444", gradient: "from-red-500 to-red-600" },
  { icon: Shield, name: "Redact PDF", desc: "Permanently remove sensitive information from documents", path: "/redact-pdf", color: "#8b5cf6", gradient: "from-violet-500 to-indigo-600" },
];

export function HorizontalScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [200, -800]);
  const smoothX = useSpring(x, { stiffness: 80, damping: 30 });

  return (
    <section ref={containerRef} className="py-28 relative overflow-hidden" data-testid="section-horizontal-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-300 text-sm font-medium mb-5"
          >
            Tool Spotlight
          </motion.span>
          <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight">
            Explore Our <span className="gradient-text">Best Tools</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Scroll to discover our most powerful PDF tools
          </p>
        </motion.div>
      </div>

      <motion.div
        style={{ x: smoothX }}
        className="flex gap-6 px-4"
      >
        {showcaseTools.map((tool, i) => (
          <Link key={tool.path} href={tool.path}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card-premium rounded-2xl p-8 min-w-[300px] max-w-[300px] cursor-pointer group flex-shrink-0"
              data-testid={`showcase-tool-${tool.name.toLowerCase().replace(/\s/g, '-')}`}
            >
              <motion.div
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-lg flex items-center justify-center mb-6`}
              >
                <tool.icon className="w-7 h-7 text-white" />
              </motion.div>

              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-300">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{tool.desc}</p>

              <div className="flex items-center gap-2 text-sm font-medium text-violet-500 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                Try Now <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
