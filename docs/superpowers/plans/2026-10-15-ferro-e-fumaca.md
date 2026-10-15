# Ferro & Fumaça — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir, testar e publicar na Vercel o site multipágina da hamburgueria fictícia Ferro & Fumaça, como peça de portfólio.

**Architecture:**
- Next.js 16 (App Router) com páginas estáticas (Server Components) e ilhas cliente só onde há interação.
- Regras de negócio em funções puras em `src/lib`, testadas com Vitest.
- Conteúdo em `src/data`, fotos locais em `src/assets`.
- Estado do carrinho num store externo lido via `useSyncExternalStore`.
- Testes de navegador com Playwright no Edge do Windows.

**Tech Stack:** Next.js 16.4.1 · React 19.3 · TypeScript 5 · Tailwind CSS 4 · lucide-react 1.57.0 · Vitest 5.0.5 · @playwright/test 1.64.1 (channel `msedge`)

**Spec:** `docs/superpowers/specs/2026-10-15-ferro-e-fumaca-design.md` (seções citadas como §N)

## Global Constraints

**Ambiente e comandos**
- Raiz do projeto: `C:\Users\rapha\Portfolio\ferro-e-fumaca`. Comandos rodam no Git Bash, a partir da raiz. Node 24 / npm 11.
- `AGENTS.md` do scaffold fica no repositório. Antes de usar uma API do Next de que não tenha certeza, ler `node_modules/next/dist/docs/`.

**Next 16 / Cache Components**
- Mantém-se a config do scaffold: `cacheComponents: true`, `partialPrefetching: true` e Tailwind via `@tailwindcss/turbopack`.
- Server Components **não** chamam `new Date()`, `Date.now()` nem `Math.random()`. Ano do rodapé: `SITE.copyrightYear`.
- Se `next build` acusar erro de Suspense/rota bloqueante num hook cliente (ex.: `usePathname`), envolver o componente em `<Suspense>` como o link do erro indica.
- Páginas visitadas ficam montadas e escondidas (`<Activity>`, `display:none`). Por isso estado e efeitos de página precisam tolerar "esconder e mostrar de novo".

**Lint (eslint-plugin-react-hooks 7) — erro se violar**
- Nada de `setState` síncrono dentro de `useEffect`.
- Nada de chamadas impuras (`Date.now`, `new Date()`, `Math.random`) durante o render.
- Padrões obrigatórios:
  - valores só do cliente ou externos (hora, carrinho, rolagem, "já hidratou") via `useSyncExternalStore`, com snapshot de servidor neutro;
  - `setState` só em handlers e callbacks de subscription;
  - "ajustar estado durante o render" (padrão do `prevPathname`) em vez de efeito.

**Imagens**
- `next/image` com import estático e `placeholder="blur"`.
- `preload` (nunca `priority`) só na imagem do hero da Início.
- Não passar `quality` (o padrão do Next 16 é `[75]`).
- `sizes` sempre que a imagem não ocupa largura fixa.

**Dados, texto e commits**
- Preços em centavos inteiros; exibição só via `formatBRL`.
- "Hoje/agora" sempre em `America/Sao_Paulo`.
- Interface em pt-BR; identificadores e comentários em inglês.
- Commits em pt-BR com prefixo convencional e, no fim da mensagem, a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

**Dependências**
- Produção: só `next`, `react`, `react-dom`, `lucide-react`.
- Desenvolvimento: as do scaffold + `vitest` + `@playwright/test`.

**Privacidade e contato (§3)**
- Nenhum dado de contato do desenvolvedor no site. O crédito é exatamente "Desenvolvido por Raphael Elias Senhorinho".
- Telefone do restaurante: `(11) 1777-0450`, só texto.
- `SITE.whatsapp = ''`, o que gera links `https://wa.me/?text=…`.
- `robots: { index: false, follow: false }`, sem `Disallow` no `robots.txt`.

**Visual, movimento e testes de navegador**
- Cores e fontes exatamente as do §4. Nunca texto branco sobre `brasa`; o texto sobre `brasa` é `carvao`.
- `prefers-reduced-motion: reduce` desliga marquee, Reveal, transições de gaveta/lightbox e scroll suave.
- Scroll lock: `document.documentElement.dataset.scrollLock = 'true'`, aplicado e removido em efeito, com o CSS `html[data-scroll-lock='true']{overflow:hidden}`.
- E2E: só seletores sensíveis à visibilidade (`getByRole`, `getByLabel`, `getByText`, `.filter({ visible: true })`).

**Antes da Task 9:** carregar o skill `frontend-design` e aplicar a direção visual do §4.

## Review Focus

1. **Carrinho salvo corrompido ou antigo** (JSON inválido, formato errado, ids que sumiram do cardápio, qty 0/negativa/999) → o site abre normal, com carrinho vazio ou saneado, e nunca quebra. *Testes:* Task 4 (`sanitizeLines`) e Task 10 (localStorage com lixo).
2. **Visitante fora do fuso de SP ou perto da meia-noite** → status, "hoje" e horários de reserva seguem São Paulo. *Testes:* Task 3 (instantes UTC que caem em outro dia em SP) e Task 9 (status com o navegador em `Asia/Tokyo` e relógio fixo).
3. **Texto do cliente com `&`, `#`, `?`, acentos, quebra de linha e emoji** → a mensagem chega intacta ao WhatsApp. *Testes:* Task 6 (ida e volta da URL) e Task 11 (observação com `&` e `#`).
4. **Celular estreito** (palavras longas como "Confraternização", marquee, tabelas, abas roláveis) → sem rolagem horizontal na página. *Teste:* helper `expectNoHorizontalOverflow` em todos os testes de página, nos dois viewports.
5. **Hidratação com UI dependente de hora** (selo de status, dia de hoje na tabela, data mínima da reserva) → nenhum erro no console. *Teste:* helper `trackErrors` em todos os testes de página (Task 9 em diante).

---

### Task 1: Fundação do projeto

**Files:**
- Create (via scaffold): `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `AGENTS.md`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/components/ui/Container.tsx`
- Delete: `public/*.svg`, `src/app/favicon.ico`

**Interfaces:**
- Produces:
  - classes Tailwind de cor `bg-carvao`, `text-osso`, `text-brasa`, etc. (tokens do §4);
  - fontes `font-display` (Big Shoulders), `font-stencil` (Big Shoulders Stencil) e `font-body` (Barlow);
  - `<Container className?>` = `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`.

- [ ] **Step 1: Gerar o scaffold numa pasta temporária e copiar para o repo**

```bash
S="C:/Users/rapha/AppData/Local/Temp/claude/C--Users-rapha/05164bed-af6e-416e-8b9c-3179f04ade50/scratchpad"
cd "$S" && rm -rf ferro-e-fumaca && npx --yes create-next-app@16.4.1 ferro-e-fumaca --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --skip-install --yes
cp -r "$S/ferro-e-fumaca/." "C:/Users/rapha/Portfolio/ferro-e-fumaca/"
cd "C:/Users/rapha/Portfolio/ferro-e-fumaca" && rm -f public/*.svg src/app/favicon.ico
```

- [ ] **Step 2: Instalar dependências**

```bash
npm install && npm install lucide-react@1.57.0 && npm install -D vitest@5.0.5 @playwright/test@1.64.1
```
Expected: sem `ERR!`.

Adicionar ao `.gitignore`:
```
/test-results
/playwright-report
```

- [ ] **Step 3: Tokens e base em `src/app/globals.css`**
  - Manter `@import "tailwindcss";`.
  - Bloco `@theme`:
    - cores: `--color-carvao:#12100E`, `--color-carvao-2:#1B1815`, `--color-carvao-3:#26221E`, `--color-osso:#F3EADB`, `--color-osso-2:#E7DCC8`, `--color-fumaca:#A39A8E`, `--color-brasa:#E8501C`, `--color-brasa-escura:#B83A12`, `--color-mostarda:#F2B33D`;
    - fontes em `@theme inline`: `--font-display: var(--font-big-shoulders)`, `--font-stencil: var(--font-big-shoulders-stencil)`, `--font-body: var(--font-barlow)`.
  - Remover o tema claro/escuro do scaffold.
  - `body`: `bg-carvao text-osso font-body antialiased`.
  - `:focus-visible`: outline 2px `brasa`, offset 3px.
  - Regra de scroll lock (Global Constraints).
  - `html { scroll-behavior: smooth }`, desligado em `@media (prefers-reduced-motion: reduce)`, junto com `animation`/`transition` de `.marquee-track`, `.reveal`, `.drawer` e `.lightbox`.
  - Utilitário `@utility grain`: pseudo-elemento fixo com ruído SVG em data-URI (`feTurbulence`), opacidade 0.06, `pointer-events:none`, sem `mix-blend-mode`.

- [ ] **Step 4: `src/app/layout.tsx` com fontes e casca mínima**
  - Fontes:
    - `Big_Shoulders({ subsets:['latin'], variable:'--font-big-shoulders', display:'swap' })`;
    - `Big_Shoulders_Stencil({ subsets:['latin'], variable:'--font-big-shoulders-stencil', display:'swap' })`;
    - `Barlow({ subsets:['latin'], weight:['400','500','600','700'], variable:'--font-barlow', display:'swap' })`.
  - `<html lang="pt-BR" data-scroll-behavior="smooth" className={vars}>` e `<body className="grain min-h-dvh flex flex-col">`.
  - `metadata` provisória: `{ title: 'Ferro & Fumaça' }`.
  - `src/app/page.tsx` provisória: `<main>` com `<h1 className="font-display ...">Chapa de ferro. Fumaça de lenha.</h1>` (texto final do §6.1).

- [ ] **Step 5: Verificar build e lint**

Run: `npm run lint && npm run build`
Expected: lint sem erros; build termina com `○ /` (estático) e sem warnings de fonte.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: estrutura inicial Next.js 16 + Tailwind 4 com tokens da marca" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Formatação de preço e telefone

