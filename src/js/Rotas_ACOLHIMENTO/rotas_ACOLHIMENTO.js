import api from "../_cache/apiOffline.js";
export function obterDenuncias() { return api.get("denuncias").map(d => ({...d, mensagens: obterMensagens(d.id).length})); }
export function obterEstatisticas() {
  const denuncias = obterDenuncias();
  return [{icone:'clipboard',rotulo:'Recebidas',valor:denuncias.length}, {icone:'repeat',rotulo:'Em andamento',valor:denuncias.filter(d=>d.status==='Em andamento').length}, {icone:'check',rotulo:'Resolvidas',valor:denuncias.filter(d=>d.status==='Resolvida').length}];
}
export function obterRedesApoio() { return api.get("redesApoio"); }
export function obterMensagens(id) { return id == null ? [] : api.get(`mensagens_${id}`).sort((a,b) => (a.data || "").localeCompare(b.data || "") || a.horario.localeCompare(b.horario)); }
export function enviarMensagem(id, texto) { if (!texto.trim()) throw new Error("Mensagem vazia."); if (!api.get('denuncias', id)) throw new Error('Denúncia não encontrada.'); return api.post(`mensagens_${id}`, { autor: 'voce', texto, horario: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}), data: new Date().toISOString() }); }
export function atualizarDenuncia(id, dados) { return api.put('denuncias', id, dados); }
export function cadastrarRedeApoio(dados) { return api.post('redesApoio', dados); }
export function atualizarRedeApoio(id, dados) { return api.put('redesApoio', id, dados); }
export function excluirRedeApoio(id) { return api.delete('redesApoio', id); }
export function cadastrarDenuncia(dados) { return api.post('denuncias', dados); }
export function excluirDenuncia(id) { api.substituir(`mensagens_${id}`, []); return api.delete('denuncias', id); }

export function marcarDenunciaVista(id) { const d=api.get('denuncias',id); if(!d?.vinculoId)return; if(!d.lidaEquipe)api.put('denuncias',id,{lidaEquipe:true}); const msgs=api.get(`mensagens_${id}`); if(msgs.some(m=>m.autor==='aluno'&&!m.lidaEquipe))api.substituir(`mensagens_${id}`,msgs.map(m=>m.autor==='aluno'?{...m,lidaEquipe:true}:m)); }
