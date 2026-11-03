import type { FiltroStatus } from "./types";
import type { CursoOpcao } from "./data/academico";
import { opcoesDeIcones } from "../../components/Geral/SeletorDeIcones/opcoes";
import iconeFormacao from "../../assets/icons/Geral/formacao.png";

export function criarId(prefixo: string) {
  return prefixo + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

export function textoNormalizado(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function filtrarItens<T extends { ativa: boolean }>(
  itens: T[],
  busca: string,
  filtro: FiltroStatus,
  campos: (item: T) => string[],
) {
  const termo = textoNormalizado(busca.trim());
  return itens.filter((item) => {
    const correspondeStatus = filtro === "todas" || (filtro === "ativas" ? item.ativa : !item.ativa);
    const correspondeBusca = !termo || campos(item).some((campo) => textoNormalizado(campo).includes(termo));
    return correspondeStatus && correspondeBusca;
  });
}

export function atualizarLista<T extends { id: string }>(atuais: T[], item: T) {
  return atuais.some((registro) => registro.id === item.id)
    ? atuais.map((registro) => registro.id === item.id ? item : registro)
    : [item, ...atuais];
}

export function nomeDoCurso(id: string, cursos: CursoOpcao[]) {
  return cursos.find((curso) => curso.id === id)?.nome ?? `Curso #${id}`;
}

export function iconeDeSala(id: string) {
  return opcoesDeIcones.find((icone) => icone.id === id)?.imagem ?? iconeFormacao;
}

