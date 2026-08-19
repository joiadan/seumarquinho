"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// All media items for the hero carousel
const HERO_MEDIA = [
  {
    type: "image" as const,
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/transicao-sm-floral.png",
    alt: "Seu Marquinho — Transição Floral",
    objectPosition: "center",
  },
  {
    type: "image" as const,
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/transicao-sm-grafite.png",
    alt: "Seu Marquinho — Transição Grafite",
    objectPosition: "center",
  },
  {
    type: "video" as const,
    src: "/PRODUTOS E LOGO/VÍDEOS PARA PÁGINA INICIAL/VÍDEO LANÇAMENTO SITE.mp4",
    alt: "Vídeo Lançamento Site",
  },
  {
    type: "image" as const,
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/sm tratada.png",
    alt: "Seu Marquinho — Streetwear Premium",
    objectPosition: "center 39%",
  },
  {
    type: "image" as const,
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6490.jpg",
    alt: "Seu Marquinho — Lifestyle Urbano",
    objectPosition: "center",
  },
  {
    type: "image" as const,
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6815.jpg",
    alt: "Seu Marquinho — Coleção Exclusiva",
    objectPosition: "center 72%",
  },
  {
    type: "image" as const,
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_7061.jpg",
    alt: "Seu Marquinho — Atitude Urbana",
    objectPosition: "center 25%",
  },
  {
    type: "image" as const,
    src: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6448.PNG",
    alt: "Seu Marquinho — Urban Culture",
    objectPosition: "center 32%",
  },
];

const SLIDE_DURATION = 5000; // 5 seconds

