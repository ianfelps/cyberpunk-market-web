import { ProtectedPage } from "@/shared/components/layout/ProtectedPage";
import { WishlistList } from "@/modules/wishlist/components/WishlistList";

export default function WishlistPage() {
  return (
    <ProtectedPage>
      <div className="grid-auto">
        <div className="page-title">
          <div>
            <h1>Wishlist</h1>
            <p>Produtos que você está acompanhando.</p>
          </div>
        </div>
        <WishlistList />
      </div>
    </ProtectedPage>
  );
}
