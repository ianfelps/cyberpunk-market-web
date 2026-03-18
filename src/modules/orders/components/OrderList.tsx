"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleX,
  Clock,
  CreditCard,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Panel } from "@/shared/components/ui/Panel";
import { formatCurrency, formatDate } from "@/shared/lib/utils/format";
import { Order, OrderStatus } from "@/shared/types/domain";
import { useOrders } from "@/modules/orders/hooks/useOrders";
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

const StatusIcon = ({ status }: { status: OrderStatus }) => {
  const props = { size: 12 };
  switch (status) {
    case OrderStatus.Pending:
      return <Clock {...props} />;
    case OrderStatus.Paid:
      return <CheckCircle2 {...props} />;
    case OrderStatus.Shipped:
      return <Truck {...props} />;
    case OrderStatus.Completed:
      return <Package {...props} />;
    case OrderStatus.Canceled:
      return <CircleX {...props} />;
  }
};

export function OrderList() {
  const { items, loading, error, cancel } = useOrders();
  const [cancelingOrder, setCancelingOrder] = useState<Order | null>(null);
  const [canceling, setCanceling] = useState(false);

  const handleAskCancel = useCallback((order: Order) => {
    setCancelingOrder(order);
  }, []);

  const handleCloseCancel = useCallback(() => {
    if (canceling) return;
    setCancelingOrder(null);
  }, [canceling]);

  const handleConfirmCancel = useCallback(async () => {
    if (!cancelingOrder) return;
    setCanceling(true);
    try {
      await cancel(cancelingOrder.id);
      setCancelingOrder(null);
    } finally {
      setCanceling(false);
    }
  }, [cancel, cancelingOrder]);

  if (loading) return <p className="loading-text">Carregando pedidos...</p>;
  if (error) return <p className="inline-error">{error}</p>;

  return (
    <Panel title="Meus pedidos" subtitle="Histórico do usuário autenticado.">
      <ConfirmDialog
        open={cancelingOrder !== null}
        title="Cancelar pedido"
        description={
          cancelingOrder
            ? `Tem certeza que deseja cancelar o pedido #${cancelingOrder.id.slice(0, 8).toUpperCase()}?`
            : "Tem certeza que deseja cancelar este pedido?"
        }
        confirmText="Cancelar pedido"
        cancelText="Voltar"
        variant="danger"
        loading={canceling}
        onConfirm={handleConfirmCancel}
        onClose={handleCloseCancel}
      />
      {!items.length ? (
        <p style={{ color: "var(--text-muted)", paddingTop: "0.5rem" }}>
          Você ainda não possui pedidos.
        </p>
      ) : null}
      <div className={styles.list}>
        {items.map((order) => (
          <article key={order.id} className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.itemId}>#{order.id.slice(0, 8).toUpperCase()}</span>
              <span className={statusClass[order.status]}>
                <StatusIcon status={order.status} />
                {statusLabel[order.status]}
              </span>
              <span className={styles.itemDate}>{formatDate(order.orderDate)}</span>
            </div>
            <div className={styles.itemRight}>
              <span className={styles.itemTotal}>{formatCurrency(order.totalAmount)}</span>
              <div className={styles.actions}>
                <Link href={`/orders/${order.id}`} className={styles.detailLink}>
                  Detalhes
                  <ArrowRight size={13} />
                </Link>
                {order.status === OrderStatus.Pending ? (
                  <>
                    <Link href={`/payment/${order.id}`}>
                      <Button size="sm">
                        <CreditCard size={13} />
                        Pagar
                      </Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleAskCancel(order)}>
                      <XCircle size={13} />
                      Cancelar
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
