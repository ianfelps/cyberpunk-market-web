"use client";

import { CheckCircle2, CreditCard, XCircle } from "lucide-react";
import { Panel } from "@/shared/components/ui/Panel";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, formatDate } from "@/shared/lib/utils/format";
import { PaymentMethod, PaymentStatus } from "@/shared/types/domain";
import { usePayment } from "@/modules/payments/hooks/usePayment";
import styles from "./payment.module.css";

const methodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.CreditCard]: "Cartão de Crédito",
  [PaymentMethod.DebitCard]: "Cartão de Débito",
  [PaymentMethod.Pix]: "Pix",
  [PaymentMethod.BankTransfer]: "Transferência Bancária",
};

const statusLabel: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "Pendente",
  [PaymentStatus.Completed]: "Concluído",
  [PaymentStatus.Failed]: "Falhou",
  [PaymentStatus.Refunded]: "Estornado",
};

const statusClass: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "status-badge status-pending",
  [PaymentStatus.Completed]: "status-badge status-paid",
  [PaymentStatus.Failed]: "status-badge status-failed",
  [PaymentStatus.Refunded]: "status-badge status-refunded",
};

interface Props {
  orderId: string;
}

export function PaymentPanel({ orderId }: Props) {
  const { payment, loading, acting, error, complete, fail } = usePayment(orderId);

  if (loading) return <p className="loading-text">Carregando pagamento...</p>;
  if (error) return <p className="inline-error">{error}</p>;
  if (!payment) return null;

  return (
    <Panel title="Pagamento">
      <div className={styles.grid}>
        <div className={styles.infoBox}>
          <span>Valor</span>
          <strong>{formatCurrency(payment.amount)}</strong>
        </div>
        <div className={styles.infoBox}>
          <span>Método</span>
          <strong>
            <CreditCard size={13} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
            {methodLabel[payment.method]}
          </strong>
        </div>
        <div className={styles.infoBox}>
          <span>Status</span>
          <span className={statusClass[payment.status]}>{statusLabel[payment.status]}</span>
        </div>
      </div>

      {payment.paidAt ? (
        <p className={styles.paidAt}>Pago em: {formatDate(payment.paidAt)}</p>
      ) : null}

      {payment.status === PaymentStatus.Pending ? (
        <div className={styles.actions}>
          <Button onClick={complete} disabled={acting}>
            <CheckCircle2 size={15} />
            {acting ? "Processando..." : "Confirmar Pagamento"}
          </Button>
          <Button variant="danger" onClick={fail} disabled={acting}>
            <XCircle size={15} />
            Marcar como Falho
          </Button>
        </div>
      ) : null}
    </Panel>
  );
}
