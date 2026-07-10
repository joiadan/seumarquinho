import React from "react";

export default function Marquee() {
  const text = "/// UNDERGROUND ESSENCE /// NEW DROP COMING SOON /// FREE SHIPPING OVER R$300";

  return (
    <div className="w-full overflow-hidden bg-street-white text-street-black py-3 flex border-y border-white/10 select-none">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {[...Array(4)].map((_, i) => (
          <span key={`a-${i}`} className="font-black uppercase tracking-widest text-sm mx-4">
            {text}
          </span>
        ))}
      </div>
      <div className="flex whitespace-nowrap animate-marquee items-center" aria-hidden="true">
        {[...Array(4)].map((_, i) => (
          <span key={`b-${i}`} className="font-black uppercase tracking-widest text-sm mx-4">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
