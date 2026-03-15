import { motion } from "framer-motion";
import {
  FileText, Merge, Scissors, Archive, RotateCw, Image, Lock, PenTool,
  Layers, Type, Stamp, Hash, Shield, Eye, Crop, Wrench
} from "lucide-react";

const marqueeTools = [
  { icon: FileText, name: "Edit PDF", color: "#8b5cf6" },
  { icon: Merge, name: "Merge PDF", color: "#7c3aed" },
  { icon: Scissors, name: "Split PDF", color: "#ec4899" },
  { icon: Archive, name: "Compress", color: "#f59e0b" },
  { icon: Image, name: "PDF to JPG", color: "#06b6d4" },
  { icon: RotateCw, name: "Rotate PDF", color: "#14b8a6" },
  { icon: Lock, name: "Protect PDF", color: "#22c55e" },
  { icon: PenTool, name: "Sign PDF", color: "#8b5cf6" },
  { icon: Layers, name: "Organize", color: "#7c3aed" },
  { icon: Type, name: "Add Text", color: "#ec4899" },
  { icon: Stamp, name: "Watermark", color: "#f59e0b" },
  { icon: Hash, name: "Number Pages", color: "#06b6d4" },
  { icon: Shield, name: "Redact PDF", color: "#ef4444" },
  { icon: Eye, name: "Annotate", color: "#14b8a6" },
  { icon: Crop, name: "Crop PDF", color: "#22c55e" },
  { icon: Wrench, name: "Repair PDF", color: "#f59e0b" },
];

function MarqueeItem({ tool }: { tool: typeof marqueeTools[0] }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card-premium whitespace-nowrap flex-shrink-0 group/item hover:scale-105 transition-transform duration-300">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover/item:scale-110"
        style={{ background: `${tool.color}15` }}
      >
        <tool.icon className="w-3.5 h-3.5" style={{ color: tool.color }} />
      </div>
      <span className="text-sm font-medium text-foreground">{tool.name}</span>
    </div>
  );
}

function MarqueeRow({ direction = "left", speed = 30 }: { direction?: "left" | "right"; speed?: number }) {
  return (
    <div className="flex overflow-hidden marquee-container">
      <div
        className={`flex gap-4 py-2 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {marqueeTools.map((tool, i) => (
          <MarqueeItem key={`a-${i}`} tool={tool} />
        ))}
        {marqueeTools.map((tool, i) => (
          <MarqueeItem key={`b-${i}`} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export function ToolMarquee() {
  return (
    <div className="relative py-8 overflow-hidden" data-testid="section-marquee">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="space-y-4">
        <MarqueeRow direction="left" speed={40} />
        <MarqueeRow direction="right" speed={35} />
      </div>
    </div>
  );
}
