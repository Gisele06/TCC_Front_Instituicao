import type { EventoRegistro, TipoEventoRegistro } from "../../../types/banco";
import { listarRegistros, salvarRegistro } from "../../../services/recursos";
import { rotasApi } from "../../../services/rotasApi";

export interface Evento {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  observacoes: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  local: string;
}

export async function listarTiposEvento() {
  return listarRegistros<TipoEventoRegistro>(rotasApi.tiposEvento);
}

export async function carregarEventos(): Promise<Evento[]> {
  const [eventos, tipos] = await Promise.all([
    listarRegistros<EventoRegistro>(rotasApi.eventos),
    listarTiposEvento(),
  ]);
  const tiposPorId = new Map(tipos.map((tipo) => [tipo.id, tipo.nome]));
  return eventos.map((evento) => ({
    id: evento.id,
    titulo: evento.nome,
    categoria: tiposPorId.get(evento.id_tipo_evento) ?? "Tipo não encontrado",
    descricao: evento.descricao ?? "",
    observacoes: evento.observacoes ?? "",
    data: evento.data_evento.slice(0, 10),
    horaInicio: evento.horario_inicio.slice(0, 5),
    horaFim: evento.horario_fim.slice(0, 5),
    local: evento.local_do_evento ?? "Local não informado",
  }));
}

export function adicionarEvento(evento: Omit<EventoRegistro, "id">) {
  return salvarRegistro<EventoRegistro>(rotasApi.eventos, evento);
}
