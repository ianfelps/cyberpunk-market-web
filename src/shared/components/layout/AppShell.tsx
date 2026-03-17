import { ReactNode } from "react";
import { Header } from "@/shared/components/layout/Header";
import styles from "./app-shell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
