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
  ArrowLeft, 
  Check, 
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { PRODUCTS, formatPrice } from "../data/products";
import type { CartItem, Product } from "../data/products";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
  image: string;
  imageAlt: string;
  hotDrop?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "O Start: Da Resenha no Vidigal para as Ruas",
    date: "15 MAI 2026",
    excerpt: "Como uma brincadeira de apelidos entre Bruno, Daniel e Felipe em uma conveniência no topo do Vidigal se transformou na alma de uma marca nacional.",
    image: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6490.jpg",
    imageAlt: "Estética Seu Marquinho lifestyle urbano no Rio de Janeiro.",
    hotDrop: true,
    content: [
      "Tudo começou sem pretensão, em uma dessas noites quentes do Rio. Bruno, Daniel e Felipe nunca se chamavam pelos nomes reais. Para eles, o cotidiano era guiado por apelidos — Roger, Cleitin, Marquinho. Era a linguagem da cumplicidade, a resenha pura e simples que define a amizade nascida nas ladeiras do Vidigal.",
      "A virada de chave aconteceu em um cenário improvável: uma pequena loja de conveniência no coração da comunidade. Felipe se virou para Bruno e disparou a frase que mudaria tudo: 'Marquinho, vai querer comprar mais alguma coisa?'. Nesse exato momento, um senhor que passava ouviu a brincadeira, olhou fixamente para Bruno e começou a chamá-lo com entusiasmo: 'Seu Marquinho! Seu Marquinho!'.",
      "O riso foi geral, mas o estalo foi imediato. Aquele nome tinha força, tinha a cara da rua, do Rio de Janeiro e da espontaneidade carioca. Dali para o papel foi um salto. Eles desenharam o primeiro esboço da logo, estruturaram a ideia de criar bonés e acessórios e decidiram que a marca levaria essa verdade no peito. Nascia oficialmente a Seu Marquinho: uma marca que não veio de planos corporativos, mas sim de uma legítima resenha e zoeira de favela."
    ]
  },
  {
    id: "post-2",
    title: "Estética das Vielas: O Monograma SM",
    date: "20 MAI 2026",
    excerpt: "A história por trás do desenvolvimento visual do nosso monograma e como traduzimos a arquitetura orgânica das favelas em design premium.",
    image: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/sm tratada.png",
    imageAlt: "Design gráfico do monograma Seu Marquinho tratada para estampa premium.",
    content: [
      "Criar uma identidade visual para a Seu Marquinho exigia mais do que apenas um desenho bonito; era preciso traduzir a geometria e o contraste da nossa realidade. O monograma SM nasceu com essa missão: unir as linhas retas e cruas do asfalto com as curvas e labirintos das vielas da comunidade.",
      "Cada ângulo do nosso logotipo foi planejado para carregar peso e presença. O monograma foi desenvolvido para ser de fácil reconhecimento e forte impacto visual, seja bordado na frente de um boné Five Panel ou estampado em silk em uma camiseta boxy de alta gramatura. Queríamos que quem usasse a marca sentisse o orgulho da representatividade urbana em cada detalhe.",
      "A imagem 'sm tratada' reflete perfeitamente esse espírito. Ela une fotografia urbana analógica com contraste agressivo, celebrando o monograma como um selo de autenticidade. Nosso design é o reflexo de quem vive a rua intensamente e entende que a moda de periferia é, hoje, a vanguarda do design global."
    ]
  },
  {
    id: "post-3",
    title: "Atitude Five Panel: A Cultura das Calçadas",
    date: "28 MAI 2026",
    excerpt: "Conheça os detalhes do design do nosso boné clássico Five Panel e por que ele se tornou o maior símbolo de conexão urbana da Seu Marquinho.",
    image: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6815.jpg",
    imageAlt: "Close-up do modelo vestindo o boné Five Panel Preto da Seu Marquinho.",
    content: [
      "No streetwear, o boné Five Panel é mais do que um acessório; é uma coroa urbana. Quando decidimos desenvolver o nosso modelo clássico em preto, sabíamos que ele precisava ser impecável no caimento e resistente para aguentar a rotina intensa de quem corre atrás do seu espaço no Rio de Janeiro.",
      "Focamos na tela respirável na parte traseira para garantir conforto térmico sob o sol carioca, combinada com um tecido de alta resistência na parte frontal que serve como base para o nosso monograma bordado. O ajuste com fivela traseira foi pensado para se adaptar perfeitamente a qualquer estilo de cabelo e postura. O design é ergonômico, clean e direto ao ponto.",
      "Cada drop do Five Panel preto representa nossa conexão direta com a comunidade. Ver os jovens do Vidigal e de todo o Rio ocupando praças, praias e as pistas de skate com o boné é a validação definitiva de que a Seu Marquinho não é apenas vestuário — é um código visual de pertencimento e atitude."
    ]
  }
];

