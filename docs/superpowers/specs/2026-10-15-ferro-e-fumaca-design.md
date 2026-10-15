# Ferro & Fumaça — site de hamburgueria para portfólio

> Spec de design · 15/10/2026 · Raphael Elias Senhorinho (com Claude Code)

## 1. Objetivo

Construir o site de uma hamburgueria/steakhouse **fictícia**, a *Ferro & Fumaça — Burger & Grill*, como peça de portfólio de freelancer. O site precisa provar, em poucos segundos de visita, que o autor entrega um site de restaurante profissional: visual marcante, várias páginas, ótimo no celular, rápido, e com as funções que donos de hamburgueria realmente pedem (cardápio digital, pedido pelo WhatsApp, reserva de mesa).

O código é organizado como **template reaproveitável**: todo o conteúdo (cardápio, horários, endereço, fotos, textos de listas) fica em arquivos de dados, de modo que um próximo cliente real exige trocar dados, não reescrever código.

## 2. Público e critérios de sucesso

**Quem vê:**
1. Possíveis clientes (donos de restaurante) que abrem o link ou veem os prints do projeto.
2. Clientes técnicos que olham o repositório no GitHub.

**Pronto quando:**
- Existe um link público na Vercel funcionando, com as 6 abas (Início, Cardápio, Sobre, Galeria, Reservas, Contato) e uma página 404 própria.
- Tudo funciona em celular (390 px) e desktop (1440 px), sem rolagem horizontal.
- O carrinho gera a mensagem de pedido correta e abre o WhatsApp.
- A reserva valida os campos, confirma com código e abre o WhatsApp.
- `npm run build`, `npm run lint`, testes unitários e testes de navegador passam.
- Lighthouse (mobile) com meta de ≥ 90 em Performance, Acessibilidade, Boas práticas e SEO (o SEO conta com o `noindex` intencional — ver §13).
- O repositório tem README em português com prints, e há um conjunto de prints prontos para subir no Workana.

## 3. Restrições e decisões

| Tema | Decisão |
|---|---|
| Custo | Zero: Vercel (plano Hobby), GitHub grátis, fotos do Unsplash. |
| Stack | Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, páginas estáticas. |
| Backend | Nenhum. Sem banco, sem API. Toda a lógica roda no navegador. |
| Restaurante | Fictício: nome, endereço, telefone, história e depoimentos inventados. Rodapé avisa "restaurante fictício · projeto de portfólio". |
| Indexação | `noindex` em todas as páginas, para o restaurante inexistente não aparecer em buscas do Google. A prévia do link (Open Graph) continua funcionando. |
| Contato do desenvolvedor | **Nenhum dado de contato pessoal no site** (nem e-mail, nem WhatsApp). O crédito é só o nome: "Desenvolvido por Raphael Elias Senhorinho". Motivo: a central de ajuda do Workana diz que "solicitar ou enviar informações de contato pessoal (…) pode resultar na suspensão ou no encerramento definitivo da sua conta". |
| WhatsApp do restaurante | Na demo fica vazio. Os botões abrem `https://wa.me/?text=…` (o WhatsApp abre com a mensagem pronta e a pessoa escolhe o contato). Para um cliente real, basta preencher o número em `src/data/site.ts`. |
| Telefone do restaurante | Exibido como texto, sem link, com número inválido de propósito, `(11) 1777-0450` (no Brasil, números locais não começam com 1). Assim ninguém liga para um número real por engano. |
| Redes sociais | Não exibidas na demo (campo opcional no `site.ts`; o componente some se estiver vazio). |
| Idioma | Interface e README em português (pt-BR). Identificadores e comentários de código em inglês. Commits em português com prefixos convencionais (`feat:`, `fix:`, `docs:`…). |

## 4. Marca e direção visual

**Conceito:** hamburgueria urbana na Vila Madalena (São Paulo). O burger é feito na chapa de ferro a 300 °C e as carnes são defumadas na lenha de laranjeira. Estética "industrial quente": ferro, carvão, papel de açougue, brasa. Fotos grandes e escuras, tipografia condensada e pesada, detalhes de carimbo.

**Origem do nome (usada na página Sobre):** os sócios fictícios Bruno **Ferr**az, que domina a chapa, e Léo **Fum**agalli, que nunca deixa o defumador apagar.

**Cores (tokens no `@theme` do Tailwind):**

