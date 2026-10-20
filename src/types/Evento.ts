export interface Evento {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  observacoes?: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  local: string;
  recorrencia: string;
  turmas: string;
}

export type NovoEvento = Omit<Evento, "id">;
