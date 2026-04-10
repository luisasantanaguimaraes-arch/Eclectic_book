import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { User, Mail, Shield, BookOpen, ShoppingBag, Heart, ChevronRight, LogOut, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [me, cart, books] = await Promise.all([
      base44.auth.me(),
      base44.entities.CartItem.list(),
      base44.entities.Book.list(),
    ]);
    setUser(me);
    setCartCount(cart.length);
    setBookCount(books.length);
    setLoading(false);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <div className="flex flex-col items-center py-8">
          <div className="w-20 h-20 rounded-full bg-muted animate-pulse mb-4" />
          <div className="w-32 h-4 bg-muted animate-pulse rounded mb-2" />
          <div className="w-48 h-3 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const menuItems = [
    { icon: ShoppingBag, label: 'Meus Pedidos', value: `${cartCount} no carrinho`, href: '/cart' },
    { icon: Heart, label: 'Favoritos', value: 'Em breve' },
    { icon: Bell, label: 'Notificações', value: 'Ativado' },
    { icon: Settings, label: 'Configurações', value: '' },
  ];

  return (
    <div className="px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Meu Perfil</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-5 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-display font-bold text-primary">{initials}</span>
        </div>
        <h2 className="font-display text-lg font-bold">{user?.full_name || 'Usuário'}</h2>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-body">{user?.email}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <Shield className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-body capitalize">
            {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-3 mt-4"
      >
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <BookOpen className="w-5 h-5 text-primary mx-auto mb-1.5" />
          <p className="text-2xl font-display font-bold">{bookCount}</p>
          <p className="text-xs text-muted-foreground font-body">Livros disponíveis</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <ShoppingBag className="w-5 h-5 text-primary mx-auto mb-1.5" />
          <p className="text-2xl font-display font-bold">{cartCount}</p>
          <p className="text-xs text-muted-foreground font-body">No carrinho</p>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 bg-card rounded-xl border border-border divide-y divide-border overflow-hidden"
      >
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const Wrapper = item.href ? 'a' : 'button';
          return (
            <Wrapper
              key={i}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium">{item.label}</p>
                {item.value && (
                  <p className="text-xs text-muted-foreground font-body">{item.value}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </Wrapper>
          );
        })}
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-4"
      >
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full rounded-xl py-5 border-destructive/20 text-destructive hover:bg-destructive/5 font-body gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </Button>
      </motion.div>

      <p className="text-center text-[11px] text-muted-foreground font-body mt-6 mb-4">
        Eclectic_book v1.0 • Feito com ❤️
      </p>
    </div>
  );
}