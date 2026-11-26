import api from "../_cache/apiOffline.js";
export function obterEventosDeExemplo() { return api.get("eventos"); }
export function obterEvento(id) { return api.get('eventos', id); }
export function cadastrarEvento(dados) { return api.post('eventos', dados); }
export function atualizarEvento(id, dados) { return api.put('eventos', id, dados); }
export function excluirEvento(id) { return api.delete('eventos', id); }