| Token | Hex | Uso |
|---|---|---|
| `carvao` | `#12100E` | fundo principal |
| `carvao-2` | `#1B1815` | superfícies (cards, gaveta) |
| `carvao-3` | `#26221E` | bordas e superfícies elevadas |
| `osso` | `#F3EADB` | texto sobre escuro; fundo das seções "papel de açougue" |
| `osso-2` | `#E7DCC8` | variação de superfície clara |
| `fumaca` | `#A39A8E` | texto secundário sobre escuro |
| `brasa` | `#E8501C` | destaques, botões principais (texto `carvao` sobre `brasa`) |
| `brasa-escura` | `#B83A12` | hover; texto pequeno laranja sobre fundo claro |
| `mostarda` | `#F2B33D` | selos ("mais pedido", "novo") |

Contraste verificado: `brasa` sobre `carvao` ≈ 5,0:1; `carvao` sobre `brasa` ≈ 5,0:1; `fumaca` sobre `carvao` ≈ 6,8:1; `brasa-escura` sobre `osso` ≈ 4,8:1. Texto branco sobre `brasa` (≈ 3,7:1) **não** é usado.

**Tipografia (via `next/font/google`, auto-hospedada):**
- Títulos: **Big Shoulders** (Display, peso 800–900, caixa alta), com cara de letreiro industrial.
- Logo: **Big Shoulders Stencil**, como carimbo em caixa de ferro.
- Texto: **Barlow** (400/500/600/700).
- Se o nome exato da família no Google Fonts mudou (ex.: famílias unificadas), usa-se o equivalente atual da mesma família.

**Detalhes recorrentes:**
- Rótulos de seção carimbados: `Nº 02 — FAVORITOS DA CASA` (caixa alta, espaçado, cor `brasa`, com fio curto).
- Textura granulada sutil (ruído SVG em tile, opacidade ~6%, sem `mix-blend-mode`, para não pesar no scroll do celular).
- Faixa letreiro rolando: `SMASH NA CHAPA ✦ DEFUMADOS NA LENHA ✦ CHOPE GELADO ✦ PÃO DA CASA ✦`.
- Fotos com cantos quase retos (2–4 px), zoom suave no hover, tratamento leve para dar unidade ao conjunto (gradiente escuro por cima onde há texto).
- Seções alternam escuro (carvão) e claro (papel de açougue) para criar ritmo.
- Animações de entrada discretas (fade + leve deslocamento) e marquee — **todas desligadas** com `prefers-reduced-motion: reduce`.

## 5. Estrutura global

**Cabeçalho (fixo, todas as páginas):**
- Logo à esquerda (wordmark stencil "FERRO & FUMAÇA" + "BURGER & GRILL" pequeno).
- Links: Início · Cardápio · Sobre · Galeria · Reservas · Contato (link ativo destacado).
- Selo de status ao vivo ("Aberto agora · até 23h" / "Fechado · abre terça às 18h"), só no desktop.
- Botão do carrinho com contador; botão "Peça agora" (abre a gaveta do carrinho).
- Transparente sobre o hero; ao rolar mais de ~24 px fica `carvao` translúcido com desfoque e borda inferior.
- Abaixo de 1024 px: ícone de menu → menu em tela cheia (links grandes, status, endereço, botão de pedido). Fecha com Esc, ao trocar de página e no botão fechar; trava o scroll do fundo; foco vai para o primeiro link.

**Rodapé:**
- Marca + frase + aviso "Restaurante fictício · projeto de portfólio".
- Endereço (Rua das Brasas, 450 · Vila Madalena · São Paulo – SP) com link "Como chegar" (busca do Google Maps por "Vila Madalena, São Paulo", já que a rua é fictícia).
- Horários e links de navegação.
- Linha final: `© 2026 Ferro & Fumaça · Desenvolvido por Raphael Elias Senhorinho · Fotos: Unsplash`.

**Componentes compartilhados:** link "Pular para o conteúdo", `PageHero` (foto de fundo + rótulo + título + subtítulo, usado em todas as páginas internas), `SectionLabel`, `Button` (variantes primária, contorno, fantasma; como link ou botão), `Marquee`, `Reveal` (animação de entrada com IntersectionObserver), `Toast` ("Smash Clássico adicionado · Ver pedido"), gaveta do carrinho (§7).

## 6. Páginas

