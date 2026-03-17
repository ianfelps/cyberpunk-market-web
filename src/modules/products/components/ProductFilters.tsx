"use client";

import { ChangeEvent } from "react";
import { ProductFilters as ProductFiltersType } from "@/modules/products/services/productService";
import styles from "./products.module.css";

interface Props {
  filters: ProductFiltersType;
  onChange: (next: ProductFiltersType) => void;
}

export function ProductFilters({ filters, onChange }: Props) {
  const update =
    (field: keyof ProductFiltersType) => (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...filters,
        page: 1,
        [field]: event.target.value,
      });
    };

  return (
    <div className={styles.filters}>
      <input placeholder="Buscar por nome" value={filters.name ?? ""} onChange={update("name")} />
      <input
        placeholder="Preço mínimo"
        type="number"
        value={filters.minPrice ?? ""}
        onChange={update("minPrice")}
      />
      <input
        placeholder="Preço máximo"
        type="number"
        value={filters.maxPrice ?? ""}
        onChange={update("maxPrice")}
      />
    </div>
  );
}
