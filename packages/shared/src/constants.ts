export const API_ROUTES = {
  FRANCHISES: "/api/franchises",
  FRANCHISE_BY_ID: (id: number | string) => `/api/franchises/${id}`,
  COLLABORATORS: "/api/collaborators",
  COLLABORATOR_BY_ID: (id: number | string) => `/api/collaborators/${id}`,
} as const;

export const FRANCHISE_STATUSES: readonly string[] = [
  "active",
  "inactive ",
  "pending",
];

export const COLLABORATOR_ROLE_SUGGESTIONS = [
  "Gerente", "Subgerente", "Supervisor", "Atendente", "Caixa",
  "Estoquista", "Analista Financeiro", "Auxiliar Administrativo",
  "Coordenador de Operações", "Treinador",
] as const;

export const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