### 6.1 Início (`/`)
1. **Hero** (altura total da tela): foto escura de burger em close, gradiente e brilho de brasa. Rótulo `VILA MADALENA · DESDE 2017`. Título **"Chapa de ferro. Fumaça de lenha."** Subtítulo: "Smash burgers na chapa a 300 °C, costela defumada por 12 horas na lenha de laranjeira e chope gelado. Do jeito que tem que ser." Botões **Ver cardápio** (primário) e **Reservar mesa** (contorno). Status ao vivo + "Delivery próprio na região".
2. **Faixa letreiro** (marquee).
3. **Os mais pedidos** (`Nº 02 — FAVORITOS DA CASA`): 4 cards gerados a partir dos itens com selo "mais pedido" (Smash Clássico, Ferro Duplo, Costela Defumada, Coxinhas de Costela), com foto, descrição curta, preço e "Adicionar". Link "Ver cardápio completo →".
4. **Do açougue à chapa** (seção clara, papel de açougue), em 3 etapas com foto:
   - 01 *Blend do nosso açougue*: acém, peito e costela Angus maturados por 21 dias e moídos toda manhã.
   - 02 *Pão do nosso forno*: brioche de fermentação natural, assado em fornadas pequenas antes de abrir a casa.
   - 03 *Fumaça de laranjeira*: defumador de 1 tonelada aceso 12 horas antes do serviço, sem fumaça líquida.
   - Números: **21 dias** de maturação · **12 h** de defumação · **300 °C** na chapa · **0** congelados.
5. **A casa**: foto do salão + texto curto sobre o food truck que virou endereço fixo + "Nossa história →".
6. **Depoimentos**: 3 citações curtas com primeiro nome + inicial + bairro. Fictícios, sem nota nem logo de plataformas reais.
7. **Faixa de fotos**: 6 imagens + "Ver galeria →".
8. **Chamada final** (foto de fogo ao fundo): "Bateu a fome?" com os botões **Fazer pedido** (abre o carrinho) e **Reservar mesa**.

### 6.2 Cardápio (`/cardapio`)
1. `PageHero`: "Feito na chapa, no fogo e na hora." / "Todos os burgers vêm no brioche da casa."
2. **Navegação de categorias fixa** abaixo do cabeçalho: Burgers · Da Brasa · Porções · Sobremesas & Shakes · Bebidas. No celular rola na horizontal. Destaca a categoria visível (scroll-spy com IntersectionObserver). Clique rola suavemente até a seção, com compensação da altura do cabeçalho.
3. Legenda de selos: Mais pedido · Picante · Vegetariano · Novo (ícones `lucide-react`: estrela, chama, folha, brilho).
4. **Seções por categoria**: título + frase de introdução + grade de cards (1/2/3 colunas). Cada card mostra foto 4:3, nome, preço, descrição, selos e botão "Adicionar". Depois de adicionar, o botão mostra a quantidade já no pedido ("No pedido: 2").
5. **Bebidas**: lista compacta em duas colunas, com linha pontilhada entre nome e preço (estilo cardápio de quadro) + uma foto de ambiente. Itens sem foto individual.
6. **Barra de pedido** fixa no rodapé da tela, só no celular e só nesta página, quando o carrinho não está vazio: "Ver pedido (3) · R$ 120,70".

### 6.3 Sobre (`/sobre`)
1. `PageHero`: "Nossa história" / "De um food truck a um endereço com cheiro de lenha."
2. **História** (texto + foto): começou em 2017 num food truck nas feiras gastronômicas de Pinheiros; o nome vem dos sobrenomes dos sócios (ver §4).
3. **Quatro pilares** (cards com ícone): Carne (blend próprio maturado 21 dias) · Pão (brioche de fermentação natural) · Fumaça (lenha de laranjeira, 12 h) · Chope (cervejarias artesanais do bairro).
4. **Linha do tempo**:
   - 2017: o food truck;
   - 2019: primeira casa, com 40 lugares;
   - 2022: defumador de 1 tonelada construído pela equipe;
   - 2024: varanda e balcão da chapa;
   - 2026: 250 mil burgers servidos.
5. **Números**: 250 mil burgers · 12 h de defumação · 21 dias de maturação · 120 lugares.
6. **Chamada**: "Venha sentir o cheiro de perto" → Reservar mesa / Como chegar.

### 6.4 Galeria (`/galeria`)
1. `PageHero`: "Galeria" / "Fumaça, chapa e gente feliz."
2. **Filtros** (botões com `aria-pressed`): Todos · Comida · Ambiente · Bastidores.
3. **Mosaico** com ~16 fotos (colunas CSS 1/2/3) e legenda no hover/foco.
4. **Visualizador em tela cheia** (`role="dialog"`, `aria-modal`):
   - imagem grande, legenda e contador ("3 / 16");
   - botões anterior/próximo, teclas ← → e Esc, deslize no celular;
   - o foco volta para a miniatura ao fechar e o scroll do fundo fica travado.
   - A navegação respeita o filtro ativo.