const LOOKBOOK_IMAGES = [
  {
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6448.PNG",
    alt: "Seu Marquinho — Urban Culture",
    caption: "A Origem no Vidigal",
    aspect: "aspect-[9/16]"
  },
  {
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6490.jpg",
    alt: "Seu Marquinho — Lifestyle Urbano",
    caption: "Da Resenha ao Drop",
    aspect: "aspect-[16/9]"
  },
  {
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6815.jpg",
    alt: "Seu Marquinho — Coleção Exclusiva",
    caption: "Conexão com a Cidade",
    aspect: "aspect-[3/4]"
  },
  {
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6843.jpg",
    alt: "Seu Marquinho — Estilo Carioca",
    caption: "Atitude Five Panel",
    aspect: "aspect-[3/4]"
  },
  {
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_7061.jpg",
    alt: "Seu Marquinho — Atitude Urbana",
    caption: "Cultura Urbana Real",
    aspect: "aspect-[3/4]"
  },
  {
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/sm tratada.png",
    alt: "Seu Marquinho — Streetwear Premium",
    caption: "Essência Premium",
    aspect: "aspect-[9/19]"
  }
];

export default function BlogPage() {
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);
  const [activeLookbookIndex, setActiveLookbookIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Cart & Search States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

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
    const phoneNumber = "5521981676041";
    const cartDetails = cart
      .map(item => `- ${item.quantity}x ${item.product.name}${item.size ? ` (Tamanho: ${item.size})` : ""} (R$ ${item.product.price.toFixed(2)} cada)`)
      .join("\n");
    const subtotalText = `Subtotal: R$ ${cartSubtotal.toFixed(2)}`;
    const message = `Olá Seu Marquinho! Gostaria de fazer o seguinte pedido do Blog:\n\n${cartDetails}\n\n${subtotalText}\n\nForma de pagamento: Combinado via Whatsapp`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  // Search filter
  const filteredSearchProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextLookbookImage = () => {
    if (activeLookbookIndex !== null) {
      setActiveLookbookIndex((activeLookbookIndex + 1) % LOOKBOOK_IMAGES.length);
    }
  };

  const prevLookbookImage = () => {
    if (activeLookbookIndex !== null) {
      setActiveLookbookIndex((activeLookbookIndex - 1 + LOOKBOOK_IMAGES.length) % LOOKBOOK_IMAGES.length);
    }
  };

  const scrollToSection = (id: string) => {
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
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex justify-between items-center">
          
          {/* Logo & Brand Name Container */}
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

          {/* Desktop Navigation */}
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
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs tracking-widest font-bold uppercase cursor-pointer py-1 border-b-2 text-primary border-[#ffdb58]"
            >
              Blog
            </button>
            <button
              onClick={() => scrollToSection("origem")}
              className="text-xs tracking-widest font-bold uppercase transition-colors cursor-pointer py-1 border-b-2 text-[#cfc6af] hover:text-primary border-transparent"
            >
              História
            </button>
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-6">
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
                  className="absolute -top-1.5 -right-1.5 bg-[#d30017] text-[#ffe2de] text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border border-black"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-[#fff9f3] hover:text-[#ffe179] cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            <Link
              href="/#catalogo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors"
            >
              Drops
            </Link>
            <Link
              href="/colecoes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors"
            >
              Coleções
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#ffdb58] transition-colors cursor-pointer"
            >
              Blog
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                scrollToSection("origem");
              }}
              className="text-left text-base uppercase tracking-widest font-bold py-2 border-b border-zinc-900 text-[#fff9f3] hover:text-[#ffe179] transition-colors cursor-pointer"
            >
              História
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16 md:pt-20">
        {/* Hero Section: CRÔNICAS DA RUA */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
              <Image 
                src="/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6490.jpg"
                alt="Conceito estético Seu Marquinho nas ruas do Rio de Janeiro."
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-50 select-none pointer-events-none"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          </div>
          <div className="relative z-10 text-center px-margin-mobile max-w-4xl">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 tracking-tighter italic uppercase text-glow">
              CRÔNICAS DA RUA
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Toda marca tem uma história, mas a nossa nasceu do asfalto e das vielas do Vidigal. Explore o design, a amizade e a cultura urbana que definem a essência da Seu Marquinho.
            </p>
            <div className="mt-12">
              <div className="h-16 w-px bg-primary-container mx-auto animate-bounce"></div>
            </div>
          </div>
        </section>

        {/* Nossa Origem Section */}
        <section id="origem" className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto border-b border-white/5 bg-[#050505] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* LEFT — Text content */}
            <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
              {/* Bubble title — matching the main page style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <p className="text-[#FF6B1A] font-sans text-xs font-bold tracking-[0.3em] uppercase mb-4 opacity-80">
                  NOSSA HISTÓRIA
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
                  <span className="text-[#FF6B1A] font-semibold italic text-base sm:text-lg">&ldquo;Seu Marquinho! Seu Marquinho!&rdquo;</span>
                </p>
                
                <p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light">
                  E esse foi o start para que tudo começasse. Desenvolveram uma logo e resolveram criar uma marca de produtos e alguns acessórios. Dessa forma e <span className="text-white font-semibold">literalmente através de uma resenha e zoeira</span> era criado o 
                  <span className="text-[#FF6B1A] font-bold"> Seu Marquinho</span>.
                </p>
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

        {/* Criadores Section (Bento Grid) */}
        <section id="criadores" className="py-24 bg-surface-container-lowest border-y border-outline-variant/10">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <h2 className="font-headline-md text-headline-md text-center mb-16 italic tracking-widest uppercase">
              DA RESENHA AO DROP
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 group relative overflow-hidden aspect-[16/9] bg-black border border-outline-variant/10">
                <Image 
                  src="/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6490.jpg"
                  alt="Bruno, Daniel e Felipe - Criadores da marca Seu Marquinho"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none select-none"
                />
              </div>

              <div className="md:col-span-5 space-y-8">
                <div className="border-l-4 border-primary-container pl-6">
                  <h3 className="font-display-lg text-display-lg-mobile text-primary uppercase leading-tight">
                    BRUNO, DANIEL &amp; FELIPE
                  </h3>
                  <p className="font-label-sm text-label-sm text-primary-container tracking-[0.2em] uppercase mt-2 font-bold">
                    Os Fundadores
                  </p>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Os três amigos que transformaram conversas descontraídas e apelidos de favela em uma grife urbana autêntica. Unindo a vivência das calçadas do Vidigal com o design contemporâneo para criar um movimento cultural real.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Lookbook Section */}
        <section id="lookbook" className="py-24 bg-[#050505] border-b border-white/5 overflow-hidden">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#FF6B1A] font-sans text-xs font-bold tracking-[0.3em] uppercase mb-4 block opacity-80 animate-pulse">
                LOOKBOOK OFICIAL
              </span>
              <h2 className="bubble-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-center">
                A Alma das Vielas
              </h2>
              <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed font-light">
                Explore a coleção fotográfica que traduz o lifestyle Seu Marquinho. Cliques reais, recortes urbanos e a atitude carioca em foco.
              </p>
            </div>

            {/* Masonry-like grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {LOOKBOOK_IMAGES.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  onClick={() => setActiveLookbookIndex(index)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_30px_rgba(255,107,26,0.15)] transition-all duration-300"
                >
                  {/* Aspect Ratio Container */}
                  <div className={`relative w-full ${img.aspect} overflow-hidden`}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                      <span className="text-[#FF6B1A] font-sans text-xs font-bold tracking-wider uppercase mb-1">
                        LOOKBOOK
                      </span>
                      <h4 className="text-white font-sans text-lg font-bold uppercase tracking-tight">
                        {img.caption}
                      </h4>
                    </div>
                    
                    {/* Subtle border outline */}
                    <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-xl pointer-events-none z-20" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Histórias das Ruas (Blog Grid) */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2 uppercase">
                HISTÓRIAS DAS RUAS
              </h2>
              <p className="font-label-sm text-label-sm text-primary-container tracking-widest uppercase">
                Crônicas Urbanas &amp; Drops
              </p>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-label-sm text-label-sm border border-primary px-8 py-3 hover:bg-primary hover:text-black transition-all uppercase tracking-widest font-bold cursor-pointer"
            >
              VER TUDO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article 
                key={post.id} 
                onClick={() => setActiveBlogPost(post)}
                className="card-hover-reveal border border-outline-variant/10 p-4 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square overflow-hidden mb-6 bg-surface-container-high relative border border-white/5">
                    {post.hotDrop && (
                      <div className="absolute top-4 left-4 z-10 bg-error px-3 py-1 font-label-sm text-label-sm text-white font-bold uppercase tracking-wider">
                        HOT DROP
                      </div>
                    )}
                    <Image 
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-w-768px) 100vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <time className="font-label-sm text-label-sm text-on-surface-variant mb-2 block uppercase tracking-wider">{post.date}</time>
                  <h3 className="font-headline-md text-headline-md text-primary mb-4 group-hover:text-primary-container transition-colors uppercase leading-snug">
                    {post.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                
                <span className="font-label-sm text-label-sm text-primary flex items-center gap-2 uppercase tracking-widest mt-auto font-bold group-hover:text-primary-container">
                  LER ARTIGO 
                  <span className="material-symbols-outlined text-[16px] text-xs">arrow_forward</span>
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-t border-outline-variant">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start text-left">
          
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
              <Link href="/#catalogo" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Todos os Produtos</Link>
              <Link href="/colecoes" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Coleções</Link>
              <Link href="/blog#origem" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Nossa Origem</Link>
              <Link href="/blog#criadores" className="text-on-surface-variant hover:text-primary text-xs transition-colors text-left">Criadores</Link>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-on-surface-variant hover:text-primary text-xs transition-colors cursor-pointer text-left">Blog das Ruas</button>
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
                <div className="flex flex-col items-center opacity-65 text-[#e2e2e2]">
                  <span className="material-symbols-outlined text-lg">shield</span>
                  <span className="text-[7px] uppercase font-bold tracking-tighter mt-0.5">SSL Seguro</span>
                </div>
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

      {/* --- BLOG READER MODAL DRAWER --- */}
      <AnimatePresence>
        {activeBlogPost && (
          <>
            {/* Backdrop with premium blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBlogPost(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-4 md:inset-10 lg:inset-20 z-55 bg-[#090909] border border-white/10 shadow-2xl flex flex-col max-w-5xl mx-auto overflow-hidden rounded-lg"
            >
              {/* Header section with Close Button */}
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={() => setActiveBlogPost(null)}
                  className="p-3 bg-black/60 hover:bg-[#ffdb58] text-white hover:text-black rounded-none border border-white/10 transition-colors cursor-pointer"
                  aria-label="Fechar artigo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {/* Hero Cover Image inside Modal */}
                <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] bg-black">
                  <Image 
                    src={activeBlogPost.image}
                    alt={activeBlogPost.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    className="object-cover opacity-85 select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/40 to-transparent"></div>
                  
                  {/* Hero Title and Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-left">
                    <div className="flex items-center gap-3 font-label-sm text-label-sm text-primary-container mb-3 uppercase">
                      <Calendar className="w-4 h-4" />
                      <span>{activeBlogPost.date}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-white/60">Streetwear Carioca</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter max-w-3xl leading-tight">
                      {activeBlogPost.title}
                    </h2>
                  </div>
                </div>

                {/* Content Body */}
                <div className="px-6 py-10 md:px-16 md:py-16 max-w-3xl mx-auto space-y-6 text-[#cfc6af] font-body-lg text-body-lg font-light leading-relaxed">
                  {activeBlogPost.content.map((paragraph, index) => (
                    <p key={index} className="first-letter:text-[#ffdb58] first-letter:text-2xl first-letter:font-bold">
                      {paragraph}
                    </p>
                  ))}
                  
                  {/* Quote or callout inside modal */}
                  <div className="border-l-4 border-[#ffdb58] bg-[#111111] p-6 my-8 font-display italic text-[#fff9f3] text-sm md:text-base">
                    "O streetwear nacional não consome apenas tendências, ele dita o passo do asfalto global."
                  </div>
                  
                  {/* Footer inside modal */}
                  <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                    <button 
                      onClick={() => setActiveBlogPost(null)}
                      className="flex items-center gap-2 font-label-sm text-label-sm text-[#ffdb58] hover:text-[#fff9f3] transition-colors cursor-pointer uppercase font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar para a página</span>
                    </button>
                    <span className="font-label-sm text-label-sm text-white/30 uppercase tracking-widest">Seu Marquinho Co.</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

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
    </div>
  );
}
