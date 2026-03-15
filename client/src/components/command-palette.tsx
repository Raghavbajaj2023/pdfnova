import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Command } from "lucide-react";
import { useLocation } from "wouter";
import { tools } from "@/lib/tools-data";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, navigate] = useLocation();

  const results = useMemo(() => {
    if (!query.trim()) return tools.slice(0, 8);
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    ).slice(0, 8);
  }, [query]);

  const handleSelect = useCallback((path: string) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  }, [navigate]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleNav(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        handleSelect(results[selectedIndex].path);
      }
    }
    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [open, results, selectedIndex, handleSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search tools"
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg glass-card-premium rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5 dark:border-white/10">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                data-testid="input-command-palette"
                autoFocus
                type="text"
                placeholder="Search tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] text-muted-foreground font-mono">
                ESC
              </kbd>
            </div>

            <div className="max-h-[320px] overflow-y-auto scrollbar-hidden py-2">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">No tools found</p>
                </div>
              ) : (
                results.map((tool, i) => (
                  <button
                    key={tool.id}
                    data-testid={`command-result-${tool.id}`}
                    onClick={() => handleSelect(tool.path)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === selectedIndex ? "bg-black/5 dark:bg-white/10" : "hover:bg-black/[0.03] dark:hover:bg-white/5"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${tool.color}15` }}
                    >
                      <tool.icon className="w-4 h-4" style={{ color: tool.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{tool.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-opacity ${
                      i === selectedIndex ? "opacity-100" : "opacity-0"
                    }`} />
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-black/5 dark:border-white/10 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">↵</kbd> Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">esc</kbd> Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CommandPaletteTrigger({ onClick }: { onClick: () => void }) {
  const [, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <button
      data-testid="button-command-palette"
      onClick={onClick}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 transition-colors hover:border-white/20 hover:text-gray-300"
    >
      <Search className="w-3.5 h-3.5" />
      <span>Search tools...</span>
      <kbd className="flex items-center gap-0.5 ml-2 text-[10px] font-mono">
        <Command className="w-3 h-3" />K
      </kbd>
    </button>
  );
}
