// Contratos esperados da API. Os campos seguem os nomes do SQL do Bloom.
// Os nomes de categoria/tipo são resolvidos pelas tabelas de apoio.
export interface CategoriaRedeRegistro {
  id: number;
  nome: string;
}

export interface RedeApoioRegistro {
  id: number;
  nome: string;
  descricao: string | null;
  telefone: string;
  email: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  url_site_ou_rede_social: string | null;
  endereco: string;
  id_categoria_rede_apoio: number;
}

export interface TipoEventoRegistro {
  id: number;
  nome: string;
}

export interface EventoRegistro {
  id: number;
  nome: string;
  descricao: string | null;
  observacoes: string | null;
  custo: number | string;
  data_evento: string;
  horario_inicio: string;
  horario_fim: string;
  local_do_evento: string | null;
  id_instituicao: number;
  id_sala: number | null;
  id_tipo_evento: number;
}

export interface ComunicadoRegistro {
  id: number;
  nome: string;
  titulo: string | null;
  descricao: string | null;
  observacoes: string | null;
  url_banner: string | null;
  id_instituicao: number;
  id_evento: number | null;
  id_funcionario: number;
}

export interface SalaRegistro {
  id: number;
  nome: string;
  capacidade: number;
  descricao: string | null;
  id_icone: number | null;
  id_instituicao: number;
  id_tipo_sala: number;
}
export interface TipoSalaRegistro {
  id: number;
  tipo: string;
}
export interface CursoRegistro {
  id: number;
  nome: string;
  id_tipo_curso: number;
  id_instituicao: number;
}
export interface MateriaRegistro {
  id: number;
  sigla: string;
  nome: string;
  descricao: string | null;
  ativa: number | boolean;
  id_curso: number;
}
export interface TurmaRegistro {
  id: number;
  nome: string;
  descricao: string | null;
  ativa: number | boolean;
  horario_inicio_aulas: string;
  horario_fim_aulas: string;
  id_curso: number;
}
export interface IntervaloRegistro {
  id: number;
  horario_inicio: string;
  horario_fim: string;
}
export interface TurmaIntervaloRegistro {
  id: number;
  id_intervalo: number;
  id_turma: number;
}
export interface MateriaTurmaRegistro {
  id: number;
  id_materia: number;
  id_turma: number;
  horario_inicio: string;
  horario_fim: string;
  id_sala: number;
}
export interface DiaMateriaRegistro {
  id: number;
  id_dia_semana: number;
  id_materia_turma: number;
}
export interface DenunciaRegistro {
  id: number;
  descricao_do_relato: string;
  data_hora: string;
  local: string | null;
  id_instituicao: number;
  id_aluno: number;
  id_tipo_denuncia: number;
  id_tipo_envolvido: number;
}
export interface TipoDenunciaRegistro {
  id: number;
  nome: string;
}
export interface HistoricoStatusDenunciaRegistro {
  id: number;
  data_hora: string;
  id_denuncia: number;
  nome: string;
}
export interface MensagemDenunciaRegistro {
  id: number;
  texto: string;
  data_hora: string;
  enviada_pela_instituicao: number | boolean;
  id_chat_anonimo: number;
}
