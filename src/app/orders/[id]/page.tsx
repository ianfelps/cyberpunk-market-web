"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderDetails } from "@/modules/orders/components/OrderDetails";
import { useOrderDetails } from "@/modules/orders/hooks/useOrderDetails";
import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";

export default function OrderDetailsPage() {
  const { isAuthenticated } = useProtectedRoute();
  const params = useParams<{ id: string }>();
  const { order, loading, error } = useOrderDetails(params.id);

  if (!isAuthenticated) return null;

  return (
    <div className="grid-auto">
      <div className="page-title">
        <div>
          <h1>Detalhes do pedido</h1>
          <p>Itens, valores e status do pagamento.</p>
        </div>
        <Link href="/orders" style={{ color: "var(--accent-2)", fontSize: "0.9rem" }}>
          ← Pedidos
        </Link>
      </div>

      {loading ? <p className="loading-text">Carregando pedido...</p> : null}
      {error ? <p className="inline-error">{error}</p> : null}
      {order ? <OrderDetails order={order} /> : null}
    </div>
  );
}
