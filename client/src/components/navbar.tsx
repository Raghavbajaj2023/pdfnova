import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Menu, X, Search, Command, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme";

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "Tools" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-black/5 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20"
          : "border-b border-transparent"
      }`}
      style={{
        background: scrolled
          ? theme === "dark" ? "rgba(12, 10, 30, 0.92)" : "rgba(255, 255, 255, 0.88)"
          : theme === "dark" ? "rgba(12, 10, 30, 0.4)" : "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link href="/" data-testid="link-home">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20"
              >
                <FileText className="w-4 h-4 text-white" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
              </motion.div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                PDF<span className="text-violet-500 dark:text-violet-400">NOVA</span>
              </span>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                    location === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {location === link.href && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-black/5 dark:bg-white/10"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <motion.button
              data-testid="button-command-palette"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={triggerCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 text-xs text-muted-foreground transition-all duration-300 hover:border-primary/20 hover:text-foreground hover:shadow-md hover:shadow-violet-500/5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search tools...</span>
              <kbd className="flex items-center gap-0.5 ml-1.5 text-[10px] font-mono opacity-60">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </motion.button>

            <motion.button
              data-testid="button-theme-toggle"
              whileHover={{ scale: 1.15, rotate: 20 }}
              whileTap={{ scale: 0.85, rotate: -20 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/[0.04] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 text-muted-foreground hover:text-foreground transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-violet-500/10"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div key="sun" initial={{ rotate: -90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0, opacity: 0 }} transition={{ duration: 0.3, type: "spring" }}>
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -90, scale: 0, opacity: 0 }} transition={{ duration: 0.3, type: "spring" }}>
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <Link href="/edit-pdf">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button data-testid="button-get-started" size="sm" className="btn-glow text-xs gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <motion.button
              data-testid="button-theme-toggle-mobile"
              whileTap={{ scale: 0.85, rotate: -20 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/[0.04] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 text-muted-foreground"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.button
              data-testid="button-mobile-menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              whileTap={{ scale: 0.9 }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            id="mobile-nav"
            className="md:hidden border-t border-black/5 dark:border-white/5 overflow-hidden bg-background/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-4 py-4 space-y-1"
            >
              {navLinks.map((link, i) => (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      location === link.href
                        ? "text-foreground bg-black/5 dark:bg-white/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/edit-pdf">
                  <Button size="sm" className="w-full mt-3 btn-glow gap-1.5" onClick={() => setMobileOpen(false)}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Get Started Free
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
