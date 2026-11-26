import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import {
  obterTurmasIniciais,
  obterSalasIniciais,
} from "../../../js/Rotas_ACADEMICO/rotas_ACADEMICO.js";

import {
  obterEvento,
  cadastrarEvento as criarRegistro,
  atualizarEvento,
  excluirEvento,
} from "../../../js/Rotas_EVENTOS/rotas_EVENTOS.js";
import {
  obterComunicadosDeExemplo,
  atualizarComunicado,
} from "../../../js/Rotas_COMUNICADOS/rotas_COMUNICADOS.js";
import { formatarData } from "../../../js/Gerais/calendario.js";
import iconeReenviar from "../../../img/icones/reenviar-evento.png";

import { lerImagemLocal } from "../../../js/Gerais/arquivos.js";
import Abas, { ConteudoAba } from "../../../components/Gerais/Abas/Abas.jsx";
import Input from "../../../components/Gerais/Input/Input.jsx";
import CardPerguntasEvento from "../../../components/Eventos/CardPerguntasEvento/CardPerguntasEvento.jsx";
import CardComentariosEvento from "../../../components/Eventos/CardComentariosEvento/CardComentariosEvento.jsx";
import iconeCalendario from "../../../img/icones/calendario-evento.png";
import iconeRelogio from "../../../img/icones/relogio-evento.png";
import iconeRecorrencia from "../../../img/icones/recorrencia-evento.png";
import iconeTurmas from "../../../img/icones/turmas-evento.png";
import iconeLocal from "../../../img/icones/local-evento.png";
import iconeCalendarioComSinal from "../../../img/icones/calendario-adicionar.png";
import "./CadastrarEvento.css";

const TIPOS_EVENTO = ["Palestra", "Oficina", "Campanha", "Festa", "Reunião"];

const OPCOES_RECORRENCIA = [
  "Não se repete",
  "Todo dia",
  "Toda semana",
  "Todo mês",
];

const LOCAIS_PADRAO = [
  "Auditório",
  "Refeitório",
  "Pátio",
  "Quadra",
  "Biblioteca",
  "Sala de reuniões",
  "Laboratório",
  "Espaço externo",
];

const PERGUNTAS_EXEMPLO = [
  {
    id: "perg-1",
    anonima: true,
    data: "06 de Julho de 2026, 22:14",
    texto:
      "Como posso ajudar um amigo que está passando por um momento difícil?",
    respondida: false,
  },
  {
    id: "perg-2",
    anonima: false,
    autorNome: "Mariana Oliveira",
    turma: "2º Ano B",
    autorFoto: "",
    data: "07 de Julho de 2026, 09:40",
    texto:
      "Haverá emissão de certificado ou registro de participação para as atividades complementares?",
    respondida: true,
  },
  {
    id: "perg-3",
    anonima: false,
    autorNome: "Lucas Mendes",
    turma: "3º Ano A",
    autorFoto: "",
    data: "07 de Julho de 2026, 14:05",
    texto:
      "Os responsáveis pelos estudantes também poderão acompanhar a palestra no auditório?",
    respondida: false,
  },
];

const COMENTARIOS_EXEMPLO = [
  {
    id: "com-1",
    autorNome: "Steven",
    apelido: "Biscoito Gatinho",
    autorFoto: "",
    registro: "06/07/2024",
    mensagens: 67,
    data: "06 de Julho de 2026, 22:14",
    texto:
      "Fico feliz em ver que estão dando atenção a um tema tão importante.",
    curtidas: 67,
    respostas: [],
  },
  {
    id: "com-2",
    autorNome: "Beatriz Souza",
    apelido: "2º Ano A",
    autorFoto: "",
    registro: "12/02/2025",
    mensagens: 19,
    data: "07 de Julho de 2026, 10:20",
    texto:
      "Nossa turma já está super animada para participar! Vai ter espaço para tirar dúvidas ao final?",
    curtidas: 14,
    respostas: [
      {
        id: "resp-1",
        autor: "Coordenação",
        data: "07 de Julho de 2026, 11:05",
        texto:
          "Sim! Os últimos 20 minutos serão dedicados às perguntas enviadas pelos estudantes.",
      },
    ],
  },
];

