export type SecaoAcademica = "salas" | "turmas" | "materias";
export type FiltroStatus = "todas" | "ativas" | "inativas";

export interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  descricao: string;
  tipo: string;
  tipoId?: number;
  idIcone?: number | null;
  icone: string;
  ativa: boolean;
}

export interface Intervalo {
  id: string;
  inicio: string;
  fim: string;
}

export interface HorarioMateria {
  id: string;
  materiaId: string;
  dias: string[];
  inicio: string;
  fim: string;
  salaId: string;
}

export interface Turma {
  id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  inicio: string;
  fim: string;
  cursoId?: number;
  intervalos: Intervalo[];
  horarios: HorarioMateria[];
}

export interface Materia {
  id: string;
  nome: string;
  sigla: string;
  descricao: string;
  ativa: boolean;
  cursos: string[];
}

export interface PropriedadesSalas {
  aoNavegar: (pagina: string) => void;
}

export interface EditorAtual {
  secao: SecaoAcademica;
  id?: string;
}
