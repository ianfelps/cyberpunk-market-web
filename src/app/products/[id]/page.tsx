"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductDetailsCard } from "@/modules/products/components/ProductDetailsCard";
import { useProductDetails } from "@/modules/products/hooks/useProductDetails";
import { ReviewList } from "@/modules/reviews/components/ReviewList";
import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";

export default function ProductDetailsPage() {
  const { isAuthenticated } = useProtectedRoute();
  const params = useParams<{ id: string }>();
  const { product, loading, error } = useProductDetails(params.id);

  if (!isAuthenticated) return null;

  return (
    <div className="grid-auto">
      <div className="page-title">
        <div>
          <h1>Detalhes do produto</h1>
          <p>Informações completas, carrinho e wishlist.</p>
        </div>
        <Link href="/products" style={{ color: "var(--accent-2)", fontSize: "0.9rem" }}>
          ← Catálogo
        </Link>
      </div>

      {loading ? <p className="loading-text">Carregando produto...</p> : null}
      {error ? <p className="inline-error">{error}</p> : null}
      {product ? <ProductDetailsCard product={product} /> : null}

      {product ? <ReviewList productId={product.id} /> : null}
    </div>
  );
}
