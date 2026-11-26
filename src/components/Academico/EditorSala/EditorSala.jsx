import { useState } from "react";
import Input from "../../Gerais/Input/Input.jsx";
import { criarId } from "../../../js/Rotas_ACADEMICO/gerenciamento.js";
import CabecalhoEditor from "../CabecalhoEditor/CabecalhoEditor.jsx";
import AcoesFormulario from "../AcoesFormulario/AcoesFormulario.jsx";
import {
  ICONES_SALA,
  obterIconeSala,
} from "../IconesSala/IconesSala.jsx";
import "./EditorSala.css";

const TIPOS_SALA = [
  "Sala de aula",
  "Laboratório",
  "Auditório",
  "Biblioteca",
  "Multiuso",
  "Outro",
];

function EditorSala({ existente, aoVoltar, aoSalvar }) {
  const [nome, definirNome] = useState(existente?.nome ?? "");
  const [capacidade, definirCapacidade] = useState(
    existente?.capacidade != null ? String(existente.capacidade) : "",
  );
  const [descricao, definirDescricao] = useState(existente?.descricao ?? "");
  const [tipo, definirTipo] = useState(existente?.tipo ?? "");
  const [status, definirStatus] = useState(
    existente?.ativa === false ? "inativa" : "ativa",
  );
  const [icone, definirIcone] = useState(
    obterIconeSala(existente?.icone ?? "formacao").id,
  );
  const [erro, definirErro] = useState("");

  const iconeSelecionadoObj = obterIconeSala(icone);

  function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    const cap = Number(capacidade);
    if (!nome.trim() || !tipo || !Number.isFinite(cap) || cap < 1) {
      definirErro("Preencha o nome, a capacidade válida e o tipo da sala.");
      return;
    }

    aoSalvar({
      id: existente?.id ?? criarId("sala"),
      nome: nome.trim(),
      capacidade: cap,
      descricao: descricao.trim(),
      tipo,
      icone,
      ativa: status !== "inativa",
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Sala" : "Cadastrar Sala"}
        descricao={
          existente
            ? "Atualize as informações desta sala."
            : "Preencha as informações abaixo para criar uma nova sala."
        }
        aoVoltar={aoVoltar}
      />

      <form
        className="academico-formulario academico-formulario-sala"
        onSubmit={enviarFormulario}
        noValidate
      >
        <div className="academico-form-area academico-form-area-sala">
          <section
            className="academico-card academico-card-campos academico-card-sala"
            aria-label="Informações da sala"
          >
            <div className="academico-campos-duplos">
              <label className="academico-campo">
                <span>
                  Nome da sala <em>*</em>
                </span>
                <Input
                  tipo="texto"
                  nome="nome"
                  valor={nome}
                  aoAlterar={(e) => definirNome(e.target.value)}
                  placeholder="Nome da sala"
                  comprimentoMaximo={60}
                  obrigatorio
                />
              </label>

              <label className="academico-campo">
                <span>
                  Capacidade <em>*</em>
                </span>
                <Input
                  nome="capacidade"
                  tipo="numero"
                  minimo="1"
                  maximo="9999"
                  valor={capacidade}
                  aoAlterar={(e) => definirCapacidade(e.target.value)}
                  placeholder="A quantidade máxima de pessoas nela"
                  obrigatorio
                />
              </label>
            </div>

            <label className="academico-campo academico-campo-descricao-sala">
              <span>
                Descrição <small>(opcional)</small>
              </span>
              <Input
                tipo="textoLongo"
                nome="descricao"
                linhas={5}
                valor={descricao}
                aoAlterar={(e) => definirDescricao(e.target.value)}
                placeholder="Faça uma breve descrição da sala"
                comprimentoMaximo={300}
              />
            </label>

            <div className="academico-campos-duplos academico-campos-sala">
              <div className="academico-campo">
                <span>
                  Tipo <em>*</em>
                </span>
                <Input
                  id="sala-tipo"
                  tipo="selecao"
                  nome="tipo"
                  rotulo="Tipo da sala"
                  placeholder="Selecione o tipo da sala"
                  valor={tipo}
                  aoAlterar={(e) => definirTipo(e.target.value)}
                  obrigatorio
                  classeCampo="academico-popover"
                >
                  {TIPOS_SALA.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Input>
              </div>

              {existente && (
                <div className="academico-campo">
                  <span>
                    Status <em>*</em>
                  </span>
                  <Input
                    id="sala-status"
                    tipo="selecao"
                    nome="status"
                    rotulo="Status da sala"
                    valor={status}
                    aoAlterar={(e) => definirStatus(e.target.value)}
                    classeCampo="academico-popover"
                  >
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                  </Input>
                </div>
              )}
            </div>
          </section>

          <section
            className="academico-card academico-card-icones"
            aria-labelledby="academico-icone-titulo"
          >
            <h2 id="academico-icone-titulo">Escolha um ícone</h2>

            <div
              className="academico-grade-icones"
              role="radiogroup"
              aria-label="Ícones disponíveis"
            >
              {ICONES_SALA.map((opcao) => {
                const selecionado = icone === opcao.id;
                return (
                  <button
                    key={opcao.id}
                    type="button"
                    role="radio"
                    aria-checked={selecionado}
                    className={`academico-icone-botao${
                      selecionado ? " selecionado" : ""
                    }`}
                    onClick={() => definirIcone(opcao.id)}
                    aria-label={opcao.nome}
                    title={opcao.nome}
                  >
                    {opcao.render()}
                  </button>
                );
              })}
            </div>

            <div className="academico-icone-selecionado-rodape">
              <span
                className="academico-icone-preview-mini"
                aria-hidden="true"
              >
                {iconeSelecionadoObj.render()}
              </span>
              <span className="academico-icone-preview-linha">
                Ícone selecionado: <strong>{iconeSelecionadoObj.nome}</strong>
              </span>
            </div>
          </section>
        </div>

        <AcoesFormulario aoCancelar={aoVoltar} erro={erro} />
      </form>
    </>
  );
}

export default EditorSala;