**Files:**
- Create: `vitest.config.ts`, `src/lib/format.ts`, `src/lib/phone.ts`
- Test: `tests/unit/format.test.ts`, `tests/unit/phone.test.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces:
  - `formatBRL(cents: number): string`;
  - `parseBRLToCents(input: string): number | null`;
  - `onlyDigits(s: string): string`;
  - `maskPhone(input: string): string`;
  - `isValidPhone(input: string): boolean`.

- [ ] **Step 1: Config do Vitest e scripts**

`vitest.config.ts`: `defineConfig({ resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' } })`.
Scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:e2e": "playwright test"`.

- [ ] **Step 2: Escrever os testes que falham**

Os blocos de teste deste plano omitem os imports: `import { describe, it, expect } from 'vitest'` e os do módulo testado, via `@/lib/...` ou `@/data/...`.

```ts
// tests/unit/format.test.ts
const R = 'R$\u00a0'
it('formata centavos em reais', () => {
  expect(formatBRL(3690)).toBe(`${R}36,90`)
  expect(formatBRL(0)).toBe(`${R}0,00`)
  expect(formatBRL(10990)).toBe(`${R}109,90`)
  expect(formatBRL(123456)).toBe(`${R}1.234,56`)
})
it('lê valores digitados em reais', () => {
  expect(parseBRLToCents('120')).toBe(12000)
  expect(parseBRLToCents('120,50')).toBe(12050)
  expect(parseBRLToCents('120.50')).toBe(12050)
  expect(parseBRLToCents('R$ 1.234,56')).toBe(123456)
  expect(parseBRLToCents('1.234')).toBe(123400)
  expect(parseBRLToCents('  50 ')).toBe(5000)
  expect(parseBRLToCents('')).toBeNull()
  expect(parseBRLToCents('abc')).toBeNull()
  expect(parseBRLToCents('12,345')).toBeNull()
})

// tests/unit/phone.test.ts
it('aplica máscara progressiva', () => {
  expect(maskPhone('')).toBe('')
  expect(maskPhone('1')).toBe('(1')
  expect(maskPhone('11')).toBe('(11')
  expect(maskPhone('119')).toBe('(11) 9')
  expect(maskPhone('1198888')).toBe('(11) 9888-8')
  expect(maskPhone('1133334444')).toBe('(11) 3333-4444')
  expect(maskPhone('11988887777')).toBe('(11) 98888-7777')
  expect(maskPhone('(11) 98888-777712')).toBe('(11) 98888-7777')
})
it('valida telefone brasileiro', () => {
  expect(onlyDigits('(11) 98888-7777')).toBe('11988887777')
  expect(isValidPhone('(11) 98888-7777')).toBe(true)
  expect(isValidPhone('(11) 3333-4444')).toBe(true)
  expect(isValidPhone('(11) 88888-7777')).toBe(false) // 11 dígitos sem 9
  expect(isValidPhone('(10) 3333-4444')).toBe(false)  // DDD < 11
  expect(isValidPhone('(11) 3333-444')).toBe(false)   // 9 dígitos
})
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npm test` → FAIL (módulos inexistentes).

- [ ] **Step 4: Implementar**
  - `formatBRL`: `Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' })` sobre `cents/100`.
  - `parseBRLToCents`:
    - remove `R$` e espaços;
    - se houver `,`, os `.` são milhar e a `,` é decimal;
    - sem `,`, um `.` seguido de 1–2 dígitos no fim é decimal; caso contrário, `.` é milhar;
    - aceita só `^\d+(\.\d{1,2})?$` e retorna `Math.round(n*100)`.
  - `maskPhone`: usa no máximo 11 dígitos.
    - 0 dígitos → `''`;
    - até 2 → `(DD`;
    - até 6 → `(DD) X…`;
    - até 10 → `(DD) XXXX-X…`;
    - 11 → `(DD) XXXXX-XXXX`.
  - `isValidPhone`: 10 ou 11 dígitos, DDD entre 11 e 99, e com 11 dígitos o terceiro é `9`.

- [ ] **Step 5: Rodar e ver passar**

Run: `npm test` → PASS (2 arquivos).

- [ ] **Step 6: Commit** — `feat: utilitários de preço e telefone`

---

### Task 3: Dados da casa e horários

**Files:**
- Create: `src/data/site.ts`, `src/lib/hours.ts`
- Test: `tests/unit/hours.test.ts`

**Interfaces:**
- Produces (`site.ts`):
  - objeto `SITE`:

```ts
export const SITE = {
  name: 'Ferro & Fumaça', tagline: 'Burger & Grill',
  description: 'Smash burgers na chapa, costela defumada na lenha de laranjeira e chope gelado na Vila Madalena.',
  address: { street: 'Rua das Brasas, 450', district: 'Vila Madalena', city: 'São Paulo – SP' },
  mapsQuery: 'Vila Madalena, São Paulo',
  phoneDisplay: '(11) 1777-0450',
  whatsapp: '',   // só dígitos com DDI, ex. '5511999999999'; vazio na demo
  instagram: '',  // opcional; some da interface se vazio
  timeZone: 'America/Sao_Paulo',
  delivery: { feeCents: 800, freeFromCents: 15000, radiusKm: 5 },
  developer: { name: 'Raphael Elias Senhorinho' },
  foundedYear: 2017, copyrightYear: 2026,
} as const
```

  - `type DaySchedule = { open: number; close: number } | null` (minutos desde 00:00, `close ≤ 1440`);
  - `SCHEDULE: readonly DaySchedule[]` indexado por dia (0 = domingo): dom 720–1320, seg `null`, ter/qua/qui 1080–1380, sex 1080–1440, sáb 720–1440.
- Produces (`hours.ts`):
  - `WEEKDAY_NAMES = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'] as const`;
  - `type ZonedNow = { dateISO: string; weekday: number; minutes: number }`;
  - `zonedNow(date: Date, timeZone = SITE.timeZone): ZonedNow`;
  - `weekdayOfISO(dateISO: string): number` (via `Date.UTC`);
  - `addDaysISO(dateISO: string, days: number): string`;
  - `formatDateLongBR(dateISO: string): string`;
  - `formatHour(minutes: number): string` (1080→`18h`, 1110→`18h30`, 1440→`0h`);
  - `describeDay(weekday: number): string`;
  - `type OpenStatus = { state: 'open'|'closing'|'closed'; label: string; detail: string }`;
  - `getOpenStatus(date: Date): OpenStatus`;
  - `RESERVATION = { stepMin: 30, lastSeatingBeforeCloseMin: 90, leadMin: 60, windowDays: 60 } as const`;
  - `getReservationSlots(dateISO: string, now: Date): string[]`.

- [ ] **Step 1: Escrever os testes que falham**

```ts
// tests/unit/hours.test.ts   (SP = UTC−3; 2026-10-15 é quinta)
const at = (iso: string) => new Date(iso)
it('converte para o dia de São Paulo, não o de UTC', () => {
  expect(zonedNow(at('2026-10-20T01:30:00Z'))).toEqual({ dateISO: '2026-10-19', weekday: 1, minutes: 22*60+30 })
})
it.each([
  ['2026-10-19T23:00:00Z', 'closed',  'Fechado',        'abre amanhã às 18h'], // seg 20:00
  ['2026-10-20T20:00:00Z', 'closed',  'Fechado',        'abre hoje às 18h'],   // ter 17:00
  ['2026-10-20T22:00:00Z', 'open',    'Aberto agora',   'até 23h'],            // ter 19:00
  ['2026-10-21T01:45:00Z', 'closing', 'Fecha em breve', 'até 23h'],            // ter 22:45
  ['2026-10-21T02:00:00Z', 'closed',  'Fechado',        'abre amanhã às 18h'], // ter 23:00
  ['2026-10-24T02:00:00Z', 'open',    'Aberto agora',   'até meia-noite'],     // sex 23:00
  ['2026-10-24T02:40:00Z', 'closing', 'Fecha em breve', 'até meia-noite'],     // sex 23:40
  ['2026-10-24T03:30:00Z', 'closed',  'Fechado',        'abre hoje às 12h'],   // sáb 00:30
  ['2026-10-26T01:30:00Z', 'closed',  'Fechado',        'abre terça às 18h'],  // dom 22:30
])('status em %s', (iso, state, label, detail) => {
  expect(getOpenStatus(at(iso))).toEqual({ state, label, detail })
})
it('descreve dias e datas', () => {
  expect(describeDay(1)).toBe('Fechado')
  expect(describeDay(2)).toBe('18h às 23h')
  expect(describeDay(5)).toBe('18h à 0h')
  expect(describeDay(0)).toBe('12h às 22h')
  expect(formatDateLongBR('2026-10-24')).toBe('sábado, 24/10/2026')
  expect(addDaysISO('2026-10-15', 60)).toBe('2026-12-14')
  expect(addDaysISO('2026-12-31', 1)).toBe('2027-01-01')
})
describe('horários de reserva', () => {
  const now = at('2026-10-15T15:00:00Z') // qui 12:00
  it('gera de 30 em 30 até fechamento − 90 min', () => {
    expect(getReservationSlots('2026-10-20', now)).toEqual(['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'])
    const sex = getReservationSlots('2026-10-23', now); expect([sex.length, sex[0], sex.at(-1)]).toEqual([10, '18:00', '22:30'])
    const sab = getReservationSlots('2026-10-24', now); expect([sab.length, sab[0], sab.at(-1)]).toEqual([22, '12:00', '22:30'])
    const dom = getReservationSlots('2026-10-25', now); expect([dom.length, dom[0], dom.at(-1)]).toEqual([18, '12:00', '20:30'])
  })
  it('respeita fechado, passado e janela de 60 dias', () => {
    expect(getReservationSlots('2026-10-19', now)).toEqual([])          // segunda
    expect(getReservationSlots('2026-10-14', now)).toEqual([])          // passado
    expect(getReservationSlots('2026-12-13', now)).toHaveLength(18)     // dia 59, domingo
    expect(getReservationSlots('2026-12-15', now)).toEqual([])          // dia 61
  })
  it('para hoje, só a partir de agora + 60 min', () => {
    expect(getReservationSlots('2026-10-20', at('2026-10-20T22:10:00Z'))).toEqual(['20:30','21:00','21:30']) // ter 19:10
    expect(getReservationSlots('2026-10-20', at('2026-10-21T00:40:00Z'))).toEqual([])                        // ter 21:40
  })
})
```

- [ ] **Step 2: Rodar e ver falhar** — `npm test` → FAIL.

- [ ] **Step 3: Implementar `site.ts` e `hours.ts`**
  - `zonedNow`: `Intl.DateTimeFormat('en-CA', { timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).formatToParts`. O `weekday` sai de `weekdayOfISO(dateISO)`.
  - `getOpenStatus`:
    - aberto se `open ≤ min < close`;
    - `closing` se `close − min ≤ 30`;
    - detalhe `até ${close===1440 ? 'meia-noite' : formatHour(close)}`;
    - fechado: procura a próxima abertura (hoje, se ainda não abriu, ou nos 7 dias seguintes), com o texto `abre hoje|amanhã|<WEEKDAY_NAMES[d]> às <formatHour(open)>`.
  - `getReservationSlots`: devolve `[]` quando
    - a data vem antes de `today` (o `dateISO` de `zonedNow(now)`),
    - a data vem depois de `addDaysISO(today, 60)`,
    - ou o dia não tem horário.

    Senão, gera de `open` até `close − 90` em passos de 30. Se a data for hoje, filtra `≥ minutes + 60`. Formato `HH:MM`.

- [ ] **Step 4: Rodar e ver passar** — `npm test` → PASS.

- [ ] **Step 5: Commit** — `feat: horários de funcionamento, status ao vivo e horários de reserva`

---

### Task 4: Carrinho (regras puras)

**Files:**
- Create: `src/lib/cart.ts`
- Test: `tests/unit/cart.test.ts`

**Interfaces:**
- Consumes: `parseBRLToCents` (Task 2).
- Produces:

```ts
export const MAX_QTY = 20
export type CartLine = { id: string; qty: number }
export type CartState = { lines: CartLine[] }
export type CartAction =
  | { type: 'add'; id: string } | { type: 'setQty'; id: string; qty: number }
  | { type: 'remove'; id: string } | { type: 'clear' } | { type: 'hydrate'; lines: CartLine[] }
export const EMPTY_CART: CartState
export function cartReducer(state: CartState, action: CartAction): CartState
export function sanitizeLines(raw: unknown, knownIds: ReadonlySet<string>): CartLine[]
export type Fulfillment = 'delivery' | 'pickup'
export type DeliveryRules = { feeCents: number; freeFromCents: number }
export type Totals = { itemCount: number; subtotalCents: number; deliveryCents: number; totalCents: number; missingForFreeCents: number }
export function computeTotals(lines: CartLine[], priceOf: (id: string) => number, fulfillment: Fulfillment, rules: DeliveryRules): Totals
export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro'
export type CheckoutDetails = { fulfillment: Fulfillment; name: string; address: string; neighborhood: string; complement: string; payment: PaymentMethod | ''; changeFor: string; notes: string }
export type CheckoutErrors = Partial<Record<'name' | 'address' | 'neighborhood' | 'payment' | 'changeFor', string>>
export function validateCheckout(details: CheckoutDetails, totals: Totals): CheckoutErrors
```

- [ ] **Step 1: Escrever os testes que falham**

```ts
const rules = { feeCents: 800, freeFromCents: 15000 }
const price = (id: string) => ({ a: 3690, b: 2490 } as Record<string, number>)[id] ?? 0
it('adiciona, incrementa e limita a 20', () => {
  let s = cartReducer(EMPTY_CART, { type: 'add', id: 'a' }); expect(s.lines).toEqual([{ id: 'a', qty: 1 }])
  s = cartReducer(s, { type: 'add', id: 'a' }); expect(s.lines[0].qty).toBe(2)
  for (let i = 0; i < 25; i++) s = cartReducer(s, { type: 'add', id: 'a' }); expect(s.lines[0].qty).toBe(20)
})
it('setQty remove com 0, limita a 20, ignora id ausente; remove/clear; não muta', () => {
  const s = { lines: [{ id: 'a', qty: 2 }] }
  expect(cartReducer(s, { type: 'setQty', id: 'a', qty: 5 }).lines).toEqual([{ id: 'a', qty: 5 }])
  expect(cartReducer(s, { type: 'setQty', id: 'a', qty: 0 }).lines).toEqual([])
  expect(cartReducer(s, { type: 'setQty', id: 'a', qty: 99 }).lines[0].qty).toBe(20)
  expect(cartReducer(s, { type: 'setQty', id: 'z', qty: 3 })).toEqual(s)
  expect(cartReducer(s, { type: 'remove', id: 'a' }).lines).toEqual([])
  expect(cartReducer(s, { type: 'clear' })).toEqual(EMPTY_CART)
  expect(s.lines).toEqual([{ id: 'a', qty: 2 }])
})
it('saneia dados salvos', () => {
  const known = new Set(['a', 'b', 'c', 'd'])
  expect(sanitizeLines('{lixo', known)).toEqual([])
  expect(sanitizeLines(null, known)).toEqual([])
  expect(sanitizeLines([{id:'a',qty:2},{id:'ghost',qty:1},{id:'b',qty:0},{id:'b',qty:-3},{id:'c',qty:2.7},{id:'a',qty:19},'lixo',null,{id:'d'}], known))
    .toEqual([{ id: 'a', qty: 20 }, { id: 'c', qty: 2 }])
})
it('calcula totais, taxa e frete grátis', () => {
  expect(computeTotals([{id:'a',qty:2},{id:'b',qty:1}], price, 'delivery', rules))
    .toEqual({ itemCount: 3, subtotalCents: 9870, deliveryCents: 800, totalCents: 10670, missingForFreeCents: 5130 })
  const p = (c: number) => () => c
  expect(computeTotals([{id:'x',qty:1}], p(15000), 'delivery', rules)).toMatchObject({ deliveryCents: 0, missingForFreeCents: 0 })
  expect(computeTotals([{id:'x',qty:1}], p(14999), 'delivery', rules)).toMatchObject({ deliveryCents: 800, missingForFreeCents: 1 })
  expect(computeTotals([{id:'a',qty:1}], price, 'pickup', rules)).toMatchObject({ deliveryCents: 0, missingForFreeCents: 0, totalCents: 3690 })
  expect(computeTotals([], price, 'delivery', rules)).toEqual({ itemCount: 0, subtotalCents: 0, deliveryCents: 0, totalCents: 0, missingForFreeCents: 0 })
})
it('valida o checkout', () => {
  const totals = computeTotals([{id:'a',qty:2},{id:'b',qty:1}], price, 'delivery', rules)
  const ok: CheckoutDetails = { fulfillment:'delivery', name:'João', address:'Rua das Flores, 123', neighborhood:'Pinheiros', complement:'', payment:'pix', changeFor:'', notes:'' }
  expect(validateCheckout(ok, totals)).toEqual({})
  expect(validateCheckout({ ...ok, name:' ', address:'', neighborhood:'', payment:'' }, totals)).toEqual({
    name:'Informe seu nome.', address:'Informe rua e número.', neighborhood:'Informe o bairro.', payment:'Escolha a forma de pagamento.' })
  expect(validateCheckout({ ...ok, fulfillment:'pickup', address:'', neighborhood:'' }, totals)).toEqual({})
  expect(validateCheckout({ ...ok, payment:'dinheiro', changeFor:'100' }, totals)).toEqual({ changeFor:'O troco precisa ser igual ou maior que o total.' })
  expect(validateCheckout({ ...ok, payment:'dinheiro', changeFor:'abc' }, totals)).toEqual({ changeFor:'Valor inválido.' })
  expect(validateCheckout({ ...ok, payment:'dinheiro', changeFor:'120' }, totals)).toEqual({})
  expect(validateCheckout({ ...ok, payment:'pix', changeFor:'abc' }, totals)).toEqual({})
})
```

- [ ] **Step 2: Rodar e ver falhar** — `npm test` → FAIL.
- [ ] **Step 3: Implementar `cart.ts`**
  - `sanitizeLines`: só objetos com `id` string conhecido e `qty` número finito ≥ 1. Aplica `Math.floor`, soma duplicados e limita a `MAX_QTY`, mantendo a ordem da primeira ocorrência.
  - `validateCheckout`: nome exige ≥ 2 caracteres após `trim`.
- [ ] **Step 4: Rodar e ver passar** — `npm test` → PASS.
- [ ] **Step 5: Commit** — `feat: regras do carrinho, taxa de entrega e validação do checkout`

---

### Task 5: Reserva (regras puras)

**Files:**
- Create: `src/lib/reservation.ts`
- Test: `tests/unit/reservation.test.ts`

**Interfaces:**
- Consumes: `isValidPhone` (Task 2); `zonedNow`, `addDaysISO`, `weekdayOfISO`, `getReservationSlots` (Task 3).
- Produces:

```ts
export const AREA_LABELS = { salao: 'Salão', varanda: 'Varanda', balcao: 'Balcão da chapa' } as const
export const OCCASION_LABELS = { aniversario: 'Aniversário', encontro: 'Encontro', negocios: 'Negócios', confraternizacao: 'Confraternização' } as const
export type Area = keyof typeof AREA_LABELS
export type Occasion = keyof typeof OCCASION_LABELS
export type ReservationInput = { name: string; phone: string; email: string; date: string; time: string; people: number; area: Area | ''; occasion: Occasion | ''; notes: string }
export type ReservationErrors = Partial<Record<'name' | 'phone' | 'email' | 'date' | 'time' | 'people', string>>
export const MAX_PEOPLE = 12
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export function validateReservation(input: ReservationInput, now: Date): ReservationErrors
export function generateReservationCode(random: () => number = Math.random): string
```

- [ ] **Step 1: Escrever os testes que falham**

```ts
const now = new Date('2026-10-15T15:00:00Z') // qui 12:00 em SP
const ok: ReservationInput = { name:'Ana Souza', phone:'(11) 98888-7777', email:'', date:'2026-10-24', time:'20:00', people:4, area:'varanda', occasion:'aniversario', notes:'' }
it('aceita reserva válida', () => expect(validateReservation(ok, now)).toEqual({}))
it.each([
  [{ name: '  A ' }, 'name', 'Informe seu nome completo.'],
  [{ name: '123' }, 'name', 'Informe seu nome completo.'],
  [{ phone: '(11) 8888-777' }, 'phone', 'Informe um telefone válido com DDD.'],
  [{ email: 'ana@' }, 'email', 'E-mail inválido.'],
  [{ date: '' }, 'date', 'Escolha a data.'],
  [{ date: '2026-10-19' }, 'date', 'Fechamos às segundas. Escolha outro dia.'],
  [{ date: '2026-10-14' }, 'date', 'Escolha uma data a partir de hoje.'],
  [{ date: '2026-12-15' }, 'date', 'Reservas com até 60 dias de antecedência.'],
  [{ date: '2026-12-14' }, 'date', 'Fechamos às segundas. Escolha outro dia.'],
  [{ time: '' }, 'time', 'Escolha um horário.'],
  [{ date: '2026-10-20', time: '22:00' }, 'time', 'Horário indisponível para esta data.'],
  [{ date: '2026-10-20', time: '17:30' }, 'time', 'Horário indisponível para esta data.'],
  [{ people: 0 }, 'people', 'Reservas de 1 a 12 pessoas. Para grupos maiores, fale com a gente.'],
  [{ people: 13 }, 'people', 'Reservas de 1 a 12 pessoas. Para grupos maiores, fale com a gente.'],
  [{ people: 2.5 }, 'people', 'Reservas de 1 a 12 pessoas. Para grupos maiores, fale com a gente.'],
])('%o → erro em %s', (patch, field, msg) => {
  expect(validateReservation({ ...ok, ...patch }, now)).toEqual({ [field]: msg })
})
it('aceita e-mail válido e 12 pessoas', () => {
  expect(validateReservation({ ...ok, email: 'ana@exemplo.com', people: 12 }, now)).toEqual({})
})
it('com data inválida não avalia o horário contra a lista', () => {
  expect(validateReservation({ ...ok, date: '2026-10-19', time: '20:00' }, now)).toEqual({ date: 'Fechamos às segundas. Escolha outro dia.' })
})
it('gera código sem caracteres ambíguos', () => {
  expect(generateReservationCode(() => 0)).toBe('FF-AAAA')
  expect(generateReservationCode(() => 0.999999)).toBe('FF-9999')
  expect(generateReservationCode()).toMatch(/^FF-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/)
})
```

- [ ] **Step 2: Rodar e ver falhar** — `npm test` → FAIL.
- [ ] **Step 3: Implementar `reservation.ts`**
  - Ordem da checagem da data: vazia → passado → além da janela → segunda (fechado).
  - Horário: se vazio, sempre erro. Se não estiver em `getReservationSlots(date, now)`, só é erro quando a data não tem erro.
  - Nome: `trim().length ≥ 3` e `/\p{L}/u`.
  - E-mail: só é checado se não vazio, com `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- [ ] **Step 4: Rodar e ver passar** — `npm test` → PASS.
- [ ] **Step 5: Commit** — `feat: validação e código de reserva`

---

### Task 6: Mensagens e links do WhatsApp

**Files:**
- Create: `src/lib/whatsapp.ts`
- Test: `tests/unit/whatsapp.test.ts`

**Interfaces:**
- Consumes: `formatBRL`, `parseBRLToCents` (Task 2); `SITE` (Task 3); `Totals`, `CheckoutDetails`, `computeTotals` (Task 4); `ReservationInput`, `AREA_LABELS`, `OCCASION_LABELS` (Task 5); `formatDateLongBR` (Task 3).
- Produces:
  - `CONTACT_MESSAGE = 'Olá! Vim pelo site da Ferro & Fumaça.'`;
  - `whatsappUrl(text: string, phone: string = SITE.whatsapp): string`;
  - `type OrderItem = { name: string; qty: number; unitCents: number }`;
  - `buildOrderMessage(items: OrderItem[], totals: Totals, details: CheckoutDetails): string`;
  - `buildReservationMessage(input: ReservationInput, code: string): string`.

- [ ] **Step 1: Escrever os testes que falham**

```ts
const R = 'R$\u00a0'
const rules = { feeCents: 800, freeFromCents: 15000 }
const items = [{ name: 'Smash Clássico', qty: 2, unitCents: 3690 }, { name: 'Batata Rústica', qty: 1, unitCents: 2490 }]
const totalsFor = (f: 'delivery' | 'pickup', sub = 9870) => computeTotals([{ id: 'x', qty: 1 }], () => sub, f, rules)
const base: CheckoutDetails = { fulfillment:'delivery', name:'João', address:'Rua das Flores, 123', neighborhood:'Pinheiros', complement:'apto 42', payment:'dinheiro', changeFor:'120', notes:'sem cebola no Clássico' }
it('monta o pedido de delivery do spec', () => {
  expect(buildOrderMessage(items, totalsFor('delivery'), base)).toBe([
    '*Novo pedido — Ferro & Fumaça*', '',
    `2x Smash Clássico — ${R}73,80`, `1x Batata Rústica — ${R}24,90`, '',
    `Subtotal: ${R}98,70`, `Entrega: ${R}8,00`, `*Total: ${R}106,70*`, '',
    '*Entrega:* Rua das Flores, 123 — Pinheiros (apto 42)',
    `*Pagamento:* Dinheiro (troco para ${R}120,00)`, '*Nome:* João', '*Obs.:* sem cebola no Clássico',
  ].join('\n'))
})
it('retirada com Pix, sem observação', () => {
  const msg = buildOrderMessage(items, totalsFor('pickup'), { ...base, fulfillment:'pickup', payment:'pix', notes:'  ' })
  expect(msg).toContain('*Retirada no balcão*'); expect(msg).toContain('*Pagamento:* Pix')
  expect(msg).not.toContain('Entrega:'); expect(msg).not.toContain('*Obs.:*')
  expect(msg).toContain(`*Total: ${R}98,70*`)
})
it('frete grátis e cartão', () => {
  const msg = buildOrderMessage(items, totalsFor('delivery', 15000), { ...base, payment: 'cartao', complement: '' })
  expect(msg).toContain('Entrega: grátis'); expect(msg).toContain('*Pagamento:* Cartão na entrega')
  expect(msg).toContain('*Entrega:* Rua das Flores, 123 — Pinheiros\n')
})
it('monta a reserva completa e a mínima', () => {
  const r: ReservationInput = { name:'Ana Souza', phone:'(11) 98888-7777', email:'', date:'2026-10-24', time:'20:00', people:4, area:'varanda', occasion:'aniversario', notes:'cadeira para bebê' }
  expect(buildReservationMessage(r, 'FF-7K3Q')).toBe([
    '*Pedido de reserva — Ferro & Fumaça*', 'Código: FF-7K3Q', 'Nome: Ana Souza', 'Telefone: (11) 98888-7777',
    'Data: sábado, 24/10/2026', 'Horário: 20:00', 'Pessoas: 4', 'Área: Varanda', 'Ocasião: Aniversário', 'Obs.: cadeira para bebê',
  ].join('\n'))
  const min = buildReservationMessage({ ...r, email: 'ana@exemplo.com', area: '', occasion: '', notes: '' }, 'FF-AAAA')
  expect(min.split('\n')).toEqual(['*Pedido de reserva — Ferro & Fumaça*', 'Código: FF-AAAA', 'Nome: Ana Souza',
    'Telefone: (11) 98888-7777', 'E-mail: ana@exemplo.com', 'Data: sábado, 24/10/2026', 'Horário: 20:00', 'Pessoas: 4'])
})
it('codifica a URL e faz ida e volta com caracteres especiais', () => {
  const text = 'Pão & Cia #1? ç\n🍔'
  const url = whatsappUrl(text, '')
  expect(url.startsWith('https://wa.me/?text=')).toBe(true)
  expect(decodeURIComponent(url.slice('https://wa.me/?text='.length))).toBe(text)
  expect(whatsappUrl('oi', '5511999999999')).toBe('https://wa.me/5511999999999?text=oi')
})
```

- [ ] **Step 2: Rodar e ver falhar** — `npm test` → FAIL.
- [ ] **Step 3: Implementar `whatsapp.ts`**
  - Rótulo do pagamento:
    - `pix` → `Pix`;
    - `cartao` → `Cartão na entrega` ou `Cartão na retirada`;
    - `dinheiro` → `Dinheiro`, com ` (troco para R$ X)` quando `parseBRLToCents(changeFor)` não é nulo.
  - Linha de taxa só no delivery (`grátis` quando `deliveryCents === 0`).
  - `notes` com `trim`.
- [ ] **Step 4: Rodar e ver passar** — `npm test` → PASS.
- [ ] **Step 5: Commit** — `feat: mensagens de pedido e reserva para o WhatsApp`

---

### Task 7: Fotos e fontes da imagem de compartilhamento

**Files:**
- Create: `scripts/images.manifest.json`, `scripts/fetch-images.mjs`
- Create: `src/assets/images/menu/*.jpg` (20), `src/assets/images/scenes/*.jpg` (14)
- Create: `src/assets/fonts/BigShouldersStencil-900.ttf`, `src/assets/fonts/Barlow-600.ttf`

**Interfaces:**
- Produces: arquivos com estes nomes exatos, que as Tasks 8–16 importam.
  - `menu/` (4:3, 1200×900):
    - `smash-classico`, `ferro-duplo`, `costela-12h`, `brasa-picante`, `trufado`, `veggie-na-brasa`, `smashinho`;
    - `costela-defumada`, `picanha-na-chapa`, `ancho-maturado`, `ribs-bbq`;
    - `batata-rustica`, `onion-rings`, `mac-and-cheese`, `coxinhas-de-costela`, `linguica-artesanal`;
    - `brownie-na-chapa`, `pudim-defumado`, `shake-de-malte`, `shake-de-doce-de-leite`.
  - `scenes/` (16:10, 2000×1250):
    - `hero-burger` (burger escuro e dramático, com espaço para texto);
    - `chapa`, `brasa`, `fogo`, `carne-grelha`;
    - `processo-carne`, `processo-pao`, `processo-fumaca`;
    - `salao`, `bar`, `varanda`, `amigos`, `cozinha`, `bebidas`.

- [ ] **Step 1: Curadoria (visual)**
  - O site `unsplash.com` bloqueia acesso automatizado; o CDN funciona.
  - Para cada vaga, testar IDs candidatos baixando uma prévia:

    ```
    https://images.unsplash.com/photo-<ID>?w=480&q=60&fm=jpg
    ```

    - Salvar a prévia no scratchpad e olhar com a ferramenta Read.
    - Escolher a foto que corresponde ao prato e combina com a estética escura e quente.
  - IDs já confirmados no CDN (pontos de partida): `1568901346375-23c9450c58cd`, `1550547660-d9450f859349`, `1571091718767-18b5b1457add` (burgers); `1544025162-d76694265947` (ribs); `1600891964092-4316c288032e` (steak).
  - Para achar mais IDs: WebSearch `unsplash "images.unsplash.com/photo-" <termo>`.
  - Sem foto honesta para um item (ex.: coxinha, pudim): usar a mais próxima que não engane (croquete / flan) e registrar isso no manifesto.

- [ ] **Step 2: Manifesto e script**
  - `images.manifest.json`: `[{ "file": "menu/smash-classico.jpg", "id": "1568901346375-23c9450c58cd", "kind": "menu", "note": "..." }, …]`.
  - `fetch-images.mjs` (Node 24, `fetch` nativo):
    - para cada entrada, baixa `https://images.unsplash.com/photo-<id>?w=<W>&h=<H>&fit=crop&crop=entropy&q=75&fm=jpg` (menu 1200×900, scenes 2000×1250) para `src/assets/images/<file>`;
    - pula arquivos existentes, a menos que receba `--force`;
    - termina com código ≠ 0 se algum download falhar.

- [ ] **Step 3: Baixar e verificar**

Run: `node scripts/fetch-images.mjs && ls src/assets/images/menu | wc -l && ls src/assets/images/scenes | wc -l && du -sh src/assets/images`
Expected: `20`, `14`; total < 12 MB; nenhum arquivo < 40 KB (indicaria erro).

- [ ] **Step 4: Fontes estáticas para o `next/og`**
  - Satori não usa woff2 nem fonte variável.
  - Baixar o CSS sem User-Agent para receber TTF:
    - `curl -s "https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil:wght@900"`
    - `curl -s "https://fonts.googleapis.com/css2?family=Barlow:wght@600"`
  - Extrair o `url(...)` de cada CSS e baixar para `src/assets/fonts/`.
  - Verificar com `file src/assets/fonts/*.ttf`, que deve indicar `TrueType`.

- [ ] **Step 5: Commit** — `feat: fotos do Unsplash e fontes da imagem de compartilhamento`

---

### Task 8: Conteúdo (cardápio, galeria, depoimentos, FAQ, linha do tempo)

**Files:**
- Create: `src/data/menu.ts`, `src/data/gallery.ts`, `src/data/testimonials.ts`, `src/data/faq.ts`, `src/data/timeline.ts`
- Test: `tests/unit/data.test.ts`

**Interfaces:**
- Consumes: imagens da Task 7; `SITE` (Task 3); `formatBRL` (Task 2).
- Produces (`menu.ts`):

```ts
export type Tag = 'mais-pedido' | 'picante' | 'vegetariano' | 'novo'
export const TAG_LABELS: Record<Tag, string> // Mais pedido · Picante · Vegetariano · Novo
export type CategoryId = 'burgers' | 'da-brasa' | 'porcoes' | 'sobremesas' | 'bebidas'
export type Category = { id: CategoryId; name: string; intro: string }
export type MenuItem = { id: string; name: string; description: string; priceCents: number; category: CategoryId; tags: Tag[]; image?: StaticImageData; imageAlt?: string }
export const CATEGORIES: Category[]
export const MENU: MenuItem[]
export const MENU_BY_ID: ReadonlyMap<string, MenuItem>
export const MENU_IDS: ReadonlySet<string>
export const FEATURED: MenuItem[] // itens com 'mais-pedido', na ordem do MENU
export function priceOf(id: string): number // 0 se desconhecido
export function itemsByCategory(id: CategoryId): MenuItem[]
```

- Produces (demais arquivos):
  - `gallery.ts`:
    - `type GalleryCategory = 'comida'|'ambiente'|'bastidores'`;
    - `GALLERY_FILTERS: { id: 'todos' | GalleryCategory; label: string }[]` (Todos, Comida, Ambiente, Bastidores);
    - `type GalleryPhoto = { id: string; src: StaticImageData; alt: string; caption: string; category: GalleryCategory }`;
    - `GALLERY: GalleryPhoto[]`.
  - `testimonials.ts`: `TESTIMONIALS: { quote: string; author: string; district: string }[]`.
  - `faq.ts`: `FAQ: { question: string; answer: string }[]`.
  - `timeline.ts`: `TIMELINE: { year: string; title: string; text: string }[]`.

- [ ] **Step 1: Escrever o teste de integridade que falha**

```ts
it('cardápio do spec §10', () => {
  expect(MENU).toHaveLength(26)
  expect(new Set(MENU.map(i => i.id)).size).toBe(26)
  expect(Object.fromEntries(MENU.map(i => [i.id, i.priceCents]))).toEqual({
    'smash-classico': 3690, 'ferro-duplo': 4990, 'costela-12h': 5290, 'brasa-picante': 4690, 'trufado': 5490,
    'veggie-na-brasa': 4290, 'smashinho': 2990, 'costela-defumada': 9890, 'picanha-na-chapa': 8990,
    'ancho-maturado': 10990, 'ribs-bbq': 7990, 'batata-rustica': 2490, 'onion-rings': 2690, 'mac-and-cheese': 2990,
    'coxinhas-de-costela': 3290, 'linguica-artesanal': 3490, 'brownie-na-chapa': 2690, 'pudim-defumado': 1990,
    'shake-de-malte': 2490, 'shake-de-doce-de-leite': 2490, 'chope-pilsen': 1690, 'chope-ipa': 2290,
    'limonada-defumada': 1490, 'caipirinha': 2490, 'refrigerante': 790, 'agua': 590 })
  expect(CATEGORIES.map(c => [c.id, itemsByCategory(c.id).length])).toEqual(
    [['burgers', 7], ['da-brasa', 4], ['porcoes', 5], ['sobremesas', 4], ['bebidas', 6]])
  expect(FEATURED.map(i => i.id)).toEqual(['smash-classico', 'ferro-duplo', 'costela-defumada', 'coxinhas-de-costela'])
  const tagged = (t: Tag) => MENU.filter(i => i.tags.includes(t)).map(i => i.id)
  expect(tagged('vegetariano')).toEqual(['veggie-na-brasa', 'batata-rustica', 'onion-rings'])
  expect(tagged('picante')).toEqual(['brasa-picante'])
  expect(tagged('novo')).toEqual(['costela-12h', 'pudim-defumado', 'limonada-defumada'])
  for (const i of MENU) {
    if (i.category === 'bebidas') expect(i.image).toBeUndefined()
    else { expect(i.image).toBeTruthy(); expect(i.imageAlt?.length).toBeGreaterThan(10) }
  }
  expect(priceOf('ghost')).toBe(0)
})
it('galeria, depoimentos, FAQ e linha do tempo', () => {
  expect(GALLERY).toHaveLength(16)
  const count = (c: string) => GALLERY.filter(p => p.category === c).length
  expect([count('comida'), count('ambiente'), count('bastidores')]).toEqual([6, 4, 6])
  expect(new Set(GALLERY.map(p => p.id)).size).toBe(16)
  expect(GALLERY.every(p => p.alt.length > 10 && p.caption.length > 0)).toBe(true)
  expect(TESTIMONIALS).toHaveLength(3)
  expect(FAQ).toHaveLength(6)
  expect(FAQ[2].answer).toContain('R$\u00a0150,00')
  expect(TIMELINE.map(t => t.year)).toEqual(['2017', '2019', '2022', '2024', '2026'])
})
```

- [ ] **Step 2: Rodar e ver falhar** — `npm test` → FAIL.

- [ ] **Step 3: Escrever os dados**
  - **Itens:** nomes, descrições, preços e selos do §10. Cada descrição vira frase com maiúscula e ponto. Ids em kebab-case conforme o teste. `imageAlt` descreve a foto real escolhida.
  - **Categorias** (nome → intro):
    - Burgers → "Blend próprio, chapa de ferro e brioche da casa."
    - Da Brasa → "Carnes defumadas na lenha de laranjeira e grelhadas na brasa."
    - Porções → "Pra dividir. Ou não."
    - Sobremesas & Shakes → "O final feliz."
    - Bebidas → "Chope gelado, drinks e opções sem álcool."
  - **Galeria:** a ordem já intercala categorias nos 6 primeiros, que a Início usa.
    - comida = smash-classico, ferro-duplo, costela-defumada, ribs-bbq, batata-rustica, shake-de-malte;
    - ambiente = salao, bar, varanda, amigos;
    - bastidores = chapa, cozinha, fogo, brasa, processo-carne, carne-grelha.
  - **Depoimentos:**
    - "O smash mais honesto de São Paulo: borda crocante, miolo suculento." — Marina A., Pinheiros
    - "Fui pela costela, voltei pelo pudim defumado. Duas vezes na mesma semana." — Thiago R., Perdizes
    - "Chope gelado, som bom e um atendimento que lembra do seu pedido." — Carla M., Vila Madalena
  - **FAQ** (ordem do §6.6). Respostas:
    1. "Sim! Reservas de terça a domingo para até 12 pessoas, direto pela página de Reservas. A confirmação chega pelo WhatsApp."
    2. "Tem: o Veggie na Brasa, de cogumelos e grão-de-bico, além da Batata Rústica e dos Onion Rings."
    3. Texto gerado a partir de `SITE.delivery`: "Entregamos num raio de 5 km a partir da Vila Madalena. A taxa é de R$ 8,00 e a entrega é grátis em pedidos a partir de R$ 150,00." (usar `formatBRL`)
    4. "Pode! A varanda é pet friendly e tem água fresca pros visitantes de quatro patas."
    5. "Fazemos aniversários, confraternizações e fechamento da casa para grupos a partir de 13 pessoas. Chama a gente no WhatsApp."
    6. "Pix, cartões de crédito e débito e dinheiro."
  - **Linha do tempo:**
    - 2017 "O food truck" / "Uma chapa de ferro de 30 kg e um defumador improvisado nas feiras gastronômicas de Pinheiros."
    - 2019 "A primeira casa" / "Endereço fixo na Vila Madalena, com 40 lugares e fila na calçada."
    - 2022 "O defumador de 1 tonelada" / "Construído pela própria equipe e aceso 12 horas antes de cada serviço."
    - 2024 "Varanda e balcão da chapa" / "A casa chegou a 120 lugares, com vista direta para a chapa."
    - 2026 "250 mil burgers" / "E a mesma receita do primeiro dia."

- [ ] **Step 4: Rodar e ver passar** — `npm test` → PASS.
- [ ] **Step 5: Commit** — `feat: conteúdo do cardápio, galeria, depoimentos, FAQ e linha do tempo`

---

### Task 9: Estrutura do site (cabeçalho, menu mobile, rodapé, rotas, 404)

**Files:**
- Create:
  - `src/hooks/useNow.ts`, `src/hooks/useIsClient.ts`, `src/hooks/useScrolled.ts`, `src/hooks/useScrollLock.ts`, `src/hooks/useFocusTrap.ts`
  - `src/components/ui/{Button,SectionLabel,PageHero,Reveal,Marquee}.tsx`
  - `src/components/layout/{nav.ts,Logo.tsx,SkipLink.tsx,SiteHeader.tsx,MobileMenu.tsx,SiteFooter.tsx}`
  - `src/components/info/OpenStatus.tsx`
  - `src/app/{cardapio,sobre,galeria,reservas,contato}/page.tsx`, `src/app/not-found.tsx`
  - `playwright.config.ts`, `tests/e2e/helpers.ts`, `tests/e2e/navigation.spec.ts`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `SITE`, `getOpenStatus`, `describeDay` (Task 3); imagens `scenes/*` (Task 7).
- Produces:

```ts
useNow(intervalMs = 60_000): Date | null          // useSyncExternalStore; servidor → null; snapshot arredondado ao minuto
useIsClient(): boolean                            // useSyncExternalStore(() => () => {}, () => true, () => false)
useScrolled(threshold = 24): boolean              // useSyncExternalStore com listener 'scroll' passivo
useScrollLock(active: boolean): void              // dataset.scrollLock no <html>, limpo no cleanup
useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape: () => void): void // foca 1º focável, prende Tab, Esc → onEscape, devolve foco ao elemento anterior
NAV_LINKS: { href: '/' | '/cardapio' | '/sobre' | '/galeria' | '/reservas' | '/contato'; label: string }[]
<Button href? variant?: 'primary'|'outline'|'ghost' size?: 'md'|'lg' {...button|link props}>
<SectionLabel number="02">FAVORITOS DA CASA</SectionLabel>    // "Nº 02 — FAVORITOS DA CASA"
<PageHero label title subtitle? image: StaticImageData imageAlt />  // contém o único <h1> da página
<Reveal as? delay?>                               // classe 'reveal' + IntersectionObserver alterna data-shown no DOM (sem setState)
<Marquee items: string[] />                       // duplicado com aria-hidden na cópia
<OpenStatus variant: 'pill' | 'inline' />         // null do useNow → placeholder de mesma largura, sem texto
```

- [ ] **Step 1:** Carregar o skill `frontend-design` e confirmar a direção do §4 (tipografia, rótulos carimbados, contraste, granulado).
- [ ] **Step 2: Playwright, helpers e o teste de navegação que falha**

`playwright.config.ts`:

```ts
export default defineConfig({
  testDir: 'tests/e2e', fullyParallel: true, reporter: 'list',
  use: { baseURL: 'http://localhost:3100', channel: 'msedge', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: { command: 'npm run build && npx next start -p 3100', url: 'http://localhost:3100', reuseExistingServer: true, timeout: 300_000 },
})
```

`helpers.ts`:
- `trackErrors(page): string[]` coleta `console` do tipo `error` e `pageerror`.
- `expectNoHorizontalOverflow(page)` verifica `document.documentElement.scrollWidth <= innerWidth`.

`navigation.spec.ts`:
- **Para cada rota** `['/', 'Chapa de ferro. Fumaça de lenha.']`, `['/cardapio', 'Feito na chapa, no fogo e na hora.']`, `['/sobre', 'De um food truck a um endereço com cheiro de lenha.']`, `['/galeria', 'Fumaça, chapa e gente feliz.']`, `['/reservas', 'Sua mesa, sem fila.']`, `['/contato', 'Chega mais.']`:
  - `response.status() === 200`;
  - `getByRole('heading', { level: 1, name })` visível;
  - `trackErrors` vazio;
  - sem overflow horizontal.
- **desktop:** clicar `getByRole('banner').getByRole('link', { name: 'Galeria' })` → URL `/galeria` e o link com `aria-current="page"`.
- **mobile:**
  - `getByRole('button', { name: 'Abrir menu' })` → `getByRole('dialog', { name: 'Menu' })` visível;
  - clicar `link 'Reservas'` → URL `/reservas` e o diálogo some;
  - abrir de novo + Esc → o diálogo some e o foco volta ao botão.
- **404:** `/nao-existe` → status 404 e heading `Essa passou do ponto.`
- **Fuso** (Review Focus 2): `test.use({ timezoneId: 'Asia/Tokyo' })` + `page.clock.setFixedTime(new Date('2026-10-20T22:00:00Z'))` → em `/` (desktop), `getByRole('banner')` contém `Aberto agora` e `até 23h`.

Run: `npx playwright test tests/e2e/navigation.spec.ts` → FAIL (rotas inexistentes).

- [ ] **Step 3: Implementar hooks, primitivos de UI, cabeçalho, menu mobile e rodapé**
  - **Cabeçalho** (`<header role="banner">`, fixo, `h-16 lg:h-20`):
    - Logo (`font-stencil`, "FERRO & FUMAÇA" + "BURGER & GRILL");
    - nav desktop com `aria-current="page"` via `usePathname`;
    - `OpenStatus pill` no `lg+`;
    - fundo `carvao/90` + `backdrop-blur` + borda quando `useScrolled()`.
  - **Menu mobile:**
    - botão `Abrir menu` com `aria-expanded`;
    - `role="dialog" aria-modal="true" aria-label="Menu"`, com links grandes, status e endereço;
    - fechado, **não é renderizado**: nada dele fica na árvore de acessibilidade;
    - fecha no clique de link e com Esc;
    - fecha também na troca de `pathname`, via ajuste de estado durante o render (`prevPathname`);
    - `useScrollLock` + `useFocusTrap`.
  - **Rodapé:** conteúdo do §5, com horários via `describeDay` e linha final exata do §5. Instagram só aparece se `SITE.instagram` não estiver vazio.
  - **`SkipLink`:** "Pular para o conteúdo" → `#conteudo` (o `<main id="conteudo">` fica no layout).
- [ ] **Step 4: Páginas internas e 404**
  - Cada página interna: `PageHero` com rótulo, título e subtítulo do §6.x, mais um `Container` com um parágrafo introdutório. O conteúdo completo vem nas Tasks 10–15.
  - Fotos dos heros:
    - `/cardapio` → `chapa`
    - `/sobre` → `brasa`
    - `/galeria` → `carne-grelha`
    - `/reservas` → `salao`
    - `/contato` → `bar`
  - `/` mantém o `h1` da Task 1.
  - `not-found.tsx`:
    - "404" gigante em `font-stencil`;
    - `h1` "Essa passou do ponto.";
    - texto "A página que você procurou virou carvão.";
    - botões Ver cardápio / Voltar ao início.
- [ ] **Step 5: Rodar e ver passar**

Run: `npm run lint && npx playwright test tests/e2e/navigation.spec.ts` → todos PASS nos 2 projetos.

- [ ] **Step 6: Commit** — `feat: estrutura do site com cabeçalho, menu mobile, rodapé e 404`

---

### Task 10: Cardápio e estado do carrinho

**Files:**
- Create:
  - `src/components/cart/{cart-store.ts,CartProvider.tsx,CartButton.tsx,AddToCartButton.tsx}`
  - `src/components/ui/Toaster.tsx`
  - `src/components/menu/{CategoryNav,MenuSection,MenuItemCard,DrinkList,TagBadge}.tsx`
  - `tests/e2e/menu.spec.ts`
- Modify: `src/app/layout.tsx` (providers), `SiteHeader.tsx` e `MobileMenu.tsx` (CartButton e "Peça agora"), `src/app/cardapio/page.tsx`

**Interfaces:**
- Consumes: `cartReducer`, `sanitizeLines`, `computeTotals`, `EMPTY_CART`, `CartLine`, `CartState` (Task 4); `MENU`, `MENU_IDS`, `MENU_BY_ID`, `priceOf`, `CATEGORIES`, `itemsByCategory`, `TAG_LABELS` (Task 8); `formatBRL`.
- Produces:

```ts
// cart-store.ts (módulo cliente; estado em memória + localStorage)
export const CART_STORAGE_KEY = 'ff:cart:v1'
export function subscribeCart(cb: () => void): () => void
export function getCartSnapshot(): CartState     // carrega do localStorage na 1ª leitura (try/catch → sanitizeLines(JSON.parse(raw), MENU_IDS)); mesma referência até mudar
export function getServerCartSnapshot(): CartState // EMPTY_CART
export function dispatchCart(action: CartAction): void // reduce → persiste (try/catch) → notifica
// CartProvider.tsx
export function useCart(): { lines: CartLine[]; itemCount: number; subtotalCents: number; qtyOf(id: string): number;
  add(id: string): void; setQty(id: string, qty: number): void; remove(id: string): void; clear(): void;
  isOpen: boolean; open(): void; close(): void }
// Toaster.tsx
export function useToast(): { show(message: string, action?: { label: string; onClick: () => void }): void }
<AddToCartButton id name variant?: 'full' | 'icon' />  // aria-label `Adicionar ${name} ao pedido`; toast `+1 ${name} no pedido` com ação 'Ver pedido'; mostra 'No pedido: N' quando N>0
<CartButton />  // aria-label `Abrir pedido (${n} ${n === 1 ? 'item' : 'itens'})`, badge com n
```

- [ ] **Step 1: Escrever o teste que falha (`menu.spec.ts`)**
- Em `/cardapio`:
  - headings nível 2 visíveis: `Burgers`, `Da Brasa`, `Porções`, `Sobremesas & Shakes`, `Bebidas`;
  - `getByRole('button', { name: /^Adicionar .+ ao pedido$/ })` com count 26.
- Adicionar Smash Clássico 2× e Batata Rústica 1×:
  - `getByRole('button', { name: 'Abrir pedido (3 itens)' })` visível;
  - `getByText('+1 Batata Rústica no pedido')` visível;
  - depois de `page.reload()`, ainda `Abrir pedido (3 itens)`.
- Lixo salvo (Review Focus 1):
  - `page.addInitScript(() => localStorage.setItem('ff:cart:v1', '{lixo'))`;
  - abrir `/cardapio` → `Abrir pedido (0 itens)`;
  - `trackErrors` vazio.
- Navegação de categorias: clicar `getByRole('navigation', { name: 'Categorias do cardápio' }).getByRole('link', { name: 'Bebidas' })` →
  - URL termina em `#bebidas`;
  - heading `Bebidas` `toBeInViewport()`;
  - o link fica com `aria-current="true"`.
- Os 2 projetos: sem overflow horizontal e sem erros no console.

Run: `npx playwright test tests/e2e/menu.spec.ts` → FAIL.

- [ ] **Step 2: Implementar o store, o provider e o toaster**
  - `useCart` = `useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot)` + `useState` para `isOpen`, dentro do `CartProvider`.
  - `ToastProvider`: até 3 toasts, 3,5 s cada, região `aria-live="polite"`.
  - Ambos envolvem o conteúdo no `layout.tsx`.
- [ ] **Step 3: Implementar a página do Cardápio (§6.2)**
  - `CategoryNav`:
    - `<nav aria-label="Categorias do cardápio">`, `sticky top-16 lg:top-20`, `overflow-x-auto` no celular;
    - scroll-spy por IntersectionObserver (`rootMargin: '-40% 0px -55% 0px'`), com `setState` no callback.
  - Seções `id={category.id}` com `scroll-mt-36 lg:scroll-mt-44`.
  - Legenda de selos.
  - `MenuItemCard`:
    - imagem 4:3 com `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"`;
    - `h3`, preço, descrição, `TagBadge` (lucide: Star, Flame, Leaf, Sparkles), `AddToCartButton`.
  - `DrinkList`: lista em 2 colunas com linha pontilhada, foto `bebidas` e `AddToCartButton variant="icon"`.
- [ ] **Step 4: Rodar e ver passar**

Run: `npm run lint && npx playwright test tests/e2e/menu.spec.ts tests/e2e/navigation.spec.ts` → PASS.

- [ ] **Step 5: Commit** — `feat: cardápio com categorias, selos e carrinho persistente`

---

### Task 11: Gaveta do carrinho, checkout e envio pelo WhatsApp

**Files:**
- Create: `src/components/cart/{CartDrawer,CartLineRow,CheckoutForm,OpenCartButton}.tsx`, `src/components/menu/MobileCartBar.tsx`, `tests/e2e/order.spec.ts`
- Modify: `src/app/layout.tsx` (renderiza `<CartDrawer />`), `src/app/cardapio/page.tsx` (`<MobileCartBar />` + `pb-24 lg:pb-0`)

**Interfaces:**
- Consumes: `useCart`, `useToast` (Task 10); `computeTotals`, `validateCheckout`, `CheckoutDetails`, `Fulfillment` (Task 4); `buildOrderMessage`, `whatsappUrl` (Task 6); `getOpenStatus` + `useNow` (Tasks 3, 9); `useFocusTrap`, `useScrollLock` (Task 9); `MENU_BY_ID`, `priceOf` (Task 8).
- Produces: `<OpenCartButton>{children}</OpenCartButton>`, um botão cliente que chama `open()` (usado na Task 12).

- [ ] **Step 1: Escrever o teste que falha (`order.spec.ts`)**
- **Fluxo completo** (desktop e mobile):
  1. Em `/cardapio`, adicionar Smash Clássico e Batata Rústica.
  2. Abrir `Abrir pedido (2 itens)` → `getByRole('dialog', { name: 'Seu pedido' })` visível.
  3. Clicar `Aumentar quantidade de Smash Clássico` → total `/R\$\s106,70/` visível.
  4. Preencher:
     - `getByLabel('Nome')` João;
     - `Endereço (rua e número)` Rua das Flores, 123;
     - `Bairro` Pinheiros;
     - `Complemento (opcional)` apto 42;
     - marcar `Dinheiro`;
     - `Troco para (opcional)` 120;
     - `Observações (opcional)` `sem cebola & sem picles #1`.
  5. Antes de enviar: `page.evaluate(() => { (window as any).__opened = []; window.open = (u?: string | URL) => { (window as any).__opened.push(String(u)); return null } })`.
  6. Clicar `Enviar pedido pelo WhatsApp`. A URL capturada:
     - começa com `https://wa.me/?text=`;
     - o texto decodificado contém `2x Smash Clássico`, `*Total: R$\u00a0106,70*`, `Rua das Flores, 123 — Pinheiros (apto 42)` e `sem cebola & sem picles #1`.
  7. Aparece `Abrimos o WhatsApp com seu pedido. É só enviar a mensagem por lá.`
  8. `Limpar carrinho` → `Abrir pedido (0 itens)`.
- **Validação:** com 1 item, enviar vazio → aparecem `Informe seu nome.`, `Informe rua e número.`, `Informe o bairro.` e `Escolha a forma de pagamento.`; o foco fica em `Nome`.
- **Retirada:**
  - marcar `Retirada` → `Endereço (rua e número)` não visível;
  - com nome e Pix, a mensagem contém `*Retirada no balcão*` e não contém `Entrega:`.
- **Teclado:** Esc fecha o diálogo e o foco volta ao botão do carrinho.
- **Mobile:** depois de adicionar, `getByRole('button', { name: /^Ver pedido \(1\)/ })` visível em `/cardapio` e abre o diálogo.
- **Vazio:** o diálogo mostra `Seu pedido está vazio.` e o link `Ver cardápio`.

Run: `npx playwright test tests/e2e/order.spec.ts` → FAIL.

- [ ] **Step 2: Implementar a gaveta e o checkout**
  - **`CartDrawer`:**
    - `role="dialog" aria-modal="true" aria-labelledby` → `h2` "Seu pedido";
    - botão `Fechar pedido`; clique no overlay fecha;
    - `useFocusTrap(ref, isOpen, close)` + `useScrollLock(isOpen)`;
    - entra deslizando da direita (classe `drawer`);
    - fechada, fica com `inert` + `invisible` (`visibility:hidden` ao fim da transição), **nunca só fora da tela**. Senão os campos "Nome" da gaveta colidem com os da página de Reservas nos seletores do Playwright.
  - **Visões** `'cart' | 'sent'` em estado local, voltando a `'cart'` quando `isOpen` passa a false (ajuste durante o render).
  - **Itens:** `CartLineRow` com miniatura 48 px, preço unitário e botões `Diminuir quantidade de X`, `Aumentar quantidade de X` e `Remover X`.
  - **Totais:**
    - Subtotal;
    - Entrega (valor ou "grátis"; oculta na retirada);
    - "Faltam R$ X para o frete grátis";
    - Total.
  - **Aviso de fechado:** aparece quando `getOpenStatus(now).state === 'closed'` (`now` de `useNow`).
  - **`CheckoutForm`** (rótulos exatos do teste):
    - radio "Delivery/Retirada" como controle segmentado;
    - endereço, bairro e complemento só no delivery;
    - pagamento em radios: Pix · Cartão na entrega/retirada · Dinheiro;
    - "Troco para (opcional)" só com Dinheiro, `inputMode="decimal"`;
    - erros com `aria-invalid` e `aria-describedby`; foco no 1º inválido.
  - **Envio:**
    - `window.open(whatsappUrl(buildOrderMessage(items, totals, details)), '_blank', 'noopener')`;
    - `items` sai de `lines` via `MENU_BY_ID`;
    - depois, visão `'sent'`.
  - **`MobileCartBar`:** `lg:hidden`, fixa embaixo, com `Ver pedido (N) · R$ X`.
  - **Header:** o botão "Peça agora" usa `open()`.
- [ ] **Step 3: Rodar e ver passar**

Run: `npm run lint && npx playwright test tests/e2e/order.spec.ts tests/e2e/menu.spec.ts` → PASS.

- [ ] **Step 4: Commit** — `feat: gaveta do carrinho com checkout e pedido pelo WhatsApp`

---

### Task 12: Página Início

**Files:**
- Create: `src/components/home/{Hero,Favorites,Process,HouseTeaser,Testimonials,GalleryStrip,FinalCta}.tsx`, `tests/e2e/home.spec.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `FEATURED`, `GALLERY`, `TESTIMONIALS` (Task 8); `MenuItemCard`, `AddToCartButton` (Task 10); `OpenCartButton` (Task 11); `Button`, `SectionLabel`, `Reveal`, `Marquee`, `OpenStatus` (Task 9); imagens `scenes/hero-burger`, `processo-*`, `salao`, `fogo`.

- [ ] **Step 1: Escrever o teste que falha (`home.spec.ts`)**
- `h1` "Chapa de ferro. Fumaça de lenha." visível.
- `getByRole('link', { name: 'Ver cardápio' }).first()` → `/cardapio`.
- Headings h2 visíveis:
  - `Os mais pedidos`
  - `Do açougue à chapa`
  - `Um food truck que criou raízes`
  - `Quem prova, volta`
  - `Direto da chapa`
  - `Bateu a fome?`
- 4 botões `Adicionar … ao pedido` dentro da seção "Os mais pedidos". Clicar `Adicionar Ferro Duplo ao pedido` → `Abrir pedido (1 item)`.
- `Fazer pedido` abre o diálogo `Seu pedido`.
- Sem overflow e sem erros nos 2 projetos.

Run: `npx playwright test tests/e2e/home.spec.ts` → FAIL.

- [ ] **Step 2: Implementar as 8 seções do §6.1**
  - **Rótulos de seção:**
    - Favoritos `02 — FAVORITOS DA CASA`
    - Processo `03 — O PROCESSO`
    - Casa `04 — A CASA`
    - Depoimentos `05 — QUEM JÁ VEIO`
    - Galeria `06 — GALERIA`
  - **Hero:** imagem com `preload`, `sizes="100vw"` e `placeholder="blur"`.
  - **Marquee:** itens `['SMASH NA CHAPA','DEFUMADOS NA LENHA','CHOPE GELADO','PÃO DA CASA']`.
  - **Processo:** seção clara (`bg-osso text-carvao`; textos laranja pequenos em `brasa-escura`) com a cópia exata das 3 etapas e dos 4 números do §6.1.
  - **Casa:** "Nasceu num food truck em 2017, nas feiras gastronômicas de Pinheiros. Hoje são 120 lugares na Vila Madalena, um defumador de 1 tonelada e a mesma obsessão pela chapa."
  - **Galeria:** `GALLERY.slice(0, 6)`.
  - **Chamada final:** fundo `fogo`, com o texto "Monte seu pedido e mande direto no WhatsApp, ou garanta sua mesa pro fim de semana."
- [ ] **Step 3: Rodar e ver passar** — `npm run lint && npx playwright test tests/e2e/home.spec.ts` → PASS.
- [ ] **Step 4: Commit** — `feat: página inicial`

---

### Task 13: Páginas Sobre e Contato

**Files:**
- Create: `src/components/about/{Story,Pillars,Timeline,Stats}.tsx`, `src/components/info/{ContactCards,HoursTable,MapEmbed,Faq}.tsx`, `tests/e2e/info.spec.ts`
- Modify: `src/app/sobre/page.tsx`, `src/app/contato/page.tsx`

**Interfaces:**
- Consumes: `SITE`, `SCHEDULE`, `describeDay`, `zonedNow` (Task 3); `TIMELINE`, `FAQ` (Task 8); `whatsappUrl`, `CONTACT_MESSAGE` (Task 6); `useNow` (Task 9); imagens `cozinha`, `brasa`, `bar`.

- [ ] **Step 1: Escrever o teste que falha (`info.spec.ts`)**
- **`/sobre`:**
  - h2 `Carne`, `Pão`, `Fumaça`, `Chope` visíveis;
  - textos `2017`, `2019`, `2022`, `2024` e `2026` visíveis na linha do tempo;
  - `getByText('250 mil')` visível.
- **`/contato`:**
  - `getByRole('link', { name: 'Chamar no WhatsApp' })`: `href` decodificado = `https://wa.me/?text=` + `CONTACT_MESSAGE`, com `target="_blank"`;
  - tabela `getByRole('table', { name: 'Horários de funcionamento' })` com 7 linhas no corpo, sendo exatamente 1 com `aria-current="date"` (`expect.poll`);
  - clicar `Qual a área de entrega?` → texto com `R$ 150,00` visível;
  - `getByTitle('Mapa da região da Vila Madalena')` presente;
  - `getByText('(11) 1777-0450')` visível, sem link `tel:`.
- Os 2 projetos: sem overflow e sem erros.

Run: `npx playwright test tests/e2e/info.spec.ts` → FAIL.

- [ ] **Step 2: Implementar a Sobre (§6.3)**
  - **`Story`**, em três parágrafos:
    1. "A Ferro & Fumaça nasceu em 2017 como um food truck nas feiras gastronômicas de Pinheiros: uma chapa de ferro de 30 kg, um defumador improvisado e uma fila que só crescia."
    2. "O nome vem dos sobrenomes dos sócios: Bruno Ferraz, que domina a chapa, e Léo Fumagalli, que nunca deixa o defumador apagar. Em 2019 a dupla trocou as rodas por um endereço fixo na Vila Madalena."
    3. "A casa cresceu, ganhou varanda e balcão de frente pra chapa, mas a regra continua a mesma: carne moída no dia, pão saído do forno e fumaça de verdade."
  - **`Pillars`** (lucide Beef/Wheat/Flame/Beer):
    - Carne → "Blend próprio de acém, peito e costela Angus, maturado por 21 dias e moído toda manhã."
    - Pão → "Brioche de fermentação natural, assado em fornadas pequenas antes de abrir a casa."
    - Fumaça → "Lenha de laranjeira e 12 horas de defumação lenta. Nada de fumaça líquida."
    - Chope → "Torneiras de cervejarias artesanais do bairro, servido trincando."
  - **`Stats`:** 250 mil burgers servidos · 12 h de defumação · 21 dias de maturação · 120 lugares.
  - **Chamada:** "Venha sentir o cheiro de perto", com Reservar mesa e Como chegar (`https://www.google.com/maps/search/?api=1&query=` + `encodeURIComponent(SITE.mapsQuery)`, em nova aba).
- [ ] **Step 3: Implementar o Contato (§6.6)**
  - `ContactCards`.
  - `HoursTable`:
    - cliente, com `<caption>` "Horários de funcionamento";
    - linhas de segunda a domingo;
    - `aria-current="date"` e selo "Hoje" na linha de `zonedNow(now).weekday`, só quando `useNow()` ≠ null.
  - `MapEmbed`:
    - `src="https://maps.google.com/maps?q=<mapsQuery>&z=15&output=embed"`, `loading="lazy"`;
    - filtro escuro `[filter:grayscale(1)_invert(0.92)_contrast(0.9)_hue-rotate(180deg)]`.
  - `Faq`: `<details>`/`<summary>` com ícone que gira via `group-open:`.
- [ ] **Step 4: Rodar e ver passar** — `npm run lint && npx playwright test tests/e2e/info.spec.ts` → PASS.
- [ ] **Step 5: Commit** — `feat: páginas Sobre e Contato`

---

### Task 14: Galeria com visualizador

**Files:**
- Create: `src/components/gallery/{GalleryView,Lightbox}.tsx`, `tests/e2e/gallery.spec.ts`
- Modify: `src/app/galeria/page.tsx`

**Interfaces:**
- Consumes: `GALLERY`, `GALLERY_FILTERS` (Task 8); `useFocusTrap`, `useScrollLock` (Task 9).
- Produces: `<Lightbox photos: GalleryPhoto[] index: number | null onIndexChange(i: number | null) />`.

- [ ] **Step 1: Escrever o teste que falha (`gallery.spec.ts`)**
- `getByRole('button', { name: /^Ampliar foto/ })` count 16.
- Filtros:
  - `Ambiente` → `aria-pressed="true"` e count 4;
  - `Bastidores` → 6;
  - `Comida` → 6;
  - `Todos` → 16.
- Visualizador:
  1. Abrir a 1ª foto → `getByRole('dialog', { name: 'Visualizador de fotos' })` visível e `getByText('1 / 16')`.
  2. `ArrowRight` → `2 / 16`.
  3. Botão `Próxima foto` → `3 / 16`.
  4. `Escape` → o diálogo some e a 1ª miniatura `toBeFocused()`.
- Com `Ambiente` ativo: abrir → `1 / 4`; `ArrowLeft` → `4 / 4`.
- Os 2 projetos: sem overflow e sem erros.

Run: `npx playwright test tests/e2e/gallery.spec.ts` → FAIL.

- [ ] **Step 2: Implementar**
  - **Grade:** colunas CSS (`columns-1 sm:columns-2 lg:columns-3`, `break-inside-avoid`) com botões `Ampliar foto: ${alt}`.
  - **Visualizador:**
    - imagem `object-contain` com `sizes="100vw"`, legenda e contador;
    - botões `Foto anterior`, `Próxima foto` e `Fechar`;
    - setas e Esc; navegação circular;
    - deslize no toque (Δx > 50 px, via pointer events);
    - foco no `Fechar` ao abrir e retorno à miniatura de origem ao fechar.
- [ ] **Step 3: Rodar e ver passar** — `npm run lint && npx playwright test tests/e2e/gallery.spec.ts` → PASS.
- [ ] **Step 4: Commit** — `feat: galeria com filtros e visualizador em tela cheia`

---

### Task 15: Reservas

**Files:**
- Create: `src/components/reservation/{ReservationForm,ReservationSuccess}.tsx`, `tests/e2e/reservation.spec.ts`
- Modify: `src/app/reservas/page.tsx`

**Interfaces:**
- Consumes: `validateReservation`, `generateReservationCode`, `ReservationInput`, `AREA_LABELS`, `OCCASION_LABELS`, `MAX_PEOPLE` (Task 5); `getReservationSlots`, `zonedNow`, `addDaysISO`, `formatDateLongBR`, `describeDay` (Task 3); `maskPhone` (Task 2); `buildReservationMessage`, `whatsappUrl`, `CONTACT_MESSAGE` (Task 6); `useNow` (Task 9).

- [ ] **Step 1: Escrever o teste que falha (`reservation.spec.ts`)**
- **Datas relativas:** o teste importa `zonedNow`, `addDaysISO`, `weekdayOfISO` e `getReservationSlots` de `src/lib/hours` (o Playwright resolve `paths` do tsconfig).
  - `nextOpen` = 1º dia ≥ amanhã com horários;
  - `nextMonday` = 1ª segunda ≥ amanhã.
- **Envio vazio:** aparecem `Informe seu nome completo.`, `Informe um telefone válido com DDD.`, `Escolha a data.` e `Escolha um horário.`; `getByLabel('Nome')` fica focado.
- **Segunda-feira:** `getByLabel('Data').fill(nextMonday)` → `Fechamos às segundas. Escolha outro dia.` visível, com `getByLabel('Horário')` desabilitado.
- **Reserva válida:**
  1. Nome `Ana Souza`.
  2. `getByLabel('WhatsApp ou telefone').pressSequentially('11988887777')` → o valor fica `(11) 98888-7777`.
  3. Data `nextOpen`; `Horário`: `selectOption` com o 1º horário.
  4. `Aumentar pessoas` 2× → `4 pessoas`.
  5. Radio `Varanda`; ocasião `Aniversário`.
  6. Enviar → heading `Reserva solicitada!` visível, com texto `/FF-[A-Z2-9]{4}/`.
  7. O `href` do link `Confirmar pelo WhatsApp`, decodificado, contém o código, `Pessoas: 4` e `Área: Varanda`.
  8. `Fazer outra reserva` → o formulário volta com `Nome` vazio.
- Os 2 projetos: sem overflow e sem erros.

Run: `npx playwright test tests/e2e/reservation.spec.ts` → FAIL.

- [ ] **Step 2: Implementar o §6.5**
  - **Estado:** `ReservationInput` controlado.
  - **Data:** `min`/`max` vêm de `useNow()` (`today` e `today+60`) e só são aplicados quando ≠ null. O erro de data é mostrado já na mudança; os outros, só ao enviar.
  - **Horário:** opções calculadas no render com `getReservationSlots(date, now)`.
    - Desabilitado sem data, ou com data inválida.
    - Sem horários hoje: "Não há mais horários hoje. Que tal amanhã?"
  - **Telefone:** `maskPhone` no `onChange`, com `inputMode="tel"` e `autoComplete="tel"`.
  - **Pessoas:** botões `Diminuir pessoas`/`Aumentar pessoas` (1–12) e saída `aria-live`: "N pessoas" ou "1 pessoa".
    - Em 12, aparece "Mais de 12 pessoas? Fale com a gente sobre eventos.", com link `whatsappUrl(CONTACT_MESSAGE)`.
  - **Área:** radios em cartões, dentro de um fieldset "Área preferida (opcional)".
  - **Ocasião:** select com `''` = "Nenhuma".
  - **Envio:**
    - `validateReservation(input, new Date())` roda dentro do handler (permitido);
    - foco no 1º inválido, na ordem name, phone, email, date, time, people.
  - **Sucesso:**
    - `generateReservationCode()` no handler e `ReservationSuccess` com foco no heading (`tabIndex=-1`);
    - resumo: data longa, horário, pessoas, área;
    - links `Confirmar pelo WhatsApp` e `Fazer outra reserva`.
  - **Coluna lateral "Bom saber":** os 5 itens do §6.5, mais a tabela de horários via `describeDay`.
- [ ] **Step 3: Rodar e ver passar** — `npm run lint && npx playwright test tests/e2e/reservation.spec.ts` → PASS.
- [ ] **Step 4: Commit** — `feat: reservas com validação, confirmação e WhatsApp`

---

### Task 16: SEO e imagem de compartilhamento

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/icon.svg`, `src/components/seo/RestaurantJsonLd.tsx`, `tests/e2e/seo.spec.ts`
- Modify: `src/app/layout.tsx` (metadata, viewport, JSON-LD), as 5 `page.tsx` internas (`export const metadata`)

**Interfaces:**
- Consumes: `SITE`, `SCHEDULE` (Task 3); `src/assets/images/scenes/hero-burger.jpg` e `src/assets/fonts/*.ttf` (Task 7).

- [ ] **Step 1: Escrever o teste que falha (`seo.spec.ts`, só desktop)**
- **Para cada rota:**
  - `meta[name="robots"]` com `content` contendo `noindex`;
  - `meta[property="og:image"]` existe;
  - `html[lang="pt-BR"]`.
- **Títulos:**
  - `/` → `Ferro & Fumaça · Burger & Grill na Vila Madalena`;
  - `/cardapio` → `Cardápio · Ferro & Fumaça` (idem Sobre, Galeria, Reservas, Contato).
- **Imagem:** o `pathname` do `og:image`, buscado com `request.get`, retorna status 200 e `content-type` `image/png`.
- **JSON-LD:** `script[type="application/ld+json"]` faz parse com `@type === 'Restaurant'` e `name === 'Ferro & Fumaça'`.

Run: `npx playwright test tests/e2e/seo.spec.ts --project=desktop` → FAIL.

- [ ] **Step 2: Implementar**
  - **Metadata do layout:**
    - `metadataBase`: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`, com fallback `http://localhost:3000`;
    - `title: { default: 'Ferro & Fumaça · Burger & Grill na Vila Madalena', template: '%s · Ferro & Fumaça' }`;
    - `description: SITE.description`;
    - `openGraph: { type:'website', locale:'pt_BR', siteName:'Ferro & Fumaça' }`;
    - `twitter: { card:'summary_large_image' }`;
    - `robots: { index:false, follow:false }`;
    - `export const viewport = { themeColor: '#12100E' }`.
  - **Títulos e descrições das páginas:**
    - Cardápio → "Smash burgers, carnes defumadas na lenha, porções, shakes e chope gelado. Monte seu pedido e envie pelo WhatsApp."
    - Sobre → "Do food truck de 2017 ao endereço com cheiro de lenha na Vila Madalena: conheça a história da Ferro & Fumaça."
    - Galeria → "Fotos da chapa, da brasa, do salão e dos bastidores da Ferro & Fumaça."
    - Reservas → "Reserve sua mesa de terça a domingo para até 12 pessoas. Confirmação pelo WhatsApp."
    - Contato → "Endereço, horários, mapa e perguntas frequentes da Ferro & Fumaça, na Vila Madalena."
  - **`opengraph-image.tsx`:**
    - `alt = 'Ferro & Fumaça — Burger & Grill na Vila Madalena'`, `size = { width: 1200, height: 630 }`, `contentType = 'image/png'`;
    - foto e fontes lidas no escopo do módulo (`readFile(join(process.cwd(), 'src/assets/...'))`, foto como data-URL base64);
    - foto de fundo com gradiente escuro à esquerda;
    - "FERRO & FUMAÇA" (Stencil 900, ~120 px, `#F3EADB`);
    - "BURGER & GRILL · VILA MADALENA" (Barlow 600, 32 px, `#E8501C`);
    - "Chapa de ferro. Fumaça de lenha." (Barlow 600, 36 px).
  - **`icon.svg`:** quadrado `#12100E` com cantos de 6 px e chama (path do lucide `Flame`) em `#E8501C`.
  - **`RestaurantJsonLd`:**
    - campos: `name`, `servesCuisine` `['Hambúrguer','Churrasco']`, `priceRange` `'$$'`, `telephone`, `address`, `url`;
    - `address` como `PostalAddress`, com `addressLocality` São Paulo, `addressRegion` SP e `addressCountry` BR;
    - `openingHoursSpecification` derivado de `SCHEDULE` (`closes: '00:00'` quando 1440);
    - no `<body>`, com `<` escapado como `\u003c`.
- [ ] **Step 3: Rodar e ver passar**

Run: `npm run lint && npx playwright test tests/e2e/seo.spec.ts --project=desktop` → PASS; abrir `http://localhost:3100/opengraph-image` e conferir visualmente o PNG.

- [ ] **Step 4: Commit** — `feat: metadados, imagem de compartilhamento, ícone e JSON-LD`

---

### Task 17: Revisão visual, Lighthouse, README e prints

**Files:**
- Create: `tests/e2e/screenshots.spec.ts`, `docs/screenshots/*.png`, `README.md` (substitui o do scaffold)
- Modify: componentes conforme os problemas encontrados

- [ ] **Step 1: Teste gerador de prints**
  - `screenshots.spec.ts` roda só com `SHOTS=1`.
  - Usa `test.use({ reducedMotion: 'reduce' })`, para o conteúdo do Reveal aparecer.
  - Para cada rota e projeto:
    1. Rolar até o fim em passos de 600 px.
    2. Esperar `networkidle`.
    3. Voltar ao topo.
    4. Salvar `docs/screenshots/<projeto>-<rota>.png` (só a primeira dobra) e `…-full.png` (página inteira) no scratchpad.
  - Extras: gaveta aberta com 3 itens (mobile) e confirmação de reserva (desktop).

Run: `SHOTS=1 npx playwright test tests/e2e/screenshots.spec.ts` → PNGs gerados.

- [ ] **Step 2: Revisar cada print com a ferramenta Read**
  - Checklist:
    - hierarquia e contraste;
    - alinhamento e respiro;
    - foto que não combina;
    - texto cortado ou quebrado feio;
    - estados vazios;
    - consistência dos rótulos `Nº`.
  - Corrigir, regerar e repetir até não sobrar problema. Depois, rodar toda a suíte: `npm run lint && npm test && npx playwright test` → PASS.
- [ ] **Step 3: Lighthouse (mobile)**

```bash
npx --yes lighthouse@latest http://localhost:3100/ --chrome-path="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./lh-home.json --quiet --chrome-flags="--headless=new"
```

  - Repetir para `/cardapio`.
  - Esperado: Performance, Acessibilidade e Boas práticas ≥ 0,90. SEO só pode perder pontos pelo `noindex`; conferir `audits['is-crawlable']`, sendo a única falha aceitável.
  - Corrigir o que estiver abaixo. Não commitar os JSONs.
- [ ] **Step 4: README.md em pt-BR (§16)**
  - Título e o aviso "Restaurante fictício — projeto de portfólio".
  - Link ao vivo: a linha `**Ao vivo:**` é preenchida na Task 18.
  - Prints `desktop-inicio`, `mobile-cardapio`, gaveta e confirmação de reserva.
  - Recursos, Stack, Como rodar (`npm install`, `npm run dev`, `npm test`, `npm run test:e2e`).
  - "Como adaptar para um restaurante de verdade": `src/data/site.ts` (nome, endereço, WhatsApp, horários, taxa), `menu.ts`, `gallery.ts`, imagens em `src/assets` e `scripts/images.manifest.json`.
  - Estrutura de pastas.
  - Créditos: "Fotos do Unsplash (Licença Unsplash)" com a lista de URLs do manifesto.
  - Autor: só o nome.
- [ ] **Step 5: Commit** — `docs: README, prints e ajustes da revisão visual`

---

### Task 18: Publicação no GitHub e na Vercel

**Files:**
- Modify: `README.md` (link ao vivo)

- [ ] **Step 1: Suíte completa verde**

Run: `npm run lint && npm test && npx playwright test` → tudo PASS.

- [ ] **Step 2: Combinar a publicação com o Raphael (pausa obrigatória)**
  - **Perguntar:**
    - o usuário do GitHub;
    - se ele cria o repositório público vazio `ferro-e-fumaca` em github.com/new (sem README nem .gitignore) ou se prefere que eu instale o GitHub CLI (`winget install GitHub.cli`);
    - qual e-mail usar nos commits públicos (sugerir o `noreply` do GitHub).
  - **Se o e-mail mudar:**
    - `git config user.email <novo>`;
    - `git rebase -r --root --exec "git commit --amend --no-edit --reset-author"`.
  - **Confirmar explicitamente antes do push.**
- [ ] **Step 3: Push**

```bash
git remote add origin https://github.com/<usuario>/ferro-e-fumaca.git && git push -u origin main
```
O Git Credential Manager abre o login no navegador. Esperado: `branch 'main' set up to track 'origin/main'`.

- [ ] **Step 4: Importar na Vercel (feito pelo Raphael)**
  - Em https://vercel.com/new → Import `ferro-e-fumaca` → Deploy, sem mudar configurações.
  - Ele envia a URL de produção.
- [ ] **Step 5: Verificar produção**

```bash
for p in / /cardapio /sobre /galeria /reservas /contato; do curl -s -o /dev/null -w "%{http_code} $p\n" "https://<url>$p"; done
curl -s "https://<url>/" | grep -o '<meta name="robots"[^>]*>'
```
  - Esperado: seis `200`, mais `noindex, nofollow`.
  - O `og:image` retorna `image/png`.
- [ ] **Step 6: README com o link ao vivo, commit e push** — `docs: link do site publicado` (a Vercel republica sozinha).
- [ ] **Step 7: Entregar o material do Workana no chat**
  - Lista dos 4–6 prints para "Projetos em Destaque".
  - Texto de descrição do projeto, sem links nem contatos.
  - Lembrete da regra de contato.
