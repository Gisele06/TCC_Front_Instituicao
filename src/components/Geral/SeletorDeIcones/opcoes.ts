import calendario from "../../../assets/icons/Geral/calendar.png";
import comunicado from "../../../assets/icons/Geral/Megaphone.png";
import pessoa from "../../../assets/icons/Geral/pessoa.png";
import coracao from "../../../assets/icons/Geral/coracao.png";
import formacao from "../../../assets/icons/Geral/formacao.png";
import pessoas from "../../../assets/icons/Geral/pessoas.png";
import escudo from "../../../assets/icons/Geral/cadeado.png";
import livro from "../../../assets/icons/Geral/materia.png";
import folha from "../../../assets/icons/Geral/Leaf.png";
import flor from "../../../assets/icons/Geral/flower_bouquet.png";
import type { OpcaoDeIcone } from "./SeletorDeIcones";

/** Ícones que podem ser usados em diferentes cadastros do Bloom. */
export const opcoesDeIcones: OpcaoDeIcone[] = [
  { id: "calendario", nome: "Calendário", imagem: calendario },
  { id: "comunicado", nome: "Comunicados", imagem: comunicado },
  { id: "pessoa", nome: "Pessoa", imagem: pessoa },
  { id: "coracao", nome: "Bem-estar", imagem: coracao },
  { id: "formacao", nome: "Formação", imagem: formacao },
  { id: "pessoas", nome: "Pessoas", imagem: pessoas },
  { id: "escudo", nome: "Proteção", imagem: escudo },
  { id: "livro", nome: "Livro", imagem: livro },
  { id: "folha", nome: "Natureza", imagem: folha },
  { id: "flor", nome: "Acolhimento", imagem: flor },
];
