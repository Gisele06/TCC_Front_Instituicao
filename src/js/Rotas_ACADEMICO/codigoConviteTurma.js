import { ler, gravar, lerPublico } from "../_cache/storage.js";

const CARACTERES_CODIGO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const DURACAO_CONVITE_MS = 15 * 60 * 1000; // 15 minutos

function gerarBloco(tamanho = 4) {
  const resultado = [];
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint32Array(tamanho);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < tamanho; i++) {
      resultado.push(CARACTERES_CODIGO[bytes[i] % CARACTERES_CODIGO.length]);
    }
    return resultado.join("");
  }

  for (let i = 0; i < tamanho; i++) {
    const indice = Math.floor(Math.random() * CARACTERES_CODIGO.length);
    resultado.push(CARACTERES_CODIGO[indice]);
  }
  return resultado.join("");
}

export function gerarCodigoConvite() {
  return `${gerarBloco(4)}-${gerarBloco(4)}`;
}

function lerMapaConvites() { return ler('convitesTurmas', {}); }
function salvarMapaConvites(mapa) { gravar('convitesTurmas', mapa); }

export function obterConviteAtivoDaTurma(turmaId) {
  if (!turmaId) return null;
  const mapa = lerMapaConvites();
  const registro = mapa[turmaId];
  if (!registro || !registro.codigo || !registro.expiraEm) return null;
  if (registro.expiraEm <= Date.now()) return null;
  return registro;
}

export function criarNovoConviteDaTurma(turmaId) {
  const agora = Date.now();
  const codigos = new Set((lerPublico("usuarios",[])||[]).flatMap(u=>Object.values(ler("convitesTurmas",{},u.id))).filter(c=>c.expiraEm>agora).map(c=>c.codigo));
  let codigo; do { codigo=gerarCodigoConvite(); } while(codigos.has(codigo));
  const registro = {
    turmaId,
    codigo,
    criadoEm: agora,
    expiraEm: agora + DURACAO_CONVITE_MS,
  };

  if (turmaId) {
    const mapa = lerMapaConvites();
    mapa[turmaId] = registro;
    salvarMapaConvites(mapa);
  }

  return registro;
}

export function obterOuCriarConviteDaTurma(turmaId) {
  return obterConviteAtivoDaTurma(turmaId) || criarNovoConviteDaTurma(turmaId);
}

export function formatarTempoRestante(ms) {
  const segundosTotais = Math.max(0, Math.ceil(ms / 1000));
  const minutos = Math.floor(segundosTotais / 60);
  const segundos = segundosTotais % 60;
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}