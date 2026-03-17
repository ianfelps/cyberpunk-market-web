import { ProtectedPage } from "@/shared/components/layout/ProtectedPage";
import { ProfilePanel } from "@/modules/account/components/ProfilePanel";

export default function AccountPage() {
  return (
    <ProtectedPage>
      <div className="grid-auto">
        <div className="page-title">
          <div>
            <h1>Minha conta</h1>
            <p>Perfil e endereços cadastrados.</p>
          </div>
        </div>
        <ProfilePanel />
      </div>
    </ProtectedPage>
  );
}
