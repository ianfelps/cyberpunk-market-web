"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CircleUser,
  ClipboardList,
  Heart,
  LogOut,
  ShoppingCart,
  Store,
  Tag,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserRole } from "@/shared/types/domain";
import styles from "./header.module.css";

const buyerLinks = [
  { href: "/products", label: "Produtos", icon: Tag },
  { href: "/cart", label: "Carrinho", icon: ShoppingCart },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/orders", label: "Pedidos", icon: ClipboardList },
  { href: "/account", label: "Conta", icon: CircleUser },
];

const sellerLinks = [
  { href: "/products", label: "Produtos", icon: Tag },
  { href: "/products/manage", label: "Meus Produtos", icon: Store },
  { href: "/cart", label: "Carrinho", icon: ShoppingCart },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/orders", label: "Pedidos", icon: ClipboardList },
  { href: "/account", label: "Conta", icon: CircleUser },
];

const roleLabel: Record<UserRole, string> = {
  [UserRole.Buyer]: "Comprador",
  [UserRole.Seller]: "Vendedor",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const links = user?.role === UserRole.Seller ? sellerLinks : buyerLinks;

  const isLinkActive = (href: string) => {
    if (href === "/products") {
      if (pathname === "/products") return true;
      if (!pathname.startsWith("/products/")) return false;
      return !pathname.startsWith("/products/manage");
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/">CYBERPUNK MARKET</Link>
      </div>

      {isAuthenticated ? (
        <nav className={styles.nav}>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={isLinkActive(href) ? styles.active : ""}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
          {isAdmin ? (
            <Link
              href="/categories/manage"
              className={isLinkActive("/categories/manage") ? styles.active : ""}
            >
              <Store size={14} />
              Categorias
            </Link>
          ) : null}
        </nav>
      ) : (
        <nav className={styles.nav}>
          <Link href="/login" className={pathname === "/login" ? styles.active : ""}>
            Entrar
          </Link>
          <Link href="/register" className={pathname === "/register" ? styles.active : ""}>
            Registrar
          </Link>
        </nav>
      )}

      <div className={styles.actions}>
        {isAuthenticated ? (
          <>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              {user?.role !== undefined ? (
                <span className={styles.userRole}>{roleLabel[user.role]}</span>
              ) : null}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={14} />
              Sair
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Registrar</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
