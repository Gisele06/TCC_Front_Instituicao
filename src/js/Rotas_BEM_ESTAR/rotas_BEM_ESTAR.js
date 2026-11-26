import { dadosReais, resumo, distribuicaoReal, metricasReais } from "../integracao/avaliacoes.js";
import { obterCursosDisponiveis, obterTurmasIniciais } from "../Rotas_ACADEMICO/rotas_ACADEMICO.js";
import api from "../_cache/apiOffline.js";
export function obterSeriesDeExemplo() { return api.get("series"); }
export function obterDatasDoGrafico() { return api.get("datasGrafico"); }
export function obterDistribuicao(turmas=[]) { return dadosReais() ? distribuicaoReal(turmas) : api.get("distribuicao"); }
export function obterIndicadores() { return dadosReais() ? metricasReais().map(m=>({id:m.valor,icone:m.icone,titulo:m.titulo,descricao:m.descricao,valor:`${m.percentual}%`,variacao:"—",sentido:"cima",tom:"bom"})) : api.get("indicadoresBemEstar"); }
export function obterMetricas(turmas=[]) { return dadosReais() ? metricasReais(turmas) : api.get("metricas"); }
export function obterCursos() { const dados = api.get("cursosBemEstar"); return [...dados, ...obterCursosDisponiveis().filter(c=>!dados.some(d=>d.id===c.id)).map(c=>({...c,turmas:obterTurmasIniciais().filter(t=>t.cursoId===c.id).length}))]; }
export function obterResumoGeral(turmas=[]) { return dadosReais() && (api.get("vinculosPonte").length || api.get("avaliacoesPonte").length) ? resumo(turmas) : api.get("resumoGeral"); }

// Pontos de integração para as respostas agregadas da futura API (não são inventados dados de alunos).
export function atualizarResumoGeral(dados) { return api.substituir('resumoGeral', dados); }
export function atualizarSeries(dados) { return api.substituir('series', dados); }
export function atualizarDistribuicao(dados) { return api.substituir('distribuicao', dados); }
export function atualizarIndicadores(dados) { return api.substituir('indicadoresBemEstar', dados); }
export function atualizarMetricas(dados) { return api.substituir('metricas', dados); }
export function atualizarDatasDoGrafico(dados) { return api.substituir('datasGrafico', dados); }
export function atualizarCursosBemEstar(dados) { return api.substituir('cursosBemEstar', dados); }
