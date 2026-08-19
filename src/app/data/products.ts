// Shared product data and types used by Home page + Product Detail Page

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[]; // additional gallery images
  category: "camisas" | "bones";
  badge?: "NEW" | "LIMITED" | "LANÇAMENTO";
  description: string;
  descriptionLong?: string;
  sizes?: string[];
  esgotado?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}


// 6 Actual Products from the store with real local asset mapping
export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Camiseta Street Logo Off-White",
    price: 180.00,
    image: "/PRODUTOS E LOGO/OFF-WHITE.png",
    images: [
      "/PRODUTOS E LOGO/OFF-WHITE.png",
      "/PRODUTOS E LOGO/OFF-WHITE 01.png",
      "/PRODUTOS E LOGO/OFF-WHITE 02.png",
      "/PRODUTOS E LOGO/OFF-WHITE 03.png",
      "/PRODUTOS E LOGO/OFF-WHITE 04.png",
    ],
    category: "camisas",
    badge: "NEW",
    sizes: ["P", "M", "G", "GG", "XG"],
    description: "Pensa num produto que tem história, é essa camiseta!",
    descriptionLong: "Pensa num produto que tem história, é essa camiseta!\n\nInformações Técnicas:\n- 100% algodão fio 30.1 penteado\n- Gramatura: 180 g/m²\n- Gola de 2,7 cm, ribana canelada 2×1 com elastano e pesponto de 2 agulhas\n- Reforço ombro a ombro\n- Bainha e barras com 2 cm\n- Etiqueta interna de composição\n- Etiqueta de tamanho no ombro\n\nTabela de Medidas:\n- P: Larg. 54 cm | Comp. 73 cm | Man. 22 cm\n- M: Larg. 56 cm | Comp. 75 cm | Man. 23 cm\n- G: Larg. 58 cm | Comp. 77 cm | Man. 24 cm\n- GG: Larg. 60 cm | Comp. 79 cm | Man. 25 cm\n- XG: Larg. 62 cm | Comp. 81 cm | Man. 26 cm\n\nKit Seu Marquinho:\n- ziplock\n- sacola reutilizável\n- chaveiro retrô"
  },
  {
    id: "prod-2",
    name: "Camiseta Street Logo Preta",
    price: 180.00,
    image: "/PRODUTOS E LOGO/BLACK 01.png",
    images: [
      "/PRODUTOS E LOGO/BLACK 01.png",
      "/PRODUTOS E LOGO/BLACK 03.png",
      "/PRODUTOS E LOGO/BLACK 04.png",
    ],
    category: "camisas",
    sizes: ["P", "M", "G", "GG", "XG"],
    description: "Pensa num produto que tem história, é essa camiseta!",
    descriptionLong: "Pensa num produto que tem história, é essa camiseta!\n\nInformações Técnicas:\n- 100% algodão fio 30.1 penteado\n- Gramatura: 180 g/m²\n- Gola de 2,7 cm, ribana canelada 2×1 com elastano e pesponto de 2 agulhas\n- Reforço ombro a ombro\n- Bainha e barras com 2 cm\n- Etiqueta interna de composição\n- Etiqueta de tamanho no ombro\n\nTabela de Medidas:\n- P: Larg. 54 cm | Comp. 73 cm | Man. 22 cm\n- M: Larg. 56 cm | Comp. 75 cm | Man. 23 cm\n- G: Larg. 58 cm | Comp. 77 cm | Man. 24 cm\n- GG: Larg. 60 cm | Comp. 79 cm | Man. 25 cm\n- XG: Larg. 62 cm | Comp. 81 cm | Man. 26 cm\n\nKit Seu Marquinho:\n- ziplock\n- sacola reutilizável\n- chaveiro retrô"
  },
  {
    id: "prod-3",
    name: "Boné Five Panel Preto Logo Seu Marquinho",
    price: 135.00,
    image: "/PRODUTOS E LOGO/Boné Five Panel Preto Logo Seu Marquinho.PNG",
    images: [
      "/PRODUTOS E LOGO/Boné Five Panel Preto Logo Seu Marquinho.PNG",
      "/PRODUTOS E LOGO/Boné Five Panel Preto Logo Seu Marquinho (verso foto 02).webp"
    ],
    category: "bones",
    badge: "LIMITED",
    description: "Boné Five Panel Preto Logo Seu Marquinho.",
    descriptionLong: "Boné Five Panel Preto Logo Seu Marquinho\n\nEspecificações:\n- Desestruturado\n- Tecido 100% Poliamida\n- Tamanho Único\n\nKit Seu Marquinho:\n- ziplock\n- sacola reutilizável\n- chaveiro retrô"
  },
  {
    id: "prod-4",
    name: "Boné Dadhat Preto Logo Seu Marquinho",
    price: 117.00,
    image: "/PRODUTOS E LOGO/Boné Dadhat Preto Logo Seu Marquinho.PNG",
    images: [
      "/PRODUTOS E LOGO/Boné Dadhat Preto Logo Seu Marquinho.PNG"
    ],
    category: "bones",
    description: "Boné Dad Hat em sarja preta de alta gramatura com fecho regulável e o bordado frontal clássico do Seu Marquinho.",
    descriptionLong: "O Dad Hat Preto com Logo Seu Marquinho é o acessório indispensável do dia a dia. Confeccionado em sarja preta de alta gramatura com aba levemente curvada para aquele caimento relaxado perfeito. Bordado frontal do logo completo Seu Marquinho em linha premium. Fecho regulável metálico com passante. Conforto o dia inteiro, estilo o tempo todo."
  },
  {
    id: "prod-5",
    name: "Boné DadHat Preto SM",
    price: 117.00,
    image: "/PRODUTOS E LOGO/Boné DadHat Preto SM (esse que está esgotado).webp",
    images: [
      "/PRODUTOS E LOGO/Boné DadHat Preto SM (esse que está esgotado).webp",
      "/PRODUTOS E LOGO/Boné DadHat Preto SM (verso foto 02).webp"
    ],
    category: "bones",
    description: "Boné Dad Hat clássico preto com bordado geométrico SM. Edição limitada premium.",
    descriptionLong: "O Dad Hat Preto SM traz o monograma geométrico 'SM' bordado com precisão no painel frontal. Sarja premium preta com acabamento matte. Aba curvada desestruturada para máximo conforto. Fecho regulável com passante metálico."
  },
  {
    id: "prod-6",
    name: "Boné Five Panel Redinha Preto SM",
    price: 135.00,
    image: "/PRODUTOS E LOGO/Boné Five Panel Redinha Preto SM.PNG",
    images: [
      "/PRODUTOS E LOGO/Boné Five Panel Redinha Preto SM.PNG",
      "/PRODUTOS E LOGO/Boné Five Panel Redinha Preto SM (verso foto 02).webp"
    ],
    category: "bones",
    description: "Boné Five Panel com ajuste strapback e lateral em tela (redinha) respirável para o máximo conforto.",
    descriptionLong: "O Boné Five Panel Redinha Preto SM é a fusão perfeita entre estilo urbano e funcionalidade. Conta com painéis laterais em tela (redinha) que garantem ventilação superior nos dias quentes do Rio. Estrutura five panel clássica com frente flat e bordado frontal do logo SM. Ajuste strapback regulável para encaixe perfeito."
  }