function formatarDataAgora() {
  const agora = new Date();
  const mesesPt = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = mesesPt[agora.getMonth()];
  const ano = agora.getFullYear();
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");
  return `${dia} de ${mes} de ${ano}, ${hora}:${minuto}`;
}

function extrairListaLocais(valor) {
  if (Array.isArray(valor)) return valor.filter(Boolean);
  if (typeof valor === "string" && valor.trim()) {
    return valor
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function formatarMoedaEntrada(texto = "") {
  const digitos = String(texto).replace(/\D/g, "").slice(0, 9);
  if (!digitos) return "";
  return (Number(digitos) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarNumeroMoeda(numero) {
  const n = Number(numero);
  if (!Number.isFinite(n) || n <= 0) return "";
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function converterMoedaParaNumero(texto = "") {
  const limpo = String(texto).replace(/\./g, "").replace(",", ".");
  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : 0;
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

function IconeAbaInfo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
  );
}

function IconeAbaPerguntas() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.4 2.4 0 0 1 4.7.8c0 1.5-2.3 2-2.3 3.3" />
      <circle cx="12" cy="16.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconeAbaComentarios() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CadastrarEvento({ aoVoltar }) {
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  const inputArquivoRef = useRef(null);

  const { id: idRota } = useParams();
  const id = idRota || parametros.get("id");
  const existente = id ? obterEvento(id) : null;
  const turmas = obterTurmasIniciais().filter((t) => t.ativa);

  const [abaAtiva, definirAbaAtiva] = useState("informacoes");
  const [titulo, definirTitulo] = useState(existente?.titulo || "");
  const [categoria, definirCategoria] = useState(existente?.categoria || "");
  const [descricao, definirDescricao] = useState(existente?.descricao || "");
  const [observacoes, definirObservacoes] = useState(
    existente?.observacoes || "",
  );
  const [data, definirData] = useState(existente?.data || "");
  const [horaInicio, definirHoraInicio] = useState(existente?.horaInicio || "");
  const [horaFim, definirHoraFim] = useState(existente?.horaFim || "");
  const [recorrencia, definirRecorrencia] = useState(
    existente?.recorrencia || "Não se repete",
  );
  const [turmaSelecionada, definirTurmaSelecionada] = useState(
    existente?.turmas || "",
  );
  const [locaisSelecionados, definirLocaisSelecionados] = useState(() =>
    extrairListaLocais(existente?.local),
  );
  const [ehGratuito, definirEhGratuito] = useState(() => {
    if (existente?.gratuito !== undefined) return Boolean(existente.gratuito);
    return !(Number(existente?.valor) > 0);
  });
  const [valorTexto, definirValorTexto] = useState(() =>
    formatarNumeroMoeda(existente?.valor),
  );
  const [permitirPerguntas, definirPermitirPerguntas] = useState(
    existente?.permitirPerguntas ?? true,
  );
  const [perguntas, definirPerguntas] = useState(() => {
    if (Array.isArray(existente?.perguntas)) return existente.perguntas;
    return [];
  });
  const [permitirComentarios, definirPermitirComentarios] = useState(
    existente?.permitirComentarios ?? true,
  );
  const [comentarios, definirComentarios] = useState(() => {
    if (Array.isArray(existente?.comentarios)) return existente.comentarios;
    return [];
  });
  const [imagem, definirImagem] = useState(existente?.imagem || null);
  const [erro, definirErro] = useState("");

  const [comunicadoVinculado, definirComunicadoVinculado] = useState(() => {
    if (!existente?.id) return null;
    return (
      obterComunicadosDeExemplo().find(
        (item) => String(item.eventoId) === String(existente.id),
      ) || null
    );
  });
  const [avisoReenvio, definirAvisoReenvio] = useState("");
  useEffect(() => {
    if (!id) return;
    const atualizar = () => {
      const atual = obterEvento(id);
      if (atual) {
        definirComentarios(atual.comentarios || []);
        definirPerguntas(atual.perguntas || []);
      }
    };
    window.addEventListener("storage", atualizar);
    return () => window.removeEventListener("storage", atualizar);
  }, [id]);

  function editarComunicadoVinculado() {
    if (!comunicadoVinculado) return;
    navegar(
      `/comunicados/cadastrarComunicado?id=${encodeURIComponent(
        comunicadoVinculado.id,
      )}`,
    );
  }

  function reenviarComunicadoVinculado() {
    if (!comunicadoVinculado) return;
    try {
      const agora = new Date().toISOString();
      atualizarComunicado(comunicadoVinculado.id, { reenviadoEm: agora });
      definirComunicadoVinculado((atual) =>
        atual ? { ...atual, reenviadoEm: agora } : atual,
      );
      definirAvisoReenvio("Reenvio registrado agora.");
      setTimeout(() => definirAvisoReenvio(""), 3500);
    } catch (e) {
      definirErro(e.message || "Não foi possível reenviar o comunicado.");
    }
  }

  const opcoesLocais = useMemo(() => {
    const conjunto = new Set([
      ...obterSalasIniciais()
        .filter((s) => s.ativa !== false)
        .map((s) => s.nome),
      ...LOCAIS_PADRAO,
    ]);
    locaisSelecionados.forEach((item) => conjunto.add(item));
    return Array.from(conjunto);
  }, [locaisSelecionados]);

  const abasEvento = useMemo(
    () => [
      {
        valor: "informacoes",
        rotulo: "Informações do evento",
        icone: <IconeAbaInfo />,
      },
      {
        valor: "perguntas",
        rotulo:
          perguntas.length > 0
            ? `Perguntas (${perguntas.length})`
            : "Perguntas",
        icone: <IconeAbaPerguntas />,
      },
      {
        valor: "comentarios",
        rotulo:
          comentarios.length > 0
            ? `Comentários (${comentarios.length})`
            : "Comentários",
        icone: <IconeAbaComentarios />,
      },
    ],
    [perguntas.length, comentarios.length],
  );

  function voltar() {
    if (aoVoltar) aoVoltar();
    else navegar("/eventos");
  }

  function persistirParcial(parcial) {
    if (!existente) return;
    try {
      atualizarEvento(id, parcial);
    } catch {
      // Será persistido ao clicar em Salvar
    }
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

  function alternarRespondida(perguntaId) {
    const atualizadas = perguntas.map((item) =>
      item.id === perguntaId ? { ...item, respondida: !item.respondida } : item,
    );
    definirPerguntas(atualizadas);
    persistirParcial({ perguntas: atualizadas });
  }

  function removerPergunta(perguntaId) {
    if (!window.confirm("Remover esta pergunta do evento?")) return;
    const atualizadas = perguntas.filter((item) => item.id !== perguntaId);
    definirPerguntas(atualizadas);
    persistirParcial({ perguntas: atualizadas });
  }

  function responderComentario(comentarioId, texto) {
    const novaResposta = {
      id: `resp-${Date.now()}`,
      autor: "Coordenação",
      data: formatarDataAgora(),
      texto,
    };
    const atualizados = comentarios.map((item) =>
      item.id === comentarioId
        ? { ...item, respostas: [...(item.respostas || []), novaResposta] }
        : item,
    );
    definirComentarios(atualizados);
    persistirParcial({ comentarios: atualizados });
  }

  function removerComentario(comentarioId) {
    if (!window.confirm("Remover este comentário da publicação?")) return;
    const atualizados = comentarios.filter((item) => item.id !== comentarioId);
    definirComentarios(atualizados);
    persistirParcial({ comentarios: atualizados });
  }

  function removerRespostaComentario(comentarioId, respostaId) {
    const atualizados = comentarios.map((item) =>
      item.id === comentarioId
        ? {
            ...item,
            respostas: (item.respostas || []).filter(
              (resp) => resp.id !== respostaId,
            ),
          }
        : item,
    );
    definirComentarios(atualizados);
    persistirParcial({ comentarios: atualizados });
  }

  function salvarEvento(evento) {
    evento.preventDefault();
    definirErro("");

    if (
      !titulo.trim() ||
      !categoria ||
      !descricao.trim() ||
      !data ||
      !horaInicio ||
      !horaFim
    ) {
      definirAbaAtiva("informacoes");
      definirErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (locaisSelecionados.length === 0) {
      definirAbaAtiva("informacoes");
      definirErro("Selecione pelo menos um local para o evento.");
      return;
    }

    if (horaFim <= horaInicio) {
      definirAbaAtiva("informacoes");
      definirErro("O horário de término deve ser posterior ao início.");
      return;
    }

    const valorNumerico = ehGratuito ? 0 : converterMoedaParaNumero(valorTexto);
    if (!ehGratuito && valorNumerico <= 0) {
      definirAbaAtiva("informacoes");
      definirErro("Informe um valor maior que zero ou marque como gratuito.");
      return;
    }

    if (id && !existente) {
      definirErro("Evento não encontrado.");
      return;
    }

    const registro = {
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      observacoes: observacoes.trim(),
      data,
      horaInicio,
      horaFim,
      recorrencia,
      turmas: turmaSelecionada || "Todas as salas",
      local: locaisSelecionados.join(", "),
      gratuito: ehGratuito,
      valor: valorNumerico,
      valorFormatado: ehGratuito
        ? "Gratuito"
        : `R$ ${formatarNumeroMoeda(valorNumerico)}`,
      permitirPerguntas,
      perguntas: id ? obterEvento(id)?.perguntas || [] : perguntas,
      permitirComentarios,
      comentarios: id ? obterEvento(id)?.comentarios || [] : comentarios,
      imagem,
    };

    try {
      const salvo = existente
        ? atualizarEvento(id, registro)
        : criarRegistro(registro);

      if (evento.nativeEvent.submitter?.value === "comunicado") {
        navegar(
          `/comunicados/cadastrarComunicado?evento=${encodeURIComponent(
            salvo.id,
          )}`,
        );
      } else {
        voltar();
      }
    } catch (e) {
      definirErro(e.message || "Não foi possível salvar o evento.");
    }
  }

  function excluir() {
    if (!existente) return;
    if (!window.confirm("Deseja realmente excluir este evento?")) return;
    try {
      excluirEvento(id);
      voltar();
    } catch (e) {
      definirErro(e.message || "Não foi possível excluir o evento.");
    }
  }

  return (
    <main className="cadastrar-evento-pagina">
      <header className="cadastrar-evento-cabecalho">
        <button
          type="button"
          className="cadastrar-evento-voltar"
          onClick={voltar}
          aria-label="Voltar para eventos"
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

        <div className="cadastrar-evento-cabecalho-texto">
          <h1>{existente ? "Editar Evento" : "Cadastrar Evento"}</h1>
          <p>
            {existente
              ? "Atualize as informações, acompanhe perguntas e modere os comentários dos estudantes."
              : "Preencha as informações abaixo para criar um novo evento."}
          </p>
        </div>
      </header>

      <div className="cadastrar-evento-abas-linha">
        <Abas
          className="cadastrar-evento-abas"
          tamanho="compacto"
          itens={abasEvento}
          valor={abaAtiva}
          aoMudar={definirAbaAtiva}
        />
      </div>

      <form
        className="cadastrar-evento-formulario"
        onSubmit={salvarEvento}
        noValidate
      >
        <ConteudoAba chave={abaAtiva} className="cadastrar-evento-conteudo-aba">
          {abaAtiva === "informacoes" ? (
            <div className="cadastrar-evento-area">
              <section
                className="cadastrar-evento-campos"
                aria-label="Informações do evento"
              >
                <div className="cadastrar-evento-campo-par">
                  <label className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Nome do evento <em>*</em>
                    </span>
                    <Input
                      tipo="texto"
                      nome="titulo"
                      classeName="cadastrar-evento-input"
                      valor={titulo}
                      aoAlterar={(e) => definirTitulo(e.target.value)}
                      placeholder="Nome do evento"
                      obrigatorio
                    />
                  </label>

                  <div className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Tipo <em>*</em>
                    </span>
                    <Input
                      id="evento-categoria"
                      tipo="selecao"
                      nome="categoria"
                      rotulo="Tipo do evento"
                      placeholder="Selecione os tipos do evento"
                      valor={categoria}
                      aoAlterar={(e) => definirCategoria(e.target.value)}
                      obrigatorio
                      classeCampo="cadastrar-evento-popover"
                    >
                      {TIPOS_EVENTO.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>

                <div className="cadastrar-evento-campo-par cadastrar-evento-campo-par--cresce">
                  <label className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Descrição <em>*</em>
                    </span>
                    <Input
                      tipo="textoLongo"
                      nome="descricao"
                      classeName="cadastrar-evento-textarea"
                      valor={descricao}
                      aoAlterar={(e) => definirDescricao(e.target.value)}
                      placeholder="Descreva o evento, objetivo e informações."
                      obrigatorio
                    />
                  </label>

                  <label className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Observações <small>(opcional)</small>
                    </span>
                    <Input
                      tipo="textoLongo"
                      nome="observacoes"
                      classeName="cadastrar-evento-textarea"
                      valor={observacoes}
                      aoAlterar={(e) => definirObservacoes(e.target.value)}
                      placeholder="Descreva observações importantes sobre o evento."
                    />
                  </label>
                </div>

                <div className="cadastrar-evento-horario-linha">
                  <div className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Data do evento <em>*</em>
                    </span>
                    <Input
                      id="evento-data"
                      tipo="data"
                      nome="data"
                      placeholder="dd/mm/aa"
                      valor={data}
                      aoAlterar={(e) => definirData(e.target.value)}
                      iconeEsquerda={<img src={iconeCalendario} alt="" />}
                      obrigatorio
                      classeCampo="cadastrar-evento-popover"
                    />
                  </div>

                  <div className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Hora de início <em>*</em>
                    </span>
                    <Input
                      id="evento-hora-inicio"
                      tipo="horario"
                      nome="horaInicio"
                      placeholder="--:--"
                      valor={horaInicio}
                      aoAlterar={(e) => definirHoraInicio(e.target.value)}
                      iconeEsquerda={<img src={iconeRelogio} alt="" />}
                      obrigatorio
                      classeCampo="cadastrar-evento-popover"
                    />
                  </div>

                  <div className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Hora de término <em>*</em>
                    </span>
                    <Input
                      id="evento-hora-fim"
                      tipo="horario"
                      nome="horaFim"
                      placeholder="--:--"
                      valor={horaFim}
                      aoAlterar={(e) => definirHoraFim(e.target.value)}
                      iconeEsquerda={<img src={iconeRelogio} alt="" />}
                      obrigatorio
                      classeCampo="cadastrar-evento-popover"
                    />
                  </div>
                </div>

                <div className="cadastrar-evento-linha-opcoes">
                  <div className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Recorrência <small>(opcional)</small>
                    </span>
                    <Input
                      id="evento-recorrencia"
                      tipo="selecao"
                      nome="recorrencia"
                      rotulo="Recorrência"
                      valor={recorrencia}
                      aoAlterar={(e) => definirRecorrencia(e.target.value)}
                      iconeEsquerda={<img src={iconeRecorrencia} alt="" />}
                      classeCampo="cadastrar-evento-popover"
                    >
                      {OPCOES_RECORRENCIA.map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </Input>
                  </div>

                  <div className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Turmas participantes
                    </span>
                    <Input
                      id="evento-turmas"
                      tipo="selecao"
                      nome="turmas"
                      rotulo="Turmas participantes"
                      placeholder="Selecione as turmas que vão participar"
                      valor={turmaSelecionada}
                      aoAlterar={(e) => definirTurmaSelecionada(e.target.value)}
                      iconeEsquerda={<img src={iconeTurmas} alt="" />}
                      classeCampo="cadastrar-evento-popover"
                    >
                      <option value="Todas as salas">Todas as salas</option>
                      {existente?.turmas &&
                        existente.turmas !== "Todas as salas" &&
                        !turmas.some((t) => t.id === existente.turmas) && (
                          <option value={existente.turmas}>
                            {existente.turmas}
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

                <div className="cadastrar-evento-campo-par">
                  <div className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Local <em>*</em>
                    </span>
                    <Input
                      id="evento-local"
                      tipo="selecao"
                      nome="local"
                      rotulo="Local do evento"
                      placeholder="Selecione um ou mais locais"
                      multiplo
                      valor={locaisSelecionados}
                      aoAlterar={(e) =>
                        definirLocaisSelecionados(e.target.value)
                      }
                      iconeEsquerda={<img src={iconeLocal} alt="" />}
                      obrigatorio
                      classeCampo="cadastrar-evento-popover"
                    >
                      {opcoesLocais.map((local) => (
                        <option key={local} value={local}>
                          {local}
                        </option>
                      ))}
                    </Input>
                  </div>

                  <div className="cadastrar-evento-campo">
                    <span className="cadastrar-evento-rotulo">
                      Valor do evento <em>*</em>
                    </span>
                    <div className="cadastrar-evento-valor-linha">
                      <div
                        className="cadastrar-evento-valor-segmento"
                        role="radiogroup"
                        aria-label="Tipo de cobrança do evento"
                      >
                        <button
                          type="button"
                          role="radio"
                          aria-checked={ehGratuito}
                          className={`cadastrar-evento-valor-btn${
                            ehGratuito
                              ? " cadastrar-evento-valor-btn--ativo"
                              : ""
                          }`}
                          onClick={() => definirEhGratuito(true)}
                        >
                          Gratuito
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={!ehGratuito}
                          className={`cadastrar-evento-valor-btn${
                            !ehGratuito
                              ? " cadastrar-evento-valor-btn--ativo"
                              : ""
                          }`}
                          onClick={() => definirEhGratuito(false)}
                        >
                          Pago
                        </button>
                      </div>

                      {!ehGratuito && (
                        <label className="cadastrar-evento-valor-input-wrap">
                          <span aria-hidden="true">R$</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            aria-label="Valor em reais"
                            placeholder="0,00"
                            value={valorTexto}
                            onChange={(e) =>
                              definirValorTexto(
                                formatarMoedaEntrada(e.target.value),
                              )
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="cadastrar-evento-campo">
                  <span className="cadastrar-evento-rotulo">
                    Interações dos estudantes
                  </span>
                  <div className="cadastrar-evento-interacoes-par">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={permitirPerguntas}
                      className={`cadastrar-evento-toggle${
                        permitirPerguntas
                          ? " cadastrar-evento-toggle--ativo"
                          : ""
                      }`}
                      onClick={() =>
                        definirPermitirPerguntas((atual) => !atual)
                      }
                    >
                      <span className="cadastrar-evento-toggle-texto">
                        Permitir perguntas
                      </span>
                      <span className="evento-switch-trilho" aria-hidden="true">
                        <span className="evento-switch-bolinha" />
                      </span>
                    </button>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={permitirComentarios}
                      className={`cadastrar-evento-toggle${
                        permitirComentarios
                          ? " cadastrar-evento-toggle--ativo"
                          : ""
                      }`}
                      onClick={() =>
                        definirPermitirComentarios((atual) => !atual)
                      }
                    >
                      <span className="cadastrar-evento-toggle-texto">
                        Permitir comentários
                      </span>
                      <span className="evento-switch-trilho" aria-hidden="true">
                        <span className="evento-switch-bolinha" />
                      </span>
                    </button>
                  </div>
                </div>
              </section>

              <aside className="cadastrar-evento-lateral">
                <input
                  ref={inputArquivoRef}
                  type="file"
                  accept="image/*"
                  className="cadastrar-evento-arquivo-oculto"
                  onChange={selecionarArquivo}
                />

                <div
                  className={`cadastrar-evento-upload${
                    imagem ? " cadastrar-evento-upload--com-imagem" : ""
                  }`}
                >
                  {imagem ? (
                    <>
                      <img
                        src={imagem}
                        alt="Prévia da imagem do evento"
                        className="cadastrar-evento-upload-previa"
                      />
                      <div className="cadastrar-evento-upload-acoes">
                        <button
                          type="button"
                          className="cadastrar-evento-upload-btn"
                          onClick={() => inputArquivoRef.current?.click()}
                        >
                          Trocar imagem
                        </button>
                        <button
                          type="button"
                          className="cadastrar-evento-upload-btn cadastrar-evento-upload-btn--remover"
                          onClick={() => definirImagem(null)}
                        >
                          Remover
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="cadastrar-evento-upload-gatilho"
                      onClick={() => inputArquivoRef.current?.click()}
                    >
                      <span className="cadastrar-evento-upload-icone">
                        <IconeImagemUpload />
                      </span>
                      <span className="cadastrar-evento-upload-texto">
                        Clique para escolher uma imagem
                      </span>
                    </button>
                  )}
                </div>

                <span className="cadastrar-evento-divisor" aria-hidden="true" />

                <section
                  className={`cadastrar-evento-comunicado${
                    comunicadoVinculado
                      ? " cadastrar-evento-comunicado--vinculado"
                      : ""
                  }`}
                >
                  <div className="cadastrar-evento-comunicado-topo">
                    <div className="cadastrar-evento-comunicado-cabecalho">
                      <h2>Comunicado do evento</h2>
                      {comunicadoVinculado && (
                        <span
                          className={`cadastrar-evento-comunicado-selo${
                            comunicadoVinculado.oculto
                              ? " cadastrar-evento-comunicado-selo--oculto"
                              : ""
                          }`}
                        >
                          {comunicadoVinculado.oculto ? "Oculto" : "Criado"}
                        </span>
                      )}
                    </div>
                    <p>
                      {comunicadoVinculado
                        ? "Este evento já possui um comunicado vinculado."
                        : "Crie o comunicado do evento."}
                    </p>
                  </div>

                  {comunicadoVinculado ? (
                    <div className="cadastrar-evento-comunicado-vinculado">
                      <div className="cadastrar-evento-comunicado-resumo">
                        <strong>{comunicadoVinculado.titulo}</strong>
                        <span>
                          {comunicadoVinculado.data
                            ? formatarData(comunicadoVinculado.data)
                            : "Sem data"}
                          {comunicadoVinculado.horaInicio
                            ? ` • ${comunicadoVinculado.horaInicio}`
                            : ""}
                        </span>
                      </div>

                      {avisoReenvio && (
                        <span
                          className="cadastrar-evento-comunicado-feedback"
                          role="status"
                        >
                          {avisoReenvio}
                        </span>
                      )}

                      <div className="cadastrar-evento-comunicado-botoes">
                        <button
                          type="button"
                          className="cadastrar-evento-comunicado-btn cadastrar-evento-comunicado-btn--editar"
                          onClick={editarComunicadoVinculado}
                        >
                          Editar comunicado
                        </button>
                        <button
                          type="button"
                          className="cadastrar-evento-comunicado-btn cadastrar-evento-comunicado-btn--reenviar"
                          onClick={reenviarComunicadoVinculado}
                        >
                          <img src={iconeReenviar} alt="" />
                          Reenviar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      value="comunicado"
                      className="cadastrar-evento-comunicado-gatilho"
                    >
                      <img src={iconeCalendarioComSinal} alt="" />
                      <span>Criar comunicado</span>
                    </button>
                  )}
                </section>
              </aside>
            </div>
          ) : abaAtiva === "perguntas" ? (
            <CardPerguntasEvento
              permitirPerguntas={permitirPerguntas}
              aoAlternarPermitir={definirPermitirPerguntas}
              perguntas={perguntas}
              aoAlternarRespondida={alternarRespondida}
              aoRemoverPergunta={removerPergunta}
            />
          ) : (
            <CardComentariosEvento
              permitirComentarios={permitirComentarios}
              aoAlternarPermitir={definirPermitirComentarios}
              comentarios={comentarios}
              aoResponderComentario={responderComentario}
              aoRemoverComentario={removerComentario}
              aoRemoverResposta={removerRespostaComentario}
            />
          )}
        </ConteudoAba>

        <footer className="cadastrar-evento-rodape">
          <div className="cadastrar-evento-rodape-esquerda">
            {erro && (
              <p className="cadastrar-evento-erro" role="alert">
                {erro}
              </p>
            )}
            {existente && (
              <button
                type="button"
                className="cadastrar-evento-excluir"
                onClick={excluir}
              >
                Excluir evento
              </button>
            )}
          </div>

          <div className="cadastrar-evento-acoes">
            <button
              type="button"
              className="cadastrar-evento-cancelar"
              onClick={voltar}
            >
              Cancelar
            </button>
            <button type="submit" className="cadastrar-evento-salvar">
              Salvar
            </button>
          </div>
        </footer>
      </form>
    </main>
  );
}

export default CadastrarEvento;
