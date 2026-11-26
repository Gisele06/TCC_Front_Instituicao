import api from "../_cache/apiOffline.js";
export function obterComunicadosDeExemplo() { return api.get("comunicados"); }
export function obterComunicado(id) { return api.get('comunicados', id); }
export function cadastrarComunicado(dados) { return api.post('comunicados', dados); }
export function atualizarComunicado(id, dados) { return api.put('comunicados', id, dados); }
export function excluirComunicado(id) { return api.delete('comunicados', id); }
