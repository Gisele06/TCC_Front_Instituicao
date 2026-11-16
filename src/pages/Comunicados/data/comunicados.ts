import iconeAviso from "../../../assets/icons/Comunicados/comunicado-aviso.png";
import iconeComunicadoEvento from "../../../assets/icons/Comunicados/comunicado-evento.png";
import { ambiente } from "../../../config/ambiente";
import { carregarProgramacoesLocais } from "./programacao";
import type { ComunicadoRegistro } from "../../../types/banco";
import { listarRegistros, salvarRegistro } from "../../../services/recursos";
import { rotasApi } from "../../../services/rotasApi";

export interface Comunicado {
  id: number;
  categoria: "Comunicado" | "Evento";
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  recorrencia: string;
  icone: string;
}

export async function carregarComunicados(): Promise<Comunicado[]> {
  const lista = await listarRegistros<ComunicadoRegistro>(rotasApi.comunicados);
  const programacoes = ambiente.fonteDados === "mock" ? carregarProgramacoesLocais() : [];
  return lista.map((item) => ({
    id: item.id,
    categoria: item.id_evento == null ? "Comunicado" : "Evento",
    titulo: item.titulo || item.nome,
    descricao: item.descricao ?? "",
    data: programacoes.find(programa => programa.comunicadoId === item.id)?.data ?? "",
    hora: programacoes.find(programa => programa.comunicadoId === item.id)?.horaInicio ?? "",
    recorrencia: programacoes.find(programa => programa.comunicadoId === item.id)?.recorrencia ?? "unica",
    icone: item.id_evento == null ? iconeAviso : iconeComunicadoEvento,
  }));
}

export function adicionarComunicado(comunicado: Omit<ComunicadoRegistro, "id">) {
  return salvarRegistro<ComunicadoRegistro>(rotasApi.comunicados, comunicado);
}
