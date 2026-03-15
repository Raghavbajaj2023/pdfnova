import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, FileQuestion, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/animated-background";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background noise-bg transition-colors duration-500">
      <AnimatedBackground />
      <Navbar />
      <div className="relative pt-32 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-md mx-auto px-4"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 border border-violet-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <FileQuestion className="w-10 h-10 text-violet-500 dark:text-violet-400" />
          </motion.div>
          <h1 className="text-6xl font-bold text-foreground mb-3 tracking-tight">404</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button data-testid="button-go-home" className="btn-glow gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="secondary" data-testid="button-browse-tools" className="border border-black/10 dark:border-white/10 gap-2">
                <Sparkles className="w-4 h-4" />
                Browse Tools
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
