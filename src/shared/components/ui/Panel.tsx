import { PropsWithChildren } from "react";
import styles from "./panel.module.css";

interface PanelProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
}

export function Panel({ title, subtitle, children }: PanelProps) {
  return (
    <section className={styles.panel}>
      {title ? <h2>{title}</h2> : null}
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </section>
  );
}
