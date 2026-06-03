import type { Metadata } from "next";
import { Montserrat, Inter, Baloo_2 } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "SEU MARQUINHO | Estilo Urbano Premium",
  description: "Estilo urbano premium desenhado para quem não aceita o comum. Qualidade, estilo e autenticidade em cada detalhe.",
  keywords: ["streetwear", "moda urbana", "bonés premium", "camisetas heavyweight", "Seu Marquinho", "essential tees", "5-panel"],
  openGraph: {
    title: "SEU MARQUINHO | Estilo Urbano Premium",
    description: "Estilo urbano premium desenhado para quem não aceita o comum.",
    type: "website",
    locale: "pt_BR",
    siteName: "Seu Marquinho",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${inter.variable} ${baloo2.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#000000] text-[#e2e2e2] selection:bg-[#FFDB58] selection:text-black">
        {children}
      </body>
    </html>
  );
}

