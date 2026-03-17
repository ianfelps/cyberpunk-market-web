import { InputHTMLAttributes } from "react";
import styles from "./input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input className={`${styles.input} ${className ?? ""}`} {...props} />
      {error ? <small className={styles.error}>{error}</small> : null}
    </label>
  );
}
