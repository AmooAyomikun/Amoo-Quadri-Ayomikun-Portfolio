import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedWords } from '../components/AnimatedWords';

const techRow1 = [
  { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'React', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Next.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
  { name: 'Node.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'Firebase', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg' },
  { name: 'TensorFlow', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg' },
];

const techRow2 = [
  { name: 'PyTorch', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg' },
  { name: 'Scikit-Learn', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg' },
  { name: 'Pandas', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg' },
  { name: 'NumPy', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg' },
  { name: 'PostgreSQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'MySQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  { name: 'Figma', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
];

const getMarqueeItems = (row: typeof techRow1) => [...row, ...row, ...row, ...row];

export const TechStackSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-16 bg-[var(--color-surface-base)] relative overflow-hidden transition-colors duration-200">
      {/* Contained border that does not clash with the sidebars */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 mb-8">
        <div className="border-t border-[var(--color-border)] pt-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold">
              // TECH ECOSYSTEM
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text-main)] tracking-tight mt-0.5">
              <AnimatedWords text="Core Technologies" />
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--color-text-muted)] hidden sm:inline-block">
            Hover to inspect
          </span>
        </div>
      </div>

      {/* Marquee constrained within content container to stay inside the borders and clear sidebars */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="relative w-full flex flex-col gap-2 overflow-hidden group py-2"
        >
          {/* Left/Right Fade Gradients contained cleanly within the section */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[var(--color-surface-base)] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[var(--color-surface-base)] to-transparent z-10 pointer-events-none" />

          {/* Row 1 - with vertical padding (py-3) so hover scale never clips the top border */}
          <div className="flex animate-marquee space-x-4 whitespace-nowrap w-max py-3 group-hover:[animation-play-state:paused]">
            {getMarqueeItems(techRow1).map((tech, idx) => (
              <motion.div
                whileHover={{ scale: 1.06, y: -2 }}
                key={`r1-${idx}`}
                className="flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-full shadow-xs hover:border-[var(--color-primary)] hover:shadow-md transition-all cursor-default"
              >
                <img 
                  src={tech.iconUrl} 
                  alt={tech.name} 
                  className="w-5 h-5 shrink-0" 
                  style={{ filter: tech.name === 'Next.js' ? 'var(--nextjs-filter, none)' : 'none' }} 
                />
                <span className="text-[var(--color-text-main)] font-medium text-xs sm:text-sm">{tech.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Row 2 (Reversed direction) - with py-3 padding so hover scale never clips */}
          <div 
            className="flex animate-marquee space-x-4 whitespace-nowrap w-max py-3 group-hover:[animation-play-state:paused]" 
            style={{ animationDirection: 'reverse' }}
          >
            {getMarqueeItems(techRow2).map((tech, idx) => (
              <motion.div
                whileHover={{ scale: 1.06, y: -2 }}
                key={`r2-${idx}`}
                className="flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-full shadow-xs hover:border-[var(--color-primary)] hover:shadow-md transition-all cursor-default"
              >
                <img src={tech.iconUrl} alt={tech.name} className="w-5 h-5 shrink-0" />
                <span className="text-[var(--color-text-main)] font-medium text-xs sm:text-sm">{tech.name}</span>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};
