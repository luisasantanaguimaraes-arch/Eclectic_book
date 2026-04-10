import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookDetailModal from '../components/BookDetailModal';
import CategoryBadge from '../components/CategoryBadge';
import SearchInput from '../components/SearchInput';
import { toast } from 'sonner';

const categories = ['Ficção', 'Romance', 'Suspense', 'Fantasia', 'Autoajuda', 'Biografia', 'Ciência', 'História', 'Poesia', 'Infantil'];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const data = await base44.entities.Book.list('-created_date', 50);
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

  const featuredBooks = books.filter(b => b.featured);
  const recentBooks = books.slice(0, 10);
  const filteredBooks = search
    ? books.filter(b =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5"
      >
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl font-bold">Eclectic<span className="text-primary">_book</span></h1>
          </div>
          <p className="text-sm text-muted-foreground font-body mt-0.5">Descubra sua próxima leitura</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SearchInput value={search} onChange={setSearch} />
      </motion.div>

      {/* Search Results */}
      {search && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
          <h3 className="font-display font-semibold text-base mb-3">Resultados para "{search}"</h3>
          {filteredBooks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum livro encontrado</p>
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
      )}

      {!search && (
        <>
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-base">Categorias</h2>
              <a href="/search" className="text-xs text-primary font-body font-medium flex items-center gap-0.5">
                Ver todas <ChevronRight className="w-3 h-3" />
              </a>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              {categories.slice(0, 6).map(cat => (
                <CategoryBadge key={cat} category={cat} />
              ))}
            </div>
          </motion.div>

          {/* Featured */}
          {featuredBooks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Destaques
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                {featuredBooks.map(book => (
                  <div key={book.id} className="w-40 flex-shrink-0">
                    <BookCard
                      book={book}
                      onAddToCart={addToCart}
                      onViewDetails={(b) => { setSelectedBook(b); setShowDetail(true); }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Books */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6"
          >
            <h2 className="font-display font-semibold text-base mb-3">Catálogo</h2>
            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[3/5]" />
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-body">Nenhum livro cadastrado ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {recentBooks.map(book => (
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
        </>
      )}

      <BookDetailModal
        book={selectedBook}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onAddToCart={(b) => { addToCart(b); setShowDetail(false); }}
      />
    </div>
  );
}