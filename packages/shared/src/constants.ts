export const API_ROUTES = {
  FRANCHISES: "/api/franchises",
  FRANCHISE_BY_ID: (id: number | string) => `/api/franchises/${id}`,
} as const;

export const FRANCHISE_STATUSES: readonly string[] = [
  "active",
  "inactive ",
  "pending",
];

export const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
