import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { CartItem, formatPrice } from "../data/products";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (productId: string, size: string | undefined, delta: number) => void;
  removeItem: (productId: string, size?: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeItem,
}: CartDrawerProps) {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const phoneNumber = "5521981676041";
    const cartDetails = cartItems
      .map(
        (item) =>
          `- ${item.quantity}x ${item.product.name}${
            item.size ? ` (Tamanho: ${item.size})` : ""
          } (R$ ${item.product.price.toFixed(2)} cada)`
      )
      .join("\n");
    const subtotalText = `Subtotal: R$ ${cartSubtotal.toFixed(2)}`;
    const message = `Olá Seu Marquinho! Gostaria de finalizar minha compra:\n\n${cartDetails}\n\n${subtotalText}\n\nForma de pagamento: Combinado via Whatsapp`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Slide drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[450px] bg-[#0A0A0A]/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-street-white" />
                <span className="font-display font-black uppercase tracking-widest text-sm text-street-white">
                  Carrinho ({cartCount})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:text-[#FF6B1A] text-white/50 cursor-pointer transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/50 space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="font-sans text-sm uppercase tracking-widest font-bold">
                    Seu carrinho está vazio
                  </p>
                  <button
                    onClick={onClose}
                    className="text-[#FF6B1A] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border-b border-[#FF6B1A] hover:border-white pb-1"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size || "none"}`}
                    className="flex gap-4 items-center bg-white/5 p-3 border border-white/5"
                  >
                    <div className="w-20 h-24 bg-[#050505] relative flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/produto/${item.product.id}`} onClick={onClose}>
                          <h4 className="font-display text-xs font-bold text-white uppercase line-clamp-1 hover:text-[#FF6B1A] transition-colors">
                            {item.product.name}
                          </h4>
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="text-white/40 hover:text-[#d30017] transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-white/60 font-sans text-[10px] uppercase tracking-wider mb-2">
                        R$ {formatPrice(item.product.price)}
                        {item.size && ` | TAM: ${item.size}`}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-white/20 bg-black/40">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, -1)
                            }
                            className="p-1.5 text-white/70 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, 1)
                            }
                            className="p-1.5 text-white/70 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-display text-sm font-black text-white">
                          R$ {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/60 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-sm font-bold text-white/70 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="font-display text-xl font-black text-white">
                    R$ {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-white hover:bg-[#FF6B1A] text-black hover:text-white py-4 flex items-center justify-center font-display font-black text-sm uppercase tracking-widest transition-colors duration-300 group"
                >
                  Checkout via WhatsApp
                </button>
                <p className="text-center text-white/40 text-[10px] mt-4 uppercase tracking-widest font-sans">
                  Taxas e frete calculados no atendimento
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
