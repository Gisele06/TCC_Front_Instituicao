import { ler, gravar, alterar, proximoId } from './storage.js';

// Contrato único de operações locais, sem chamadas a servidores fictícios.
export function get(recurso, id) {
  const dados = ler(recurso, []);
  return id === undefined ? dados : dados.find(item => String(item.id) === String(id)) ?? null;
}
export function post(recurso, dados) {
  const registro = { ...dados, id: dados.id ?? proximoId() };
  alterar(recurso, [], lista => {
    if (lista.some(item => String(item.id) === String(registro.id))) throw new Error('Registro já existe.');
    return [registro, ...lista];
  });
  return registro;
}
export function put(recurso, id, dados) {
  let registro;
  alterar(recurso, [], lista => {
    if (!lista.some(item => String(item.id) === String(id))) throw new Error('Registro não encontrado.');
    return lista.map(item => String(item.id) === String(id) ? (registro = { ...item, ...dados, id: item.id }) : item);
  });
  return registro;
}
export function excluir(recurso, id) {
  alterar(recurso, [], lista => lista.filter(item => String(item.id) !== String(id)));
  return true;
}
export function substituir(recurso, dados) { return gravar(recurso, dados); }
export default { get, post, put, delete: excluir, substituir };
