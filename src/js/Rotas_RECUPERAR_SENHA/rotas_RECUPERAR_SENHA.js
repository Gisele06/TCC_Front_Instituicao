import { usuarioPorEmail, trocarSenhaLocal } from '../_cache/usuarios.js';
// Simulação somente neste navegador: não envia e-mail nem comprova identidade real.
let recuperacao;
export async function iniciarRecuperacao(email) {
  const usuario = await usuarioPorEmail(email);
  if (!usuario?.senhaHash) return null;
  const codigo = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
  recuperacao = { email: usuario.email, codigo, expira: Date.now() + 600000 };
  return codigo;
}
export function validarRecuperacao(senha, confirmarSenha) { return !!senha && senha === confirmarSenha; }
export async function redefinirSenha(email, codigo, senha, confirmarSenha) {
  if (!recuperacao || recuperacao.expira < Date.now() || recuperacao.email !== email.trim().toLowerCase() || recuperacao.codigo !== codigo || !validarRecuperacao(senha, confirmarSenha)) return false;
  const sucesso = await trocarSenhaLocal(email, senha);
  if (sucesso) recuperacao = null;
  return sucesso;
}
