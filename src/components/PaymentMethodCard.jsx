import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function PaymentMethodCard({ icon, label, description, isSelected, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all duration-200 text-left
        ${isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-primary/30'
        }
      `}
    >
      <div className={`
        w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0
        ${isSelected ? 'bg-primary/10' : 'bg-muted'}
      `}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground font-body mt-0.5">{description}</p>
      </div>
      <div className={`
        w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
        ${isSelected ? 'border-primary bg-primary' : 'border-border'}
      `}>
        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
    </motion.button>
  );
}