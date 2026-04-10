import { Star, ShoppingCart, X, BookOpen, User } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function BookDetailModal({ book, open, onClose, onAddToCart }) {
  if (!book) return null;

  const rating = book.rating || 4.5;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-border">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative h-64 bg-accent overflow-hidden">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">📚</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
        </div>

        <div className="px-5 pb-5 -mt-6 relative">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-body font-medium mb-2">
            {book.category}
          </span>
          <h2 className="font-display text-xl font-bold leading-tight">{book.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-body">{book.author}</span>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">{rating}</span>
            </div>
            {book.pages && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{book.pages} páginas</span>
              </div>
            )}
          </div>

          {book.description && (
            <p className="mt-3 text-sm text-muted-foreground font-body leading-relaxed line-clamp-4">
              {book.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-5">
            <div>
              <p className="text-xs text-muted-foreground font-body">Preço</p>
              <p className="text-2xl font-display font-bold text-primary">R$ {book.price?.toFixed(2)}</p>
            </div>
            <Button
              onClick={() => onAddToCart?.(book)}
              className="rounded-full px-6 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-body"
            >
              <ShoppingCart className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}