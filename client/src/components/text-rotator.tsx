import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const words = ["Instantly", "Securely", "For Free", "With Ease", "Offline"];

export function TextRotator({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`inline-block relative ${className}`} data-testid="text-rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 30, opacity: 0, rotateX: -40 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -30, opacity: 0, rotateX: 40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="gradient-text-hero inline-block"
          style={{ perspective: "1000px" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
