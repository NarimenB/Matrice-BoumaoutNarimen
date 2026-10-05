import React from "react";
const GROUP_OPTIONS = [
  { value: "all", label: "Tous les groupes" },
  { value: "A", label: "Groupe A" },
  { value: "B", label: "Groupe B" },
];

const DOMAIN_OPTIONS = [
  { value: "all", label: "Tous les domaines" },
  { value: "web", label: "Web" },
  { value: "data", label: "Data" },
  { value: "cyber", label: "Cybersécurité" },
  { value: "projet", label: "Projet" },
];

const FIELD_CLASS =
  "rounded-lg border-2 border-green-700 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-800";

export function FiltersBar({ filters, onChange }) {
  return (
    <section
      aria-label="Filtres du planning"
      className="flex flex-col gap-3 rounded-2xl border-2 border-green-700 bg-white p-4 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-group" className="text-sm font-bold text-green-900">
          Groupe
        </label>
        <select
          id="filter-group"
          className={FIELD_CLASS}
          value={filters.group}
          onChange={(e) => onChange("group", e.target.value)}
        >
          {GROUP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="filter-domain" className="text-sm font-bold text-green-900">
          Domaine
        </label>
        <select
          id="filter-domain"
          className={FIELD_CLASS}
          value={filters.domain}
          onChange={(e) => onChange("domain", e.target.value)}
        >
          {DOMAIN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor="filter-search" className="text-sm font-bold text-green-900">
          Recherche
        </label>
        <input
          id="filter-search"
          type="text"
          placeholder="Rechercher un titre de séance"
          className={FIELD_CLASS}
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </div>
    </section>
  );
}