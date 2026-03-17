"use client";

import Link from "next/link";
import {
  ClipboardList,
  CreditCard,
  Heart,
  Package,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Panel } from "@/shared/components/ui/Panel";
import { useAuth } from "@/shared/hooks/useAuth";

const features = [
  {
    icon: ShoppingBag,
    title: "Catálogo completo",
    desc: "Explore produtos de múltiplos vendedores com filtros avançados por nome e faixa de preço.",
  },
  {
    icon: Store,
    title: "Abra sua loja",
    desc: "Cadastre-se como vendedor, crie produtos e gerencie seu catálogo em tempo real.",
  },
  {
    icon: ClipboardList,
    title: "Gestão de pedidos",
    desc: "Acompanhe cada etapa: pendente, pago, enviado e concluído, com histórico completo.",
  },
  {
    icon: Heart,
    title: "Lista de desejos",
    desc: "Salve produtos favoritos e receba alertas quando o preço cair.",
  },
  {
    icon: Star,
    title: "Avaliações",
    desc: "Avalie produtos com nota de 1 a 5 e deixe comentários para outros compradores.",
  },
  {
    icon: CreditCard,
    title: "Múltiplos pagamentos",
    desc: "Pix, cartão de crédito, débito ou transferência bancária — você escolhe.",
  },
];

function LandingPage() {
  return (
    <div style={{ display: "grid", gap: "4rem", paddingBottom: "2rem" }}>
      <section
        style={{
          minHeight: "55vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1.5rem",
          paddingTop: "clamp(1.5rem, 4vw, 3rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "0",
            width: "380px",
            height: "380px",
            background:
              "radial-gradient(circle, rgb(255 143 63 / 8%) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "30%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgb(0 229 255 / 5%) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div>
          <p
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1rem",
            }}
          >
            ◈ Marketplace Multi-Vendor
          </p>
          <h1
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              lineHeight: "1.1",
              letterSpacing: "0.04em",
              background: "linear-gradient(135deg, #fff 0%, var(--accent-2) 50%, var(--accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "1.25rem",
            }}
          >
            CYBERPUNK
            <br />
            MARKET
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "var(--text-muted)",
              maxWidth: "520px",
              lineHeight: "1.7",
              marginBottom: "2rem",
            }}
          >
            O marketplace do futuro, disponível agora. Compre, venda e gerencie
            pedidos em uma plataforma construída para quem move rápido.
          </p>
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
            <Link href="/login">
              <Button>
                <ShoppingCart size={15} />
                Entrar na plataforma
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary">
                <Store size={15} />
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Compradores", value: "Buyer" },
            { label: "Vendedores", value: "Seller" },
            { label: "Endpoints API", value: "30+" },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "1.4rem",
                  color: "var(--accent-2)",
                }}
              >
                {stat.value}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div style={{ marginBottom: "1.75rem" }}>
          <p
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.5rem",
            }}
          >
            ◈ Funcionalidades
          </p>
          <h2
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
              letterSpacing: "0.04em",
            }}
          >
            Tudo que você precisa
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gap: "0.85rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
          }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <Panel key={title}>
              <div style={{ display: "grid", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "2.2rem",
                    height: "2.2rem",
                    borderRadius: "0.5rem",
                    background: "var(--accent-glow)",
                    border: "1px solid rgb(255 143 63 / 30%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={16} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-title)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.88rem",
                    lineHeight: "1.6",
                  }}
                >
                  {desc}
                </p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "linear-gradient(145deg, rgb(18 28 52 / 80%), rgb(10 15 28 / 90%))",
          border: "1px solid var(--border-2)",
          borderRadius: "var(--radius-lg)",
          padding: "clamp(1.5rem, 5vw, 2.5rem)",
          textAlign: "center",
          display: "grid",
          gap: "1.5rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            Pronto para entrar?
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              maxWidth: "400px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Cadastre-se como comprador ou vendedor e comece agora mesmo.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register">
            <Button>
              <Package size={15} />
              Criar conta grátis
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className="grid-auto">
      <section
        style={{
          padding: "1.5rem 0 0.5rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "0.25rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          CYBERPUNK MARKET
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Bem-vindo de volta. Use a navegação acima para acessar os módulos.
        </p>
      </section>

      <div className="grid-2">
        <Panel title="Comprador" subtitle="Explore produtos, monte seu carrinho e faça pedidos.">
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <Link href="/products">
              <Button fullWidth>
                <ShoppingBag size={15} />
                Explorar produtos
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="secondary" fullWidth>
                <ShoppingCart size={15} />
                Ver carrinho
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="ghost" fullWidth>
                <ClipboardList size={15} />
                Meus pedidos
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" fullWidth>
                <Heart size={15} />
                Wishlist
              </Button>
            </Link>
          </div>
        </Panel>

        <Panel title="Vendedor" subtitle="Gerencie seu catálogo de produtos.">
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <Link href="/products/manage">
              <Button fullWidth>
                <Package size={15} />
                Gerenciar produtos
              </Button>
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <DashboardHome />;
}
