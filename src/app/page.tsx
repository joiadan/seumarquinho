"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HeroCarousel from "./components/HeroCarousel";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import { PRODUCTS, formatPrice } from "./data/products";
import type { Product, CartItem } from "./data/products";
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Check, 
  Sparkles, 
  AlertTriangle,
  ArrowRightLeft,
  HelpCircle,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Types

export default function Home() {
  // Navigation Refs for HeroCarousel
  const prevSlideRef = useRef<(() => void) | null>(null);
  const nextSlideRef = useRef<(() => void) | null>(null);

  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"todos" | "bones" | "camisas">("todos");
  const [activeSection, setActiveSection] = useState("hero");
  

  
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
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // Transient popup verification
    setAddedPopup(product.name);
    setTimeout(() => setAddedPopup(null), 2500);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string | undefined, amount: number) => {
    setCart((prev) => {
      return prev.map(item => {
        if (item.product.id === productId && item.size === size) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // WhatsApp Checkout Generator
  const handleWhatsAppCheckout = () => {
    const phoneNumber = "5521981676041"; // Whatsapp do Seu Marquinho (21) 98167-6041
    const cartDetails = cart
      .map(item => `- ${item.quantity}x ${item.product.name}${item.size ? ` (Tamanho: ${item.size})` : ""} (R$ ${item.product.price.toFixed(2)} cada)`)
      .join("\n");
    const subtotalText = `Subtotal: R$ ${cartSubtotal.toFixed(2)}`;
    const message = `Olá Seu Marquinho! Gostaria de fazer o seguinte pedido:\n\n${cartDetails}\n\n${subtotalText}\n\nForma de pagamento: Combinado via Whatsapp`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  // Search filter
  const filteredSearchProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Category filter
  const displayedProducts = PRODUCTS.filter(p => {
    if (selectedCategory === "todos") return true;
    return p.category === selectedCategory;
  });

  // Scroll helper
  const scrollTo = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-[#e2e2e2] font-sans overflow-x-hidden selection:bg-[#ffdb58] selection:text-black">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 w-full z-45 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex justify-between items-center">
          
          {/* Logo & Brand Name Container */}
          <button 
            onClick={() => scrollTo("hero")} 
            className="flex items-center gap-2 md:gap-3 cursor-pointer text-left focus:outline-none"
          >
            <div className="relative w-8 h-8 md:w-11 md:h-11 flex-shrink-0">
              <Image 
                src="/PRODUTOS E LOGO/logo_preta.png" 
                alt="Seu Marquinho Logo" 
                fill 
                sizes="(max-width: 768px) 32px, 44px"
                className="object-contain"
              />
            </div>
            <span className="font-display font-extrabold text-[15px] md:text-2xl tracking-tighter text-[#fff9f3] hover:text-[#ffe179] transition-colors uppercase">
              Seu Marquinho
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => {
                setSelectedCategory("todos");
                scrollTo("catalogo");
              }}
              className={`text-xs tracking-widest font-bold uppercase transition-colors cursor-pointer py-1 border-b-2 ${
                activeSection === "catalogo" 
                  ? "text-primary border-[#ffdb58]" 
                  : "text-[#cfc6af] hover:text-primary border-transparent"
              }`}
            >
              Drops
            </button>
            <Link
              href="/colecoes"
              className="text-xs tracking-widest font-bold uppercase transition-colors py-1 border-b-2 text-[#cfc6af] hover:text-primary border-transparent"
            >
              Coleções
            </Link>
            <Link
              href="/blog"
              className="text-xs tracking-widest font-bold uppercase transition-colors py-1 border-b-2 text-[#cfc6af] hover:text-primary border-transparent"
            >
              Blog
            </Link>
            <Link
              href="/blog#origem"
              className="text-xs tracking-widest font-bold uppercase transition-colors py-1 border-b-2 text-[#cfc6af] hover:text-primary border-transparent"
            >
              História
            </Link>
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-1 md:gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:scale-110 transition-all duration-300 active:scale-95 text-primary cursor-pointer p-1.5 md:p-2.5"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5 md:w-5 md:h-5" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:scale-110 transition-all duration-300 active:scale-95 text-primary relative cursor-pointer p-1.5 md:p-2.5"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-5 h-5 md:w-5 md:h-5" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 md:top-1 md:right-1 bg-[#d30017] text-[#ffe2de] text-[9px] md:text-[10px] w-4 h-4 md:w-4.5 md:h-4.5 flex items-center justify-center rounded-full font-bold border border-black"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-[#fff9f3] hover:text-[#ffe179] cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#121414] border-b border-white/10 px-6 py-6 flex flex-col gap-5 md:hidden"
          >
            <button
              onClick={() => {
                setSelectedCategory("todos");
                scrollTo("catalogo");
              }}
              className={`text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 transition-colors ${
                activeSection === "catalogo" ? "text-[#ffdb58]" : "text-[#fff9f3] hover:text-[#ffe179]"
              }`}
            >
              Drops
            </button>
            <Link
              href="/colecoes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors"
            >
              Coleções
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/blog#origem"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors"
            >
              História
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mt-0">
        
        {/* 2. HERO SECTION — CINEMATIC CAROUSEL */}
        <section id="hero" className="relative flex flex-col overflow-hidden">
          {/* Carousel with text overlay */}
          <div className="relative">
            <HeroCarousel 
              onPrev={(fn) => { prevSlideRef.current = fn; }}
              onNext={(fn) => { nextSlideRef.current = fn; }}
              showArrows={false}
            />
            
            {/* Text overlay positioned on top of carousel */}
            <div className="absolute inset-0 z-20 flex items-start justify-start pointer-events-none pt-28 sm:pt-36 md:pt-44">
              <div className="px-margin-mobile md:px-margin-desktop max-w-4xl w-full pointer-events-auto">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-primary-container font-sans text-xs font-bold tracking-[0.25em] uppercase mb-3 md:mb-5 text-glow"
                >
                  Underground Essence
                </motion.p>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-street-white mb-4 md:mb-6 leading-[1.1] tracking-tighter uppercase drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
                >
                  Nascido no Rio.<br/>Criado para as Ruas.
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-white font-sans text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-light drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)]"
                >
                  <span className="text-[#FF6B1A] font-semibold">Estética urbana refinada com a alma carioca.</span> Do asfalto ao topo, <span className="text-[#FF6B1A] font-semibold">Seu Marquinho</span> define o novo padrão do streetwear nacional.
                </motion.p>

                {/* Transition navigation buttons below the text */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex gap-4 mt-6 sm:mt-8"
                >
                  <button 
                    onClick={() => prevSlideRef.current?.()}
                    className="p-3 rounded-full bg-black/40 hover:bg-[#FF6B1A] text-white hover:text-white border border-white/10 hover:border-[#FF6B1A] backdrop-blur-md transition-all duration-300 active:scale-90 hover:scale-110 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] group"
                    aria-label="Slide anterior"
                  >
                    <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  </button>
                  <button 
                    onClick={() => nextSlideRef.current?.()}
                    className="p-3 rounded-full bg-black/40 hover:bg-[#FF6B1A] text-white hover:text-white border border-white/10 hover:border-[#FF6B1A] backdrop-blur-md transition-all duration-300 active:scale-90 hover:scale-110 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] group"
                    aria-label="Próximo slide"
                  >
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PRODUCT CATALOG GRID WITH FILTER TABS */}
        <section id="catalogo" className="py-20 bg-surface-container-lowest border-y border-white/5">
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <p className="text-primary-container font-sans text-xs font-bold tracking-widest uppercase mb-2">PRODUTOS EM DESTAQUE</p>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-primary uppercase">Drops Exclusivos</h2>
              </div>
              
              {/* Category Filter Tabs */}
              <div className="flex gap-4 md:gap-6 border-b border-white/5 pb-2">
                {[
                  { label: "Todos os produtos", value: "todos" },
                  { label: "Bonés", value: "bones" },
                  { label: "Camisetas", value: "camisas" }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedCategory(tab.value as any)}
                    className={`font-sans text-xs uppercase tracking-widest pb-1 transition-all cursor-pointer relative font-bold ${
                      selectedCategory === tab.value
                        ? "text-primary"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {tab.label}
                    {selectedCategory === tab.value && (
                      <motion.div 
                        layoutId="activeCategoryIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffdb58]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {displayedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group cursor-pointer flex flex-col"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. BRAND ORIGIN STORY */}
        <section id="sobre" className="relative overflow-hidden bg-[#050505] py-16 md:py-24 px-margin-mobile md:px-margin-desktop border-b border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* LEFT — Text content */}
            <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
              
              {/* Bubble title — matching the reference image style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <p className="text-[#FF6B1A] font-sans text-xs font-bold tracking-[0.3em] uppercase mb-4 opacity-80">
                  A ORIGEM
                </p>
                <h2 className="bubble-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl mb-8">
                  A Resenha<br/>Que Virou<br/>Marca.
                </h2>
              </motion.div>
              
              {/* Story text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-5"
              >
                <p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light">
                  <span className="text-[#FF6B1A] font-bold">Seu Marquinho</span>, a marca que começou através de uma resenha. Bruno, Daniel e Felipe não tinham o hábito de se chamarem pelo próprio nome, então usavam apelidos como por exemplo: 
                  <span className="text-white font-semibold"> Roger, Cleitin e Marquinho...</span>
                </p>
                
                <p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light">
                  Até que um dia, numa pequena loja de conveniência dentro da favela do 
                  <span className="text-white font-semibold"> Vidigal</span>, Felipe se vira para Bruno e diz:
                </p>
                
                {/* The quote — highlighted */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="border-l-4 border-[#FF6B1A] pl-5 py-3 my-6 bg-[#FF6B1A]/5 rounded-r-lg"
                >
                  <p className="text-white font-sans text-base sm:text-lg md:text-xl font-semibold italic leading-relaxed">
                    &ldquo;Marquinho, vai querer comprar mais alguma coisa?&rdquo;
                  </p>
                </motion.div>
                
                <p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light">
                  Nessa hora entra um senhor escutando esse nome e vem na direção do Bruno dizendo: 
                  <span className="story-quote text-base sm:text-lg">&ldquo;Seu Marquinho! Seu Marquinho!&rdquo;</span>
                </p>
                
                <p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light">
                  E esse foi o start para que tudo começasse. Desenvolveram uma logo e resolveram criar uma marca de produtos e alguns acessórios. Dessa forma e <span className="text-white font-semibold">literalmente através de uma resenha e zoeira</span> era criado o 
                  <span className="text-[#FF6B1A] font-bold"> Seu Marquinho</span>.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <button 
                  onClick={() => {
                    setSelectedCategory("todos");
                    scrollTo("catalogo");
                  }}
                  className="bg-[#FF6B1A] text-white px-8 py-4 font-bold tracking-tight hover:scale-105 hover:bg-[#ff7e36] transition-all duration-300 active:scale-95 cursor-pointer uppercase text-xs hover:shadow-[0_0_25px_rgba(255,107,26,0.4)]"
                >
                  VER PRODUTOS
                </button>
                <Link
                  href="/blog#origem"
                  className="border border-[#FF6B1A]/50 text-[#FF6B1A] px-8 py-4 font-bold tracking-tight hover:bg-[#FF6B1A] hover:text-white transition-all duration-300 active:scale-95 uppercase text-xs"
                >
                  SAIBA MAIS
                </Link>
              </motion.div>
            </div>

            {/* RIGHT — Full photo card with correct aspect ratio */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-5 order-1 lg:order-2 flex justify-center items-center w-full"
            >
              <div className="relative w-full max-w-[420px] aspect-[828/1465] overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-zinc-950">
                <Image 
                  src="/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6448.PNG"
                  alt="Seu Marquinho — A Origem da Marca"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover hover:scale-102 transition-transform duration-700 select-none pointer-events-none"
                  priority
                />
              </div>
            </motion.div>

          </div>
        </section>









        {/* 9. BRAND IDENTITY & CONCEPT SHOWCASE */}
        <section className="py-32 overflow-hidden bg-street-black">
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
              
              {/* Logo Image Frame with golden-yellow brackets */}
              <div className="w-full md:w-1/2 relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-primary-container/30"></div>
                <div className="relative w-full aspect-square overflow-hidden border border-white/10 bg-white flex items-center justify-center p-8">
                  <div className="relative w-full h-full">
                    <Image 
                      src="/PRODUTOS E LOGO/IMG_3898.PNG"
                      alt="Logo Oficial Seu Marquinho e Monograma SM"
                      fill
                      sizes="(max-w-768px) 100vw, 550px"
                      className="object-contain scale-95 pointer-events-none select-none"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-primary-container/30"></div>
              </div>

              {/* Identity & Rio de Janeiro Reference Highlights */}
              <div className="w-full md:w-1/2">
                <p className="text-primary-container font-sans text-xs font-bold tracking-[0.25em] mb-4 uppercase">IDENTIDADE</p>
                <h2 className="font-display text-4xl md:text-5xl font-black text-street-white mb-8 leading-tight uppercase tracking-tighter">
                  Nossa Origem &amp;<br/>Conceito.
                </h2>
                
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full border border-primary-container/30 flex items-center justify-center text-primary-container bg-[#111] shrink-0">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                    </div>
                    <div>
                      <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Alma do Rio de Janeiro</h4>
                      <p className="text-on-surface-variant font-sans text-sm leading-relaxed font-light">
                        Nascido e criado sob a energia das ruas do Rio. Nossa marca é moldada pelas vivências do asfalto, da orla à favela, capturando a irreverência e a atitude da cultura carioca.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full border border-primary-container/30 flex items-center justify-center text-primary-container bg-[#111] shrink-0">
                      <span className="material-symbols-outlined text-sm">palette</span>
                    </div>
                    <div>
                      <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">O Personagem &amp; Monograma SM</h4>
                      <p className="text-on-surface-variant font-sans text-sm leading-relaxed font-light">
                        Nossa logo une a figura clássica do malandro carioca — com seu chapéu e charuto característicos — ao monograma geométrico "SM", unindo a malandragem tradicional à estética moderna das ruas.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full border border-primary-container/30 flex items-center justify-center text-primary-container bg-[#111] shrink-0">
                      <span className="material-symbols-outlined text-sm">local_shipping</span>
                    </div>
                    <div>
                      <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Produção Local Autêntica</h4>
                      <p className="text-on-surface-variant font-sans text-sm leading-relaxed font-light">
                        Cada peça é concebida e estampada localmente no Rio, garantindo qualidade artesanal e valorizando a economia local de forma ética e transparente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 10. NEWSLETTER / COMMUNITY */}
        <section id="contato" className="py-24 border-y border-white/5 bg-[#050505]">
          <div className="px-margin-mobile md:px-margin-desktop max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-primary mb-4 uppercase tracking-tight">
              Entre no Círculo
            </h2>
            <p className="text-on-surface-variant mb-10 font-sans text-sm leading-relaxed font-light">
              Receba acesso exclusivo a drops secretos, cupons de desconto especiais e lançamentos de coleções underground em primeira mão.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("E-mail cadastrado com sucesso! Fique atento aos próximos drops.");
                (e.target as HTMLFormElement).reset();
              }}
              className="flex flex-col md:flex-row gap-4"
            >
              <input 
                type="email" 
                required
                placeholder="Seu melhor e-mail" 
                className="flex-grow bg-[#080808] border-b-2 border-[#4c4635] focus:border-primary-container text-primary placeholder:text-outline p-4 outline-none focus:ring-0 transition-colors font-mono"
              />
              <button 
                type="submit"
                className="bg-primary text-black px-8 py-4 font-bold hover:bg-primary-container hover:text-black transition-colors uppercase tracking-widest text-xs cursor-pointer"
              >
                INSCREVER-SE
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* 11. FOOTER */}
      <footer className="w-full py-16 px-margin-mobile md:px-margin-desktop bg-street-black border-t border-street-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          
          {/* Logo brand & copyrights */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image 
                  src="/PRODUTOS E LOGO/logo_preta.png" 
                  alt="Seu Marquinho Logo" 
                  fill 
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-display font-extrabold text-xl text-[#fff9f3] tracking-tighter uppercase">
                Seu Marquinho
              </span>
            </div>
            <p className="text-on-surface-variant font-sans text-xs leading-relaxed max-w-xs font-light">
              Streetwear premium desenhado para quem dita as regras. Conforto, caimento e atitude nascidos nas ruas do Rio de Janeiro.
            </p>
            <p className="text-on-surface-variant font-sans text-[10px] mt-2">
              © 2026 Seu Marquinho. Todos os direitos reservados.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-4">
            <h5 className="text-[#fff9f3] font-bold text-xs uppercase tracking-widest">Links</h5>
            <nav className="flex flex-col items-center md:items-start gap-2.5">
              <button onClick={() => { setSelectedCategory("todos"); scrollTo("catalogo"); }} className="text-on-surface-variant hover:text-primary text-xs transition-colors cursor-pointer text-left">Todos os Produtos</button>
              <button onClick={() => { setSelectedCategory("bones"); scrollTo("catalogo"); }} className="text-on-surface-variant hover:text-primary text-xs transition-colors cursor-pointer text-left">Bonés Exclusivos</button>
              <button onClick={() => { setSelectedCategory("camisas"); scrollTo("catalogo"); }} className="text-on-surface-variant hover:text-primary text-xs transition-colors cursor-pointer text-left">Camisetas Heavyweight</button>
              <button onClick={() => scrollTo("sobre")} className="text-on-surface-variant hover:text-primary text-xs transition-colors cursor-pointer text-left">Lookbook / Sobre</button>
              <Link href="/blog#origem" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Nossa Origem</Link>
              <Link href="/blog#criadores" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Criadores</Link>
              <Link href="/blog" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Blog das Ruas</Link>
            </nav>
          </div>

          {/* Contact and atendimento */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-4">
            <h5 className="text-[#fff9f3] font-bold text-xs uppercase tracking-widest">Atendimento</h5>
            <div className="flex flex-col items-center md:items-start gap-2.5 text-xs text-on-surface-variant">
              <a href="mailto:seumarquinho2023@gmail.com" className="hover:text-primary transition-colors text-left">seumarquinho2023@gmail.com</a>
              <a href="https://wa.me/5521981676041" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-left font-semibold">
                (21) 98167-6041
              </a>
              <p className="text-[10px] text-primary-container uppercase tracking-wide font-bold mt-1">
                Formas de Pagamento:
              </p>
              <span className="text-[11px] italic">Combinado via Whatsapp</span>
            </div>
          </div>

          {/* Security Certifications & Social Links */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <h5 className="text-[#fff9f3] font-bold text-xs uppercase tracking-widest">Segurança</h5>
              <div className="flex gap-4 items-center bg-[#111111] p-2 border border-white/5 rounded-sm">
                {/* SSL Shield Logo Icon Representation */}
                <div className="flex flex-col items-center opacity-65 text-[#e2e2e2]">
                  <span className="material-symbols-outlined text-lg">shield</span>
                  <span className="text-[7px] uppercase font-bold tracking-tighter mt-0.5">SSL Seguro</span>
                </div>
                {/* Google Verified Logo Icon Representation */}
                <div className="flex flex-col items-center opacity-65 text-[#e2e2e2]">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span className="text-[7px] uppercase font-bold tracking-tighter mt-0.5">Google</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a 
                href="https://wa.me/5521981676041"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="text-on-surface-variant hover:text-primary transition-all p-2 bg-[#111111] border border-white/5 hover:border-primary-container"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/seu.marquinho/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-on-surface-variant hover:text-primary transition-all p-2 bg-[#111111] border border-white/5 hover:border-primary-container"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        updateQuantity={updateQuantity} 
        removeItem={removeFromCart} 
      />

      {/* --- SEARCH MODAL OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-[100dvh] bg-black z-50 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1.5rem+env(safe-area-inset-top,0px))] flex flex-col"
          >
            {/* Close actions */}
            <div className="max-w-4xl mx-auto w-full flex justify-end">
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar busca"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Search box */}
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

              {/* Dynamic Search results */}
              <div className="mt-12 overflow-y-auto max-h-[60vh] space-y-6">
                {searchQuery.trim() === "" ? (
                  <div className="text-zinc-650 text-xs md:text-sm font-light uppercase tracking-widest">
                    Sugestões: "Camiseta", "Boné", "Street", "Redinha", "Panel"
                  </div>
                ) : filteredSearchProducts.length === 0 ? (
                  <div className="text-zinc-550 text-xs md:text-sm font-light uppercase tracking-widest">
                    Nenhum produto encontrado para "{searchQuery}"
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSearchProducts.map((product) => (
                      <Link 
                        key={product.id}
                        href={`/produto/${product.id}`}
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                        className="flex gap-4 p-4 bg-[#121414] border border-white/5 group hover:border-[#ffdb58]/35 transition-all"
                      >
                        <div className="relative w-20 h-20 bg-black border border-white/5 overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            <Image 
                              src={product.image} 
                              alt={product.name} 
                              fill
                              sizes="80px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white">{product.name}</h4>
                            <p className="text-[10px] text-on-surface-variant font-light line-clamp-1 mt-1">{product.description}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-black text-[#ffdb58] font-mono">
                              R$ {formatPrice(product.price)}
                            </span>
                            {product.esgotado ? (
                              <span className="text-[9px] bg-[#333] text-[#cfc6af] px-3 py-1 font-bold uppercase tracking-wider">
                                ESGOTADO
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#ffdb58] font-bold uppercase tracking-wider">
                                VER PRODUTO →
                              </span>
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

      {/* --- ADDED TO CART NOTIFICATION POPUP --- */}
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
              <span className="text-[9px] text-[#ffdb58] uppercase font-bold tracking-widest">ADICIONADO À SACOLA!</span>
              <span className="text-xs font-bold uppercase mt-0.5 tracking-wide">{addedPopup}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}
