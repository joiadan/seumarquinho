"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "../data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasSecondaryImage = product.images && product.images.length > 1;
  const secondaryImage = hasSecondaryImage ? product.images![1] : null;
  const isNew = product.badge === 'LANÇAMENTO' || product.badge === 'NEW';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      whileTap={{ scale: 0.96 }}
      className="w-full h-full"
    >
      <Link href={`/produto/${product.id}`} className="group flex flex-col w-full h-full cursor-pointer">
        {/* Image Container */}
        <div className={`relative w-full aspect-[4/5] bg-[#050505] overflow-hidden ${product.esgotado ? 'opacity-60 grayscale' : ''}`}>
          
          {/* Primary Image */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${
              hasSecondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
          />

          {/* Secondary Image (Hover State) */}
          {hasSecondaryImage && (
            <Image
              src={secondaryImage!}
              alt={`${product.name} lifestyle`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}

          {/* Gleam Effect for New Products */}
          {isNew && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
                repeatDelay: 3
              }}
              className="absolute inset-0 z-20 w-[150%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] pointer-events-none"
            />
          )}

          {/* Badges */}
          {product.esgotado ? (
            <span className={`absolute ${product.category === 'camisas' ? 'bottom-2 left-2' : 'top-2 left-2'} bg-[#000000] text-[#FFFFFF] text-[10px] tracking-widest font-bold px-2 py-1 uppercase z-30 border border-white/10`}>
              ESGOTADO
            </span>
          ) : product.badge ? (
            <motion.div 
              className={`absolute ${product.category === 'camisas' ? 'bottom-2 left-2' : 'top-2 left-2'} z-30 overflow-hidden`}
              animate={isNew ? { y: [0, -3, 0] } : {}}
              transition={isNew ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
            >
              <span className="relative block bg-[#000000] text-[#FFFFFF] text-[10px] tracking-widest font-bold px-2 py-1 uppercase border border-white/10 overflow-hidden group-hover:border-white/30 transition-colors">
                {product.badge}
                {isNew && (
                  <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />
                )}
              </span>
            </motion.div>
          ) : null}
        </div>

        {/* Info Container */}
        <div className="flex flex-col mt-4 text-left">
          <h3 className="text-sm font-bold uppercase text-current leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-[#a3a3a3] mt-1 font-medium">
            R$ {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
