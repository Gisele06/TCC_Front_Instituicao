import api from "../_cache/apiOffline.js";
export function obterCursosDisponiveis() { return api.get("cursosAcademicos"); }
export function obterSalasIniciais() { return api.get("salas"); }
export function obterMateriasIniciais() { return api.get("materias"); }
export function obterTurmasIniciais() { return api.get("turmas"); }
export function cadastrarSala(dados) { return api.post("salas", dados); }
export function atualizarSala(id, dados) { return api.put("salas", id, dados); }
export function excluirSala(id) { if (obterTurmasIniciais().some(t=>t.horarios.some(h=>h.salaId===id))) throw new Error("Remova os horários vinculados a esta sala antes de excluí-la."); return api.delete("salas", id); }
export function cadastrarTurma(dados) { return api.post("turmas", dados); }
export function atualizarTurma(id, dados) { return api.put("turmas", id, dados); }
export function excluirTurma(id) { return api.delete("turmas", id); }
export function cadastrarMateria(dados) { return api.post("materias", dados); }
export function atualizarMateria(id, dados) { return api.put("materias", id, dados); }
export function excluirMateria(id) { if (obterTurmasIniciais().some(t=>t.horarios.some(h=>h.materiaId===id))) throw new Error("Remova os horários vinculados a esta matéria antes de excluí-la."); return api.delete("materias", id); }
export function cadastrarCurso(dados) { return api.post("cursosAcademicos", dados); }
export function atualizarCurso(id, dados) { return api.put("cursosAcademicos", id, dados); }
export function excluirCurso(id) { if (obterMateriasIniciais().some(m=>m.cursos.includes(id)) || obterTurmasIniciais().some(t=>t.cursoId===id)) throw new Error("Remova as matérias e turmas vinculadas ao curso antes de excluí-lo."); return api.delete("cursosAcademicos", id); }
