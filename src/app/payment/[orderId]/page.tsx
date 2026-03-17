"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PaymentPanel } from "@/modules/payments/components/PaymentPanel";
import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";

export default function PaymentPage() {
  const { isAuthenticated } = useProtectedRoute();
  const params = useParams<{ orderId: string }>();

  if (!isAuthenticated) return null;

  return (
    <div className="grid-auto">
      <div className="page-title">
        <div>
          <h1>Pagamento</h1>
          <p>Confirme ou acompanhe o status do pagamento.</p>
        </div>
        <Link href="/orders" style={{ color: "var(--accent-2)", fontSize: "0.9rem" }}>
          ← Pedidos
        </Link>
      </div>

      <PaymentPanel orderId={params.orderId} />

      <Link
        href={`/orders/${params.orderId}`}
        style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
      >
        Ver detalhes do pedido →
      </Link>
    </div>
  );
}
