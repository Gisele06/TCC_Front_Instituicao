import { registrosIniciais } from "./registros";

// O mock simula respostas JSON. Ele não substitui autenticação nem banco de dados.
// Os cadastros feitos aqui ficam somente no navegador, dentro do localStorage.
const prefixo = "bloom-mock-v2:";

function obterLista<T>(rota: string): T[] {
  const iniciais = registrosIniciais[rota];
  if (!iniciais) throw new Error(`Não existe mock para a rota "${rota}".`);

  try {
    const salvo = localStorage.getItem(prefixo + rota);
    return salvo ? (JSON.parse(salvo) as T[]) : (structuredClone(iniciais) as T[]);
  } catch {
    return structuredClone(iniciais) as T[];
  }
}

function guardarLista<T>(rota: string, lista: T[]) {
  localStorage.setItem(prefixo + rota, JSON.stringify(lista));
}

export async function listarMock<T>(rota: string): Promise<T[]> {
  return obterLista<T>(rota);
}

export async function salvarMock<T>(
  rota: string,
  dados: Record<string, unknown>,
  id?: number,
): Promise<T> {
  const registros = obterLista<Record<string, unknown>>(rota);
  const novoId = id ?? Math.max(0, ...registros.map((item) => Number(item.id) || 0)) + 1;
  const registro: Record<string, unknown> = { ...dados, id: novoId };

  if (rota.match(/^denuncias\/\d+\/mensagens$/)) {
    // No banco, o chat da denúncia é descoberto pelo backend.
    registro.data_hora = new Date().toISOString();
    registro.enviada_pela_instituicao = 1;
    registro.id_chat_anonimo = 1;
  }

  if (id == null) {
    registros.unshift(registro);
  } else {
    const indice = registros.findIndex((item) => Number(item.id) === id);
    if (indice < 0) throw new Error("Registro de demonstração não encontrado.");
    registros[indice] = registro;
  }

  guardarLista(rota, registros);
  return registro as T;
}

// Útil para reiniciar o ambiente de demonstração, sem afetar outros dados.
export function limparMocks() {
  Object.keys(registrosIniciais).forEach((rota) => localStorage.removeItem(prefixo + rota));
}
