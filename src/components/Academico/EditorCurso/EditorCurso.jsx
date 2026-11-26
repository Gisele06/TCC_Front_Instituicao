import { useState } from "react";
import Input from "../../Gerais/Input/Input.jsx";
import CabecalhoEditor from "../CabecalhoEditor/CabecalhoEditor.jsx";
import AcoesFormulario from "../AcoesFormulario/AcoesFormulario.jsx";
import "./EditorCurso.css";

function EditorCurso({ existente, aoVoltar, aoSalvar, aoExcluir }) {
  const [nome, definirNome] = useState(existente?.nome ?? "");
  const [erro, definirErro] = useState("");

  function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      definirErro("Informe o nome do curso.");
      return;
    }

    aoSalvar({
      ...(existente?.id ? { id: existente.id } : {}),
      nome: nomeLimpo,
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Curso" : "Cadastrar Curso"}
        descricao={
          existente
            ? "Atualize o nome deste curso."
            : "Preencha as informações abaixo para criar um novo curso."
        }
        aoVoltar={aoVoltar}
      />

      <form
        className="academico-formulario academico-formulario-curso"
        onSubmit={enviarFormulario}
        noValidate
      >
        <div className="academico-form-area-curso">
          <section
            className="academico-card academico-card-campos academico-card-curso"
            aria-label="Informações do curso"
          >
            <label className="academico-campo academico-curso-campo-nome">
              <span>
                Nome do curso <em>•</em>
              </span>
              <Input
                tipo="texto"
                nome="nome"
                valor={nome}
                aoAlterar={(e) => definirNome(e.target.value)}
                placeholder="Ex.: Desenvolvimento de Sistemas"
                comprimentoMaximo={80}
                obrigatorio
              />
            </label>
          </section>
        </div>

        <AcoesFormulario
          aoCancelar={aoVoltar}
          aoExcluir={existente ? aoExcluir : undefined}
          textoExcluir="Excluir curso"
          erro={erro}
        />
      </form>
    </>
  );
}

export default EditorCurso;