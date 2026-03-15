import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function RippleButton({ children, className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);
    const timer = setTimeout(() => {
      if (mountedRef.current) setRipples((prev) => prev.filter((r) => r.id !== id));
      timersRef.current.delete(timer);
    }, 800);
    timersRef.current.add(timer);

    onClick?.(e);
  }, [onClick]);

  return (
    <Button className={`relative overflow-hidden ${className}`} onClick={handleClick} {...props}>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 40,
              height: 40,
              marginLeft: -20,
              marginTop: -20,
            }}
          />
        ))}
      </AnimatePresence>
      {children}
    </Button>
  );
}
