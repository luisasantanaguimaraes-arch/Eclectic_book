import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookDetailModal from '../components/BookDetailModal';
import CategoryBadge from '../components/CategoryBadge';
import SearchInput from '../components/SearchInput';
import { toast } from 'sonner';

const categories = ['Ficção', 'Romance', 'Suspense', 'Fantasia', 'Autoajuda', 'Biografia', 'Ciência', 'História', 'Poesia', 'Infantil'];

export default function SearchPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const data = await base44.entities.Book.list('-created_date', 100);
    setBooks(data);
    setLoading(false);
  };

  const addToCart = async (book) => {
    const existing = await base44.entities.CartItem.filter({ book_id: book.id });
    if (existing.length > 0) {
      await base44.entities.CartItem.update(existing[0].id, { quantity: (existing[0].quantity || 1) + 1 });
    } else {
      await base44.entities.CartItem.create({
        book_id: book.id,
        book_title: book.title,
        book_author: book.author,
        book_cover: book.cover_url,
        book_price: book.price,
        quantity: 1,
      });
    }
    toast.success('Adicionado ao carrinho!');
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = !search || 
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || book.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const booksByCategory = {};
  if (!search && !activeCategory) {
    categories.forEach(cat => {
      const catBooks = books.filter(b => b.category === cat);
      if (catBooks.length > 0) booksByCategory[cat] = catBooks;
    });
  }

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">Explorar</h1>
          <div className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por título ou autor..." />
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          <CategoryBadge
            category="Todos"
            isActive={!activeCategory}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map(cat => (
            <CategoryBadge
              key={cat}
              category={cat}
              isActive={activeCategory === cat}
              onClick={(c) => setActiveCategory(activeCategory === c ? null : c)}
            />
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[3/5]" />
            ))}
          </div>
        ) : search || activeCategory ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${search}-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-muted-foreground mb-3 font-body">
                {filteredBooks.length} livro{filteredBooks.length !== 1 ? 's' : ''} encontrado{filteredBooks.length !== 1 ? 's' : ''}
              </p>
              {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum resultado encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredBooks.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onAddToCart={addToCart}
                      onViewDetails={(b) => { setSelectedBook(b); setShowDetail(true); }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          // Browse by category
          Object.entries(booksByCategory).map(([cat, catBooks]) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-base">{cat}</h3>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className="text-xs text-primary font-body font-medium"
                >
                  Ver todos →
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                {catBooks.slice(0, 6).map(book => (
                  <div key={book.id} className="w-36 flex-shrink-0">
                    <BookCard
                      book={book}
                      onAddToCart={addToCart}
                      onViewDetails={(b) => { setSelectedBook(b); setShowDetail(true); }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BookDetailModal
        book={selectedBook}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onAddToCart={(b) => { addToCart(b); setShowDetail(false); }}
      />
    </div>
  );
}