### 6.5 Reservas (`/reservas`)
1. `PageHero`: "Reservas" / "Sua mesa, sem fila." / "Reservas para até 12 pessoas. A confirmação é pelo WhatsApp."
2. **Formulário** (2/3 da largura no desktop) + **painel lateral** "Bom saber":
   - tolerância de 15 minutos;
   - reservas de terça a domingo;
   - a varanda é pet friendly;
   - aniversariante com reserva ganha sobremesa;
   - mais de 12 pessoas → eventos pelo WhatsApp;
   - tabela de horários.
3. **Campos:**
   - Nome*, WhatsApp/telefone* (máscara `(11) 98888-7777`) e e-mail (opcional).
   - Data* (`input type="date"`, mínimo hoje e máximo hoje + 60 dias).
   - Horário* (`select` preenchido conforme a data; desabilitado até escolher a data).
   - Pessoas* (botões − / +, de 1 a 12).
   - Área (cartões de opção: Salão · Varanda · Balcão da chapa).
   - Ocasião (Nenhuma · Aniversário · Encontro · Negócios · Confraternização) e observações.
4. **Validação** (regras em §8):
   - erros aparecem abaixo de cada campo (`aria-invalid` + `aria-describedby`);
   - ao enviar com erro, o foco vai para o primeiro campo inválido.
5. **Sucesso**: o formulário dá lugar a um card "Reserva solicitada!" com:
   - código `FF-XXXX` e resumo da reserva;
   - botão **Confirmar pelo WhatsApp** (mensagem pronta, §8);
   - botão **Fazer outra reserva**.

### 6.6 Contato (`/contato`)
1. `PageHero`: "Contato" / "Chega mais."
2. **Cards**:
   - Endereço, com link "Como chegar".
   - Telefone, só texto.
   - WhatsApp: botão "Chamar no WhatsApp", com mensagem inicial "Olá! Vim pelo site da Ferro & Fumaça.".
3. **Horários**: tabela com o dia de hoje destacado + status ao vivo.
4. **Mapa**: iframe do Google Maps (sem chave de API) centrado na Vila Madalena.
   - Tom escuro via filtro CSS (`grayscale` + `invert` + ajuste de contraste).
   - Carregamento `lazy` e `title` acessível.
5. **Perguntas frequentes** (`<details>/<summary>` estilizados):
   - Aceitam reservas?
   - Tem opção vegetariana?
   - Qual a área de entrega? (raio de 5 km; taxa de R$ 8, grátis a partir de R$ 150)
   - Pode levar pet? (sim, na varanda)
   - Fazem eventos? (a partir de 13 pessoas, pelo WhatsApp)
   - Quais formas de pagamento? (Pix, cartões, dinheiro)

### 6.7 Página 404
Número "404" em stencil gigante. Título "Essa passou do ponto." e texto "A página que você procurou virou carvão." Botões Ver cardápio / Voltar ao início.

## 7. Carrinho e pedido pelo WhatsApp

- **Estado**: `{ lines: { id, qty }[] }` num React Context com reducer. Persistido em `localStorage` (chave `ff:cart:v1`), com leitura e escrita em `try/catch`.
  - Ao carregar, ids que não existem mais no cardápio são descartados.
  - Quantidade por item fica entre 1 e 20.
- **Preços em centavos (inteiros)** em todo o código; formatação só na exibição (`Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`).
- **Gaveta lateral** (`role="dialog"`, foco preso dentro, fecha com Esc e clique fora), acessível de qualquer página.
  - **Carrinho vazio**: ilustração/texto e botão "Ver cardápio".
  - **Itens**: lista com miniatura, nome, preço unitário, controle − / + e remover.
  - **Tipo**: alternância **Delivery / Retirada**.
  - **Entrega**: taxa fixa de **R$ 8,00**, **grátis a partir de R$ 150,00** de subtotal; mostra quanto falta para o frete grátis. Retirada não tem taxa.
  - **Campos**: Nome*; se Delivery, Endereço (rua e número)* e Bairro*, mais Complemento opcional.
  - **Pagamento***: Pix · Cartão na entrega · Dinheiro. No dinheiro, aparece o campo "Troco para" (opcional; se preenchido, deve ser ≥ total).
  - **Observações**: campo livre.
  - **Restaurante fechado**: aviso "Estamos fechados agora; seu pedido entra na fila assim que abrirmos." O envio continua permitido.
