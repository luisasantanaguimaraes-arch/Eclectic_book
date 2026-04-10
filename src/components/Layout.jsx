import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { base44 } from '@/api/base44Client';

export default function Layout() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCartCount();
    const unsubscribe = base44.entities.CartItem.subscribe(() => {
      loadCartCount();
    });
    return unsubscribe;
  }, []);

  const loadCartCount = async () => {
    const items = await base44.entities.CartItem.list();
    setCartCount(items.length);
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-lg mx-auto pb-20">
        <Outlet />
      </div>
      <BottomNav cartCount={cartCount} />
    </div>
  );
}