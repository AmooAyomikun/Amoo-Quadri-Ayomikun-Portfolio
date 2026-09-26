import React from 'react';

const techRow1 = [
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
  { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
  { name: 'React', slug: 'react', color: '#61DAFB' },
  { name: 'Next.js', slug: 'nextdotjs', color: '#000000' },
  { name: 'Node.js', slug: 'nodedotjs', color: '#339933' },
  { name: 'Firebase', slug: 'firebase', color: '#FFCA28' },
  { name: 'TensorFlow', slug: 'tensorflow', color: '#FF6F00' },
];

const techRow2 = [
  { name: 'PyTorch', slug: 'pytorch', color: '#EE4C2C' },
  { name: 'Scikit-Learn', slug: 'scikitlearn', color: '#F7931E' },
  { name: 'Pandas', slug: 'pandas', color: '#150458' },
  { name: 'NumPy', slug: 'numpy', color: '#013243' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1' },
  { name: 'MySQL', slug: 'mysql', color: '#4479A1' },
  { name: 'Figma', slug: 'figma', color: '#F24E1E' },
];

const getMarqueeItems = (row: typeof techRow1) => [...row, ...row, ...row, ...row];

export const TechStackSection: React.FC = () => {
  return (
    <section className="py-16 bg-[var(--color-surface-base)] relative overflow-hidden border-t border-[var(--color-border)]">
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
              <img src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color.replace('#', '')}`} alt={tech.name} className="w-5 h-5" />
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
              <img src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color.replace('#', '')}`} alt={tech.name} className="w-5 h-5" />
              <span className="text-[var(--color-text-main)] font-medium text-sm">{tech.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
