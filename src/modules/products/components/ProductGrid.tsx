import Link from "next/link";
import { Product } from "@/shared/types/domain";
import { formatCurrency } from "@/shared/lib/utils/format";
import styles from "./products.module.css";

interface Props {
  products: Product[];
}

export function ProductGrid({ products }: Props) {
  if (!products.length) {
    return <p className={styles.empty}>Nenhum produto encontrado.</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id} style={{ display: "contents" }}>
          <article className={styles.card}>
            <span
              className={`status-badge ${product.isActive ? "status-active" : "status-inactive"}`}
            >
              {product.isActive ? "Ativo" : "Inativo"}
            </span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong className={styles.cardPrice}>{formatCurrency(product.price)}</strong>
            <span className={styles.cta}>Ver detalhes →</span>
          </article>
        </Link>
      ))}
    </div>
  );
}
