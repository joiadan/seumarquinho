"use client";

import { use, useState, useEffect, useRef } from "react";
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
  ArrowLeft,
  Check,
  AlertTriangle,
  Share2,
  ChevronRight,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Copy,
  ChevronLeft,
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import CartDrawer from "../../components/CartDrawer";
import { PRODUCTS, formatPrice, getProductById, getRelatedProducts } from "../../data/products";
import type { Product, CartItem } from "../../data/products";

// Cart types

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(id);
  const relatedProducts = product ? getRelatedProducts(product, 4) : [];

  // UI states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDescriptionFull, setShowDescriptionFull] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);

  // Mobile Swipe Gesture States
  const [mainTouchStart, setMainTouchStart] = useState<number | null>(null);
  const [mainTouchEnd, setMainTouchEnd] = useState<number | null>(null);
  const [zoomTouchStart, setZoomTouchStart] = useState<number | null>(null);
  const [zoomTouchEnd, setZoomTouchEnd] = useState<number | null>(null);

  const handleMainTouchStart = (e: React.TouchEvent) => {
    setMainTouchStart(e.targetTouches[0].clientX);
  };

  const handleMainTouchMove = (e: React.TouchEvent) => {
    setMainTouchEnd(e.targetTouches[0].clientX);
  };

  const handleMainTouchEnd = () => {
    if (!mainTouchStart || !mainTouchEnd || !product) return;
    const distance = mainTouchStart - mainTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const galleryLength = product.images && product.images.length > 0 ? product.images.length : 1;
    if (isLeftSwipe) {
      setSelectedImageIndex((prev) => (prev + 1) % galleryLength);
    } else if (isRightSwipe) {
      setSelectedImageIndex((prev) => (prev - 1 + galleryLength) % galleryLength);
    }
    setMainTouchStart(null);
    setMainTouchEnd(null);
  };

  const handleZoomTouchStart = (e: React.TouchEvent) => {
    setZoomTouchStart(e.targetTouches[0].clientX);
  };

  const handleZoomTouchMove = (e: React.TouchEvent) => {
    setZoomTouchEnd(e.targetTouches[0].clientX);
  };

  const handleZoomTouchEnd = () => {
    if (!zoomTouchStart || !zoomTouchEnd || !product) return;
    const distance = zoomTouchStart - zoomTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const galleryLength = product.images && product.images.length > 0 ? product.images.length : 1;
    if (isLeftSwipe) {
      setZoomImageIndex((prev) => (prev + 1) % galleryLength);
    } else if (isRightSwipe) {
      setZoomImageIndex((prev) => (prev - 1 + galleryLength) % galleryLength);
    }
    setZoomTouchStart(null);
    setZoomTouchEnd(null);
  };

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
  const addToCart = (prod: Product) => {
    if (prod.esgotado) return;
    
    // Size check
    if (prod.sizes && prod.sizes.length > 0 && !selectedSize) {
      alert("Por favor, selecione um tamanho antes de adicionar ao carrinho.");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === prod.id && item.size === selectedSize);
      if (existing) {
        return prev.map((item) =>
          item.product.id === prod.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product: prod, quantity: 1, size: selectedSize || undefined }];
    });
    setAddedPopup(`${prod.name}${selectedSize ? ` (${selectedSize})` : ""}`);
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

  // WhatsApp Checkout Generator
  const handleWhatsAppCheckout = () => {
    const phoneNumber = "5521981676041";
    const cartDetails = cart
      .map(
        (item) =>
          `- ${item.quantity}x ${item.product.name}${item.size ? ` (Tamanho: ${item.size})` : ""} (R$ ${item.product.price.toFixed(2)} cada)`
      )
      .join("\n");
    const subtotalText = `Subtotal: R$ ${cartSubtotal.toFixed(2)}`;
    const message = `Olá Seu Marquinho! Gostaria de fazer o seguinte pedido:\n\n${cartDetails}\n\n${subtotalText}\n\nForma de pagamento: Combinado via Whatsapp`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  // Buy single product via WhatsApp
  const handleBuyNowWhatsApp = () => {
    if (!product || product.esgotado) return;
    const phoneNumber = "5521981676041";
    const sizeText = selectedSize ? `\nTamanho: ${selectedSize}` : "";
    const message = `Olá Seu Marquinho! Tenho interesse no produto:\n\n- ${product.name}\n- R$ ${formatPrice(product.price)}${sizeText}\n\nGostaria de saber mais sobre disponibilidade e formas de pagamento!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  // Share handlers
  const handleShareWhatsApp = () => {
    if (!product) return;
    const message = `Confira esse produto incrível da Seu Marquinho: ${product.name} - R$ ${formatPrice(product.price)} 🔥`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    setShowShareMenu(false);
  };

  // Search filter
  const filteredSearchProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Product images for gallery
  const productImages = product?.images && product.images.length > 0
    ? product.images
    : product
    ? [product.image]
    : [];

  // 404 State
  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-extrabold text-primary mb-4">
            Produto não encontrado
          </h1>
          <p className="text-on-surface-variant mb-8">
            O produto que você procura não existe ou foi removido.
          </p>
          <Link
            href="/"
            className="bg-primary-container text-on-primary-fixed px-8 py-4 font-bold tracking-tight hover:scale-105 transition-all duration-300 active:scale-95 uppercase text-xs hover:shadow-[0_0_20px_rgba(255,219,88,0.45)]"
          >
            VOLTAR À LOJA
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = product.category === "bones" ? "Bonés" : "Camisetas";

  return (
    <div className="relative min-h-screen bg-black text-[#e2e2e2] font-sans overflow-x-hidden selection:bg-[#ffdb58] selection:text-black">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 w-full z-45 glass-nav transition-all duration-300">
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
            <span className="font-display font-extrabold text-lg md:text-2xl tracking-tighter text-[#fff9f3] hover:text-[#ffe179] transition-colors uppercase">
              Seu Marquinho
            </span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link
              href="/#catalogo"
              className="text-xs tracking-widest font-bold uppercase transition-colors py-1 border-b-2 text-[#cfc6af] hover:text-primary border-transparent"
            >
              Drops
            </Link>
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

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:scale-110 transition-all duration-300 active:scale-95 text-primary cursor-pointer p-2.5"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:scale-110 transition-all duration-300 active:scale-95 text-primary relative cursor-pointer p-2.5"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 bg-[#d30017] text-[#ffe2de] text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border border-black"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-[#fff9f3] hover:text-[#ffe179] cursor-pointer"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#121414] border-b border-white/10 px-6 py-6 flex flex-col gap-5 md:hidden"
          >
            <Link href="/#catalogo" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors">Drops</Link>
            <Link href="/colecoes" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors">Coleções</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors">Blog</Link>
            <Link href="/blog#origem" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors">História</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN PRODUCT CONTENT ── */}
      <main className="pt-16 md:pt-20">

        {/* WHITE BACKGROUND PRODUCT SECTION WITH BRAND IDENTITY */}
        <section className="bg-white text-[#1a1a1a] relative overflow-hidden">

          {/* ── VERTICAL BRAND SIDEBAR (Glued to the absolute left of the screen) ── */}
          <div className="absolute left-0 top-0 bottom-0 w-[40px] lg:w-[80px] bg-[#fafafa]/40 border-r border-[#e5e5e5] flex flex-col items-center justify-between py-6 lg:py-10 z-10">
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

          {/* Main content area — offset left to accommodate absolute sidebar, and centered */}
          <div className="pl-[40px] lg:pl-[80px]">

            {/* ── Brand Identity Bar ── */}
            <div className="border-b border-[#e5e5e5] bg-[#fafafa]">
              <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
                {/* Left — Brand breadcrumb with golden accent */}
                <nav className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-sans truncate max-w-full">
                  <Link href="/" className="text-[#999] hover:text-[#1a1a1a] transition-colors flex items-center gap-1 shrink-0">
                    <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0">
                      <Image src="/PRODUTOS E LOGO/logo_preta.png" alt="SM" fill sizes="16px" className="object-contain opacity-50" />
                    </div>
                    Início
                  </Link>
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ddd] shrink-0" />
                  <Link href="/#catalogo" className="text-[#999] hover:text-[#1a1a1a] transition-colors shrink-0">{categoryLabel}</Link>
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ddd] shrink-0" />
                  <span className="text-[#1a1a1a] font-semibold truncate max-w-[80px] xs:max-w-[150px] sm:max-w-[200px]">{product.name}</span>
                </nav>
                {/* Right — Brand tagline */}
                <p className="hidden md:block text-[9px] text-[#bbb] font-bold tracking-[0.25em] uppercase">
                  Underground Essence · Rio de Janeiro
                </p>
              </div>
            </div>

            {/* ── Product Grid: Gallery + Info ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-16">

                {/* LEFT — Image Gallery */}
                <div className="flex flex-col-reverse md:flex-row gap-4">
                  {/* Thumbnails */}
                  {productImages.length > 1 && (
                    <div className="flex md:flex-col gap-3 md:w-20 shrink-0 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
                      {productImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative w-16 h-20 md:w-20 md:h-26 aspect-[3/4] border-2 transition-all overflow-hidden bg-[#f5f5f5] p-1 cursor-pointer ${
                            selectedImageIndex === idx
                              ? "border-[#1a1a1a]"
                              : "border-[#e5e5e5] hover:border-[#999]"
                          }`}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={img}
                              alt={`${product.name} - foto ${idx + 1}`}
                              fill
                              sizes="80px"
                              className="object-contain"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Main Image */}
                  <div className="flex-1 relative">
                    <div 
                      className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden group border border-[#e5e5e5]"
                      onTouchStart={handleMainTouchStart}
                      onTouchMove={handleMainTouchMove}
                      onTouchEnd={handleMainTouchEnd}
                      style={{ touchAction: 'pan-y' }}
                    >
                      {/* SM Monogram watermark behind product */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <div className="relative w-2/3 h-2/3 opacity-[0.03]">
                          <Image
                            src="/PRODUTOS E LOGO/logo_monograma.png"
                            alt=""
                            fill
                            sizes="300px"
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <Image
                        src={productImages[selectedImageIndex] || product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-contain p-6 md:p-10 transition-transform duration-700 group-hover:scale-108 relative z-[1] cursor-zoom-in"
                        priority
                        onClick={() => {
                          setIsZoomOpen(true);
                          setZoomImageIndex(selectedImageIndex);
                        }}
                      />

                      {/* Badge */}
                      {product.esgotado ? (
                        <span className="absolute top-4 left-4 bg-[#333333] text-white px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider z-[2]">
                          Esgotado
                        </span>
                      ) : product.badge ? (
                        <span
                          className={`absolute top-4 left-4 px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider z-[2] ${
                            product.badge === "LIMITED"
                              ? "bg-[#d30017] text-white"
                              : "bg-[#ffdb58] text-[#231b00]"
                          }`}
                        >
                          {product.badge}
                        </span>
                      ) : null}

                      {/* Favorite button */}
                      <button
                        onClick={() => setIsFavorited(!isFavorited)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all cursor-pointer shadow-sm z-[2]"
                        aria-label="Favoritar"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            isFavorited
                              ? "fill-[#d30017] text-[#d30017]"
                              : "text-[#666]"
                          }`}
                        />
                      </button>

                      {/* Golden corner accent — top left */}
                      <div className="absolute top-0 left-0 w-12 h-12 z-[2] pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ffdb58] to-transparent" />
                        <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-[#ffdb58] to-transparent" />
                      </div>
                      {/* Golden corner accent — bottom right */}
                      <div className="absolute bottom-0 right-0 w-12 h-12 z-[2] pointer-events-none">
                        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#ffdb58] to-transparent" />
                        <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-[#ffdb58] to-transparent" />
                      </div>
                    </div>

                    {/* Integrated vertical sidebar handles mobile brand art natively */}
                  </div>
                </div>

                {/* RIGHT — Product Info Panel */}
                <div className="flex flex-col">
                  {/* Category label with golden dot */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" />
                    <p className="text-xs font-bold text-[#888] uppercase tracking-[0.2em]">
                      {categoryLabel}
                    </p>
                  </div>

                  {/* Product Name */}
                  <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1a1a1a] leading-tight mb-4">
                    {product.name}
                  </h1>

                  {/* Price with golden underline */}
                  <div className="mb-6">
                    <p className="text-2xl md:text-3xl font-extrabold text-[#1a1a1a]">
                      R$ {formatPrice(product.price)}
                    </p>
                    <div className="w-16 h-[2px] bg-[#ffdb58] mt-2" />
                    <p className="text-xs text-[#888] mt-2">
                      ou em até <span className="font-bold text-[#555]">3x de R$ {formatPrice(product.price / 3)}</span> sem juros
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#e5e5e5] mb-6" />

                  {/* Size Selector — only for camisetas */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
                          Tamanho
                        </p>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                            className={`min-w-[56px] h-12 px-4 border-2 font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                              selectedSize === size
                                ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                                : "border-[#e5e5e5] bg-white text-[#1a1a1a] hover:border-[#999]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mb-6">
                    {product.esgotado ? (
                      <button
                        disabled
                        className="w-full py-4 bg-[#e5e5e5] text-[#999] font-bold uppercase tracking-widest text-sm cursor-not-allowed"
                      >
                        Esgotado
                      </button>
                    ) : (
                      <>
                        {/* Add to Cart — brand styled */}
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full py-4 bg-[#1a1a1a] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#333] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Adicionar ao Carrinho
                        </button>

                        {/* WhatsApp Buy — golden brand button */}
                        <button
                          onClick={handleBuyNowWhatsApp}
                          className="w-full py-4 bg-[#ffdb58] text-[#231b00] font-bold uppercase tracking-widest text-sm hover:bg-[#ffe179] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,219,88,0.35)]"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Comprar via WhatsApp
                        </button>
                      </>
                    )}
                  </div>

                  {/* Favorite + Share row */}
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[#e5e5e5]">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? "fill-[#d30017] text-[#d30017]" : ""}`} />
                      <span className="font-medium">Salvar como favorito</span>
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="font-medium">Compartilhar</span>
                      </button>

                      <AnimatePresence>
                        {showShareMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full mt-2 left-0 bg-white border border-[#e5e5e5] shadow-lg p-2 z-20 min-w-[180px]"
                          >
                            <button
                              onClick={handleShareWhatsApp}
                              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-[#333] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              WhatsApp
                            </button>
                            <button
                              onClick={handleCopyLink}
                              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-[#333] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                            >
                              {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              {copiedLink ? "Link copiado!" : "Copiar link"}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-3">
                      Descrição
                    </h3>
                    <p className="text-sm text-[#555] leading-relaxed">
                      {showDescriptionFull
                        ? product.descriptionLong || product.description
                        : product.description}
                    </p>
                    {product.descriptionLong && (
                      <button
                        onClick={() => setShowDescriptionFull(!showDescriptionFull)}
                        className="text-xs font-bold text-[#1a1a1a] mt-3 underline underline-offset-4 hover:text-[#555] transition-colors cursor-pointer"
                      >
                        {showDescriptionFull
                          ? "Ver menos"
                          : "Ver mais detalhes do produto"}
                      </button>
                    )}
                  </div>

                  {/* Product details list */}
                  <div className="mb-6 pb-6 border-b border-[#e5e5e5]">
                    <ul className="space-y-2 text-sm text-[#555]">
                      {product.category === "camisas" ? (
                        <>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" /> 100% Algodão Premium Heavyweight</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" /> Caimento Boxy Oversized</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" /> Estampa em Silk de Alta Definição</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" /> Gola Reforçada com Ribana Dupla</li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" /> Sarja Premium de Alta Gramatura</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" /> Bordado Frontal em Fio Premium</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" /> Ajuste Regulável</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#ffdb58]" /> Tamanho Único</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Trust badges with golden icons */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="flex flex-col items-center text-center gap-1.5 py-3">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a830]" />
                      <span className="text-[8px] xs:text-[10px] font-bold text-[#888] uppercase tracking-wider leading-tight">Envio para todo Brasil</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1.5 py-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a830]" />
                      <span className="text-[8px] xs:text-[10px] font-bold text-[#888] uppercase tracking-wider leading-tight">Compra Segura</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1.5 py-3">
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a830]" />
                      <span className="text-[8px] xs:text-[10px] font-bold text-[#888] uppercase tracking-wider leading-tight">Troca Garantida</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RELATED PRODUCTS — "Mais Vendidos" ── */}
        {relatedProducts.length > 0 && (
          <section className="py-16 md:py-20 bg-surface-container-lowest border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <p className="text-primary-container font-sans text-xs font-bold tracking-widest uppercase mb-2">
                    VOCÊ TAMBÉM VAI GOSTAR
                  </p>
                  <h2 className="font-display text-xl md:text-2xl font-extrabold text-primary uppercase">
                    Mais Vendidos
                  </h2>
                </div>
                <Link
                  href="/#catalogo"
                  className="text-xs text-primary-container font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
                >
                  Ver todos <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct.id}
                    href={`/produto/${relProduct.id}`}
                    className="group flex flex-col"
                  >
                    <div className="aspect-square mb-4 overflow-hidden bg-[#080808] flex items-center justify-center relative border border-white/5 p-4 md:p-6 transition-colors duration-500 hover:bg-[#111111]">
                      <div className="relative w-full h-full">
                        <Image
                          src={relProduct.image}
                          alt={relProduct.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain transition-transform duration-700 group-hover:scale-108"
                        />
                      </div>
                      {relProduct.esgotado && (
                        <span className="absolute top-3 left-3 bg-[#333333] text-[#cfc6af] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider">
                          Esgotado
                        </span>
                      )}
                      {!relProduct.esgotado && relProduct.badge && (
                        <span
                          className={`absolute top-3 left-3 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider ${
                            relProduct.badge === "LIMITED"
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-primary-container text-on-primary-fixed"
                          }`}
                        >
                          {relProduct.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-sm font-bold text-primary mb-1 group-hover:text-primary-container transition-colors line-clamp-2">
                      {relProduct.name}
                    </h3>
                    <p className="text-primary-container font-display font-extrabold text-sm">
                      R$ {formatPrice(relProduct.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── BACK TO SHOP CTA ── */}
        <section className="py-12 bg-black border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-center">
            <Link
              href="/#catalogo"
              className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Voltar para a loja
              </span>
            </Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full py-16 px-4 md:px-10 bg-street-black border-t border-street-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-4">
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
              <span className="font-display font-extrabold text-xl text-[#fff9f3] tracking-tighter uppercase">
                Seu Marquinho
              </span>
            </Link>
            <p className="text-on-surface-variant font-sans text-xs leading-relaxed max-w-xs font-light">
              Streetwear premium desenhado para quem dita as regras. Conforto, caimento e atitude nascidos nas ruas do Rio de Janeiro.
            </p>
            <p className="text-on-surface-variant font-sans text-[10px] mt-2">
              © 2026 Seu Marquinho. Todos os direitos reservados.
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-4">
            <h5 className="text-[#fff9f3] font-bold text-xs uppercase tracking-widest">Links</h5>
            <nav className="flex flex-col items-center md:items-start gap-2.5">
              <Link href="/#catalogo" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Todos os Produtos</Link>
              <Link href="/blog" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Blog das Ruas</Link>
              <Link href="/blog#origem" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Nossa Origem</Link>
            </nav>
          </div>

          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-4">
            <h5 className="text-[#fff9f3] font-bold text-xs uppercase tracking-widest">Atendimento</h5>
            <div className="flex flex-col items-center md:items-start gap-2.5 text-xs text-on-surface-variant">
              <a href="mailto:seumarquinho2023@gmail.com" className="hover:text-primary transition-colors text-left">seumarquinho2023@gmail.com</a>
              <a href="https://wa.me/5521981676041" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-left font-semibold">(21) 98167-6041</a>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center md:items-start gap-6">
            <div className="flex gap-4">
              <a href="https://wa.me/5521981676041" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="text-on-surface-variant hover:text-primary transition-all p-2 bg-[#111111] border border-white/5 hover:border-primary-container">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/seu.marquinho/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-on-surface-variant hover:text-primary transition-all p-2 bg-[#111111] border border-white/5 hover:border-primary-container">
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

      {/* ── SEARCH MODAL ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-[100dvh] bg-black z-50 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1.5rem+env(safe-area-inset-top,0px))] flex flex-col"
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
                        className="flex gap-4 p-4 bg-[#121414] border border-white/5 group hover:border-[#ffdb58]/35 transition-all"
                      >
                        <div className="relative w-20 h-20 bg-black border border-white/5 overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            <Image src={prod.image} alt={prod.name} fill sizes="80px" className="object-contain" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white">{prod.name}</h4>
                            <p className="text-[10px] text-on-surface-variant font-light line-clamp-1 mt-1">{prod.description}</p>
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

      {/* ── IMAGE ZOOM LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 md:p-6"
            onClick={() => setIsZoomOpen(false)}
            onTouchStart={handleZoomTouchStart}
            onTouchMove={handleZoomTouchMove}
            onTouchEnd={handleZoomTouchEnd}
            style={{ touchAction: 'none' }}
          >
            {/* Top Bar: Close Button and Counter */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto z-10">
              <span className="text-xs font-mono font-bold tracking-widest text-[#cfc6af] uppercase">
                {product.name} ({zoomImageIndex + 1} / {productImages.length})
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomOpen(false);
                }}
                className="p-3 border border-white/10 text-[#fff9f3] hover:text-[#ffdb58] hover:border-[#ffdb58]/50 transition-all rounded-full bg-white/5 cursor-pointer"
                aria-label="Fechar zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle: Centered Image and Navigation Arrows */}
            <div className="flex-1 flex items-center justify-center relative w-full max-w-5xl mx-auto my-4">
              {/* Prev Arrow */}
              {productImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
                  }}
                  className="absolute left-2 md:left-4 z-10 p-3 rounded-full bg-black/40 hover:bg-[#ffdb58] text-white hover:text-black border border-white/10 hover:border-[#ffdb58] transition-all cursor-pointer group"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
                </button>
              )}

              {/* Centered Large Image */}
              <div 
                className="relative w-full h-[60vh] sm:h-[70vh] md:h-[75vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={productImages[zoomImageIndex]}
                  alt={`${product.name} zoomed - foto ${zoomImageIndex + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* Next Arrow */}
              {productImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomImageIndex((prev) => (prev + 1) % productImages.length);
                  }}
                  className="absolute right-2 md:right-4 z-10 p-3 rounded-full bg-black/40 hover:bg-[#ffdb58] text-white hover:text-black border border-white/10 hover:border-[#ffdb58] transition-all cursor-pointer group"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>

            {/* Bottom: Thumbnail Strip */}
            {productImages.length > 1 && (
              <div className="w-full max-w-xl mx-auto pb-2 z-10" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-center gap-3 overflow-x-auto py-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setZoomImageIndex(idx)}
                      className="relative w-12 h-12 md:w-16 md:h-16 border-2 bg-black p-0.5 transition-all overflow-hidden shrink-0 cursor-pointer"
                      style={{ borderColor: zoomImageIndex === idx ? "#ffdb58" : "rgba(255,255,255,0.1)" }}
                    >
                      <div className="relative w-full h-full">
                        <Image src={img} alt={`Thumb ${idx + 1}`} fill sizes="64px" className="object-contain" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
