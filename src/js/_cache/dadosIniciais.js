import { inicializar, ID_CONTA_DEMONSTRACAO } from "./storage.js";
import salas from "../Rotas_ACADEMICO/salasIniciais.json" with { type: "json" };
import turmas from "../Rotas_ACADEMICO/turmasIniciais.json" with { type: "json" };
import materias from "../Rotas_ACADEMICO/materiasIniciais.json" with { type: "json" };
import cursosAcademicos from "../Rotas_ACADEMICO/cursosDisponiveis.json" with { type: "json" };
import denuncias from "../Rotas_ACOLHIMENTO/denuncias.json" with { type: "json" };
import estatisticas from "../Rotas_ACOLHIMENTO/estatisticas.json" with { type: "json" };
import series from "../Rotas_BEM_ESTAR/seriesDeExemplo.json" with { type: "json" };
import datasGrafico from "../Rotas_BEM_ESTAR/datasDoGrafico.json" with { type: "json" };
import distribuicao from "../Rotas_BEM_ESTAR/distribuicao.json" with { type: "json" };
import indicadoresBemEstar from "../Rotas_BEM_ESTAR/indicadores.json" with { type: "json" };
import metricas from "../Rotas_BEM_ESTAR/metricas.json" with { type: "json" };
import cursosBemEstar from "../Rotas_BEM_ESTAR/cursos.json" with { type: "json" };
import resumoGeral from "../Rotas_BEM_ESTAR/resumoGeral.json" with { type: "json" };
import comunicados from "../Rotas_COMUNICADOS/comunicadosUnificados.json" with { type: "json" };
import eventos from "../Rotas_EVENTOS/eventosUnificados.json" with { type: "json" };
import dadosRecentes from "../Rotas_HOME/dadosRecentes.json" with { type: "json" };
import indicadoresHome from "../Rotas_HOME/indicadoresHome.json" with { type: "json" };
import graficoHome from "../Rotas_HOME/graficoHome.json" with { type: "json" };
import mensagens from "../Rotas_ACOLHIMENTO/mensagens.json" with { type: "json" };

import comunicadosDoDiaLegados from "../Rotas_COMUNICADOS/comunicadosDoDia.json" with { type: "json" };
const dadosDemo = { salas, turmas, materias, cursosAcademicos, denuncias, estatisticas, series, datasGrafico, distribuicao, indicadoresBemEstar, metricas, cursosBemEstar, resumoGeral, comunicados, eventos, dadosRecentes, indicadoresHome, graficoHome, comunicadosDoDiaLegados, mensagens_6767: mensagens };
export function prepararDadosDaConta(id) {
  const demo = String(id) === ID_CONTA_DEMONSTRACAO;
  for (const [recurso, dados] of Object.entries(dadosDemo)) {
    let inicial = demo ? dados : Array.isArray(dados) ? [] : {};
    if (demo && ["salas", "turmas", "materias"].includes(recurso)) {
      try { const legado = JSON.parse(localStorage.getItem(`bloom-academico-${recurso}`)); if (Array.isArray(legado)) inicial = legado; } catch { /* mantém o mock original */ }
    }
    inicializar(recurso, inicial, id);
  }
  inicializar("rotulosGraficoHome", demo ? ["15/06","22/06","29/06","06/07","13/07","20/07","27/07"] : [], id);
  inicializar("redesApoio", [], id);
  inicializar("avisos", demo ? { gerais: 2, acolhimento: 3 } : { gerais: 0, acolhimento: 0 }, id);
}
