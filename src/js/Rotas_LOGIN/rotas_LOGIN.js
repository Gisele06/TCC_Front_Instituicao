import { validarCredenciais, criarSessao, registrarUsuarioExterno, atualizarPerfilLocal } from '../_cache/usuarios.js';
import { lerPublico, encerrarSessaoLocal, ler, gravar } from '../_cache/storage.js';
export async function autenticarUsuario(email, senha) {
  const usuario = await validarCredenciais(email, senha);
  return usuario ? criarSessao(usuario) : false;
}
export function obterUsuarioLogado() { return lerPublico('sessao'); }
export function sairDaConta() { encerrarSessaoLocal(); }
export function obterAvisos() { return ler('avisos', { gerais: 0, acolhimento: 0 }); }
export async function autenticarUsuarioGoogle(token) {
  if (!token) throw new Error('Token Google ausente.');
  const resposta = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${token}` } });
  if (!resposta.ok) throw new Error('Não foi possível validar o acesso Google.');
  const dados = await resposta.json();
  if (!dados.email || !dados.email_verified || !dados.sub) throw new Error('Identidade Google não verificada.');
  return registrarUsuarioExterno(dados);
}

export function atualizarPerfil(dados) { return atualizarPerfilLocal(dados); }

export function marcarAvisosComoLidos(grupo) { const avisos = obterAvisos(); return gravar("avisos", {...avisos,[grupo]:0}); }
