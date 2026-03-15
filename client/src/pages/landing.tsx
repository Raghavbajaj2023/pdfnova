import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight, Shield, Zap, Check, Star, ChevronDown,
  FileText, Merge, Scissors, Archive, RotateCw, Image, Lock, PenTool,
  Sparkles, Users, Download, Clock, Layers, Eye, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground, GridPattern, FloatingShapes, FloatingParticles, HeroGlow, ScrollProgress } from "@/components/animated-background";
import { ToolMarquee } from "@/components/marquee";
import { FeatureShowcase } from "@/components/feature-showcase";
import { TextRotator } from "@/components/text-rotator";
import { FloatingPDF } from "@/components/floating-pdf";
import { useConfetti } from "@/components/confetti";
import { HowItWorks } from "@/components/how-it-works";
import { ComparisonSlider } from "@/components/comparison-slider";
import { ScrollRevealSection } from "@/components/scroll-reveal-section";
import { HorizontalScrollShowcase } from "@/components/horizontal-scroll";
import { TrustBadges } from "@/components/trust-badges";
import { AnimatedStatsBars } from "@/components/animated-stats-bar";
import { tools } from "@/lib/tools-data";
import { useRef } from "react";
import {
  useCountUp, useMagneticHover, use3DTilt,
  heroVariants, heroChildVariants, sectionReveal, cardReveal,
  smoothEase, snappySpring,
} from "@/hooks/use-animations";

const highlights = [
  { icon: Shield, title: "100% Private & Secure", desc: "Your files never leave your browser. Zero server uploads. End-to-end privacy by design.", gradient: "from-violet-500 to-violet-600" },
  { icon: Zap, title: "Blazing Fast Processing", desc: "Instant results powered by cutting-edge WebAssembly technology. No waiting, no queues.", gradient: "from-cyan-500 to-cyan-600" },
  { icon: Heart, title: "Completely Free Forever", desc: "Every tool, every feature, unlimited usage. No accounts, no credit cards, no hidden fees.", gradient: "from-pink-500 to-pink-600" },
];

const stats = [
  { value: 2, suffix: "M+", label: "PDFs Processed", icon: FileText },
  { value: 150, suffix: "K+", label: "Happy Users", icon: Users },
  { value: 28, suffix: "+", label: "PDF Tools", icon: Layers },
  { value: 3, suffix: "s", prefix: "< ", label: "Avg Process Time", icon: Clock },
];

const testimonials = [
  { name: "Sarah Chen", role: "Product Designer at Figma", text: "PDFNOVA replaced 3 different tools I was paying for. The editor is incredibly smooth and the privacy-first approach gives me peace of mind.", rating: 5, avatar: "SC" },
  { name: "Marcus Rivera", role: "Senior Developer at Stripe", text: "Finally a PDF tool that works entirely in the browser. No more uploading sensitive documents to random servers. This is how it should be.", rating: 5, avatar: "MR" },
  { name: "Elena Volkov", role: "Legal Consultant", text: "The security features are outstanding. My clients' confidential documents never leave the browser. I recommend PDFNOVA to every legal professional.", rating: 5, avatar: "EV" },
];

const faqs = [
  { q: "Is PDFNOVA really free?", a: "Yes! Every single tool is completely free with unlimited usage. No accounts, no credit cards, no catches. We believe PDF tools should be accessible to everyone." },
  { q: "Are my files truly safe?", a: "Absolutely. All processing happens 100% locally in your browser using WebAssembly technology. We never upload, store, or access your files. Your data never touches our servers." },
  { q: "What's the maximum file size?", a: "There are no file size limits. Process files of any size directly in your browser with no restrictions." },
  { q: "Do I need to create an account?", a: "No account required. Simply visit any tool, upload your file, and start working. It's that simple." },
  { q: "How many tools are available?", a: `We offer ${tools.length}+ professional-grade PDF tools including editing, converting, merging, splitting, compressing, watermarking, and much more.` },
];

