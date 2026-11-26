import { obterCursosDisponiveis } from "./rotas_ACADEMICO.js";
import iconeCalendario from "../../img/icones/calendarioBemEstar.png";
import iconeComunicado from "../../img/icones/comunicados.png";
import iconePessoa from "../../img/icones/pessoa.png";
import iconeCoracao from "../../img/icones/coracao.png";
import iconeFormacao from "../../img/icones/formacao.png";
import iconePessoas from "../../img/icones/pessoas.png";
import iconeEscudo from "../../img/icones/cadeado.png";
import iconeLivro from "../../img/icones/materia.png";
import iconeFolha from "../../img/icones/bem-estar.png";
import iconeFlor from "../../img/icones/acolhimento.png";

export const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

export const iconesDeSala = [
  { id: "calendario", nome: "Calendário", imagem: iconeCalendario },
  { id: "comunicado", nome: "Comunicados", imagem: iconeComunicado },
  { id: "pessoa", nome: "Pessoa", imagem: iconePessoa },
  { id: "coracao", nome: "Bem-estar", imagem: iconeCoracao },
  { id: "formacao", nome: "Formação", imagem: iconeFormacao },
  { id: "pessoas", nome: "Pessoas", imagem: iconePessoas },
  { id: "escudo", nome: "Proteção", imagem: iconeEscudo },
  { id: "livro", nome: "Livro", imagem: iconeLivro },
  { id: "folha", nome: "Natureza", imagem: iconeFolha },
  { id: "flor", nome: "Acolhimento", imagem: iconeFlor },
];

export function criarHorario(id, materiaId = "mat-matematica", salaId = "sala-b09") {
  return { id, materiaId, dias: [...diasDaSemana], inicio: "08:00", fim: "09:00", salaId };
}

export function criarId(prefixo) {
  return prefixo + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

export function textoNormalizado(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function filtrarItens(
  itens,
  busca,
  filtro,
  campos,
) {
  const termo = textoNormalizado(busca.trim());
  return itens.filter((item) => {
    const correspondeStatus = filtro === "todas" || (filtro === "ativas" ? item.ativa : !item.ativa);
    const correspondeBusca = !termo || campos(item).some((campo) => textoNormalizado(campo).includes(termo));
    return correspondeStatus && correspondeBusca;
  });
}

export function atualizarLista(atuais, item) {
  return atuais.some((registro) => registro.id === item.id)
    ? atuais.map((registro) => registro.id === item.id ? item : registro)
    : [item, ...atuais];
}

export function nomeDoCurso(id) {
  return obterCursosDisponiveis().find((curso) => curso.id === id)?.nome ?? id;
}

export function iconeDeSala(id) {
  return iconesDeSala.find((icone) => icone.id === id)?.imagem ?? iconeFormacao;
}


