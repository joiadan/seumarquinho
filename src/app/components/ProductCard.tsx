import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "../data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasSecondaryImage = product.images && product.images.length > 1;
  const secondaryImage = hasSecondaryImage ? product.images![1] : null;

  return (
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

        {/* Badges */}
        {product.esgotado ? (
          <span className={`absolute ${product.category === 'camisas' ? 'bottom-2 left-2' : 'top-2 left-2'} bg-[#000000] text-[#FFFFFF] text-[10px] tracking-widest font-bold px-2 py-1 uppercase z-10 border border-white/10`}>
            ESGOTADO
          </span>
        ) : product.badge ? (
          <div className={`absolute ${product.category === 'camisas' ? 'bottom-2 left-2' : 'top-2 left-2'} z-10 overflow-hidden`}>
            <span className="relative block bg-[#000000] text-[#FFFFFF] text-[10px] tracking-widest font-bold px-2 py-1 uppercase border border-white/10 overflow-hidden group-hover:border-white/30 transition-colors">
              {product.badge}
              {product.badge === 'LANÇAMENTO' && (
                <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />
              )}
            </span>
          </div>
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
  );
}