const popularTools = [
  { icon: FileText, name: "PDF Editor", path: "/edit-pdf", color: "#8b5cf6", desc: "Full-featured editor" },
  { icon: Merge, name: "Merge PDF", path: "/merge-pdf", color: "#7c3aed", desc: "Combine multiple files" },
  { icon: Scissors, name: "Split PDF", path: "/split-pdf", color: "#ec4899", desc: "Extract pages" },
  { icon: Archive, name: "Compress", path: "/compress-pdf", color: "#f59e0b", desc: "Reduce file size" },
  { icon: Image, name: "PDF to JPG", path: "/pdf-to-jpg", color: "#06b6d4", desc: "Convert to images" },
  { icon: RotateCw, name: "Rotate PDF", path: "/rotate-pdf", color: "#14b8a6", desc: "Fix orientation" },
  { icon: Lock, name: "Protect PDF", path: "/protect-pdf", color: "#22c55e", desc: "Add password" },
  { icon: PenTool, name: "Sign PDF", path: "/sign-pdf", color: "#8b5cf6", desc: "E-signatures" },
];

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
            transition={{
              duration: 0.5,
              delay: delay + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagneticHover(0.4);
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={snappySpring}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function StatCounter({ value, suffix, prefix, label, icon: Icon, index }: any) {
  const { ref, count } = useCountUp(value, 1800);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: smoothEase }}
      whileHover={{ scale: 1.08, y: -4 }}
      className="text-center py-6 group"
    >
      <motion.div
        className="flex items-center justify-center gap-2 mb-2"
        whileHover={{ scale: 1.05 }}
      >
        <Icon className="w-5 h-5 text-violet-500 dark:text-violet-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
        <span className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
          {prefix}{count}{suffix}
        </span>
      </motion.div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function ToolCard3D({ tool, index }: { tool: typeof popularTools[0]; index: number }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(12);

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
        className="glass-card-premium rounded-2xl p-6 text-center cursor-pointer group perspective-1000"
        data-testid={`card-tool-${tool.name.toLowerCase().replace(/\s/g, '-')}`}
      >
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110"
          style={{
            background: `${tool.color}15`,
            boxShadow: `0 0 0 1px ${tool.color}15`,
            transform: "translateZ(20px)",
          }}
          whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.15 }}
          transition={{ duration: 0.5 }}
        >
          <tool.icon className="w-6 h-6 transition-all duration-500 group-hover:drop-shadow-lg" style={{ color: tool.color }} />
        </motion.div>
        <span className="text-sm font-semibold text-foreground block mb-1" style={{ transform: "translateZ(15px)" }}>{tool.name}</span>
        <span className="text-xs text-muted-foreground" style={{ transform: "translateZ(10px)" }}>{tool.desc}</span>
      </motion.div>
    </Link>
  );
}

