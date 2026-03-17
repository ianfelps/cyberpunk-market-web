import { ProtectedPage } from "@/shared/components/layout/ProtectedPage";
import { OrderList } from "@/modules/orders/components/OrderList";

export default function OrdersPage() {
  return (
    <ProtectedPage>
      <div className="grid-auto">
        <div className="page-title">
          <div>
            <h1>Pedidos</h1>
            <p>Histórico e status dos seus pedidos.</p>
          </div>
        </div>
        <OrderList />
      </div>
    </ProtectedPage>
  );
}