- **Mensagem gerada** (formatação do WhatsApp com `*negrito*`):

```
*Novo pedido — Ferro & Fumaça*

2x Smash Clássico — R$ 73,80
1x Batata Rústica — R$ 24,90

Subtotal: R$ 98,70
Entrega: R$ 8,00
*Total: R$ 106,70*

*Entrega:* Rua das Flores, 123 — Pinheiros (apto 42)
*Pagamento:* Dinheiro (troco para R$ 120,00)
*Nome:* João
*Obs.:* sem cebola no Clássico
```

  - Na retirada, a linha de entrega vira `*Retirada no balcão*` e não aparece linha de taxa.
  - Com frete grátis: `Entrega: grátis`.
- **URL**: `https://wa.me/<numero>?text=<encodeURIComponent(msg)>`; sem número, `https://wa.me/?text=…`. Abre em nova aba.
- **Depois do envio**, a gaveta mostra: "Abrimos o WhatsApp com seu pedido. É só enviar a mensagem por lá." Botão **Limpar carrinho** e botão **Voltar**.

## 8. Reservas — regras

- **Fuso**: "hoje" e "agora" sempre calculados em `America/Sao_Paulo` (via `Intl.DateTimeFormat`), independente do fuso de quem acessa.
- **Data**: obrigatória, de hoje até hoje + 60 dias.
  - Segunda-feira é recusada: "Fechamos às segundas. Escolha outro dia."
  - Dia da semana calculado a partir de `YYYY-MM-DD` em UTC, sem erro de fuso.
- **Horários** a cada 30 min, da abertura até o fechamento − 90 min:

| Dia | Horários de reserva |
|---|---|
| terça a quinta | 18:00–21:30 |
| sexta | 18:00–22:30 |
| sábado | 12:00–22:30 |
| domingo | 12:00–20:30 |

  - Para hoje, só horários a partir de agora + 60 min. Sem horários disponíveis → mensagem "Não há mais horários hoje. Que tal amanhã?".
