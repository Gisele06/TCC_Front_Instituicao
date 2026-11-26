import { cadastrarUsuarioLocal } from '../_cache/usuarios.js';
export function validarCadastro(dados) { return !!dados.senha && dados.senha === dados.confirmarSenha; }
export async function cadastrarUsuario(dados) { return validarCadastro(dados) && cadastrarUsuarioLocal(dados); }
