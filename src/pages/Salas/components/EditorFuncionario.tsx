import { useState, type FormEvent } from "react";
import type { CargoRegistro, UsuarioRegistro } from "../../../types/banco";
import type { Funcionario } from "../types";
import { CabecalhoEditor, AcoesFormulario } from "./ElementosAcademicos";

interface Props {
  existente?: Funcionario;
  cargos: CargoRegistro[];
  usuarios: UsuarioRegistro[];
  usados: number[];
  aoVoltar: () => void;
  aoSalvar: (dados: Omit<Funcionario, "nome" | "email" | "cargo" | "ativa">) => void;
}

export default function EditorFuncionario({ existente, cargos, usuarios, usados, aoVoltar, aoSalvar }: Props) {
  const [usuarioId, definirUsuario] = useState(String(existente?.usuarioId ?? ""));
  const [cargoId, definirCargo] = useState(String(existente?.cargoId ?? ""));
  const [foto, definirFoto] = useState(existente?.foto ?? "");
  const [erro, definirErro] = useState("");
  const disponiveis = usuarios.filter(usuario => !usados.includes(usuario.id) || usuario.id === existente?.usuarioId);

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!usuarioId || !cargoId) { definirErro("Selecione um usuário e um cargo."); return; }
    definirErro("");
    aoSalvar({ id: existente?.id ?? "", usuarioId: Number(usuarioId), cargoId: Number(cargoId), foto });
  }

  return <>
    <CabecalhoEditor titulo={existente ? "Editar Funcionário" : "Cadastrar Funcionário"}
      descricao="Associe um usuário existente a um cargo e à instituição." aoVoltar={aoVoltar} />
    <form className="academico-formulario" onSubmit={enviar}>
      <div className="academico-form-area academico-form-area-funcionario">
        <section className="academico-card academico-card-campos">
          <h2>Dados do funcionário</h2>
          <label className="academico-campo"><span>Usuário cadastrado <i>•</i></span>
            <select value={usuarioId} onChange={e => definirUsuario(e.target.value)} required disabled={Boolean(existente)}>
              <option value="">Selecione um usuário</option>
              {disponiveis.map(u => <option value={u.id} key={u.id}>{u.nome} — {u.email}</option>)}
            </select>
          </label>
          <label className="academico-campo"><span>Cargo <i>•</i></span>
            <select value={cargoId} onChange={e => definirCargo(e.target.value)} required>
              <option value="">Selecione um cargo</option>
              {cargos.map(c => <option value={c.id} key={c.id}>{c.nome}</option>)}
            </select>
          </label>
          <label className="academico-campo"><span>URL da foto <small>(opcional)</small></span>
            <input type="url" placeholder="https://exemplo.com/foto.jpg" maxLength={255} value={foto} onChange={e => definirFoto(e.target.value)} />
          </label>
          <p className="academico-ajuda">O usuário e seu e-mail vêm do cadastro de usuários. O vínculo com esta instituição é criado automaticamente ao salvar.</p>
          {disponiveis.length === 0 && !existente && <p role="status">Não há usuários disponíveis. Cadastre primeiro o usuário no sistema.</p>}
          {erro && <p role="alert">{erro}</p>}
        </section>
        <section className="academico-card academico-card-funcionario-ajuda">
          <h2>Vínculo institucional</h2>
          <p>Funcionários são vinculados a um usuário, um cargo e à instituição.</p>
          <p>O cadastro mantém o vínculo do funcionário com a instituição.</p>
          <p>Para cadastrar um funcionário novo, selecione uma conta de usuário existente.</p>
        </section>
      </div>
      <AcoesFormulario aoCancelar={aoVoltar} textoSalvar={existente ? "Salvar alterações" : "Cadastrar funcionário"} />
    </form>
  </>;
}
