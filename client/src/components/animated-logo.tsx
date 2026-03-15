import { motion } from "framer-motion";

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const fillVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.2, duration: 0.5 } },
};

export function AnimatedLogo({ size = 60, className }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial="hidden"
      animate="visible"
    >
      <motion.rect
        x="4"
        y="2"
        width="38"
        height="50"
        rx="4"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        fill="none"
        variants={pathVariants}
      />

      <motion.path
        d="M30 2 L42 14 L30 14 Z"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        fill="none"
        variants={pathVariants}
      />

      <motion.line x1="12" y1="22" x2="34" y2="22" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" variants={pathVariants} />
      <motion.line x1="12" y1="28" x2="30" y2="28" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" variants={pathVariants} />
      <motion.line x1="12" y1="34" x2="26" y2="34" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" variants={pathVariants} />
      <motion.line x1="12" y1="40" x2="32" y2="40" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" variants={pathVariants} />

      <motion.circle
        cx="42"
        cy="38"
        r="14"
        stroke="url(#logo-gradient-2)"
        strokeWidth="2.5"
        fill="none"
        variants={pathVariants}
      />

      <motion.text
        x="42"
        y="43"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="url(#logo-gradient-2)"
        variants={fillVariants}
      >
        N
      </motion.text>

      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="46" y2="52">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logo-gradient-2" x1="28" y1="24" x2="56" y2="52">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