- **Nome**: obrigatório, ≥ 3 caracteres após `trim`, com pelo menos uma letra.
- **Telefone**: 10 ou 11 dígitos; DDD de 11 a 99; com 11 dígitos, o terceiro dígito é 9. A máscara aplica `(DD) 9XXXX-XXXX` / `(DD) XXXX-XXXX` enquanto digita.
- **E-mail**: opcional; se preenchido, formato válido.
- **Pessoas**: inteiro de 1 a 12. A interface não passa de 12 e mostra o atalho para eventos.
- **Código**: `FF-` + 4 caracteres de `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (sem 0/O/1/I/L).
- **Mensagem do WhatsApp:**

```
*Pedido de reserva — Ferro & Fumaça*
Código: FF-7K3Q
Nome: Ana Souza
Telefone: (11) 98888-7777
Data: sábado, 18/10/2026
Horário: 20:00
Pessoas: 4
Área: Varanda
Ocasião: Aniversário
Obs.: cadeira para bebê
```

Linhas opcionais (e-mail, área, ocasião, obs.) só aparecem se preenchidas. A ocasião "Nenhuma" conta como não preenchida.

## 9. Horários e status ao vivo

**Funcionamento:**

| Dia | Horário |
|---|---|
| segunda | fechado |
| terça a quinta | 18h às 23h |
| sexta | 18h à 0h |
| sábado | 12h à 0h |
| domingo | 12h às 22h |

Os horários são modelados em minutos `[abre, fecha]`, com `fecha ≤ 1440`; "0h" equivale a 1440, sem atravessar a meia-noite.

**Status** (função pura `getOpenStatus(date)`):
- **Aberto:** "Aberto agora · até 23h" (ou "até meia-noite").
- **Fechando:** "Fecha em breve · até 23h" quando faltam ≤ 30 min.
- **Fechado:** "Fechado · abre hoje às 18h", "… abre amanhã às 12h" ou "… abre terça às 18h".

Como as páginas são estáticas, o selo é um componente cliente. Ele renderiza um espaço reservado no servidor (evita diferença de hidratação), calcula o status após montar e atualiza a cada minuto.

## 10. Conteúdo (cardápio)

Preços em reais; o código guarda centavos.

**Burgers**:

| Item | Descrição | Preço | Selos |
|---|---|---|---|
| Smash Clássico | dois smashes de 90 g, queijo prato, cebola na chapa, picles da casa, molho Fumaça | 36,90 | mais pedido |
| Ferro Duplo | dois blends de 150 g, cheddar inglês, bacon de barriga defumado na casa, maionese de alho assado | 49,90 | mais pedido |
| Costela 12h | costela desfiada defumada por 12 h, queijo coalho tostado, cebola roxa em conserva, barbecue de rapadura | 52,90 | novo |
| Brasa Picante | blend de 180 g, pepper jack, jalapeños na brasa, cebola crispy, maionese de chipotle | 46,90 | picante |
| Trufado | blend de 180 g, brie, cogumelos na manteiga, aioli de trufa negra | 54,90 | — |
| Veggie na Brasa | hambúrguer de cogumelos e grão-de-bico, muçarela de búfala, tomate assado, pesto de rúcula | 42,90 | vegetariano |
| Smashinho | para os pequenos: um smash de 90 g, queijo prato e ketchup da casa, com batata pequena | 29,90 | — |

**Da Brasa**:

| Item | Descrição | Preço | Selos |
|---|---|---|---|
| Costela Defumada | 500 g de costela bovina defumada 12 h na lenha de laranjeira, farofa de manteiga e vinagrete; serve 2 | 98,90 | mais pedido |
| Picanha na Chapa | 350 g de picanha Angus fatiada, alho confitado, batata rústica e chimichurri | 89,90 | — |
| Ancho Maturado | 400 g de ancho maturado 21 dias, sal de parrilla, manteiga de ervas, purê rústico | 109,90 | — |
| Ribs BBQ | 600 g de costelinha suína no barbecue de rapadura, com coleslaw; serve 2 | 79,90 | — |

**Porções**:

| Item | Descrição | Preço | Selos |
|---|---|---|---|
| Batata Rústica | com casca, páprica defumada e aioli | 24,90 | vegetariano |
| Onion Rings | empanados na cerveja, com barbecue | 26,90 | vegetariano |
| Mac & Cheese Defumado | cheddar, queijo defumado, farofa de bacon | 29,90 | — |
| Coxinhas de Costela | 6 unidades, costela defumada com requeijão e geleia de pimenta | 32,90 | mais pedido |
| Linguiça Artesanal | linguiça de pernil defumada na casa, cebola caramelizada, mostarda escura | 34,90 | — |

**Sobremesas & Shakes**:

| Item | Descrição | Preço | Selos |
|---|---|---|---|
| Brownie na Chapa | brownie meio amargo aquecido na chapa, sorvete de creme e calda quente | 26,90 | — |
| Pudim Defumado | pudim de doce de leite com toque de fumaça e calda de caramelo | 19,90 | novo |
| Shake de Malte | sorvete de creme, malte crocante e chantilly | 24,90 | — |
| Shake de Doce de Leite | sorvete de creme, doce de leite e paçoca | 24,90 | — |

**Bebidas**:

| Item | Descrição | Preço | Selos |
|---|---|---|---|
| Chope Pilsen da Casa | 400 ml | 16,90 | — |
| Chope IPA | 400 ml, cervejaria artesanal parceira | 22,90 | — |
| Limonada Defumada | limão-taiti, alecrim e um toque de fumaça | 14,90 | novo |
| Caipirinha de Cachaça Artesanal | limão, açúcar e cachaça de alambique | 24,90 | — |
| Refrigerante Lata | 350 ml | 7,90 | — |
| Água Mineral | 500 ml, com ou sem gás | 5,90 | — |

**Outros dados:**
- `src/data/testimonials.ts` (3 depoimentos);
- `src/data/faq.ts` (6 perguntas);
- `src/data/timeline.ts` (5 marcos);
- `src/data/gallery.ts` (~16 fotos com categoria e `alt`);
- `src/data/site.ts`: nome, slogan, endereço, telefone, WhatsApp (vazio), horários, taxa e frete grátis, área de entrega, crédito do desenvolvedor e redes (vazias).

## 11. Arquitetura técnica

```
src/
  app/
    layout.tsx            fontes, metadados base, JSON-LD, CartProvider, cabeçalho, rodapé, gaveta, toasts
    page.tsx              Início
    cardapio/page.tsx  sobre/page.tsx  galeria/page.tsx  reservas/page.tsx  contato/page.tsx
    not-found.tsx         404
    opengraph-image.tsx   imagem de compartilhamento 1200×630 gerada no build (next/og)
    icon.svg              favicon (monograma/chama)
    globals.css           Tailwind 4 + @theme (cores, fontes), textura, utilitários
  components/
    layout/   SiteHeader, MobileMenu, SiteFooter, SkipLink
    ui/       Button, SectionLabel, PageHero, Marquee, Reveal, Toaster, Badge
    home/     Hero, Favorites, Process, HouseTeaser, Testimonials, GalleryStrip, FinalCta
    menu/     CategoryNav, MenuSection, MenuItemCard, DrinkList, MobileCartBar
    cart/     CartProvider, CartDrawer, CartButton, AddToCartButton, CheckoutForm
    gallery/  GalleryView, Lightbox
    reservation/ ReservationForm, ReservationSuccess
    info/     OpenStatus, HoursTable, MapEmbed, Faq
  data/       site.ts, menu.ts, gallery.ts, testimonials.ts, faq.ts, timeline.ts
  lib/        format.ts, phone.ts, cart.ts, whatsapp.ts, hours.ts, reservation.ts
  assets/
    images/   fotos (importação estática → largura/altura e blur automáticos)
    fonts/    fonte .ttf usada só na imagem de compartilhamento
