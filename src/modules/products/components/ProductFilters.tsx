"use client";

import { ChangeEvent } from "react";
import { ProductFilters as ProductFiltersType } from "@/modules/products/services/productService";
import { Category } from "@/shared/types/domain";
import styles from "./products.module.css";

interface Props {
  filters: ProductFiltersType;
  onChange: (next: ProductFiltersType) => void;
  categories?: Category[];
}

export function ProductFilters({ filters, onChange, categories }: Props) {
  const updateText =
    (field: "name") => (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...filters,
        page: 1,
        [field]: event.target.value,
      });
    };

  const updateNumber =
    (field: "minPrice" | "maxPrice") => (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      onChange({
        ...filters,
        page: 1,
        [field]: raw === "" ? undefined : Number(raw),
      });
    };

  const updateCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onChange({
      ...filters,
      page: 1,
      categoryId: value ? value : undefined,
    });
  };

  return (
    <div className={styles.filters}>
      <input placeholder="Buscar por nome" value={filters.name ?? ""} onChange={updateText("name")} />
      {categories ? (
        <select value={filters.categoryId ?? ""} onChange={updateCategory}>
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      ) : null}
      <input
        placeholder="Preço mínimo"
        type="number"
        value={filters.minPrice ?? ""}
        onChange={updateNumber("minPrice")}
      />
      <input
        placeholder="Preço máximo"
        type="number"
        value={filters.maxPrice ?? ""}
        onChange={updateNumber("maxPrice")}
      />
    </div>
  );
}
