import { motion } from 'framer-motion';

const categoryIcons = {
  'Ficção': '🌌',
  'Romance': '💕',
  'Suspense': '🔍',
  'Fantasia': '🐉',
  'Autoajuda': '🧠',
  'Biografia': '👤',
  'Ciência': '🔬',
  'História': '📜',
  'Poesia': '✒️',
  'Infantil': '🧸',
};

export default function CategoryBadge({ category, isActive, onClick, large = false }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick?.(category)}
      className={`
        flex items-center gap-2 whitespace-nowrap rounded-full border transition-all duration-200 font-body
        ${large ? 'px-5 py-3 text-sm' : 'px-3.5 py-2 text-xs'}
        ${isActive
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-accent'
        }
      `}
    >
      <span className={large ? 'text-lg' : 'text-sm'}>{categoryIcons[category] || '📖'}</span>
      <span className="font-medium">{category}</span>
    </motion.button>
  );
}