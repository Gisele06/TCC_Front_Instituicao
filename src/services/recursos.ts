import { ambiente } from "../config/ambiente";
import { listarMock, salvarMock } from "../mocks/servidorMock";
import { requisicaoApi } from "./api";

// As telas chamam estes serviços tanto em demonstração quanto com a API real.
export function fonteDisponivel() {
  return ambiente.fonteDados === "mock" || Boolean(ambiente.apiBaseUrl);
}

export async function listarRegistros<T>(rota: string): Promise<T[]> {
  if (ambiente.fonteDados === "mock") return listarMock<T>(rota);
  // Contrato atual: GET responde diretamente com um array de registros.
  return requisicaoApi<T[]>(rota);
}

export function salvarRegistro<T>(
  rota: string,
  dados: Record<string, unknown>,
  id?: number,
): Promise<T> {
  if (ambiente.fonteDados === "mock") return salvarMock<T>(rota, dados, id);
  return requisicaoApi<T>(id == null ? rota : `${rota}/${id}`, {
    method: id == null ? "POST" : "PUT",
    body: JSON.stringify(dados),
  });
}

export function idObrigatorio(valor: number, entidade: string): number {
  if (!Number.isInteger(valor) || valor <= 0) {
    throw new Error(`Informe um ${entidade} válido na configuração de integração.`);
  }
  return valor;
}
