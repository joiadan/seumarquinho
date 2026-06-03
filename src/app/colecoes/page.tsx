"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy
} from "lucide-react";
import { PRODUCTS, formatPrice } from "../data/products";
import type { Product, CartItem } from "../data/products";

// Cart types

export default function ColecoesPage() {
  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"todos" | "bones" | "camisas">("todos");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [addedPopup, setAddedPopup] = useState<string | null>(null);

  // Load cart from localStorage once on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("seu-marquinho-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsCartLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem("seu-marquinho-cart", JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.esgotado) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setAddedPopup(product.name);
    setTimeout(() => setAddedPopup(null), 2500);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string | undefined, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // WhatsApp Checkout
  const handleWhatsAppCheckout = () => {
    const phoneNumber = "5521981676041";
    const cartDetails = cart
      .map(
        (item) =>
          `- ${item.quantity}x ${item.product.name}${item.size ? ` (Tamanho: ${item.size})` : ""} (R$ ${item.product.price.toFixed(2)} cada)`
      )
      .join("\n");
    const subtotalText = `Subtotal: R$ ${cartSubtotal.toFixed(2)}`;
    const message = `Olá Seu Marquinho! Gostaria de fazer o seguinte pedido de Coleções:\n\n${cartDetails}\n\n${subtotalText}\n\nForma de pagamento: Combinado via Whatsapp`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  // Search filter
  const filteredSearchProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Category filter
  const displayedProducts = PRODUCTS.filter((p) => {
    if (selectedCategory === "todos") return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="relative min-h-screen bg-white text-[#1a1a1a] font-sans overflow-x-hidden selection:bg-[#ffdb58] selection:text-black">
      {/* ── WHITE THEMED HEADER ── */}
      <header className="fixed top-0 left-0 right-0 w-full z-45 bg-white/80 backdrop-blur-md border-b border-[#e5e5e5] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <div className="relative w-9 h-9 md:w-11 md:h-11 flex-shrink-0">
              <Image
                src="/PRODUTOS E LOGO/logo_preta.png"
                alt="Seu Marquinho Logo"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
            <span className="font-display font-extrabold text-lg md:text-2xl tracking-tighter text-[#1a1a1a] hover:text-[#c9a830] transition-colors uppercase">
              Seu Marquinho
            </span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link
              href="/#catalogo"
              className="text-xs tracking-widest font-bold uppercase transition-colors py-1 border-b-2 text-[#666] hover:text-black border-transparent"
            >
              Drops
            </Link>
            <Link
              href="/colecoes"
              className="text-xs tracking-widest font-bold uppercase transition-colors py-1 border-b-2 text-black border-[#ffdb58]"
            >
              Coleções
            </Link>
            <Link
              href="/blog"
              className="text-xs tracking-widest font-bold uppercase transition-colors py-1 border-b-2 text-[#666] hover:text-black border-transparent"
            >
              Blog
            </Link>
            <Link
              href="/blog#origem"
              className="text-xs tracking-widest font-bold uppercase transition-colors py-1 border-b-2 text-[#666] hover:text-black border-transparent"
            >
              História
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:scale-110 transition-all duration-300 active:scale-95 text-[#1a1a1a] cursor-pointer p-2.5"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:scale-110 transition-all duration-300 active:scale-95 text-[#1a1a1a] relative cursor-pointer p-2.5"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#d30017] text-[#ffe2de] text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-[#1a1a1a] hover:text-[#c9a830] cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-[#e5e5e5] px-6 py-6 flex flex-col gap-5 md:hidden"
          >
            <Link href="/#catalogo" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-100 text-[#1a1a1a] hover:text-[#c9a830]">Drops</Link>
            <Link href="/colecoes" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-100 text-[#c9a830] font-extrabold">Coleções</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-100 text-[#1a1a1a] hover:text-[#c9a830]">Blog</Link>
            <Link href="/blog#origem" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-100 text-[#1a1a1a] hover:text-[#c9a830]">História</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VERTICAL BRAND SIDEBAR (Glued to the absolute left of the screen) ── */}
      <div className="absolute left-0 top-0 bottom-0 w-[40px] lg:w-[80px] bg-[#fafafa]/40 border-r border-[#e5e5e5] flex flex-col items-center justify-between py-24 lg:py-28 z-10">
        {/* Gold vertical line gradient accent */}
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ffdb58]/10 via-[#ffdb58] to-[#ffdb58]/10" />

        {/* Top — Monogram */}
        <div className="flex flex-col items-center gap-1 lg:gap-2">
          <Image
            src="/PRODUTOS E LOGO/logo_monograma_ouro.png"
            alt="SM Monograma"
            width={32}
            height={32}
            className="w-5 h-5 lg:w-8 lg:h-8 object-contain hover:scale-110 transition-transform duration-300"
          />
          <span className="text-[7px] lg:text-[9px] font-display font-extrabold tracking-widest text-[#1a1a1a]">SM</span>
        </div>

        {/* Middle — Natural Vertical Skyline Art (Rotated 270 degrees - Inverted) */}
        <div className="my-6 flex items-center justify-center px-1 lg:px-2">
          <Image
            src="/PRODUTOS E LOGO/skyline_rio_vertical_270.png"
            alt="Rio Skyline Invertido"
            width={64}
            height={189}
            className="w-8 lg:w-16 h-auto object-contain opacity-85 hover:opacity-100 transition-opacity duration-300 select-none pointer-events-none"
          />
        </div>

        {/* Bottom — Vertical Text */}
        <div className="flex flex-col items-center gap-2 lg:gap-4">
          <p className="hidden lg:block text-[#1a1a1a]/30 font-display text-[7px] font-bold tracking-[0.25em] uppercase">
            EST. 2026
          </p>
          <p className="text-[#1a1a1a]/85 font-display text-[7px] lg:text-[9px] font-extrabold tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            SEU MARQUINHO
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA (Offset by sidebar width) ── */}
      <main className="pt-16 md:pt-20 pl-[40px] lg:pl-[80px]">
        {/* Breadcrumb row */}
        <div className="border-b border-[#e5e5e5] bg-[#fafafa]">
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-3">
            <nav className="flex items-center gap-2 text-xs font-sans">
              <Link href="/" className="text-[#999] hover:text-[#1a1a1a] transition-colors flex items-center gap-1.5">
                <div className="relative w-4 h-4 flex-shrink-0">
                  <Image src="/PRODUTOS E LOGO/logo_preta.png" alt="SM" fill sizes="16px" className="object-contain opacity-50" />
                </div>
                Início
              </Link>
              <ChevronRight className="w-3 h-3 text-[#ddd]" />
              <span className="text-[#1a1a1a] font-semibold">Coleções</span>
            </nav>
          </div>
        </div>

        {/* Catalog Body */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <p className="text-[#c9a830] font-sans text-xs font-bold tracking-widest uppercase mb-2">CATÁLOGO COMPLETO</p>
                <h1 className="font-display text-2xl md:text-4xl font-extrabold text-[#1a1a1a] uppercase">Coleções</h1>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex gap-4 md:gap-6 border-b border-[#e5e5e5] pb-2">
                {[
                  { label: "Todos", value: "todos" },
                  { label: "Bonés", value: "bones" },
                  { label: "Camisetas", value: "camisas" }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedCategory(tab.value as any)}
                    className={`font-sans text-xs uppercase tracking-widest pb-1 transition-all cursor-pointer relative font-bold ${
                      selectedCategory === tab.value
                        ? "text-[#c9a830]"
                        : "text-[#888] hover:text-[#1a1a1a]"
                    }`}
                  >
                    {tab.label}
                    {selectedCategory === tab.value && (
                      <motion.div
                        layoutId="activeCategoryIndicatorColecoes"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c9a830]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid (2 columns on mobile, 3 on tablet, 4 on desktop) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {displayedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group flex flex-col justify-between border border-[#e5e5e5] bg-white p-3 md:p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300"
                >
                  <Link href={`/produto/${product.id}`} className="flex flex-col flex-1">
                    {/* Image Frame */}
                    <div className="aspect-[3/4] mb-4 overflow-hidden bg-[#f5f5f5] flex items-center justify-center relative border border-[#e5e5e5] p-4 transition-colors duration-500 hover:bg-[#eaeaea]">
                      <div className="relative w-full h-full">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 250px"
                          className="object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Status / Badge Tags */}
                      {product.esgotado ? (
                        <span className="absolute top-2 left-2 bg-[#333333] text-white px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider">
                          Esgotado
                        </span>
                      ) : product.badge ? (
                        <span className={`absolute top-2 left-2 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider ${
                          product.badge === "LIMITED" ? "bg-[#d30017] text-white" : "bg-[#ffdb58] text-black"
                        }`}>
                          {product.badge}
                        </span>
                      ) : null}
                    </div>

                    {/* Info details */}
                    <div className="mb-3">
                      <h3 className="font-display text-xs md:text-sm font-extrabold text-[#1a1a1a] mb-1 group-hover:text-[#c9a830] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[#888] font-sans text-[9px] md:text-[10px] uppercase tracking-wider">
                        {product.category === "bones" ? "Boné Premium" : "Camiseta Street"}
                      </p>
                    </div>
                  </Link>

                  <div>
                    {/* Price with credit/installments visual info */}
                    <div className="flex flex-col mb-3">
                      <span className="text-base font-extrabold text-[#1a1a1a]">R$ {formatPrice(product.price)}</span>
                      <span className="text-[9px] text-[#888]">3x de R$ {formatPrice(product.price / 3)} sem juros</span>
                    </div>

                    {/* CTA Button */}
                    {product.esgotado ? (
                      <button
                        disabled
                        className="w-full bg-[#eaeaea] text-[#999] py-2 md:py-2.5 font-bold uppercase tracking-widest text-[9px] md:text-xs cursor-not-allowed text-center"
                      >
                        Esgotado
                      </button>
                    ) : (
                      <Link
                        href={`/produto/${product.id}`}
                        className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white py-2 md:py-2.5 font-bold uppercase tracking-widest text-[9px] md:text-xs transition-colors cursor-pointer text-center block"
                      >
                        Comprar
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHITE THEMED FOOTER ── */}
        <footer className="w-full py-12 px-4 md:px-10 bg-[#fafafa] border-t border-[#e5e5e5] mt-12 text-[#1a1a1a]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image
                    src="/PRODUTOS E LOGO/logo_preta.png"
                    alt="Seu Marquinho Logo"
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <span className="font-display font-extrabold text-lg text-[#1a1a1a] tracking-tighter uppercase">
                  Seu Marquinho
                </span>
              </Link>
              <p className="text-[#666] font-sans text-xs leading-relaxed max-w-xs font-light">
                Streetwear premium desenhado para quem dita as regras. Conforto, caimento e atitude nascidos nas ruas do Rio de Janeiro.
              </p>
              <p className="text-[#999] font-sans text-[10px] mt-2">
                © 2026 Seu Marquinho. Todos os direitos reservados.
              </p>
            </div>

            <div className="md:col-span-2 flex flex-col items-center md:items-start gap-3">
              <h5 className="text-[#1a1a1a] font-bold text-xs uppercase tracking-widest">Links</h5>
              <nav className="flex flex-col items-center md:items-start gap-2">
                <Link href="/" className="text-[#666] hover:text-black text-xs transition-colors">Drops Recentes</Link>
                <Link href="/blog" className="text-[#666] hover:text-black text-xs transition-colors">Blog das Ruas</Link>
                <Link href="/blog#origem" className="text-[#666] hover:text-black text-xs transition-colors">Nossa Origem</Link>
              </nav>
            </div>

            <div className="md:col-span-3 flex flex-col items-center md:items-start gap-3">
              <h5 className="text-[#1a1a1a] font-bold text-xs uppercase tracking-widest">Atendimento</h5>
              <div className="flex flex-col items-center md:items-start gap-2 text-xs text-[#666]">
                <a href="mailto:seumarquinho2023@gmail.com" className="hover:text-black transition-colors">seumarquinho2023@gmail.com</a>
                <a href="https://wa.me/5521981676041" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors font-semibold">(21) 98167-6041</a>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col items-center md:items-start gap-3">
              <h5 className="text-[#1a1a1a] font-bold text-xs uppercase tracking-widest">Redes Sociais</h5>
              <div className="flex gap-4">
                <a 
                  href="https://wa.me/5521981676041" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="WhatsApp" 
                  className="text-[#666] hover:text-black transition-all p-2 bg-[#f5f5f5] border border-[#e5e5e5] hover:border-[#ffdb58]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/seu.marquinho/" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Instagram" 
                  className="text-[#666] hover:text-black transition-all p-2 bg-[#f5f5f5] border border-[#e5e5e5] hover:border-[#ffdb58]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[450px] bg-[#121414] border-l border-white/10 shadow-2xl z-55 flex flex-col text-white"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#ffdb58]" />
                  <span className="font-display font-extrabold uppercase tracking-widest text-sm text-white">
                    Seu Carrinho ({cartCount})
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2.5 hover:text-[#ffdb58] text-zinc-400 cursor-pointer transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-black border border-white/5 flex items-center justify-center text-zinc-500 mb-4">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-white">Carrinho Vazio</h3>
                    <p className="text-xs text-zinc-400 font-light max-w-[240px] mt-2 leading-relaxed">
                      Adicione peças exclusivas do nosso catálogo para vê-las aqui.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.product.id}-${item.size || "nosize"}`} className="flex gap-4 border-b border-white/5 pb-6">
                      <div className="relative w-20 h-20 bg-black border border-white/5 overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white line-clamp-2">{item.product.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-zinc-500 hover:text-red-500 transition-colors p-1 cursor-pointer"
                              aria-label={`Remover ${item.product.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-[10px] text-[#ffdb58] font-bold tracking-widest mt-1 block">
                            R$ {formatPrice(item.product.price)}{item.size && ` | TAM: ${item.size}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-white/10 bg-black">
                            <button onClick={() => updateQuantity(item.product.id, item.size, -1)} className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-mono font-bold text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.size, 1)} className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-[#ffdb58] font-mono">
                            R$ {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] border-t border-white/10 bg-black flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400 uppercase tracking-widest">Subtotal</span>
                    <span className="text-base font-black text-[#ffdb58] font-mono">
                      R$ {formatPrice(cartSubtotal)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#1a1300] border border-[#4c4635] p-3 rounded-none">
                    <AlertTriangle className="w-4 h-4 text-[#ffdb58] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-400 font-light leading-relaxed">
                      O pagamento será combinado diretamente via <strong>WhatsApp</strong> após o envio dos itens do carrinho.
                    </p>
                  </div>
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-4 bg-[#ffdb58] text-[#231b00] font-bold text-xs uppercase tracking-widest hover:bg-[#ffe179] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_20px_rgba(255,219,88,0.3)]"
                  >
                    Enviar Pedido por WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SEARCH MODAL ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-[100dvh] bg-black z-50 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1.5rem+env(safe-area-inset-top,0px))] flex flex-col text-white"
          >
            <div className="max-w-4xl mx-auto w-full flex justify-end">
              <button
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                className="p-2 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar busca"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
              <div className="border-b border-white/10 pb-4 flex items-center gap-4">
                <Search className="w-6 h-6 text-[#ffdb58]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="DIGITE O QUE PROCURA..."
                  className="bg-transparent border-none text-2xl sm:text-4xl font-bold placeholder-zinc-800 focus:outline-none text-[#fff9f3] uppercase tracking-wider w-full focus:ring-0"
                  autoFocus
                />
              </div>
              <div className="mt-12 overflow-y-auto max-h-[60vh] space-y-6">
                {searchQuery.trim() === "" ? (
                  <div className="text-zinc-650 text-xs md:text-sm font-light uppercase tracking-widest">
                    Sugestões: &quot;Camiseta&quot;, &quot;Boné&quot;, &quot;Street&quot;, &quot;Redinha&quot;, &quot;Panel&quot;
                  </div>
                ) : filteredSearchProducts.length === 0 ? (
                  <div className="text-zinc-550 text-xs md:text-sm font-light uppercase tracking-widest">
                    Nenhum produto encontrado para &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSearchProducts.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/produto/${prod.id}`}
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                        className="flex gap-4 p-4 bg-[#121414] border border-white/5 group hover:border-[#ffdb58]/35 transition-all text-white"
                      >
                        <div className="relative w-20 h-20 bg-black border border-white/5 overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            <Image src={prod.image} alt={prod.name} fill sizes="80px" className="object-contain" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white">{prod.name}</h4>
                            <p className="text-[10px] text-zinc-400 font-light line-clamp-1 mt-1">{prod.description}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-black text-[#ffdb58] font-mono">R$ {formatPrice(prod.price)}</span>
                            {prod.esgotado ? (
                              <span className="text-[9px] bg-[#333] text-[#cfc6af] px-3 py-1 font-bold uppercase tracking-wider">ESGOTADO</span>
                            ) : (
                              <span className="text-[10px] text-[#ffdb58] font-bold uppercase tracking-wider">VER PRODUTO →</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ADDED TO CART POPUP ── */}
      <AnimatePresence>
        {addedPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 bg-[#121414] border border-[#ffdb58] text-[#fff9f3] px-6 py-4 shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-5 h-5 rounded-full bg-[#ffdb58] flex items-center justify-center text-black">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-[#ffdb58] uppercase font-bold tracking-widest">
                ADICIONADO À SACOLA!
              </span>
              <span className="text-xs font-bold uppercase mt-0.5 tracking-wide">
                {addedPopup}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