// Rio Landmarks line-art overlay options that change dynamically per transition
const LANDMARK_DRAWINGS = [
  // 0: Cristo + Pão de Açúcar (Combined Skyline)
  {
    viewBox: "180 10 820 180",
    elements: (
      <>
        {/* Base line */}
        <line
          x1="240"
          y1="180"
          x2="950"
          y2="180"
          stroke="rgba(255,107,26,0.12)"
          strokeWidth="1.25"
        />

        {/* Cable Car Cable */}
        <motion.line
          x1="620"
          y1="95"
          x2="810"
          y2="40"
          stroke="rgba(255, 107, 26, 0.3)"
          strokeWidth="1"
          strokeDasharray="3,3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* Cable Car Cab (Larger Group with Warning Light) */}
        <motion.g
          initial={{ x: 627, y: 88 }}
          animate={{ x: 797, y: 38.8 }}
          transition={{
            duration: 14,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <rect width="13" height="8" rx="1.5" fill="#FF5500" opacity={0.9} />
          <motion.circle
            cx="6.5"
            cy="0"
            r="1.75"
            fill="#FF0000"
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Cristo Redentor Radar Beacon */}
        <circle cx="291" cy="30" r="3.5" fill="#FF5500" />
        <motion.circle
          cx="291"
          cy="30"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.5"
          initial={{ r: 3, opacity: 0.8 }}
          animate={{ r: 28, opacity: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Pão de Açúcar Radar Beacon */}
        <circle cx="810" cy="40" r="3.5" fill="#FF5500" />
        <motion.circle
          cx="810"
          cy="40"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.5"
          initial={{ r: 3, opacity: 0.8 }}
          animate={{ r: 24, opacity: 0 }}
          transition={{
            duration: 4,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Skyline Contour Path */}
        <motion.path
          d="M 0,180 L 120,180 C 200,180 250,150 280,80 L 282,80 L 282,70 L 285,70 L 285,45 L 265,45 L 265,40 L 285,40 L 285,30 C 285,27 288,24 291,24 C 294,24 297,27 297,30 L 297,40 L 317,40 L 317,45 L 297,45 L 297,70 L 300,70 L 300,80 L 302,80 C 330,130 380,180 460,180 L 520,180 C 560,180 580,95 620,95 C 640,95 660,105 670,120 C 680,128 700,128 710,120 C 740,90 760,40 810,40 C 850,40 870,100 900,180 L 1000,180"
          fill="none"
          stroke="url(#skyline-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: [0.25, 1, 0.36, 1] }}
        />
      </>
    ),
  },
  // 1: Arcos da Lapa
  {
    viewBox: "0 0 400 150",
    elements: (
      <>
        {/* Base line */}
        <line
          x1="20"
          y1="130"
          x2="380"
          y2="130"
          stroke="rgba(255,107,26,0.15)"
          strokeWidth="1.25"
        />

        {/* Arcos da Lapa Path */}
        {/* Arcos da Lapa Radar Beacon */}
        <circle cx="200" cy="70" r="3.5" fill="#FF5500" />
        <motion.circle
          cx="200"
          cy="70"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.5"
          initial={{ r: 3, opacity: 0.8 }}
          animate={{ r: 24, opacity: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Arcos da Lapa Path */}
        <motion.path
          d="M 50,130 L 50,70 L 350,70 L 350,130 M 50,100 L 350,100 M 70,130 A 15 15 0 0 1 100,130 M 120,130 A 15 15 0 0 1 150,130 M 170,130 A 15 15 0 0 1 200,130 M 220,130 A 15 15 0 0 1 250,130 M 270,130 A 15 15 0 0 1 300,130 M 320,130 A 15 15 0 0 1 350,130 M 72,100 A 12 12 0 0 1 96,100 M 122,100 A 12 12 0 0 1 146,100 M 172,100 A 12 12 0 0 1 196,100 M 222,100 A 12 12 0 0 1 246,100 M 272,100 A 12 12 0 0 1 296,100 M 322,100 A 12 12 0 0 1 346,100"
          fill="none"
          stroke="url(#skyline-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: [0.25, 1, 0.36, 1] }}
        />
      </>
    ),
  },
  // 2: Urca (Pão de Açúcar + Bondinho)
  {
    viewBox: "0 0 400 150",
    elements: (
      <>
        {/* Base line */}
        <line
          x1="20"
          y1="130"
          x2="380"
          y2="130"
          stroke="rgba(255,107,26,0.15)"
          strokeWidth="1.25"
        />

        {/* Cable Car Cable */}
        <motion.line
          x1="130"
          y1="70"
          x2="280"
          y2="35"
          stroke="rgba(255, 107, 26, 0.35)"
          strokeWidth="1"
          strokeDasharray="3,3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Cable Car Cab (Larger Group with Warning Light) */}
        <motion.g
          initial={{ x: 130, y: 64.3 }}
          animate={{ x: 274, y: 30.7 }}
          transition={{
            duration: 14,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <rect width="13" height="8" rx="1.5" fill="#FF5500" opacity={0.9} />
          <motion.circle
            cx="6.5"
            cy="0"
            r="1.75"
            fill="#FF0000"
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Sugarloaf Peak Radar Beacon */}
        <circle cx="280" cy="35" r="3.5" fill="#FF5500" />
        <motion.circle
          cx="280"
          cy="35"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.5"
          initial={{ r: 3, opacity: 0.8 }}
          animate={{ r: 24, opacity: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Urca Radar Beacon */}
        <circle cx="130" cy="70" r="3" fill="#FF5500" />
        <motion.circle
          cx="130"
          cy="70"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.25"
          initial={{ r: 2.5, opacity: 0.8 }}
          animate={{ r: 20, opacity: 0 }}
          transition={{
            duration: 4,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Skyline Urca Path */}
        <motion.path
          d="M 20,130 C 50,130 80,70 130,70 C 150,70 170,80 190,95 C 220,95 240,35 280,35 C 310,35 340,80 370,130 L 380,130"
          fill="none"
          stroke="url(#skyline-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: [0.25, 1, 0.36, 1] }}
        />
      </>
    ),
  },
  // 3: Arpoador Sunset
  {
    viewBox: "0 0 400 150",
    elements: (
      <>
        {/* Base line */}
        <line
          x1="20"
          y1="130"
          x2="380"
          y2="130"
          stroke="rgba(255,107,26,0.15)"
          strokeWidth="1.25"
        />

        {/* Sunrays & Sun */}
        <motion.path
          d="M 215,128 A 35 35 0 0 1 285,128 M 250,85 L 250,75 M 222,98 L 215,91 M 278,98 L 285,91"
          fill="none"
          stroke="rgba(255, 107, 26, 0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8 }}
          style={{ transformOrigin: "250px 128px" }}
        />

        {/* Pedra do Arpoador & Waves */}
        {/* Arpoador Radar Beacon */}
        <circle cx="95" cy="95" r="3.5" fill="#FF5500" />
        <motion.circle
          cx="95"
          cy="95"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.5"
          initial={{ r: 3, opacity: 0.8 }}
          animate={{ r: 24, opacity: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Pedra do Arpoador & Waves */}
        <motion.path
          d="M 30,130 C 50,130 70,95 95,95 C 115,95 125,90 140,115 C 145,123 150,128 160,128 M 160,128 C 190,123 220,133 250,128 C 280,123 310,133 340,128 L 380,128 M 180,136 C 210,132 240,140 270,136 C 300,132 330,140 360,136 M 210,144 C 235,141 260,147 285,144 C 310,141 335,147 360,144"
          fill="none"
          stroke="url(#skyline-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: [0.25, 1, 0.36, 1] }}
        />
      </>
    ),
  },
  // 4: Ipanema (Dois Irmãos + Waves)
  {
    viewBox: "0 0 400 150",
    elements: (
      <>
        {/* Morro Dois Irmãos Contour */}
        {/* Morro Dois Irmãos Contour */}
        <motion.path
          d="M 100,130 C 130,130 160,85 185,85 C 200,85 210,95 220,95 C 235,95 250,40 290,40 C 310,40 330,80 360,130"
          fill="none"
          stroke="rgba(255, 107, 26, 0.35)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: [0.25, 1, 0.36, 1] }}
        />

        {/* Dois Irmãos Peak 1 Radar Beacon */}
        <circle cx="290" cy="40" r="3.5" fill="#FF5500" />
        <motion.circle
          cx="290"
          cy="40"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.5"
          initial={{ r: 3, opacity: 0.8 }}
          animate={{ r: 24, opacity: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Dois Irmãos Peak 2 Radar Beacon */}
        <circle cx="185" cy="85" r="3" fill="#FF5500" />
        <motion.circle
          cx="185"
          cy="85"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.25"
          initial={{ r: 2.5, opacity: 0.8 }}
          animate={{ r: 20, opacity: 0 }}
          transition={{
            duration: 4,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Wavy beach lines */}
        <motion.path
          d="M 20,130 C 60,140 100,120 140,130 C 180,140 220,120 260,130 C 300,140 340,120 380,130 M 20,138 C 60,148 100,128 140,138 C 180,148 220,128 260,138 C 300,148 340,128 380,138 M 20,146 C 60,156 100,136 140,146 C 180,156 220,136 260,146 C 300,156 340,136 380,146"
          fill="none"
          stroke="url(#skyline-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: [0.25, 1, 0.36, 1] }}
        />
      </>
    ),
  },
  // 5: Rocinha Favela
  {
    viewBox: "0 0 400 150",
    elements: (
      <>
        {/* Base line */}
        <line
          x1="20"
          y1="130"
          x2="380"
          y2="130"
          stroke="rgba(255,107,26,0.15)"
          strokeWidth="1.25"
        />

        {/* Rocinha stacked houses and landscape contour */}
        {/* Rocinha Favela Radar Beacon */}
        <circle cx="320" cy="55" r="3.5" fill="#FF5500" />
        <motion.circle
          cx="320"
          cy="55"
          fill="none"
          stroke="#FF5500"
          strokeWidth="1.5"
          initial={{ r: 3, opacity: 0.8 }}
          animate={{ r: 24, opacity: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Rocinha stacked houses and landscape contour */}
        <motion.path
          d="M 30,130 L 370,130 M 50,130 C 120,130 190,90 320,55 M 100,130 L 100,115 L 125,115 L 125,130 M 125,130 L 125,105 L 155,105 L 155,130 M 155,130 L 155,110 L 180,110 L 180,130 M 130,105 L 130,90 L 150,90 L 150,105 M 180,130 L 180,95 L 210,95 L 210,130 M 160,110 L 160,95 L 175,95 L 175,110 M 210,130 L 210,85 L 240,85 L 240,130 M 190,95 L 190,80 L 210,80 L 210,95 M 240,130 L 240,75 L 270,75 L 270,130 M 220,85 L 220,70 L 235,70 L 235,85 M 250,75 L 250,60 L 265,60 L 265,75 M 110,122 H 116 M 140,117 H 146 M 140,97 H 146 M 195,112 H 201 M 225,102 H 231 M 255,92 H 261 M 200,80 V 70 M 230,70 V 58 M 258,60 V 48"
          fill="none"
          stroke="url(#skyline-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: [0.25, 1, 0.36, 1] }}
        />
      </>
    ),
  },
];

interface HeroCarouselProps {
  onPrev?: (fn: () => void) => void;
  onNext?: (fn: () => void) => void;
  showArrows?: boolean;
  onSlideChange?: (index: number) => void;
}

export default function HeroCarousel({
  onPrev,
  onNext,
  showArrows = true,
  onSlideChange,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex],
  );

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + HERO_MEDIA.length) % HERO_MEDIA.length,
    );
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_MEDIA.length);
  }, []);

  // Expose navigation functions to parent component
  useEffect(() => {
    if (onPrev) onPrev(prevSlide);
  }, [onPrev, prevSlide]);

  useEffect(() => {
    if (onNext) onNext(nextSlide);
  }, [onNext, nextSlide]);

  // Expose current index to parent
  useEffect(() => {
    if (onSlideChange) onSlideChange(currentIndex);
  }, [currentIndex, onSlideChange]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, nextSlide]);

  // Handle video playback for current slide
  useEffect(() => {
    const currentMedia = HERO_MEDIA[currentIndex];
    if (currentMedia.type === "video") {
      const videoEl = videoRefs.current.get(currentIndex);
      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      }
    }
  }, [currentIndex]);

  const currentMedia = HERO_MEDIA[currentIndex];
  const currentDrawing =
    LANDMARK_DRAWINGS[currentIndex % LANDMARK_DRAWINGS.length];

  // Framer motion variants for crossfade + subtle scale
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.12,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.95,
      x: dir > 0 ? -40 : 40,
    }),
  };

  return (
    <div
      className="hero-carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Cinematic 21:9 container */}
      <div className="hero-carousel-container">
        {/* Ambient glow behind */}
        <div className="hero-carousel-glow" />

        {/* Slide content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.8, ease: "easeInOut" },
              scale: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
              x: { duration: 0.8, ease: "easeInOut" },
            }}
            className="hero-carousel-slide"
          >
            {currentMedia.type === "image" ? (
              <div className="hero-carousel-image-wrapper">
                <Image
                  src={currentMedia.src}
                  alt={currentMedia.alt}
                  fill
                  priority={currentIndex === 0}
                  sizes="100vw"
                  quality={90}
                  className="hero-carousel-image"
                  style={{
                    objectPosition:
                      (currentMedia as any).objectPosition || "center",
                  }}
                />
              </div>
            ) : (
              <video
                ref={(el) => {
                  if (el) videoRefs.current.set(currentIndex, el);
                }}
                src={currentMedia.src}
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline={true}
                className="hero-carousel-video"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Cinematic letterbox gradients */}
        <div className="hero-carousel-overlay-top" />
        <div className="hero-carousel-overlay-bottom" />
        <div className="hero-carousel-overlay-left" />
        <div className="hero-carousel-overlay-right" />

        {/* Rio Skyline Line Overlay — Large & Prominent (changes dynamically per slide) */}
        <div className="absolute right-0 bottom-[5%] w-full h-[40%] sm:bottom-[5%] sm:w-[95%] sm:h-[45%] md:bottom-0 md:w-[85%] md:h-[60%] lg:w-[80%] lg:h-[65%] z-[15] pointer-events-none select-none opacity-90 md:opacity-100">
          <AnimatePresence mode="wait">
            <motion.svg
              key={`drawing-svg-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              viewBox={currentDrawing.viewBox}
              preserveAspectRatio="xMaxYMax meet"
              className="w-full h-full drop-shadow-[0_0_15px_rgba(255,107,26,0.3)]"
            >
              <defs>
                <linearGradient
                  id="skyline-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(255, 107, 26, 0)" />
                  <stop offset="20%" stopColor="rgba(255, 107, 26, 0.8)" />
                  <stop offset="50%" stopColor="rgba(255, 107, 26, 1)" />
                  <stop offset="80%" stopColor="rgba(255, 107, 26, 0.8)" />
                  <stop offset="100%" stopColor="rgba(255, 107, 26, 0)" />
                </linearGradient>
              </defs>

              {currentDrawing.elements}
            </motion.svg>
          </AnimatePresence>
        </div>

        {/* Subtle film grain texture */}
        <div className="hero-carousel-grain" />

        {/* Navigation Arrows */}
        {showArrows && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 md:p-3 rounded-full bg-black/40 hover:bg-[#FF6B1A] text-white hover:text-white border border-white/10 hover:border-[#FF6B1A] backdrop-blur-md transition-all duration-300 active:scale-90 hover:scale-110 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] group pointer-events-auto"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 md:p-3 rounded-full bg-black/40 hover:bg-[#FF6B1A] text-white hover:text-white border border-white/10 hover:border-[#FF6B1A] backdrop-blur-md transition-all duration-300 active:scale-90 hover:scale-110 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] group pointer-events-auto"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        <div className="hero-carousel-dots">
          {HERO_MEDIA.map((media, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`hero-dot ${index === currentIndex ? "hero-dot-active" : ""}`}
              aria-label={`Ir para slide ${index + 1}`}
            >
              {/* Progress bar inside active dot */}
              {index === currentIndex && !isPaused && (
                <motion.div
                  className="hero-dot-progress"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: SLIDE_DURATION / 1000,
                    ease: "linear",
                  }}
                  key={`progress-${currentIndex}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <div className="hero-carousel-counter">
          <span className="hero-carousel-counter-current">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="hero-carousel-counter-sep">/</span>
          <span className="hero-carousel-counter-total">
            {String(HERO_MEDIA.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
