import { Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookCard({ book, onAddToCart, onViewDetails, compact = false }) {
  const rating = book.rating || 4.5;

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex gap-3 p-3 bg-card rounded-lg border border-border cursor-pointer group"
        onClick={() => onViewDetails?.(book)}
      >
        <div className="w-16 h-22 flex-shrink-0 rounded-md overflow-hidden bg-accent">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-20 flex items-center justify-center text-xs font-display text-muted-foreground">
              📖
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-body font-semibold text-sm truncate">{book.title}</h4>
          <p className="text-xs text-muted-foreground">{book.author}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-primary">R$ {book.price?.toFixed(2)}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(book); }}
              className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group cursor-pointer"
      onClick={() => onViewDetails?.(book)}
    >
      <div className="relative rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[3/4] bg-accent overflow-hidden">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
          {book.featured && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-body font-semibold uppercase tracking-wider">
              Destaque
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-display font-semibold text-sm leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-body">{book.author}</p>
          <div className="flex items-center gap-1 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
              />
            ))}
            <span className="text-[10px] text-muted-foreground ml-0.5">{rating}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-body font-bold text-primary">R$ {book.price?.toFixed(2)}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(book); }}
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}