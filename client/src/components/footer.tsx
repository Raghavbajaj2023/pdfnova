import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { FileText, Github, Twitter, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const footerLinks = [
  {
    title: "Tools",
    links: [
      { label: "Edit PDF", href: "/edit-pdf" },
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Split PDF", href: "/split-pdf" },
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "All Tools", href: "/tools" },
    ],
  },
  {
    title: "Convert",
    links: [
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "JPG to PDF", href: "/jpg-to-pdf" },
      { label: "PDF to PNG", href: "/pdf-to-png" },
      { label: "PNG to PDF", href: "/png-to-pdf" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "All Tools", href: "/tools" },
    ],
  },
];

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative border-t border-black/5 dark:border-white/5">
      <motion.div
        animate={isInView ? { x: ["-100%", "100%"] } : {}}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-2 md:col-span-1"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2.5 mb-4"
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20"
              >
                <FileText className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                PDF<span className="text-violet-500 dark:text-violet-400">NOVA</span>
              </span>
            </motion.div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
              The most powerful free PDF platform. Edit, convert, and manage PDFs entirely in your browser.
            </p>
            <div className="flex items-center gap-3">
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 flex items-center justify-center hover:border-primary/20 transition-colors"
              >
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 flex items-center justify-center hover:border-primary/20 transition-colors"
              >
                <Github className="w-4 h-4 text-muted-foreground" />
              </motion.a>
            </div>
          </motion.div>
          {footerLinks.map((section, sectionIdx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + sectionIdx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + sectionIdx * 0.1 + linkIdx * 0.05 }}
                  >
                    <Link href={link.href}>
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="group text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PDFNOVA. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            All files are processed locally in your browser. We never upload your documents.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
