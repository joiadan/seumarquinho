const fs = require('fs');

const pageFile = 'src/app/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

const oldHistoryRegex = /<p className="text-\[#e2e2e2\] font-sans text-sm sm:text-base leading-relaxed font-light">\s*<span className="text-\[#FF6B1A\] font-bold">Seu Marquinho<\/span>, a marca que começou através de uma resenha[\s\S]*?<span className="text-\[#FF6B1A\] font-bold"> Seu Marquinho<\/span>.\s*<\/p>/;
const newHistoryHTML = `<p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light">
                  Tudo começou de bobeira, numa tarde de sol no Rio. Bruno, Daniel e Felipe sempre se comunicaram por apelidos. Mas a virada de chave rolou numa conveniência no Vidigal. Felipe soltou:
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
                    &ldquo;Coé Marquinho, vai querer mais alguma coisa?&rdquo;
                  </p>
                </motion.div>
                
                <p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light">
                  Um senhor que entrava no local ouviu e começou a chamar o Bruno com entusiasmo: 
                  <span className="story-quote text-base sm:text-lg">&ldquo;Seu Marquinho! Seu Marquinho!&rdquo;</span>
                </p>
                
                <p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light mt-4">
                  A zoeira virou piada interna e, logo depois, o estalo definitivo. Aquele nome tinha a energia e a espontaneidade da resenha deles. Dali para o papel foi um pulo: desenharam a logo e decidiram criar uma marca de bonés e acessórios. Assim nasceu o <span className="text-[#FF6B1A] font-bold"> Seu Marquinho</span>: uma marca que não surgiu de planos corporativos, mas da vivência real da favela.
                </p>

                <p className="text-[#e2e2e2] font-sans text-sm sm:text-base leading-relaxed font-light mt-4 font-semibold italic">
                  &ldquo;O streetwear nacional não consome apenas tendências, ele dita o passo do asfalto global.&rdquo;
                </p>`;

pageContent = pageContent.replace(oldHistoryRegex, newHistoryHTML);

const oldMonoRegex = /<h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">O Personagem &amp; Monograma SM<\/h4>\s*<p className="text-on-surface-variant font-sans text-sm leading-relaxed font-light">[\s\S]*?<\/p>/;
const newMonoHTML = `<h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">O Personagem &amp; Monograma SM</h4>
                      <p className="text-on-surface-variant font-sans text-sm leading-relaxed font-light mb-2">
                        O monograma SM nasceu com a missão de unir as três linhas retas do asfalto com as curvas e labirintos das vielas. Cada ângulo foi planejado para carregar peso e presença.
                      </p>
                      <p className="text-on-surface-variant font-sans text-sm leading-relaxed font-light">
                        O Marquinho queríamos um personagem raiz, nada contemporâneo, mas que carregasse a alma do malandro carioca. O olhar do personagem pode dizer várias coisas ou simplesmente nada!
                      </p>`;

pageContent = pageContent.replace(oldMonoRegex, newMonoHTML);

fs.writeFileSync(pageFile, pageContent, 'utf8');

const blogFile = 'src/app/blog/page.tsx';
let blogContent = fs.readFileSync(blogFile, 'utf8');

const blogOldHistoryRegex = /<p className="text-\[#e2e2e2\] font-sans text-sm sm:text-base leading-relaxed font-light">\s*<span className="text-\[#FF6B1A\] font-bold">Seu Marquinho<\/span>, a marca que começou através de uma resenha[\s\S]*?<span className="text-\[#FF6B1A\] font-bold"> Seu Marquinho<\/span>.\s*<\/p>/;
const blogNewHistoryHTML = newHistoryHTML.replace('story-quote text-base sm:text-lg', 'text-[#FF6B1A] font-semibold italic text-base sm:text-lg');

blogContent = blogContent.replace(blogOldHistoryRegex, blogNewHistoryHTML);

const oldPost1Regex = /\{\s*id: "post-1",[\s\S]*?\}\s*\},/m;
const newPost1 = `{
    id: "post-1",
    title: "Do Vidigal para as Ruas: A Origem do Seu Marquinho",
    date: "15 MAI 2026",
    excerpt: "Tudo começou de bobeira, numa tarde de sol no Rio. A zoeira virou piada interna e, logo depois, o estalo definitivo.",
    image: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/IMG_6490.jpg",
    imageAlt: "Estética Seu Marquinho lifestyle urbano no Rio de Janeiro.",
    hotDrop: true,
    content: [
      "Tudo começou de bobeira, numa tarde de sol no Rio. Bruno, Daniel e Felipe sempre se comunicaram por apelidos. Mas a virada de chave rolou numa conveniência no Vidigal. Felipe soltou: 'Coé Marquinho, vai querer mais alguma coisa?'.",
      "Um senhor que entrava no local ouviu e começou a chamar o Bruno com entusiasmo: 'Seu Marquinho! Seu Marquinho!'.",
      "A zoeira virou piada interna e, logo depois, o estalo definitivo. Aquele nome tinha a energia e a espontaneidade da resenha deles. Dali para o papel foi um pulo: desenharam a logo e decidiram criar uma marca de bonés e acessórios. Assim nasceu o Seu Marquinho: uma marca que não surgiu de planos corporativos, mas da vivência real da favela.",
      "O streetwear nacional não consome apenas tendências, ele dita o passo do asfalto global."
    ]
  },`;
blogContent = blogContent.replace(oldPost1Regex, newPost1);

const oldPost2Regex = /\{\s*id: "post-2",[\s\S]*?\}\s*\},/m;
const newPost2 = `{
    id: "post-2",
    title: "O Monograma SM e o Personagem Marquinho",
    date: "20 MAI 2026",
    excerpt: "Criar uma identidade visual para a Seu Marquinho exigia mais do que apenas um desenho bonito; era preciso traduzir a geometria e o contraste da nossa realidade.",
    image: "/PRODUTOS E LOGO/fotos para a capa parte de cima do site/sm tratada.png",
    imageAlt: "Design gráfico do monograma Seu Marquinho tratada para estampa premium.",
    content: [
      "Criar uma identidade visual para a Seu Marquinho exigia mais do que apenas um desenho bonito; era preciso traduzir a geometria e o contraste da nossa realidade. O monograma SM nasceu com essa missão: unir as três linhas retas e cruas do asfalto com as curvas e labirintos das vielas da comunidade.",
      "Cada ângulo do nosso logotipo foi planejado para carregar peso e presença. O monograma foi desenvolvido para ser de fácil reconhecimento e forte impacto visual, seja bordado na frente de um boné Five Panel ou estampado em silk em uma camiseta over de alta gramatura. Queríamos que quem usasse a marca sentisse o orgulho da representatividade urbana em cada detalhe.",
      "A imagem 'SM tratada' reflete perfeitamente esse espírito. Ela une fotografia urbana analógica com contraste agressivo, celebrando o monograma como um selo de autenticidade. Nosso design é o reflexo de quem vive a rua intensamente e entende que a moda da favela é, hoje, a vanguarda do design global.",
      "O Marquinho queríamos um personagem raiz, nada contemporâneo, mas que carregasse a alma do malandro carioca. O olhar do personagem pode dizer várias coisas ou simplesmente nada! Tem quem diga que foi inspirado em alguns de nós ou que tem alguma característica nossa, mas vai saber Marquin..."
    ]
  },`;
blogContent = blogContent.replace(oldPost2Regex, newPost2);

fs.writeFileSync(blogFile, blogContent, 'utf8');

console.log('Update successful');
