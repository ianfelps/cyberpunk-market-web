# Cyberpunk Market Web

Frontend do marketplace Cyberpunk Market em Next.js 16 com App Router, autenticação JWT via Context API, módulos por domínio, CSS Modules com tema cyberpunk e integração completa com a API REST.

---

## Tecnologias

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configuração base) + **CSS Modules** (estilização por componente)
- **Lucide React** (ícones SVG)
- **Context API** + hooks customizados (gerenciamento de estado)

---

## Estrutura do projeto

```
cyberpunk-market-web/
├── public/                        # Assets estáticos
├── src/
│   ├── app/                       # Rotas (Next.js App Router)
│   │   ├── page.tsx               # Home: landing page ou dashboard conforme autenticação
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx           # Listagem de produtos
│   │   │   ├── [id]/page.tsx      # Detalhes do produto
│   │   │   └── manage/page.tsx    # Gerenciamento de produtos (Seller)
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── payment/[orderId]/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── account/page.tsx
│   │   ├── layout.tsx             # Layout raiz com AppShell
│   │   └── globals.css            # Variáveis CSS, utilitários e tema global
│   ├── modules/                   # Módulos por domínio (serviços, hooks, componentes)
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── wishlist/
│   │   ├── account/
│   │   ├── reviews/
│   │   └── payments/
│   └── shared/                    # Código transversal
│       ├── components/
│       │   ├── layout/            # AppShell, Header, ProtectedPage
│       │   └── ui/                # Button, Input, Panel
│       ├── contexts/              # AuthContext
│       ├── hooks/                 # useAuth, useProtectedRoute
│       ├── lib/
│       │   ├── api/               # Cliente HTTP (client.ts)
│       │   ├── storage/           # authStorage (localStorage)
│       │   └── utils/             # Formatadores (format.ts)
│       └── types/                 # Tipos TypeScript (domain.ts, api.ts)
```

Cada módulo segue a mesma estrutura interna:

```
modules/<domínio>/
├── services/      # Chamadas à API
├── hooks/         # Estado e lógica da tela
└── components/    # Componentes + CSS Module
```

---

## Configuração

### Pré-requisitos

- Node.js 20+
- API Cyberpunk Market em execução

### Variáveis de ambiente

O repositório não contém `.env.local`. Copie o modelo:

```bash
cp .env.example .env.local
```

Ajuste o valor em `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://localhost:<porta>/api
```

Aponte para a URL base da API (sem barra final).

---

## Executando o projeto

```bash
# Instalar dependências
npm install

# Desenvolvimento (hot reload)
npm run dev

# Build de produção
npm run build

# Servir build de produção
npm start
```

O frontend sobe por padrão em `http://localhost:3000`.

---

## Telas e módulos

### Acesso público

| Rota | Tela | Descrição |
|------|------|-----------|
| `/` | Landing Page | Apresentação do produto com CTA para login e registro; exibe dashboard se autenticado |
| `/login` | Login | Autenticação com email e senha; redireciona para `/products` se já logado |
| `/register` | Registro | Cadastro de comprador ou vendedor; redireciona para `/products` se já logado |

### Acesso protegido (requer autenticação)

| Rota | Tela | Perfil | Descrição |
|------|------|--------|-----------|
| `/products` | Catálogo | Buyer, Seller | Listagem paginada com filtros por nome e faixa de preço |
| `/products/[id]` | Produto | Buyer, Seller | Detalhes, adicionar ao carrinho, adicionar à wishlist e avaliações |
| `/products/manage` | Gerenciar produtos | Seller | CRUD de produtos do vendedor autenticado |
| `/cart` | Carrinho | Buyer, Seller | Itens do carrinho com controle de quantidade e acesso ao checkout |
| `/checkout` | Checkout | Buyer, Seller | Seleção de endereço de entrega e forma de pagamento; criação do pedido |
| `/payment/[orderId]` | Pagamento | Buyer, Seller | Detalhes e ações do pagamento (concluir ou marcar como falho) |
| `/orders` | Pedidos | Buyer, Seller | Histórico de pedidos com status e link para pagamento |
| `/orders/[id]` | Detalhes do pedido | Buyer, Seller | Itens, valores, status do pedido e informações de pagamento |
| `/wishlist` | Lista de desejos | Buyer, Seller | Produtos salvos com opção de alerta de queda de preço |
| `/account` | Conta | Buyer, Seller | Edição de perfil e CRUD completo de endereços |

