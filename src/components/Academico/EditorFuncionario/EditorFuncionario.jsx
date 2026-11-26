import { useState } from "react";
import Input from "../../Gerais/Input/Input.jsx";
import CabecalhoEditor from "../CabecalhoEditor/CabecalhoEditor.jsx";
import AcoesFormulario from "../AcoesFormulario/AcoesFormulario.jsx";
import { CARGOS_FUNCIONARIO } from "../../../js/Rotas_ACADEMICO/funcionarios.js";
import "./EditorFuncionario.css";

function EditorFuncionario({ existente, aoVoltar, aoSalvar, aoExcluir }) {
  const [nome, definirNome] = useState(existente?.nome ?? "");
  const [email, definirEmail] = useState(existente?.email ?? "");
  const [cargo, definirCargo] = useState(existente?.cargo ?? "");
  const [status, definirStatus] = useState(
    existente?.ativa === false ? "inativa" : "ativa",
  );
  const [erro, definirErro] = useState("");

  function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();

    if (!nomeLimpo || !emailLimpo) {
      definirErro("Preencha o nome e o e-mail do funcionário.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      definirErro("Informe um endereço de e-mail válido.");
      return;
    }

    aoSalvar({
      ...(existente?.id ? { id: existente.id } : {}),
      nome: nomeLimpo,
      email: emailLimpo,
      cargo,
      ativa: status !== "inativa",
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Funcionário" : "Cadastrar Funcionário"}
        descricao={
          existente
            ? "Atualize as informações deste funcionário."
            : "Preencha as informações abaixo para criar um novo funcionário."
        }
        aoVoltar={aoVoltar}
      />

      <form
        className="academico-formulario academico-formulario-funcionario"
        onSubmit={enviarFormulario}
        noValidate
      >
        <div className="academico-form-area-funcionario">
          <section
            className="academico-card academico-card-campos academico-card-funcionario"
            aria-label="Informações do funcionário"
          >
            <div className="academico-funcionario-coluna">
              <label className="academico-campo">
                <span>
                  Nome do funcionário <em>•</em>
                </span>
                <Input
                  tipo="texto"
                  nome="nome"
                  valor={nome}
                  aoAlterar={(e) => definirNome(e.target.value)}
                  placeholder="Nome completo do funcionário"
                  comprimentoMaximo={80}
                  obrigatorio
                />
              </label>

              <label className="academico-campo">
                <span>
                  Email <em>•</em>
                </span>
                <Input
                  tipo="email"
                  nome="email"
                  valor={email}
                  aoAlterar={(e) => definirEmail(e.target.value)}
                  placeholder="exemplo@instituicao.edu.br"
                  comprimentoMaximo={120}
                  obrigatorio
                />
              </label>

              <div className="academico-campo">
                <span>Cargo</span>
                <Input
                  id="funcionario-cargo"
                  tipo="selecao"
                  nome="cargo"
                  rotulo="Cargo do funcionário"
                  placeholder="Selecione o tipo de cargo"
                  valor={cargo}
                  aoAlterar={(e) => definirCargo(e.target.value)}
                  classeCampo="academico-popover"
                >
                  {CARGOS_FUNCIONARIO.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Input>
              </div>

              {existente && (
                <div className="academico-campo">
                  <span>Status</span>
                  <Input
                    id="funcionario-status"
                    tipo="selecao"
                    nome="status"
                    rotulo="Status do funcionário"
                    valor={status}
                    aoAlterar={(e) => definirStatus(e.target.value)}
                    classeCampo="academico-popover"
                  >
                    <option value="ativa">Ativo</option>
                    <option value="inativa">Inativo</option>
                  </Input>
                </div>
              )}
            </div>
          </section>
        </div>

        <AcoesFormulario
          aoCancelar={aoVoltar}
          aoExcluir={existente ? aoExcluir : undefined}
          textoExcluir="Excluir funcionário"
          erro={erro}
        />
      </form>
    </>
  );
}

export default EditorFuncionario;