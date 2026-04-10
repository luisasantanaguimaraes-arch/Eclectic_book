import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, QrCode, FileText, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentMethodCard from '../components/PaymentMethodCard';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadCart();
    const unsubscribe = base44.entities.CartItem.subscribe(() => loadCart());
    return unsubscribe;
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const data = await base44.entities.CartItem.list('-created_date');
    setItems(data);
    setLoading(false);
  };

  const updateQuantity = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty <= 0) {
      await base44.entities.CartItem.delete(item.id);
      toast.success('Item removido');
    } else {
      await base44.entities.CartItem.update(item.id, { quantity: newQty });
    }
  };

  const removeItem = async (item) => {
    await base44.entities.CartItem.delete(item.id);
    toast.success('Item removido');
  };

  const subtotal = items.reduce((acc, item) => acc + (item.book_price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 100 ? 0 : 12.90;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }
    setProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    // Clear cart after payment
    for (const item of items) {
      await base44.entities.CartItem.delete(item.id);
    }
    setProcessing(false);
    setShowPayment(false);
    toast.success('Pedido realizado com sucesso! 🎉');
  };

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <h1 className="font-display text-2xl font-bold mb-4">Carrinho</h1>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-5">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">Carrinho</h1>
          {items.length > 0 && (
            <span className="ml-auto px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-body font-semibold">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold mb-1">Carrinho vazio</h3>
          <p className="text-sm text-muted-foreground font-body mb-6">Adicione livros para começar</p>
          <Link to="/search">
            <Button className="rounded-full px-6 bg-primary text-primary-foreground font-body">
              Explorar livros
            </Button>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="flex gap-3 p-3 bg-card rounded-xl border border-border"
                >
                  <div className="w-16 h-20 rounded-lg bg-accent overflow-hidden flex-shrink-0">
                    {item.book_cover ? (
                      <img src={item.book_cover} alt={item.book_title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📖</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body font-semibold text-sm truncate">{item.book_title}</h4>
                    <p className="text-xs text-muted-foreground">{item.book_author}</p>
                    <p className="text-sm font-bold text-primary mt-1">R$ {item.book_price?.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item, -1)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item, 1)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item)}
                        className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-card rounded-xl border border-border"
          >
            <h3 className="font-display font-semibold text-sm mb-3">Resumo do pedido</h3>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal < 100 && (
                <p className="text-[11px] text-muted-foreground">
                  Frete grátis em compras acima de R$ 100,00
                </p>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary font-display">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          {!showPayment ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <Button
                onClick={() => setShowPayment(true)}
                className="w-full rounded-xl py-6 bg-primary text-primary-foreground font-body font-semibold text-sm gap-2"
              >
                Ir para pagamento
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5"
            >
              <h3 className="font-display font-semibold text-base mb-3">Método de pagamento</h3>
              <div className="space-y-2.5">
                <PaymentMethodCard
                  icon={<CreditCard className="w-5 h-5 text-primary" />}
                  label="Cartão de Crédito"
                  description="Visa, Master, Elo — até 12x sem juros"
                  isSelected={paymentMethod === 'credit'}
                  onClick={() => setPaymentMethod('credit')}
                />
                <PaymentMethodCard
                  icon={<QrCode className="w-5 h-5 text-primary" />}
                  label="PIX"
                  description="Pagamento instantâneo — 5% de desconto"
                  isSelected={paymentMethod === 'pix'}
                  onClick={() => setPaymentMethod('pix')}
                />
                <PaymentMethodCard
                  icon={<FileText className="w-5 h-5 text-primary" />}
                  label="Boleto Bancário"
                  description="Vencimento em 3 dias úteis"
                  isSelected={paymentMethod === 'boleto'}
                  onClick={() => setPaymentMethod('boleto')}
                />
              </div>

              {paymentMethod === 'pix' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-secondary/50 rounded-xl text-center"
                >
                  <p className="text-xs text-muted-foreground font-body mb-1">Total com desconto PIX:</p>
                  <p className="text-xl font-display font-bold text-primary">
                    R$ {(total * 0.95).toFixed(2)}
                  </p>
                </motion.div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={!paymentMethod || processing}
                className="w-full rounded-xl py-6 mt-4 bg-primary text-primary-foreground font-body font-semibold text-sm gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Finalizar compra
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}