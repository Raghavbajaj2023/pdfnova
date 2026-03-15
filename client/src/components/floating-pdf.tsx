import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export function FloatingPDF() {
  return (
    <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 pointer-events-none" data-testid="floating-pdf">
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotateY: [-5, 5, -5],
          rotateX: [2, -2, 2],
          rotateZ: [-1, 1, -1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        <div className="relative w-48 h-64">
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/90 to-cyan-500/90 shadow-2xl"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(0px)" }}
          >
            <div className="absolute inset-[1px] rounded-2xl bg-white dark:bg-gray-900 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/5 dark:border-white/10">
                <FileText className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-medium text-foreground">Document.pdf</span>
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full w-full" />
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full w-4/5" />
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full w-3/4" />
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full w-full" />
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full w-2/3" />
                <div className="mt-3 h-16 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-lg" />
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full w-full" />
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full w-5/6" />
              </div>
              <div className="mt-auto pt-2 border-t border-black/5 dark:border-white/10">
                <div className="text-[8px] text-muted-foreground text-center">Page 1 of 1</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-3 -right-3 w-20 h-20 rounded-xl bg-gradient-to-br from-pink-500 to-amber-500 shadow-xl flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="text-white text-lg font-bold">PDF</span>
          </motion.div>

          <motion.div
            className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-emerald-500 shadow-lg flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="text-white text-xs">✓</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
