"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Panel } from "@/shared/components/ui/Panel";
import { formatCurrency } from "@/shared/lib/utils/format";
import { PaymentMethod } from "@/shared/types/domain";
import { useAddresses } from "@/modules/account/hooks/useAddresses";
import { useCart } from "@/modules/cart/hooks/useCart";
import { createOrder } from "@/modules/orders/services/orderService";
import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";

const paymentMethods = [
  { value: PaymentMethod.Pix, label: "Pix" },
  { value: PaymentMethod.CreditCard, label: "Cartão de Crédito" },
  { value: PaymentMethod.DebitCard, label: "Cartão de Débito" },
  { value: PaymentMethod.BankTransfer, label: "Transferência Bancária" },
];

export default function CheckoutPage() {
  const { isAuthenticated } = useProtectedRoute();
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const { addresses, loading: addressesLoading } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.Pix);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddressId) {
      setError("Selecione um endereço de entrega.");
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      const response = await createOrder({
        shippingAddressId: selectedAddressId,
        paymentMethod: selectedMethod,
      });
      router.push(`/payment/${response.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar pedido.");
    } finally {
      setPlacing(false);
    }
  }, [selectedAddressId, selectedMethod, router]);

  if (!isAuthenticated) return null;

  if (cartLoading || addressesLoading) {
    return <p className="loading-text">Carregando checkout...</p>;
  }

  if (!cart || !cart.items.length) {
    return (
      <div className="grid-auto">
        <div className="page-title">
          <h1>Checkout</h1>
        </div>
        <Panel title="Carrinho vazio" subtitle="Adicione produtos antes de finalizar o pedido.">
          <Link href="/products">
            <Button>
              <ShoppingBag size={15} />
              Explorar produtos
            </Button>
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <div className="grid-auto">
      <div className="page-title">
        <div>
          <h1>Checkout</h1>
          <p>Confirme endereço e forma de pagamento.</p>
        </div>
        <Link href="/cart">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={13} />
            Carrinho
          </Button>
        </Link>
      </div>

      <Panel title="Resumo do pedido">
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {cart.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.6rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>
                {item.productName} × {item.quantity}
              </span>
              <strong>{formatCurrency(item.subtotal)}</strong>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
            }}
          >
            <span>Total</span>
            <strong
              style={{
                fontSize: "1.15rem",
                background: "linear-gradient(130deg, var(--accent), var(--accent-2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {formatCurrency(cart.totalAmount)}
            </strong>
          </div>
        </div>
      </Panel>

      <Panel title="Endereço de entrega">
        {!addresses.length ? (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <p style={{ color: "var(--text-muted)" }}>
              Nenhum endereço cadastrado. Cadastre um em Conta.
            </p>
            <Link href="/account">
              <Button variant="secondary">
                <MapPin size={14} />
                Ir para Conta
              </Button>
            </Link>
          </div>
        ) : (
          <div className="field-group">
            <span>
              <MapPin
                size={13}
                style={{
                  display: "inline",
                  marginRight: "0.3rem",
                  verticalAlign: "middle",
                }}
              />
              Selecionar endereço
            </span>
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
            >
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.street}, {address.number} — {address.city}/{address.state}
                  {address.isDefault ? " (Padrão)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </Panel>

      <Panel title="Forma de pagamento">
        <div className="field-group">
          <span>
            <CreditCard
              size={13}
              style={{
                display: "inline",
                marginRight: "0.3rem",
                verticalAlign: "middle",
              }}
            />
            Método
          </span>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(Number(e.target.value) as PaymentMethod)}
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      {error ? <p className="inline-error">{error}</p> : null}

      <Button fullWidth onClick={handlePlaceOrder} disabled={placing || !addresses.length}>
        {placing ? "Criando pedido..." : "Confirmar pedido"}
      </Button>
    </div>
  );
}