---

## Proteção de rotas

A proteção é feita no lado do cliente:

- **`useProtectedRoute`** (hook): verifica `isAuthenticated` do `AuthContext` e redireciona para `/login` via `router.replace` se não autenticado. Usado em componentes `"use client"`.
- **`ProtectedPage`** (componente): wrapper para páginas que não são `"use client"`, renderiza `null` enquanto não autenticado.

O token JWT é armazenado em `localStorage` e injetado automaticamente no header `Authorization: Bearer <token>` pelo cliente HTTP (`shared/lib/api/client.ts`).

---

## Comunicação com a API

Todas as chamadas passam por `shared/lib/api/client.ts`, que:

- Lê `NEXT_PUBLIC_API_URL` como base URL.
- Injeta o token JWT do `localStorage` no header `Authorization`.
- Converte respostas `ApiResponse<T>` lançando erro com a `message` da API em caso de `success: false`.
- Suporta query params opcionais via `QueryParams`.

Cada módulo expõe funções de serviço tipadas que consomem esse cliente e retornam os dados já desembrulhados do envelope `ApiResponse<T>`.

---

## Decisões técnicas

- **Módulos por domínio**: cada área funcional (auth, products, cart, orders, wishlist, account, reviews, payments) concentra seus serviços, hooks e componentes em `src/modules/<domínio>`, evitando acoplamento entre domínios e facilitando evolução isolada.
- **CSS Modules + tema global**: variáveis CSS definidas em `globals.css` (cores, tipografia, raio de borda, sombras) são consumidas por todos os CSS Modules, garantindo consistência visual sem pré-processador. Tailwind CSS é usado apenas como reset/base.
- **Context API sem biblioteca externa**: `AuthContext` gerencia o estado de autenticação (token, usuário, login, logout) com `useState` + `useCallback` + `localStorage`, evitando dependência de bibliotecas de estado.
- **Hooks por tela**: cada tela tem seu próprio hook (`useProducts`, `useCart`, `useOrders`, etc.) que encapsula carregamento, erro, paginação e ações, mantendo os componentes de apresentação sem lógica de negócio.
- **Proteção client-side**: como o token JWT vive em `localStorage` e o App Router do Next.js renderiza servidor por padrão, a proteção de rotas é feita no cliente via `useProtectedRoute` e `ProtectedPage`, alinhado com a estratégia de autenticação escolhida.
- **Tipagem sem `any`**: todos os tipos de domínio e enums estão centralizados em `shared/types/domain.ts`; os tipos de API em `shared/types/api.ts`. Nenhum uso de `any` explícito.
- **Formulários sem biblioteca**: formulários gerenciados com `useState` + `useCallback`, sem `react-hook-form` ou similar, mantendo o projeto com o menor número possível de dependências.
- **Landing page dinâmica**: `/` detecta o estado de autenticação e renderiza `LandingPage` (pública) ou `DashboardHome` (atalhos para os módulos), eliminando a necessidade de uma rota de redirecionamento separada.
- **Responsividade**: breakpoints em `480px`, `560px`, `580px`, `640px` e `860px` com CSS Modules; utilitários globais (`grid-2`, `page-title`) usam `clamp()` e `minmax(min(...), 1fr)` para adaptação fluida em qualquer tela. `overflow-x: hidden` aplicado globalmente para prevenir scroll horizontal.

---