function HighlightCard({ item, index }: { item: typeof highlights[0]; index: number }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(10);

  return (
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
      className="glass-card-premium rounded-2xl p-8 group"
    >
      <motion.div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${item.gradient} shadow-lg`}
        style={{ transform: "translateZ(25px)" }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={snappySpring}
      >
        <item.icon className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-lg font-semibold text-foreground mb-3" style={{ transform: "translateZ(15px)" }}>{item.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed" style={{ transform: "translateZ(10px)" }}>{item.desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(8);

  return (
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
      className="glass-card-premium rounded-2xl p-8 group"
    >
      <div className="flex gap-1 mb-5" style={{ transform: "translateZ(20px)" }}>
        {Array.from({ length: t.rating }).map((_, j) => (
          <motion.div
            key={j}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + j * 0.05, type: "spring", stiffness: 300 }}
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed" style={{ transform: "translateZ(10px)" }}>"{t.text}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/5" style={{ transform: "translateZ(15px)" }}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/20"
        >
          {t.avatar}
        </motion.div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const { fire: fireConfetti, ConfettiCanvas } = useConfetti();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.6], [1, 0.9]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 150]);

  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });
  const smoothHeroScale = useSpring(heroScale, { stiffness: 100, damping: 30 });

  const toolsSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: toolsProgress } = useScroll({
    target: toolsSectionRef,
    offset: ["start end", "end start"],
  });
  const toolsY = useTransform(toolsProgress, [0, 0.5], [60, 0]);
  const smoothToolsY = useSpring(toolsY, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-background noise-bg transition-colors duration-500">
      <AnimatedBackground />
      <ScrollProgress />
      <ConfettiCanvas />
      <Navbar />

      <section ref={heroRef} className="relative pt-32 pb-28 overflow-hidden min-h-[90vh] flex items-center">
        <GridPattern />
        <FloatingShapes />
        <FloatingParticles />
        <HeroGlow />
        <FloatingPDF />

        <motion.div
          style={{
            opacity: heroOpacity,
            scale: smoothHeroScale,
            y: smoothHeroY,
          }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        >
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={heroChildVariants}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-violet-500/20 dark:border-violet-400/20 text-violet-600 dark:text-violet-300 text-sm font-medium mb-8 shimmer-border bg-violet-500/5"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              100% Free — No Limits — No Signup
            </motion.div>

            <motion.h1
              variants={heroChildVariants}
              data-testid="text-hero-headline"
              className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05] mb-6"
            >
              <AnimatedText text="Edit, Convert, Compress" delay={0.3} />
              <br className="hidden sm:block" />
              <AnimatedText text="and Sign PDFs —" delay={0.6} />
              {" "}
              <TextRotator className="min-w-[200px]" />
            </motion.h1>

            <motion.p
              variants={heroChildVariants}
              data-testid="text-hero-subheadline"
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              The most powerful free PDF platform on the internet.
              All processing happens in your browser — your files never leave your device.
            </motion.p>

            <motion.div
              variants={heroChildVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <MagneticButton>
                <Link href="/edit-pdf">
                  <Button
                    data-testid="button-hero-cta"
                    size="lg"
                    className="text-base px-10 btn-glow gap-2 h-14 text-lg"
                    onClick={fireConfetti}
                  >
                    <Sparkles className="w-5 h-5" />
                    Edit PDF Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/tools">
                  <Button data-testid="button-explore-tools" variant="secondary" size="lg" className="text-base px-10 h-14 gap-2 border border-black/10 dark:border-white/10 text-lg">
                    <Eye className="w-5 h-5" />
                    Explore All Tools
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>

            <motion.div
              variants={heroChildVariants}
              className="flex items-center justify-center gap-8 mt-14 text-sm text-muted-foreground"
            >
              {["No signup required", "100% free", "No file uploads"].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  </motion.div>
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCounter key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />

      <ToolMarquee />

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {highlights.map((item, i) => (
              <HighlightCard key={item.title} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      <FeatureShowcase />

      <HowItWorks />

      <section ref={toolsSectionRef} className="py-28 relative">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)", filter: "blur(100px)" }}
          />
        </div>
        <motion.div style={{ y: smoothToolsY }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-300 text-sm font-medium mb-5"
            >
              {tools.length}+ Professional Tools
            </motion.span>
            <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight">
              <AnimatedText text="Every PDF Tool You'll" />
              {" "}
              <span className="gradient-text">Ever Need</span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-muted-foreground max-w-xl mx-auto text-lg"
            >
              From simple edits to complex conversions — all free, all in your browser.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {popularTools.map((tool, i) => (
              <ToolCard3D key={tool.path} tool={tool} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <MagneticButton>
              <Link href="/tools">
                <Button variant="secondary" data-testid="button-view-all-tools" className="gap-2 border border-black/10 dark:border-white/10 px-8 h-12">
                  View All {tools.length} Tools
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      <HorizontalScrollShowcase />

      <ComparisonSlider />

      <ScrollRevealSection />

      <AnimatedStatsBars />

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
          />
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-sm font-medium mb-5"
            >
              Trusted Worldwide
            </motion.span>
            <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight">
              <AnimatedText text="Loved by" />
              {" "}
              <span className="gradient-text">Thousands</span>
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg"
            >
              See what professionals are saying about PDFNOVA
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              <AnimatedText text="Frequently Asked Questions" />
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Everything you need to know about PDFNOVA
            </motion.p>
          </motion.div>

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
                <summary
                  data-testid={`button-faq-${i}`}
                  className="flex items-center justify-between p-6 cursor-pointer list-none select-none"
                >
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-500 group-open:rotate-180" />
                  </motion.div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="relative rounded-3xl p-14 sm:p-20 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-cyan-600/10 to-violet-600/20 rounded-3xl" />
            <div className="absolute inset-[1px] rounded-3xl bg-background/90 dark:bg-background/80" />
            <div className="absolute inset-0 rounded-3xl shimmer-border" />
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.2), transparent 60%)" }}
            />

            <div className="relative">
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-violet-500/30"
              >
                <Download className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight">
                <AnimatedText text="Ready to Transform Your" />
                {" "}
                <span className="gradient-text">PDF Workflow</span>?
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-xl mx-auto mb-12 text-lg"
              >
                Join 150,000+ professionals using PDFNOVA to handle PDFs faster, smarter, and safer.
              </motion.p>
              <MagneticButton>
                <Link href="/edit-pdf">
                  <Button
                    size="lg"
                    className="text-lg px-12 h-14 btn-glow gap-2"
                    data-testid="button-cta-bottom"
                    onClick={fireConfetti}
                  >
                    <Sparkles className="w-5 h-5" />
                    Start Editing Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
