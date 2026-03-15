import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { GripVertical, FileText, Archive } from "lucide-react";

export function ComparisonSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(x);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDragging) updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 2;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setSliderPos((p) => Math.max(10, p - step));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setSliderPos((p) => Math.min(90, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSliderPos(10);
    } else if (e.key === "End") {
      e.preventDefault();
      setSliderPos(90);
    }
  }, []);

  return (
    <section className="py-28 relative" data-testid="section-comparison">
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
            className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-300 text-sm font-medium mb-5"
          >
            See the Difference
          </motion.span>
          <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 tracking-tight">
            Powerful <span className="gradient-text">Compression</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Reduce file sizes up to 90% without visible quality loss
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative rounded-3xl overflow-hidden glass-card-premium select-none touch-none"
            style={{ aspectRatio: "16/9" }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            data-testid="comparison-slider-container"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/10 dark:from-red-500/10 dark:to-red-500/5 p-8 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Original PDF</div>
                  <div className="text-xs text-muted-foreground">24.8 MB</div>
                </div>
              </div>
              <div className="space-y-3">
                {[100, 95, 88, 78, 92, 85].map((w, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="h-2.5 rounded-full bg-red-500/10" style={{ width: `${w}%` }} />
                    <div className="w-8 h-8 rounded bg-red-500/5" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">24.8 MB</div>
                <div className="text-xs text-muted-foreground">Uncompressed</div>
              </div>
            </div>

            <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 dark:from-emerald-500/10 dark:to-emerald-500/5 p-8 flex flex-col justify-between"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Archive className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Compressed PDF</div>
                  <div className="text-xs text-muted-foreground">2.4 MB</div>
                </div>
              </div>
              <div className="space-y-3">
                {[100, 95, 88, 78, 92, 85].map((w, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="h-2.5 rounded-full bg-emerald-500/10" style={{ width: `${w}%` }} />
                    <div className="w-8 h-8 rounded bg-emerald-500/5" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">2.4 MB — 90% smaller</div>
                <div className="text-xs text-muted-foreground">Compressed</div>
              </div>
            </div>

            <div
              className="absolute top-0 bottom-0 z-20 flex items-center"
              style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-[2px] h-full bg-gradient-to-b from-violet-500 via-cyan-500 to-violet-500" />
              <motion.div
                role="slider"
                tabIndex={0}
                aria-label="Comparison slider"
                aria-valuenow={Math.round(sliderPos)}
                aria-valuemin={10}
                aria-valuemax={90}
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow-xl border-2 border-violet-500 flex items-center justify-center cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                data-testid="comparison-slider-handle"
              >
                <GripVertical className="w-4 h-4 text-violet-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
