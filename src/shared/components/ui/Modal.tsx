"use client";

import { PropsWithChildren, ReactNode, useCallback, useEffect, useId, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./Button";
import styles from "./modal.module.css";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
  subtitle?: string;
  size?: ModalSize;
  onClose: () => void;
  footer?: ReactNode;
}

export function Modal({
  open,
  title,
  subtitle,
  size = "md",
  onClose,
  footer,
  children,
}: ModalProps) {
  const titleId = useId();
  const subtitleId = useId();

  const sizeClass = useMemo(() => {
    if (size === "sm") return styles.sm;
    if (size === "lg") return styles.lg;
    return "";
  }, [size]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  const content = useMemo(() => {
    if (!open) return null;

    return (
      <div className={styles.overlay} onMouseDown={handleBackdropClick} role="presentation">
        <div
          className={[styles.modal, sizeClass].filter(Boolean).join(" ")}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={subtitle ? subtitleId : undefined}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <div className={styles.title}>
              <h2 id={titleId}>{title}</h2>
              {subtitle ? <p id={subtitleId}>{subtitle}</p> : null}
            </div>
            <div className={styles.close}>
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Fechar">
                <X size={14} />
              </Button>
            </div>
          </div>

          <div className={styles.body}>{children}</div>

          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </div>
      </div>
    );
  }, [open, sizeClass, titleId, subtitleId, title, subtitle, footer, children, handleBackdropClick, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(content, document.body);
}

