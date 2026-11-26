import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { obterEvento } from "../../../js/Rotas_EVENTOS/rotas_EVENTOS.js";
import { obterTurmasIniciais } from "../../../js/Rotas_ACADEMICO/rotas_ACADEMICO.js";
import {
  obterComunicado,
  cadastrarComunicado as criarRegistro,
  atualizarComunicado,
  excluirComunicado,
} from "../../../js/Rotas_COMUNICADOS/rotas_COMUNICADOS.js";
import { lerImagemLocal } from "../../../js/Gerais/arquivos.js";
import { formatarData } from "../../../js/Gerais/calendario.js";
import Input from "../../../components/Gerais/Input/Input.jsx";
import EditorComunicado from "../../../components/Comunicados/EditorComunicado/EditorComunicado.jsx";
import iconeCalendario from "../../../img/icones/calendario-evento.png";
import iconeRelogio from "../../../img/icones/relogio-evento.png";
import iconeRecorrencia from "../../../img/icones/recorrencia-evento.png";
import iconeTurmas from "../../../img/icones/turmas-evento.png";
import "./CadastrarComunicados.css";

const TIPOS_COMUNICADO = [
  { valor: "aviso", rotulo: "Aviso", categoria: "Aviso", icone: "iconeAviso" },
  {
    valor: "informativo",
    rotulo: "Informativo",
    categoria: "Informativo",
    icone: "iconeAviso",
  },
  {
    valor: "orientacao",
    rotulo: "Orientação",
    categoria: "Orientação",
    icone: "iconeOrientacao",
  },
  {
    valor: "evento",
    rotulo: "Evento",
    categoria: "Evento",
    icone: "iconeComunicadoEvento",
  },
];

const OPCOES_RECORRENCIA = [
  { valor: "unica", rotulo: "Não se repete" },
  { valor: "diaria", rotulo: "Diariamente" },
  { valor: "semanal", rotulo: "Semanalmente" },
  { valor: "mensal", rotulo: "Mensalmente" },
  { valor: "anual", rotulo: "Anualmente" },
];

const TAGS_COMUNICADO = [
  "Importante",
  "Saúde mental",
  "Acadêmico",
  "Família",
  "Presença obrigatória",
  "Prazo",
];

function escaparHtml(texto = "") {
  return String(texto)
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">");
}

function montarCorpoDoEvento(evento) {
  if (!evento) return "";
  const blocos = [];
  if (evento.titulo) {
    blocos.push(`<h2>${escaparHtml(evento.titulo)}</h2>`);
  }
  if (evento.descricao) {
    blocos.push(`<p>${escaparHtml(evento.descricao)}</p>`);
  }
  const detalhes = [];
  if (evento.data) {
    detalhes.push(`<li><strong>Data:</strong> ${escaparHtml(formatarData(evento.data))}</li>`);
  }
  if (evento.horaInicio) {
    const faixa = evento.horaFim
      ? `${evento.horaInicio} às ${evento.horaFim}`
      : evento.horaInicio;
    detalhes.push(`<li><strong>Horário:</strong> ${escaparHtml(faixa)}</li>`);
  }
  if (evento.local) {
    detalhes.push(`<li><strong>Local:</strong> ${escaparHtml(evento.local)}</li>`);
  }
  if (detalhes.length) {
    blocos.push(`<ul>${detalhes.join("")}</ul>`);
  }
  if (evento.observacoes) {
    blocos.push(`<p><em>${escaparHtml(evento.observacoes)}</em></p>`);
  }
  return blocos.join("");
}

function extrairListaTags(valor) {
  if (Array.isArray(valor)) return valor.filter(Boolean);
  if (typeof valor === "string" && valor.trim()) {
    return valor
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function IconeImagemUpload() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="6" y="9" width="36" height="30" rx="5" fill="#183734" />
      <circle cx="17" cy="19" r="3.4" fill="#f7f6ee" />
      <path d="M11 35l9.5-10.5 6.5 6.5 5.5-6.5 7.5 10.5H11Z" fill="#f7f6ee" />
    </svg>
  );
}

