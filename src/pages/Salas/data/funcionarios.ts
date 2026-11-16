import { requisicaoApi } from "../../../services/api";
import { ambiente } from "../../../config/ambiente";
import { idObrigatorio, listarRegistros, salvarRegistro } from "../../../services/recursos";
import { rotasApi } from "../../../services/rotasApi";
import type { CargoRegistro, FuncionarioRegistro, FuncionarioInstituicaoRegistro, UsuarioRegistro } from "../../../types/banco";
import type { Funcionario } from "../types";

export async function carregarFuncionarios() {
  const [funcionarios, cargos, usuarios, vinculos] = await Promise.all([
    listarRegistros<FuncionarioRegistro>(rotasApi.funcionarios),
    listarRegistros<CargoRegistro>(rotasApi.cargos),
    listarRegistros<UsuarioRegistro>(rotasApi.usuarios),
    listarRegistros<FuncionarioInstituicaoRegistro>(rotasApi.funcionariosInstituicoes),
  ]);
  const instituicao = idObrigatorio(ambiente.idInstituicao, "ID da instituição");
  const idsDaInstituicao = new Set(vinculos.filter(v => v.id_instituicao === instituicao).map(v => v.id_funcionario));
  const pessoas: Funcionario[] = funcionarios.filter(f => idsDaInstituicao.has(f.id)).map(f => {
    const usuario = usuarios.find(u => u.id === f.id_usuario);
    return {
      id: String(f.id), usuarioId: f.id_usuario, cargoId: f.id_cargo,
      nome: usuario?.nome ?? `Usuário #${f.id_usuario}`,
      email: usuario?.email ?? "E-mail não encontrado",
      cargo: cargos.find(c => c.id === f.id_cargo)?.nome ?? "Cargo não encontrado",
      foto: f.url_foto ?? "", ativa: Boolean(usuario?.status_conta),
    };
  });
  return { funcionarios: pessoas, cargos, usuarios, vinculos };
}

export async function gravarFuncionario(
  dados: Omit<FuncionarioRegistro, "id">, id?: number,
) {
  const salvo = await salvarRegistro<FuncionarioRegistro>(rotasApi.funcionarios, dados, id);
  if (id === undefined) {
    await salvarRegistro<FuncionarioInstituicaoRegistro>(rotasApi.funcionariosInstituicoes, {
      id_instituicao: idObrigatorio(ambiente.idInstituicao, "ID da instituição"),
      id_funcionario: salvo.id,
    });
  }
  return salvo;
}

export async function solicitarRedefinicaoSenha(id: number) {
  if (ambiente.fonteDados === "mock") return { demonstracao: true };
  return requisicaoApi<{ demonstracao?: boolean }>(rotasApi.redefinirSenhaFuncionario(id), { method: "POST" });
}
