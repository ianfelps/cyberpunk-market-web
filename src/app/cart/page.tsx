import { ProtectedPage } from "@/shared/components/layout/ProtectedPage";
import { CartList } from "@/modules/cart/components/CartList";

export default function CartPage() {
  return (
    <ProtectedPage>
      <div className="grid-auto">
        <div className="page-title">
          <div>
            <h1>Carrinho</h1>
            <p>Gerencie itens e finalize seu pedido.</p>
          </div>
        </div>
        <CartList />
      </div>
    </ProtectedPage>
  );
}
