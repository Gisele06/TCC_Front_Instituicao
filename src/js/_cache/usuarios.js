import { lerPublico, gravarPublico, proximoId, ID_CONTA_DEMONSTRACAO } from './storage.js';
import { prepararDadosDaConta } from './dadosIniciais.js';
import perfilDemo from '../Rotas_LOGIN/usuario.json' with { type: 'json' };

export function normalizarEmail(email) { return String(email || '').trim().toLowerCase(); }
export async function hashSenha(senha, salt) {
  const dados = new TextEncoder().encode(`${salt}:${senha}`);
  const hash = await crypto.subtle.digest('SHA-256', dados);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}
export async function prepararUsuarios() {
  const existentes = lerPublico('usuarios') || [];
  if (existentes.some(u => String(u.id) === ID_CONTA_DEMONSTRACAO)) return;

  const salt = proximoId();
  const senhaHash = await hashSenha('123', salt);
  const atual = lerPublico('usuarios') || [];

  if (!atual.some(u => String(u.id) === ID_CONTA_DEMONSTRACAO)) {
    gravarPublico('usuarios', [
      {
        id: ID_CONTA_DEMONSTRACAO,
        email: 'senai@gmail.com',
        nome: perfilDemo.nomeUsuario,
        cargo: perfilDemo.cargoUsuario,
        instituicao: 'SENAI Jandira',
        telefone: '4002-8922',
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7I9FiEyk28-kmIYub_Asyc1Gk3k1RV-djP_y6hoAKoQ&s=10",
        banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhCAIRSyJqm9p_EBE_YGjHQV5Erbj0NbXH_S02WoDwuw&s=10",
        salt,
        senhaHash
      },
      ...atual
    ]);
  }
}
export async function usuarioPorEmail(email) {
  await prepararUsuarios();
  return lerPublico('usuarios', []).find(u => u.email === normalizarEmail(email));
}
export function perfilPublico(usuario) {
  const perfil = { ...usuario }; delete perfil.salt; delete perfil.senhaHash;
  return perfil;
}
export function criarSessao(usuario) {
  prepararDadosDaConta(usuario.id);
  return gravarPublico('sessao', perfilPublico(usuario));
}
export async function validarCredenciais(email, senha) {
  const usuario = await usuarioPorEmail(email);
  return usuario?.senhaHash && await hashSenha(senha, usuario.salt) === usuario.senhaHash ? usuario : null;
}
export async function cadastrarUsuarioLocal(dados) {
  const email = normalizarEmail(dados.email);
  if (!email || !dados.nome?.trim() || !dados.senha || await usuarioPorEmail(email)) return false;
  const salt = proximoId();
  const senhaHash = await hashSenha(dados.senha, salt);
  const lista = lerPublico('usuarios', []);
  if (lista.some(u => u.email === email)) return false;
  const perfil = { ...dados }; delete perfil.senha; delete perfil.confirmarSenha;
  const usuario = { ...perfil, id: proximoId(), email, salt, senhaHash, foto: null };
  prepararDadosDaConta(usuario.id);
  gravarPublico('usuarios', [...lista, usuario]);
  return true;
}
export async function registrarUsuarioExterno(dados) {
  const antigo = await usuarioPorEmail(dados.email);
  // Uma conta local não pode ser sobrescrita por uma identidade externa diferente.
  if (antigo && antigo.googleId !== dados.sub) throw new Error('E-mail já associado a outra forma de acesso.');
  const usuario = { ...antigo, id: antigo?.id ?? proximoId(), email: normalizarEmail(dados.email), nome: antigo?.nome || dados.name || dados.email.split("@")[0], cargo: antigo?.cargo || 'Responsável institucional', foto: dados.picture || null, googleId: dados.sub };
  const lista = lerPublico('usuarios', []);
  gravarPublico('usuarios', [...lista.filter(u => u.id !== usuario.id), usuario]);
  return criarSessao(usuario);
}
export async function trocarSenhaLocal(email, senha) {
  const usuario = await usuarioPorEmail(email);
  if (!usuario?.senhaHash || !senha) return false;
  const salt = proximoId();
  const senhaHash = await hashSenha(senha, salt);
  gravarPublico('usuarios', lerPublico('usuarios', []).map(u => u.id === usuario.id ? { ...u, salt, senhaHash } : u));
  return true;
}

export function atualizarPerfilLocal(dados) {
  const sessao = lerPublico('sessao');
  if (!sessao) throw new Error('Entre em uma conta.');
  const lista = lerPublico('usuarios', []);
  const usuario = lista.find(u => u.id === sessao.id);
  if (!usuario) throw new Error('Conta não encontrada.');
  const novo = {...usuario};
  for (const campo of ['nome','cargo','instituicao','telefone','foto','banner']) if (Object.hasOwn(dados,campo)) novo[campo] = dados[campo];
  if (!novo.nome?.trim()) throw new Error('Informe seu nome.');
  gravarPublico('usuarios', lista.map(u=>u.id===novo.id ? novo : u));
  return gravarPublico('sessao', perfilPublico(novo));
}