function CadastrarComunicados({ aoVoltar }) {
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  const entradaImagemRef = useRef(null);

  const id = parametros.get("id");
  const existente = id ? obterComunicado(id) : null;
  const eventoIdParam = parametros.get("evento");
  const eventoVinculado = eventoIdParam ? obterEvento(eventoIdParam) : null;

  const dadosIniciais =
    existente ||
    (eventoVinculado
      ? {
          titulo: eventoVinculado.titulo,
          tipo: "evento",
          descricao: eventoVinculado.descricao,
          observacoes: eventoVinculado.observacoes,
          data: eventoVinculado.data,
          horaInicio: eventoVinculado.horaInicio,
          horaFim: eventoVinculado.horaFim,
          recorrencia:
            {
              "Não se repete": "unica",
              "Todo dia": "diaria",
              "Toda semana": "semanal",
              "Todo mês": "mensal",
            }[eventoVinculado.recorrencia] || "unica",
          turmas:
            eventoVinculado.turmas === "Todas as salas"
              ? "todas"
              : eventoVinculado.turmas || "todas",
          imagem: eventoVinculado.imagem || null,
          corpo: montarCorpoDoEvento(eventoVinculado),
        }
      : null);

  const turmas = obterTurmasIniciais().filter((t) => t.ativa);

  const [nome, definirNome] = useState(dadosIniciais?.titulo || "");
  const [tipo, definirTipo] = useState(dadosIniciais?.tipo || "");
  const [descricao, definirDescricao] = useState(dadosIniciais?.descricao || "");
  const [observacoes, definirObservacoes] = useState(
    dadosIniciais?.observacoes || "",
  );
  const [data, definirData] = useState(dadosIniciais?.data || "");
  const [horaInicio, definirHoraInicio] = useState(
    dadosIniciais?.horaInicio || "",
  );
  const [horaTermino, definirHoraTermino] = useState(
    dadosIniciais?.horaFim || "",
  );
  const [recorrencia, definirRecorrencia] = useState(
    dadosIniciais?.recorrencia || "unica",
  );
  const [turmaSelecionada, definirTurmaSelecionada] = useState(
    dadosIniciais?.turmas || "todas",
  );
  const [tagsSelecionadas, definirTagsSelecionadas] = useState(() =>
    extrairListaTags(dadosIniciais?.tags),
  );
  const [corpo, definirCorpo] = useState(dadosIniciais?.corpo || "");
  const [imagem, definirImagem] = useState(dadosIniciais?.imagem || null);
  const [erro, definirErro] = useState("");

  function voltar() {
    if (aoVoltar) aoVoltar();
    else navegar("/comunicados");
  }

  async function selecionarArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    definirErro("");
    try {
      definirImagem(await lerImagemLocal(arquivo));
    } catch (falha) {
      definirErro(falha.message || "Não foi possível carregar a imagem.");
    }
    e.target.value = "";
  }

  function salvarComunicado(evento) {
    evento.preventDefault();
    definirErro("");

    if (!nome.trim() || !tipo || !descricao.trim() || !data || !horaInicio) {
      definirErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (horaTermino && horaTermino <= horaInicio) {
      definirErro("O horário de término deve ser posterior ao início.");
      return;
    }

    if (id && !existente) {
      definirErro("Comunicado não encontrado.");
      return;
    }

    const metaTipo =
      TIPOS_COMUNICADO.find((item) => item.valor === tipo) ||
      TIPOS_COMUNICADO[0];

    const registro = {
      eventoId: existente?.eventoId || eventoVinculado?.id || null,
      titulo: nome.trim(),
      nome: nome.trim(),
      tipo,
      categoria: metaTipo.categoria,
      icone: metaTipo.icone,
      descricao: descricao.trim(),
      observacoes: observacoes.trim(),
      data,
      horaInicio,
      horaFim: horaTermino,
      recorrencia,
      turmas: turmaSelecionada || "todas",
      tags: tagsSelecionadas,
      corpo,
      imagem,
    };

    try {
      if (existente) atualizarComunicado(id, registro);
      else criarRegistro(registro);
      voltar();
    } catch (e) {
      definirErro(e.message || "Não foi possível salvar o comunicado.");
    }
  }

  function excluir() {
    if (!existente) return;
    if (!window.confirm("Deseja realmente excluir este comunicado?")) return;
    try {
      excluirComunicado(id);
      voltar();
    } catch (e) {
      definirErro(e.message || "Não foi possível excluir o comunicado.");
    }
  }

  return (
    <main className="cadastrar-comunicados-pagina">
      <header className="cadastrar-comunicados-cabecalho">
        <button
          type="button"
          className="cadastrar-comunicados-voltar"
          onClick={voltar}
          aria-label="Voltar para comunicados"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="11 18 5 12 11 6" />
          </svg>
        </button>

        <div className="cadastrar-comunicados-cabecalho-texto">
          <h1>{existente ? "Editar Comunicado" : "Criar Comunicado"}</h1>
          <p>
            {eventoVinculado
              ? `Vinculado ao evento "${eventoVinculado.titulo}". Revise os dados e personalize o corpo abaixo.`
              : existente
                ? "Atualize as informações ou o conteúdo deste comunicado."
                : "Preencha as informações abaixo para criar um novo comunicado."}
          </p>
        </div>
      </header>

      <form
        className="cadastrar-comunicados-formulario"
        onSubmit={salvarComunicado}
        noValidate
      >
        <div className="cadastrar-comunicados-area">
          {/* Card esquerdo: informações */}
          <section
            className="cadastrar-comunicados-campos"
            aria-label="Informações do comunicado"
          >
            <div className="cadastrar-comunicados-campo-par">
              <label className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Nome do comunicado <em>*</em>
                </span>
                <Input
                  tipo="texto"
                  nome="nome"
                  classeName="cadastrar-comunicados-input"
                  valor={nome}
                  aoAlterar={(e) => definirNome(e.target.value)}
                  placeholder="Nome do comunicado"
                  obrigatorio
                />
              </label>

              <div className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Tipo <em>*</em>
                </span>
                <Input
                  id="comunicado-tipo"
                  tipo="selecao"
                  nome="tipo"
                  rotulo="Tipo de comunicado"
                  placeholder="Selecione os tipos do comunicado"
                  valor={tipo}
                  aoAlterar={(e) => definirTipo(e.target.value)}
                  obrigatorio
                  classeCampo="cadastrar-comunicados-popover"
                >
                  {TIPOS_COMUNICADO.map((item) => (
                    <option key={item.valor} value={item.valor}>
                      {item.rotulo}
                    </option>
                  ))}
                </Input>
              </div>
            </div>

            <div className="cadastrar-comunicados-campo-par cadastrar-comunicados-campo-par--cresce">
              <label className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Descrição <em>*</em>
                </span>
                <Input
                  tipo="textoLongo"
                  nome="descricao"
                  classeName="cadastrar-comunicados-textarea"
                  valor={descricao}
                  aoAlterar={(e) => definirDescricao(e.target.value)}
                  placeholder="Descreva um resumo desse comunicado."
                  obrigatorio
                />
              </label>

              <label className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Observações <small>(opcional)</small>
                </span>
                <Input
                  tipo="textoLongo"
                  nome="observacoes"
                  classeName="cadastrar-comunicados-textarea"
                  valor={observacoes}
                  aoAlterar={(e) => definirObservacoes(e.target.value)}
                  placeholder="Descreva observações importantes sobre o comunicado."
                />
              </label>
            </div>

            <div className="cadastrar-comunicados-horario-linha">
              <div className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Data do comunicado <em>*</em>
                </span>
                <Input
                  id="comunicado-data"
                  tipo="data"
                  nome="data"
                  placeholder="dd/mm/aa"
                  valor={data}
                  aoAlterar={(e) => definirData(e.target.value)}
                  iconeEsquerda={<img src={iconeCalendario} alt="" />}
                  obrigatorio
                  classeCampo="cadastrar-comunicados-popover"
                />
              </div>

              <div className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Hora de início <em>*</em>
                </span>
                <Input
                  id="comunicado-hora-inicio"
                  tipo="horario"
                  nome="horaInicio"
                  placeholder="--:--"
                  valor={horaInicio}
                  aoAlterar={(e) => definirHoraInicio(e.target.value)}
                  iconeEsquerda={<img src={iconeRelogio} alt="" />}
                  obrigatorio
                  classeCampo="cadastrar-comunicados-popover"
                />
              </div>

              <div className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Hora de término <small>(opcional)</small>
                </span>
                <Input
                  id="comunicado-hora-fim"
                  tipo="horario"
                  nome="horaTermino"
                  placeholder="--:--"
                  valor={horaTermino}
                  aoAlterar={(e) => definirHoraTermino(e.target.value)}
                  iconeEsquerda={<img src={iconeRelogio} alt="" />}
                  classeCampo="cadastrar-comunicados-popover"
                />
              </div>
            </div>

            <div className="cadastrar-comunicados-linha-opcoes">
              <div className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Recorrência <small>(opcional)</small>
                </span>
                <Input
                  id="comunicado-recorrencia"
                  tipo="selecao"
                  nome="recorrencia"
                  rotulo="Recorrência"
                  valor={recorrencia}
                  aoAlterar={(e) => definirRecorrencia(e.target.value)}
                  iconeEsquerda={<img src={iconeRecorrencia} alt="" />}
                  classeCampo="cadastrar-comunicados-popover"
                >
                  {OPCOES_RECORRENCIA.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {opcao.rotulo}
                    </option>
                  ))}
                </Input>
              </div>

              <div className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Salas participantes <em>*</em>
                </span>
                <Input
                  id="comunicado-turmas"
                  tipo="selecao"
                  nome="turmas"
                  rotulo="Salas participantes"
                  placeholder="Selecione as salas que vão receber"
                  valor={turmaSelecionada}
                  aoAlterar={(e) => definirTurmaSelecionada(e.target.value)}
                  iconeEsquerda={<img src={iconeTurmas} alt="" />}
                  obrigatorio
                  classeCampo="cadastrar-comunicados-popover"
                >
                  <option value="todas">Todas as turmas</option>
                  {dadosIniciais?.turmas &&
                    dadosIniciais.turmas !== "todas" &&
                    !turmas.some((t) => t.id === dadosIniciais.turmas) && (
                      <option value={dadosIniciais.turmas}>
                        {dadosIniciais.turmas}
                      </option>
                    )}
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
                </Input>
              </div>
            </div>

            <div className="cadastrar-comunicados-linha-tags">
              <div className="cadastrar-comunicados-campo">
                <span className="cadastrar-comunicados-rotulo">
                  Tags <small>(opcional)</small>
                </span>
                <Input
                  id="comunicado-tags"
                  tipo="selecao"
                  nome="tags"
                  rotulo="Tags do comunicado"
                  placeholder="Selecione as tags do comunicado"
                  multiplo
                  valor={tagsSelecionadas}
                  aoAlterar={(e) => definirTagsSelecionadas(e.target.value)}
                  classeCampo="cadastrar-comunicados-popover"
                >
                  {TAGS_COMUNICADO.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </Input>
              </div>
            </div>
          </section>

          {/* Card direito: imagem + Tiptap */}
          <aside
            className="cadastrar-comunicados-lateral"
            aria-labelledby="cadastrar-comunicados-corpo-titulo"
          >
            <h2
              className="cadastrar-comunicados-corpo-titulo"
              id="cadastrar-comunicados-corpo-titulo"
            >
              Corpo do comunicado
            </h2>

            <input
              ref={entradaImagemRef}
              type="file"
              accept="image/*"
              className="cadastrar-comunicados-arquivo-oculto"
              onChange={selecionarArquivo}
            />

            <div
              className={`cadastrar-comunicados-upload${
                imagem ? " cadastrar-comunicados-upload--com-imagem" : ""
              }`}
            >
              {imagem ? (
                <>
                  <img
                    src={imagem}
                    alt="Prévia da imagem do comunicado"
                    className="cadastrar-comunicados-upload-previa"
                  />
                  <div className="cadastrar-comunicados-upload-acoes">
                    <button
                      type="button"
                      className="cadastrar-comunicados-upload-btn"
                      onClick={() => entradaImagemRef.current?.click()}
                    >
                      Trocar imagem
                    </button>
                    <button
                      type="button"
                      className="cadastrar-comunicados-upload-btn cadastrar-comunicados-upload-btn--remover"
                      onClick={() => definirImagem(null)}
                    >
                      Remover
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="cadastrar-comunicados-upload-gatilho"
                  onClick={() => entradaImagemRef.current?.click()}
                >
                  <span className="cadastrar-comunicados-upload-icone">
                    <IconeImagemUpload />
                  </span>
                  <span className="cadastrar-comunicados-upload-texto">
                    Clique para escolher uma imagem
                  </span>
                </button>
              )}
            </div>

            <EditorComunicado
              valor={corpo}
              aoAlterar={definirCorpo}
              placeholder="Digite o conteúdo do comunicado"
            />
          </aside>
        </div>

        <footer className="cadastrar-comunicados-rodape">
          <div className="cadastrar-comunicados-rodape-esquerda">
            {erro && (
              <p className="cadastrar-comunicados-erro" role="alert">
                {erro}
              </p>
            )}
            {existente && (
              <button
                type="button"
                className="cadastrar-comunicados-excluir"
                onClick={excluir}
              >
                Excluir comunicado
              </button>
            )}
          </div>

          <div className="cadastrar-comunicados-acoes">
            <button
              type="button"
              className="cadastrar-comunicados-cancelar"
              onClick={voltar}
            >
              Cancelar
            </button>
            <button type="submit" className="cadastrar-comunicados-salvar">
              Salvar
            </button>
          </div>
        </footer>
      </form>
    </main>
  );
}

export default CadastrarComunicados;