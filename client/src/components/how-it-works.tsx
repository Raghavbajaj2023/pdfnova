import { motion, useScroll, useTransform } from "framer-motion";
import { Upload, Wand2, Download, CheckCircle2 } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Your PDF",
    description: "Drag and drop or click to upload. Your file stays in your browser — nothing is uploaded to any server.",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-violet-600",
  },
  {
    icon: Wand2,
    number: "02",
    title: "Choose Your Tool",
    description: "Select from 28+ professional tools. Edit, merge, split, compress, convert, sign — whatever you need.",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Process Instantly",
    description: "Your file is processed in milliseconds using WebAssembly technology. No waiting, no queues.",
    color: "#ec4899",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    icon: Download,
    number: "04",
    title: "Download Result",
    description: "Get your processed file instantly. No watermarks, no quality loss, no restrictions.",
    color: "#22c55e",
    gradient: "from-emerald-500 to-emerald-600",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
      data-testid={`step-card-${index}`}
    >
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-16 left-[calc(100%)] w-full h-[2px] z-0">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full origin-left"
            style={{
              background: `linear-gradient(90deg, ${step.color}, ${steps[index + 1].color})`,
              opacity: 0.3,
            }}
          />
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.8 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: steps[index + 1].color }}
          />
        </div>
      )}

      <div className="glass-card-premium rounded-2xl p-8 text-center relative z-10 h-full">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg flex items-center justify-center mx-auto mb-6`}
        >
          <step.icon className="w-8 h-8 text-white" />
        </motion.div>

        <motion.div
          className="absolute top-4 right-4 text-5xl font-black opacity-[0.04] dark:opacity-[0.06]"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.04 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.3 }}
        >
          {step.number}
        </motion.div>

        <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden" data-testid="section-how-it-works">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)", filter: "blur(100px)" }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-sm font-medium mb-5"
          >
            Simple as 1-2-3-4
          </motion.span>
          <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Get started in seconds. No installation, no signup, no hassle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
