// Banco local temporário: cada recurso pertence à conta conectada.
const PREFIXO = 'bloomInstituicao:offline:v1:';
export const ID_CONTA_DEMONSTRACAO = '1';
export function lerPublico(recurso, padrao = null) {
  const valor = localStorage.getItem(`${PREFIXO}publico:${recurso}`);
  return valor === null ? structuredClone(padrao) : JSON.parse(valor);
}
export function gravarPublico(recurso, dados) {
  localStorage.setItem(`${PREFIXO}publico:${recurso}`, JSON.stringify(dados));
  notificar(recurso);
  return dados;
}
export function idContaAtual() { return lerPublico('sessao')?.id ?? null; }
export function ehContaDemonstracao() { return String(idContaAtual()) === ID_CONTA_DEMONSTRACAO; }
function chave(recurso, id = idContaAtual()) {
  if (id == null) throw new Error('Entre em sua conta para acessar os dados.');
  if (!/^[\w-]+$/.test(recurso)) throw new Error('Recurso inválido.');
  return `${PREFIXO}usuario:${encodeURIComponent(id)}:${recurso}`;
}
export function ler(recurso, padrao = null, id = idContaAtual()) {
  const valor = localStorage.getItem(chave(recurso, id));
  return valor === null ? structuredClone(padrao) : JSON.parse(valor);
}
export function gravar(recurso, dados, id = idContaAtual()) {
  localStorage.setItem(chave(recurso, id), JSON.stringify(dados));
  notificar(recurso);
  return dados;
}
export function inicializar(recurso, dados, id) {
  const destino = chave(recurso, id);
  if (localStorage.getItem(destino) === null) localStorage.setItem(destino, JSON.stringify(dados));
}
export function alterar(recurso, padrao, modificador) { return gravar(recurso, modificador(ler(recurso, padrao))); }
export function proximoId() { return crypto.randomUUID(); }
export function encerrarSessaoLocal() { gravarPublico('sessao', null); }
let versao = 0;
function notificar(recurso) { versao++; window.dispatchEvent(new CustomEvent('dadosInstituicaoAtualizados', { detail: { recurso } })); }
export function escutarDadosOffline(callback) {
  const local = () => callback();
  const outraAba = evento => { if (!evento.key || evento.key.startsWith(PREFIXO)) { versao++; local(); } };
  window.addEventListener('dadosInstituicaoAtualizados', local);
  window.addEventListener('storage', outraAba);
  return () => { window.removeEventListener('dadosInstituicaoAtualizados', local); window.removeEventListener('storage', outraAba); };
}
export function obterVersao() { return versao; }

export function resetConta({ confirmar = false } = {}) {
  if (typeof window === 'undefined') return;
  if (confirmar && !window.confirm('Resetar a conta de demonstração e voltar para o login?')) return;

  const prefixoDemo = `${PREFIXO}usuario:${encodeURIComponent(ID_CONTA_DEMONSTRACAO)}:`;
  const chavesLegadas = new Set([
    'bloom-academico-salas',
    'bloom-academico-turmas',
    'bloom-academico-materias'
  ]);

  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith(prefixoDemo) || chavesLegadas.has(k)) {
      localStorage.removeItem(k);
    }
  });

  // Remove apenas a conta demo de publico:usuarios para recriá-la com os dados atualizados
  const usuarios = lerPublico('usuarios') || [];
  if (Array.isArray(usuarios)) {
    const outros = usuarios.filter((u) => String(u?.id) !== ID_CONTA_DEMONSTRACAO);
    if (outros.length === 0) {
      localStorage.removeItem(`${PREFIXO}publico:usuarios`);
    } else {
      gravarPublico('usuarios', outros);
    }
  }

  encerrarSessaoLocal();
  window.location.assign('/login');
}

if (typeof window !== 'undefined') {
  window.resetConta = resetConta;

  if (!window.__atalhoResetContaInstRegistrado) {
    window.__atalhoResetContaInstRegistrado = true;
    const teclasPressionadas = new Set();

    const estaDigitando = (alvo) => {
      if (!(alvo instanceof HTMLElement)) return false;
      return (
        alvo.isContentEditable ||
        Boolean(alvo.closest('[contenteditable="true"]')) ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(alvo.tagName)
      );
    };

    window.addEventListener('keydown', (e) => {
      if (estaDigitando(e.target)) return;
      teclasPressionadas.add(e.key.toLowerCase());

      if (teclasPressionadas.has('0') && teclasPressionadas.has('p')) {
        e.preventDefault();
        teclasPressionadas.clear();
        resetConta({ confirmar: true });
      }
    });

    window.addEventListener('keyup', (e) => {
      teclasPressionadas.delete(e.key.toLowerCase());
    });

    window.addEventListener('blur', () => {
      teclasPressionadas.clear();
    });
  }
}