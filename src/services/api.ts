import { ambiente } from "../config/ambiente";

/**
 * Cliente HTTP centralizado. O grupo só precisa combinar os caminhos dos
 * endpoints com o backend e chamá-lo nos serviços de cada funcionalidade.
 */
export async function requisicaoApi<T>(
  caminho: string,
  opcoes: RequestInit = {},
): Promise<T> {
  if (!ambiente.apiBaseUrl) {
    throw new Error("Defina VITE_API_BASE_URL no .env antes de chamar a API.");
  }

  const resposta = await fetch(`${ambiente.apiBaseUrl}/${caminho.replace(/^\//, "")}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    throw new Error(`Erro ao comunicar com o servidor (${resposta.status}).`);
  }

  if (resposta.status === 204) return undefined as T;
  return (await resposta.json()) as T;
}