,
  {
    id: "prod-7",
    name: "DadHat Cinza SM",
    price: 117.00,
    image: "/PRODUTOS E LOGO/LANÇAMENTOS BONÉS/DadHat Cinza SM - Frente.png",
    images: [
      "/PRODUTOS E LOGO/LANÇAMENTOS BONÉS/DadHat Cinza SM - Frente.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS BONÉS/DadHat Cinza SM - Lateral etiqueta.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS BONÉS/DadHat Cinza SM - Traseira.png"
    ],
    category: "bones",
    badge: "LANÇAMENTO",
    description: "Boné DadHat Cinza SM com acabamento premium e estilo único.",
    descriptionLong: "O DadHat Cinza SM é a escolha perfeita para um visual urbano e sofisticado. Com material resistente e ajuste perfeito, é ideal para o uso diário."
  },
  {
    id: "prod-8",
    name: "DadHat Off White SM",
    price: 117.00,
    image: "/PRODUTOS E LOGO/LANÇAMENTOS BONÉS/DadHat Off White SM -  Frente.png",
    images: [
      "/PRODUTOS E LOGO/LANÇAMENTOS BONÉS/DadHat Off White SM -  Frente.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS BONÉS/DadHat Off White SM - Lateral Etiqueta.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS BONÉS/DadHat Off White SM - Traseira.png"
    ],
    category: "bones",
    badge: "LANÇAMENTO",
    description: "Boné DadHat Off White SM para um estilo autêntico.",
    descriptionLong: "Com o DadHat Off White SM, você eleva seu estilo com um toque clássico e moderno. Estrutura durável e design exclusivo para combinar com qualquer look."
  },
  {
    id: "prod-9",
    name: "Camiseta Street Logo Floral SM Off White",
    price: 180.00,
    image: "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Floral SM Off White 01.png",
    images: [
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Floral SM Off White 01.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Floral SM Preta 02.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Floral SM Off White 03.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Floral SM Off White 04.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Floral SM Off White 05.png"
    ],
    category: "camisas",
    badge: "LANÇAMENTO",
    sizes: ["P", "M", "G", "GG", "XG"],
    description: "Camiseta Street Logo Floral SM Off White com design urbano e estampa exclusiva.",
    descriptionLong: "A Camiseta Street Logo Floral SM Off White destaca-se pela sua estampa marcante e qualidade excepcional. Feita em 100% algodão, proporciona conforto absoluto e um estilo inconfundível para o dia a dia."
  },
  {
    id: "prod-10",
    name: "Camiseta Street Logo Grafite SM Preta",
    price: 180.00,
    image: "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Grafite SM Preta 01.png",
    images: [
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Grafite SM Preta 01.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Grafite SM Preta 02.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Grafite SM Preta 03.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Grafite SM Preta 04.png",
      "/PRODUTOS E LOGO/LANÇAMENTOS CAMISETAS/Camiseta Street Logo Grafite SM Preta 05.png"
    ],
    category: "camisas",
    badge: "LANÇAMENTO",
    sizes: ["P", "M", "G", "GG", "XG"],
    description: "Camiseta Street Logo Grafite SM Preta com visual moderno e atitude.",
    descriptionLong: "Com a Camiseta Street Logo Grafite SM Preta, você leva o estilo das ruas para o seu guarda-roupa. Confeccionada com materiais premium, oferece durabilidade e um caimento impecável."
  }
];

// Helper to format currency in a locale-independent way to prevent hydration mismatches
export const formatPrice = (value: number) => {
  return value.toFixed(2).replace(".", ",");
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(p => p.id === id);
};

// Get related products (same category, excluding current)
export const getRelatedProducts = (product: Product, limit = 4): Product[] => {
  const sameCategory = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  );
  const others = PRODUCTS.filter(
    p => p.category !== product.category && p.id !== product.id
  );
  const result = [...sameCategory, ...others];
  return result.slice(0, limit);
};
