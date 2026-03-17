import Link from "next/link";
import { Panel } from "@/shared/components/ui/Panel";
import { formatCurrency, formatDate } from "@/shared/lib/utils/format";
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/shared/types/domain";
import { Button } from "@/shared/components/ui/Button";
import styles from "./orders.module.css";

const statusLabel: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Pendente",
  [OrderStatus.Paid]: "Pago",
  [OrderStatus.Shipped]: "Enviado",
  [OrderStatus.Completed]: "Concluído",
  [OrderStatus.Canceled]: "Cancelado",
};

const statusClass: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "status-badge status-pending",
  [OrderStatus.Paid]: "status-badge status-paid",
  [OrderStatus.Shipped]: "status-badge status-shipped",
  [OrderStatus.Completed]: "status-badge status-completed",
  [OrderStatus.Canceled]: "status-badge status-canceled",
};

const methodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.CreditCard]: "Cartão de Crédito",
  [PaymentMethod.DebitCard]: "Cartão de Débito",
  [PaymentMethod.Pix]: "Pix",
  [PaymentMethod.BankTransfer]: "Transferência",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "Pendente",
  [PaymentStatus.Completed]: "Concluído",
  [PaymentStatus.Failed]: "Falhou",
  [PaymentStatus.Refunded]: "Estornado",
};

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="grid-auto">
      <Panel
        title={`Pedido #${order.id.slice(0, 8).toUpperCase()}`}
        subtitle={`Criado em ${formatDate(order.orderDate)}`}
      >
        <div style={{ marginBottom: "1rem" }}>
          <span className={statusClass[order.status]}>{statusLabel[order.status]}</span>
        </div>

        <div className={styles.list}>
          {order.items.map((item) => (
            <div key={item.id} className={styles.orderItemRow}>
              <div>
                <h3>{item.productName}</h3>
                <p>
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                  {item.discount > 0 ? ` (−${formatCurrency(item.discount)})` : ""}
                </p>
              </div>
              <strong>{formatCurrency(item.subtotal)}</strong>
            </div>
          ))}
        </div>

        <div className={styles.summaryRow}>
          <span>Total do pedido</span>
          <span className={styles.summaryTotal}>{formatCurrency(order.totalAmount)}</span>
        </div>
      </Panel>

      {order.payment ? (
        <Panel title="Pagamento">
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <p style={{ color: "var(--text-muted)" }}>
              Método: <strong style={{ color: "var(--text)" }}>{methodLabel[order.payment.method]}</strong>
            </p>
            <p style={{ color: "var(--text-muted)" }}>
              Status:{" "}
              <strong style={{ color: "var(--text)" }}>
                {paymentStatusLabel[order.payment.status]}
              </strong>
            </p>
            <p style={{ color: "var(--text-muted)" }}>
              Valor: <strong style={{ color: "var(--accent-2)" }}>{formatCurrency(order.payment.amount)}</strong>
            </p>
            {order.payment.paidAt ? (
              <p style={{ color: "var(--text-muted)" }}>
                Pago em: {formatDate(order.payment.paidAt)}
              </p>
            ) : null}
          </div>
          {order.status === OrderStatus.Pending ? (
            <div style={{ marginTop: "1rem" }}>
              <Link href={`/payment/${order.id}`}>
                <Button>Ir para pagamento</Button>
              </Link>
            </div>
          ) : null}
        </Panel>
      ) : null}
    </div>
  );
}
