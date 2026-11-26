import { useState } from "react";
import { obterCursosDisponiveis } from "../../../js/Rotas_ACADEMICO/rotas_ACADEMICO.js";
import {
  criarId,
  textoNormalizado,
} from "../../../js/Rotas_ACADEMICO/gerenciamento.js";
import Input from "../../Gerais/Input/Input.jsx";
import CabecalhoEditor from "../CabecalhoEditor/CabecalhoEditor.jsx";
import AcoesFormulario from "../AcoesFormulario/AcoesFormulario.jsx";
import iconeBusca from "../../../img/icones/busca.png";
import "./EditorMateria.css";

function IconeCheck() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function EditorMateria({ existente, aoVoltar, aoSalvar, aoExcluir }) {
  const [nome, definirNome] = useState(existente?.nome ?? "");
  const [sigla, definirSigla] = useState(existente?.sigla ?? "");
  const [descricao, definirDescricao] = useState(existente?.descricao ?? "");
  const [status, definirStatus] = useState(
    existente?.ativa === false ? "inativa" : "ativa",
  );
  const [buscaCurso, definirBuscaCurso] = useState("");
  const [cursos, definirCursos] = useState(existente?.cursos ?? []);
  const [erro, definirErro] = useState("");

  const cursosDisponiveis = obterCursosDisponiveis();
  const cursosVisiveis = cursosDisponiveis.filter((curso) =>
    textoNormalizado(curso.nome).includes(textoNormalizado(buscaCurso)),
  );
  const todosVisiveisSelecionados =
    cursosVisiveis.length > 0 &&
    cursosVisiveis.every((curso) => cursos.includes(curso.id));

  function alternarCurso(id) {
    definirCursos((atuais) =>
      atuais.includes(id)
        ? atuais.filter((curso) => curso !== id)
        : [...atuais, id],
    );
  }

  function alternarTodos() {
    if (todosVisiveisSelecionados) {
      const idsVisiveis = new Set(cursosVisiveis.map((curso) => curso.id));
      definirCursos((atuais) => atuais.filter((id) => !idsVisiveis.has(id)));
    } else {
      definirCursos((atuais) =>
        Array.from(
          new Set([...atuais, ...cursosVisiveis.map((curso) => curso.id)]),
        ),
      );
    }
  }

  function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    if (!nome.trim() || !sigla.trim()) {
      definirErro("Preencha o nome e a sigla da matéria.");
      return;
    }

    aoSalvar({
      id: existente?.id ?? criarId("materia"),
      nome: nome.trim(),
      sigla: sigla.trim().toLocaleUpperCase("pt-BR"),
      descricao: descricao.trim(),
      ativa: status !== "inativa",
      cursos,
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Matéria" : "Cadastrar Matéria"}
        descricao={
          existente
            ? "Atualize os dados e os cursos relacionados à matéria."
            : "Preencha as informações abaixo para criar uma nova matéria."
        }
        aoVoltar={aoVoltar}
      />

      <form
        className="academico-formulario academico-formulario-materia"
        onSubmit={enviarFormulario}
        noValidate
      >
        <div className="academico-form-area academico-form-area-materia">
          {/* Card esquerdo: Informações da matéria */}
          <section
            className="academico-card academico-card-campos academico-card-materia"
            aria-label="Informações da matéria"
          >
            <div className="academico-campos-duplos">
              <label className="academico-campo">
                <span>
                  Nome da matéria <em>•</em>
                </span>
                <Input
                  tipo="texto"
                  nome="nome"
                  valor={nome}
                  aoAlterar={(e) => definirNome(e.target.value)}
                  placeholder="Nome da matéria"
                  comprimentoMaximo={80}
                  obrigatorio
                />
              </label>

              <label className="academico-campo">
                <span>
                  Sigla <em>•</em>
                </span>
                <Input
                  tipo="texto"
                  nome="sigla"
                  valor={sigla}
                  aoAlterar={(e) =>
                    definirSigla(e.target.value.toLocaleUpperCase("pt-BR"))
                  }
                  placeholder="Digite a sigla da matéria"
                  comprimentoMaximo={10}
                  obrigatorio
                />
              </label>
            </div>

            <label className="academico-campo academico-campo-descricao-materia">
              <span>
                Descrição <small>(opcional)</small>
              </span>
              <Input
                tipo="textoLongo"
                nome="descricao"
                linhas={5}
                valor={descricao}
                aoAlterar={(e) => definirDescricao(e.target.value)}
                placeholder="Faça uma breve descrição da matéria."
                comprimentoMaximo={300}
              />
            </label>

            <div className="academico-campos-duplos academico-materia-status-linha">
              <div className="academico-campo">
                <span>
                  Status <em>•</em>
                </span>
                <Input
                  id="materia-status"
                  tipo="selecao"
                  nome="status"
                  rotulo="Status da matéria"
                  valor={status}
                  aoAlterar={(e) => definirStatus(e.target.value)}
                  classeCampo="academico-popover"
                >
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </Input>
              </div>
            </div>
          </section>

          {/* Card direito: Cursos relacionados */}
          <section
            className="academico-card academico-card-cursos"
            aria-labelledby="academico-cursos-titulo"
          >
            <h2 id="academico-cursos-titulo">Cursos relacionados</h2>

            <div className="academico-cursos-barra">
              <Input
                tipo="busca"
                classeName="academico-cursos-filtro-busca"
                valor={buscaCurso}
                aoAlterar={(evento) => definirBuscaCurso(evento.target.value)}
                placeholder="Buscar curso"
                aria-label="Buscar curso relacionado"
                icone={<img src={iconeBusca} alt="" />}
                tamanhoDoIcone="18px"
              />

              <button
                type="button"
                className="academico-cursos-alternar"
                onClick={alternarTodos}
              >
                {todosVisiveisSelecionados
                  ? "Desmarcar todos"
                  : "Selecionar todos"}
              </button>
            </div>

            <div className="academico-lista-cursos">
              {cursosVisiveis.map((curso) => {
                const marcado = cursos.includes(curso.id);
                return (
                  <label
                    className={`academico-curso-opcao${
                      marcado ? " academico-curso-opcao--marcado" : ""
                    }`}
                    key={curso.id}
                  >
                    <input
                      type="checkbox"
                      checked={marcado}
                      onChange={() => alternarCurso(curso.id)}
                    />
                    <span
                      className="academico-curso-caixa"
                      aria-hidden="true"
                    >
                      {marcado && <IconeCheck />}
                    </span>
                    <span className="academico-curso-texto">{curso.nome}</span>
                  </label>
                );
              })}

              {cursosVisiveis.length === 0 && (
                <p className="academico-ajuda">Nenhum curso encontrado.</p>
              )}
            </div>

            {cursos.length > 0 && (
              <p className="academico-cursos-rodape">
                {cursos.length}{" "}
                {cursos.length === 1
                  ? "curso selecionado"
                  : "cursos selecionados"}
              </p>
            )}
          </section>
        </div>

        <AcoesFormulario
          aoCancelar={aoVoltar}
          aoExcluir={existente ? aoExcluir : undefined}
          textoExcluir="Excluir matéria"
          erro={erro}
        />
      </form>
    </>
  );
}

export default EditorMateria;