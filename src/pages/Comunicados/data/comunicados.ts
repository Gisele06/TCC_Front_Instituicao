import iconeAviso from "../../../assets/icons/Comunicados/comunicado-aviso.png";
import iconeComunicadoEvento from "../../../assets/icons/Comunicados/comunicado-evento.png";
import type { ComunicadoRegistro } from "../../../types/banco";
import { listarRegistros, salvarRegistro } from "../../../services/recursos";
import { rotasApi } from "../../../services/rotasApi";

export interface Comunicado {
  id: number;
  categoria: "Comunicado" | "Evento";
  titulo: string;
  descricao: string;
  // O SQL não tem data/hora próprias para comunicado.
  data: string;
  hora: string;
  icone: string;
}

export async function carregarComunicados(): Promise<Comunicado[]> {
  const lista = await listarRegistros<ComunicadoRegistro>(rotasApi.comunicados);
  return lista.map((item) => ({
    id: item.id,
    categoria: item.id_evento == null ? "Comunicado" : "Evento",
    titulo: item.titulo || item.nome,
    descricao: item.descricao ?? "",
    data: "—",
    hora: "—",
    icone: item.id_evento == null ? iconeAviso : iconeComunicadoEvento,
  }));
}

export function adicionarComunicado(comunicado: Omit<ComunicadoRegistro, "id">) {
  return salvarRegistro<ComunicadoRegistro>(rotasApi.comunicados, comunicado);
}
