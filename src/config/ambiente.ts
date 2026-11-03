// Mudar VITE_FONTE_DADOS para "api" usa o backend, sem trocar os componentes.
const fonteDados = import.meta.env.VITE_FONTE_DADOS === "api" ? "api" : "mock";

export const ambiente = {
  fonteDados,
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, ""),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
  modoDemonstracao: import.meta.env.VITE_DEMO_MODE !== "false",
  idInstituicao: Number(import.meta.env.VITE_INSTITUICAO_ID || (fonteDados === "mock" ? 1 : 0)),
  idFuncionario: Number(import.meta.env.VITE_FUNCIONARIO_ID || (fonteDados === "mock" ? 1 : 0)),
};
