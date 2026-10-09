import React from 'react';

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
    <section className="pt-16 pb-4 md:pb-8 bg-[var(--color-surface-base)] relative overflow-hidden border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="mb-2">
          <h2 className="text-3xl font-serif font-bold text-[var(--color-text-main)] tracking-tight">Core Technologies</h2>
        </div>
      </div>

      <div className="relative w-full flex flex-col gap-4 overflow-hidden group">
        {/* Left/Right Fade Gradients for a seamless effect */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[var(--color-surface-base)] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[var(--color-surface-base)] to-transparent z-10 pointer-events-none" />

        {/* Row 1 */}
        <div className="flex animate-marquee space-x-4 whitespace-nowrap w-max">
          {getMarqueeItems(techRow1).map((tech, idx) => (
            <div
              key={`r1-${idx}`}
              className="flex items-center gap-2.5 px-6 py-3 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-full shadow-sm hover:border-[var(--color-border-hover)] transition-colors cursor-default"
            >
              <img src={tech.iconUrl} alt={tech.name} className="w-5 h-5" style={{ filter: tech.name === 'Next.js' ? 'invert(1)' : 'none' }} />
              <span className="text-[var(--color-text-main)] font-medium text-sm">{tech.name}</span>
            </div>
          ))}
        </div>

        {/* Row 2 (Delayed/Reversed direction or offset) */}
        <div className="flex animate-marquee space-x-4 whitespace-nowrap w-max" style={{ animationDirection: 'reverse' }}>
          {getMarqueeItems(techRow2).map((tech, idx) => (
            <div
              key={`r2-${idx}`}
              className="flex items-center gap-2.5 px-6 py-3 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-full shadow-sm hover:border-[var(--color-border-hover)] transition-colors cursor-default"
            >
              <img src={tech.iconUrl} alt={tech.name} className="w-5 h-5" />
              <span className="text-[var(--color-text-main)] font-medium text-sm">{tech.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
