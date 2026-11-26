import { dadosReais, avaliacoes } from "../integracao/avaliacoes.js";
import { obterTurmasIniciais } from '../Rotas_ACADEMICO/rotas_ACADEMICO.js';
import api from '../_cache/apiOffline.js';
import { obterEventosDeExemplo } from '../Rotas_EVENTOS/rotas_EVENTOS.js';
import { obterResumoGeral } from '../Rotas_BEM_ESTAR/rotas_BEM_ESTAR.js';
import { obterDenuncias, obterMensagens } from '../Rotas_ACOLHIMENTO/rotas_ACOLHIMENTO.js';
export function obterEventos() {
  const hoje = new Date().toLocaleDateString('sv-SE');
  const visiveis = obterEventosDeExemplo().filter(e => !e.oculto);
  const proximos = visiveis.filter(e => e.data >= hoje);
  return (proximos.length ? proximos : visiveis).sort((a,b) => a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio)).slice(0,3).map(e => ({ ...e, dia: e.data.slice(8), mes: new Date(e.data+'T12:00:00').toLocaleDateString('pt-BR',{month:'short'}).replace('.', ''), informacao: `${e.horaInicio} - ${e.horaFim || ''} | ${obterTurmasIniciais().find(t=>t.id===e.turmas)?.nome || e.turmas || ''}` }));
}
export function obterDadosRecentes() {
  const base = api.get('dadosRecentes');
  const valor = rotulo => Number(base.find(i => i.rotulo === rotulo)?.valor || 0);
  const mes = new Date().toLocaleDateString('sv-SE').slice(0,7);
  return [
    { rotulo:'Total de alunos', valor: dadosReais()?api.get('vinculosPonte').filter(m=>m.ativo).length:valor('Total de alunos'), icone:'iconeHistorico' },
    { rotulo:'Avaliações realizadas', valor: dadosReais()?avaliacoes().length:valor('Avaliações realizadas'), icone:'iconeNota' },
    { rotulo:'Eventos feitos no mês', valor: obterEventosDeExemplo().filter(e => e.data.startsWith(mes) && e.data <= new Date().toLocaleDateString('sv-SE') && !e.oculto).length, icone:'iconeCalendarioComPontos' },
    { rotulo:'Mensagens enviadas', valor: obterDenuncias().flatMap(d => obterMensagens(d.id)).filter(m => m.autor === 'voce').length, icone:'iconeMensagem' }
  ];
}
export function obterIndicadoresHome() { const resumo = obterResumoGeral(); return api.get('indicadoresHome').map(i => i.icone === 'sorriso' ? {...i, valor: `${resumo.valor ?? 0}%`, textoDoSelo: resumo.situacao, textoDaVariacao: resumo.variacao} : i); }
export function obterGraficoHome() { return api.get('graficoHome'); }

export function obterRotulosGraficoHome() { return api.get("rotulosGraficoHome"); }