tests/
  unit/       Vitest, um arquivo por módulo de lib/
  e2e/        Playwright (Edge do sistema, channel "msedge")
docs/
  superpowers/  spec e plano
  screenshots/  prints para o README e para o Workana
```

- Páginas são **Server Components** estáticos. Só as ilhas interativas são **Client Components** (cabeçalho, menu mobile, carrinho, botões de adicionar, navegação de categorias, galeria, formulário, status, toasts, Reveal).
- `lib/` contém **funções puras**, sem React e sem `Date.now()` escondido (o "agora" entra como parâmetro), testáveis isoladamente.
- **Dependências** de produção: `next`, `react`, `react-dom`, `lucide-react`. De desenvolvimento: as do `create-next-app` + `vitest` + `@playwright/test`. Nada além disso sem necessidade.
- Particularidades do Next 16 (ex.: `images.qualities`, `preload` × `priority`) são conferidas na documentação embutida em `node_modules/next/dist/docs/` antes de usar.

## 12. Imagens

- Fonte: **Unsplash**. A licença permite uso comercial sem atribuição; mesmo assim, o rodapé diz "Fotos: Unsplash" e o README lista os fotógrafos.
- Cerca de 35 fotos baixadas em ~1600–2000 px de largura (JPEG q≈75–80) para `src/assets/images/`, com nomes descritivos (`burger-smash-classico.jpg`).
- Todas as fotos são **conferidas visualmente** antes de entrar: precisam bater com o item (ex.: o Veggie precisa parecer vegetariano) e combinar com a estética escura.
- Uso via `next/image` com import estático: tamanhos responsivos (`sizes` corretos), AVIF/WebP automáticos na Vercel, `placeholder="blur"`. A imagem do hero é pré-carregada.
- Todo `alt` é descritivo e fica nos arquivos de dados.

## 13. SEO e compartilhamento

- `lang="pt-BR"`, `metadataBase` a partir de `VERCEL_PROJECT_PRODUCTION_URL` (variável automática da Vercel), com `http://localhost:3000` como fallback.
- Título com template `%s · Ferro & Fumaça`; padrão "Ferro & Fumaça · Burger & Grill na Vila Madalena". Descrição própria por página.
- **Open Graph / Twitter**: imagem 1200×630 gerada no build com a fonte da marca, foto escura e o nome. É ela que aparece quando o link é colado no WhatsApp, Workana ou LinkedIn.
- `robots: { index: false, follow: false }` via metadata. **Sem** `Disallow` no `robots.txt`, para os robôs de prévia de link continuarem lendo as tags Open Graph.
- JSON-LD `Restaurant` com os dados fictícios (demonstra a técnica; não é indexado por causa do `noindex`).
- `theme-color` `#12100E`.

## 14. Acessibilidade e performance

**Acessibilidade:**
- HTML semântico: `header`, `nav`, `main`, `footer` e títulos em ordem.
- Link "pular para o conteúdo" e foco visível (anel `brasa`).
- Diálogos (menu, gaveta, lightbox) com foco gerenciado e Esc.
- Botões de ícone com `aria-label`.
- Contraste AA (ver §4).
- `prefers-reduced-motion` respeitado (marquee, Reveal, scroll suave).

