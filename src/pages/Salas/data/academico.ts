import type { CursoRegistro, SalaRegistro, TipoSalaRegistro, TurmaRegistro, MateriaRegistro } from "../../../types/banco";
import { listarRegistros, salvarRegistro } from "../../../services/recursos";
import { rotasApi } from "../../../services/rotasApi";
import type { Sala, Turma, Materia, HorarioMateria } from "../types";

export interface CursoOpcao { id: string; nome: string; }
export const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

export function criarHorario(id: string, materiaId = "", salaId = ""): HorarioMateria {
  return { id, materiaId, salaId, dias: [], inicio: "", fim: "" };
}

export async function carregarAcademico() {
  const [salas, turmas, materias, cursos, tiposSala] = await Promise.all([
    listarRegistros<SalaRegistro>(rotasApi.salas),
    listarRegistros<TurmaRegistro>(rotasApi.turmas),
    listarRegistros<MateriaRegistro>(rotasApi.materias),
    listarRegistros<CursoRegistro>(rotasApi.cursos),
    listarRegistros<TipoSalaRegistro>(rotasApi.tiposSala),
  ]);
  const tipos = new Map(tiposSala.map((tipo) => [tipo.id, tipo.tipo]));
  const salasDaApi: Sala[] = salas.map((sala) => ({
    id: String(sala.id),
    nome: sala.nome,
    capacidade: sala.capacidade,
    descricao: sala.descricao ?? "",
    tipo: tipos.get(sala.id_tipo_sala) ?? "Tipo não encontrado",
    tipoId: sala.id_tipo_sala,
    idIcone: sala.id_icone,
    icone: "formacao", // O SQL guarda id_icone; o seletor visual ainda precisa desse mapeamento.
    ativa: true,       // tbl_sala não possui coluna de status.
  }));
  const turmasDaApi: Turma[] = turmas.map((turma) => ({
    id: String(turma.id),
    nome: turma.nome,
    descricao: turma.descricao ?? "",
    ativa: Boolean(turma.ativa),
    inicio: turma.horario_inicio_aulas.slice(0, 5),
    fim: turma.horario_fim_aulas.slice(0, 5),
    cursoId: turma.id_curso,
    intervalos: [], // Exigem JOIN com tbl_turma_intervalo / tbl_intervalo.
    horarios: [], // Exigem JOIN com tbl_materia_turma / tbl_dia_materia.
  }));
  const materiasDaApi: Materia[] = materias.map((materia) => ({
    id: String(materia.id),
    nome: materia.nome,
    sigla: materia.sigla,
    descricao: materia.descricao ?? "",
    ativa: Boolean(materia.ativa),
    cursos: [String(materia.id_curso)], // O SQL permite um curso por matéria.
  }));
  return {
    salas: salasDaApi,
    turmas: turmasDaApi,
    materias: materiasDaApi,
    cursos: cursos.map((curso) => ({ id: String(curso.id), nome: curso.nome })),
    tiposSala,
  };
}

export function gravarSala(dados: Omit<SalaRegistro, "id">, id?: number) {
  return salvarRegistro<SalaRegistro>(rotasApi.salas, dados, id);
}
export function gravarTurma(dados: Omit<TurmaRegistro, "id">, id?: number) {
  return salvarRegistro<TurmaRegistro>(rotasApi.turmas, dados, id);
}
export function gravarMateria(dados: Omit<MateriaRegistro, "id">, id?: number) {
  return salvarRegistro<MateriaRegistro>(rotasApi.materias, dados, id);
}
