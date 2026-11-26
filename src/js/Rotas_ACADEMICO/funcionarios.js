const CHAVE_FUNCIONARIOS = "bloom_funcionarios_v1";

export const CARGOS_FUNCIONARIO = [
  "Coordenador",
  "Diretor",
  "Professor",
  "Psicólogo",
  "Orientador educacional",
  "Secretaria",
  "Apoio pedagógico",
  "Outro",
];

const FUNCIONARIOS_INICIAIS = [
  {
    id: "func-1",
    nome: "Manoel Gomes",
    email: "manoel.gomes@bloom.edu.br",
    cargo: "Professor",
    foto: "",
    ativa: true,
  },
  {
    id: "func-2",
    nome: "Semog Leonam",
    email: "semog.leonam@bloom.edu.br",
    cargo: "Coordenador",
    foto: "",
    ativa: true,
  },
];

function lerLista() {
  try {
    const salvo = localStorage.getItem(CHAVE_FUNCIONARIOS);
    if (salvo) {
      const lista = JSON.parse(salvo);
      if (Array.isArray(lista)) return lista;
    }
  } catch {
    // Ignora falha de leitura no storage
  }
  return FUNCIONARIOS_INICIAIS;
}

function salvarLista(lista) {
  try {
    localStorage.setItem(CHAVE_FUNCIONARIOS, JSON.stringify(lista));
  } catch {
    // Ignora falha de escrita no storage
  }
  return lista;
}

export function obterFuncionarios() {
  return lerLista();
}

export function cadastrarFuncionario(dados) {
  const atual = lerLista();
  const novo = {
    id: `func-${Date.now()}`,
    nome: dados.nome.trim(),
    email: dados.email.trim().toLowerCase(),
    cargo: dados.cargo || "",
    foto: dados.foto || "",
    ativa: dados.ativa !== false,
  };
  return salvarLista([novo, ...atual]);
}

export function atualizarFuncionario(id, alteracoes) {
  const atual = lerLista();
  const atualizada = atual.map((item) =>
    item.id === id ? { ...item, ...alteracoes } : item,
  );
  return salvarLista(atualizada);
}

export function excluirFuncionario(id) {
  const atual = lerLista();
  return salvarLista(atual.filter((item) => item.id !== id));
}