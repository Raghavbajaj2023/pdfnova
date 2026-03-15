import { motion } from "framer-motion";
import { ShieldCheck, Lock, Zap, Globe, Award, Heart } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "100% Secure", sublabel: "No Data Collection", color: "#22c55e" },
  { icon: Lock, label: "End-to-End", sublabel: "Privacy Protected", color: "#8b5cf6" },
  { icon: Zap, label: "< 3 Seconds", sublabel: "Average Processing", color: "#f59e0b" },
  { icon: Globe, label: "Works Offline", sublabel: "No Internet Needed", color: "#06b6d4" },
  { icon: Award, label: "Enterprise Grade", sublabel: "Professional Tools", color: "#ec4899" },
  { icon: Heart, label: "Free Forever", sublabel: "No Hidden Costs", color: "#ef4444" },
];

export function TrustBadges() {
  return (
    <section className="py-16 relative" data-testid="section-trust-badges">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trusted by 150,000+ professionals worldwide</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.05 }}
              className="text-center p-4 rounded-xl group cursor-default"
              data-testid={`badge-${badge.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 transition-all duration-300"
                style={{ background: `${badge.color}12` }}
              >
                <badge.icon className="w-5 h-5 transition-colors duration-300" style={{ color: badge.color }} />
              </motion.div>
              <div className="text-xs font-semibold text-foreground mb-0.5">{badge.label}</div>
              <div className="text-[10px] text-muted-foreground">{badge.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