**Performance:**
- Tudo estático.
- Fontes auto-hospedadas sem salto de layout.
- Imagens otimizadas com `sizes` corretos e iframe do mapa `lazy`.
- JavaScript de cliente mínimo, só nas ilhas.
- Meta: Lighthouse mobile ≥ 90.

## 15. Testes

**Unitários (Vitest), escritos antes da implementação de cada módulo:**
- `format`:
  - `formatBRL(3690)` → `R$ 36,90` (com o espaço não separável que o `Intl` gera);
  - `maskPhone` / `isValidPhone`.
- `cart`:
  - adicionar, incrementar, decrementar até remover, limites 1–20, limpar;
  - subtotal, taxa, frete grátis no limite exato (R$ 150,00), total;
  - hidratação descartando ids desconhecidos.
- `whatsapp`:
  - pedido delivery com troco; retirada; frete grátis;
  - reserva com e sem campos opcionais;
  - URL com e sem número (texto codificado).
- `hours` (com datas UTC fixas convertidas para São Paulo):
  - segunda → fechado, abre terça;
  - terça 17:00 → abre hoje às 18h;
  - terça 22:45 → fecha em breve;
  - sexta 23:00 → aberto até meia-noite;
  - sexta 23:40 → fecha em breve, até meia-noite;
  - domingo 22:30 → abre terça;
  - horários de reserva por dia;
  - corte de 60 min para hoje.
- `reservation`:
  - cada regra do §8 (segunda, data passada, > 60 dias, horário fora da lista, telefone, nome, pessoas, e-mail);
  - entrada válida passa;
  - formato do código.

**Navegador (Playwright com o Edge do Windows, servidor `next start` após build):**
- Todas as rotas respondem 200, têm `h1` e não geram erro no console; links do cabeçalho navegam; rota inexistente mostra a 404.
- Carrinho: adicionar 2 itens no cardápio, mudar quantidade, preencher delivery, enviar. A URL do WhatsApp aberta contém itens e total corretos (texto decodificado).
- Reserva:
  - enviar vazio mostra erros;
  - segunda-feira mostra erro;
  - dados válidos levam à confirmação com código;
  - o link do WhatsApp contém o código.
- Celular (390×844): menu abre e navega; galeria abre, avança com o botão e fecha com Esc.
- **Prints** em 390×844 e 1440×900 de todas as páginas (acima da dobra e página inteira), que eu reviso visualmente antes de entregar.

## 16. Entrega

- **Pasta**: `C:\Users\rapha\Portfolio\ferro-e-fumaca`, repositório git na branch `main`.
- **README em português**: o que é (com o aviso de fictício), link ao vivo, prints, recursos, stack, como rodar (`npm install`, `npm run dev`, testes), como adaptar para um cliente (quais arquivos de `src/data` trocar) e créditos das fotos.
- **GitHub**: repositório público `ferro-e-fumaca` na conta do Raphael. Sem o GitHub CLI instalado, isso é feito na hora: ou o Raphael cria o repositório vazio no site e eu faço o push (o Git Credential Manager abre o login no navegador), ou instalo o GitHub CLI. **Confirmação explícita antes do primeiro push.** O e-mail dos commits é conferido nesse momento (pode-se usar o e-mail `noreply` do GitHub para não expor o e-mail pessoal).
- **Vercel**: o Raphael importa o repositório em vercel.com/new e clica em Deploy (o framework é detectado sozinho). Link esperado: `ferro-e-fumaca.vercel.app`, ou com sufixo se o nome estiver ocupado. A partir daí, cada push na `main` publica sozinho.
- **Verificação pós-deploy**: todas as rotas com HTTP 200 no domínio público, tags Open Graph presentes e imagem de compartilhamento carregando.
- **Material para o Workana**: 4–6 prints escolhidos (desktop e celular) em `docs/screenshots/`, prontos para "Projetos em Destaque", mais um texto curto de descrição do projeto. Orientação ao Raphael: no Workana, mostrar o projeto pelos prints no perfil (forma oficial). O link ao vivo fica para canais fora do Workana (LinkedIn, Instagram, GitHub, clientes diretos), já que relatos na comunidade do Workana indicam punição até para links externos em propostas.

## 17. Fora do escopo

Backend, banco de dados, painel administrativo, pagamento online, login, CMS, multi-idioma, personalização de itens (ponto da carne, adicionais), taxa de entrega por distância, integração com iFood, blog, múltiplas unidades.
