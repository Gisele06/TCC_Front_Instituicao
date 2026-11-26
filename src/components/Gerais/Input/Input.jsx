import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatarTelefone } from "../../../js/Gerais/formatarTelefone.js";
import iconeCadeado from "../../../img/icones/cadeado.png";
import iconeCarta from "../../../img/icones/carta.png";
import iconeCidade from "../../../img/icones/cidade.png";
import iconeEstado from "../../../img/icones/estado.png";
import iconeSetaBaixo from "../../../img/icones/setaBaixoFormulario.png";
import iconeFormacao from "../../../img/icones/formacao.png";
import iconeInstituicao from "../../../img/icones/instituicao.png";
import iconeOlho from "../../../img/icones/olho.png";
import iconePessoa from "../../../img/icones/pessoa.png";
import iconeTelefone from "../../../img/icones/telefone.png";
import Icone from "../Icone/Icone.jsx";
import "./Input.css";

const CURVA_SUAVE = [0.22, 1, 0.36, 1];

const MESES_PT = [
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

const MESES_CURTOS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const HORAS_LISTA = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const MINUTOS_LISTA = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const imagensDosIcones = {
  pessoa: iconePessoa,
  instituicao: iconeInstituicao,
  formacao: iconeFormacao,
  telefone: iconeTelefone,
  email: iconeCarta,
  estado: iconeEstado,
  cidade: iconeCidade,
  cadeado: iconeCadeado,
  olho: iconeOlho,
  seta: iconeSetaBaixo,
};

const tiposNativos = {
  texto: "text",
  senha: "password",
  numero: "number",
  marcacao: "checkbox",
  pesquisa: "search",
  telefone: "tel",
  data: "date",
  horario: "time",
  arquivo: "file",
};

function extrairTextoNode(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extrairTextoNode).join("");
  if (isValidElement(node)) return extrairTextoNode(node.props?.children);
  return "";
}

function extrairOpcoes(children, grupo = "") {
  const lista = [];
  Children.forEach(children, (filho) => {
    if (!isValidElement(filho)) return;
    if (filho.type === "optgroup") {
      lista.push(
        ...extrairOpcoes(filho.props.children, filho.props.label || ""),
      );
      return;
    }
    if (filho.type === "option") {
      const rotulo = extrairTextoNode(filho.props.children).trim();
      const valorOpcao =
        filho.props.value !== undefined ? String(filho.props.value) : rotulo;
      lista.push({
        valor: valorOpcao,
        rotulo: rotulo || valorOpcao,
        desabilitada: Boolean(filho.props.disabled),
        grupo,
      });
    }
  });
  return lista;
}

function normalizarListaMultipla(val) {
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof val === "string" && val.trim()) {
    return val
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function formatarDataISO(ano, mesZeroBased, dia) {
  return `${ano}-${String(mesZeroBased + 1).padStart(2, "0")}-${String(
    dia,
  ).padStart(2, "0")}`;
}

function parseDataISO(str) {
  if (!str || typeof str !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str.trim());
  if (!match) return null;
  const ano = Number(match[1]);
  const mes = Number(match[2]) - 1;
  const dia = Number(match[3]);
  const data = new Date(ano, mes, dia);
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes ||
    data.getDate() !== dia
  ) {
    return null;
  }
  return data;
}

function formatarDataExibicao(str) {
  const data = parseDataISO(str);
  if (!data) return "";
  return `${String(data.getDate()).padStart(2, "0")}/${String(
    data.getMonth() + 1,
  ).padStart(2, "0")}/${data.getFullYear()}`;
}

function montarGradeDias(ano, mes) {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasMesAnterior = new Date(ano, mes, 0).getDate();
  const celulas = [];

  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    const dia = diasMesAnterior - i;
    const dataObj = new Date(ano, mes - 1, dia);
    celulas.push({
      iso: formatarDataISO(
        dataObj.getFullYear(),
        dataObj.getMonth(),
        dataObj.getDate(),
      ),
      dia,
      mesAtual: false,
    });
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    celulas.push({
      iso: formatarDataISO(ano, mes, dia),
      dia,
      mesAtual: true,
    });
  }

  const restante = 42 - celulas.length;
  for (let dia = 1; dia <= restante; dia++) {
    const dataObj = new Date(ano, mes + 1, dia);
    celulas.push({
      iso: formatarDataISO(
        dataObj.getFullYear(),
        dataObj.getMonth(),
        dataObj.getDate(),
      ),
      dia,
      mesAtual: false,
    });
  }

  return celulas;
}

function semAcento(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function IconeCheck() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconeCalendarioSvg() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconeRelogioSvg() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

function PopoverFlutuante({
  aberto,
  ancoraRef,
  aoFechar,
  larguraFixa,
  alturaEstimada = 270,
  classeExtra = "",
  children,
}) {
  const popoverRef = useRef(null);
  const [posicao, definirPosicao] = useState(null);

  const atualizarPosicao = useCallback(() => {
    const el = ancoraRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margem = 10;
    const largura = larguraFixa || Math.max(rect.width, 190);
    const espacoAbaixo = window.innerHeight - rect.bottom - margem;
    const espacoAcima = rect.top - margem;
    const abrirAcima =
      espacoAbaixo < alturaEstimada && espacoAcima > espacoAbaixo;

    let left = rect.left;
    if (left + largura > window.innerWidth - margem) {
      left = Math.max(margem, window.innerWidth - largura - margem);
    }
    if (left < margem) left = margem;

    definirPosicao({
      left,
      width: largura,
      abrirAcima,
      top: abrirAcima ? undefined : rect.bottom + 6,
      bottom: abrirAcima ? window.innerHeight - rect.top + 6 : undefined,
    });
  }, [ancoraRef, larguraFixa, alturaEstimada]);

  useEffect(() => {
    if (!aberto) return;
    atualizarPosicao();

    const aoClicarFora = (evento) => {
      if (
        popoverRef.current?.contains(evento.target) ||
        ancoraRef.current?.contains(evento.target)
      ) {
        return;
      }
      aoFechar();
    };

    const aoTeclar = (evento) => {
      if (evento.key === "Escape") {
        evento.stopPropagation();
        aoFechar();
      }
    };

    const aoRolarOuRedimensionar = (evento) => {
      if (
        evento.type === "scroll" &&
        popoverRef.current?.contains(evento.target)
      ) {
        return;
      }
      atualizarPosicao();
    };

    document.addEventListener("mousedown", aoClicarFora);
    window.addEventListener("keydown", aoTeclar);
    window.addEventListener("resize", aoRolarOuRedimensionar);
    window.addEventListener("scroll", aoRolarOuRedimensionar, true);

    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      window.removeEventListener("keydown", aoTeclar);
      window.removeEventListener("resize", aoRolarOuRedimensionar);
      window.removeEventListener("scroll", aoRolarOuRedimensionar, true);
    };
  }, [aberto, ancoraRef, aoFechar, atualizarPosicao]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {aberto && posicao && (
        <motion.div
          ref={popoverRef}
          className={`bloom-popover ${classeExtra}`.trim()}
          style={{
            left: `${posicao.left}px`,
            width: `${posicao.width}px`,
            top: posicao.top !== undefined ? `${posicao.top}px` : undefined,
            bottom:
              posicao.bottom !== undefined ? `${posicao.bottom}px` : undefined,
          }}
          initial={{ opacity: 0, y: posicao.abrirAcima ? 6 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: posicao.abrirAcima ? 4 : -4 }}
          transition={{ duration: 0.16, ease: CURVA_SUAVE }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Input({
  tipo = "texto",
  classeName,
  nome,
  valor,
  valorInicial,
  aoAlterar,
  aoPerderFoco,
  aoPressionarTecla,
  aoReceberFoco,
  obrigatorio,
  desabilitado,
  somenteLeitura,
  marcado,
  marcadoInicial,
  minimo,
  maximo,
  comprimentoMinimo,
  comprimentoMaximo,
  linhas,
  autocompletar,
  multiplo,
  aceitar,
  aoClicar,
  titulo,
  passo,
  padrao,
  placeholder,
  icone,
  iconeEsquerda,
  tamanhoDoIcone = "clamp(14px, 1.6vw, 18px)",
  children,
  rotulo,
  imagemAcesso,
  classeCampo = "",
  rodape,
  ...atributos
}) {
  const [mostrarSenha, definirMostrarSenha] = useState(false);
  const [popoverAberto, definirPopoverAberto] = useState(false);
  const [buscaOpcao, definirBuscaOpcao] = useState("");
  const [indiceDestaque, definirIndiceDestaque] = useState(-1);

  const ehControlado = valor !== undefined;
  const [valorInterno, definirValorInterno] = useState(
    valorInicial ?? (tipo === "selecao" && multiplo ? [] : ""),
  );
  const valorAtual = ehControlado ? (valor ?? "") : valorInterno;

  const ancoraRef = useRef(null);
  const listaHorasRef = useRef(null);
  const listaMinutosRef = useRef(null);

  const opcoesBrutas = useMemo(
    () => (tipo === "selecao" ? extrairOpcoes(children) : []),
    [tipo, children],
  );

  const placeholderDaOpcao = useMemo(
    () =>
      opcoesBrutas.find((op) => op.valor === "" && op.desabilitada)?.rotulo ||
      "",
    [opcoesBrutas],
  );

  const opcoesSelect = useMemo(
    () => opcoesBrutas.filter((op) => !(op.valor === "" && op.desabilitada)),
    [opcoesBrutas],
  );

  const selecionadosMultiplos = useMemo(
    () =>
      tipo === "selecao" && multiplo ? normalizarListaMultipla(valorAtual) : [],
    [tipo, multiplo, valorAtual],
  );

  const opcoesFiltradas = useMemo(() => {
    if (!buscaOpcao.trim()) return opcoesSelect;
    const termo = semAcento(buscaOpcao.trim());
    return opcoesSelect.filter((op) => semAcento(op.rotulo).includes(termo));
  }, [opcoesSelect, buscaOpcao]);

  const dataSelecionadaObj = useMemo(
    () => (tipo === "data" ? parseDataISO(String(valorAtual)) : null),
    [tipo, valorAtual],
  );

  const hojeObj = useMemo(() => new Date(), []);
  const hojeISO = useMemo(
    () =>
      formatarDataISO(
        hojeObj.getFullYear(),
        hojeObj.getMonth(),
        hojeObj.getDate(),
      ),
    [hojeObj],
  );

  const [mesVisivel, definirMesVisivel] = useState(() => ({
    ano: dataSelecionadaObj?.getFullYear() ?? hojeObj.getFullYear(),
    mes: dataSelecionadaObj?.getMonth() ?? hojeObj.getMonth(),
  }));
  const [modoSeletorData, definirModoSeletorData] = useState("dias");

  const fecharPopover = useCallback(() => {
    definirPopoverAberto(false);
    definirBuscaOpcao("");
    definirModoSeletorData("dias");
    aoPerderFoco?.({
      target: { value: valorAtual, name: nome, id: atributos.id },
    });
  }, [aoPerderFoco, valorAtual, nome, atributos.id]);

  const emitirMudanca = useCallback(
    (novoValor) => {
      if (!ehControlado) {
        definirValorInterno(novoValor);
      }
      const eventoSintetico = {
        target: {
          value: novoValor,
          name: nome,
          id: atributos.id,
        },
        currentTarget: {
          value: novoValor,
          name: nome,
          id: atributos.id,
        },
      };
      aoAlterar?.(eventoSintetico);
    },
    [ehControlado, nome, atributos.id, aoAlterar],
  );

  const alternarOpcaoMultipla = useCallback(
    (valorOpcao) => {
      const jaExiste = selecionadosMultiplos.includes(valorOpcao);
      const proximaLista = jaExiste
        ? selecionadosMultiplos.filter((item) => item !== valorOpcao)
        : [...selecionadosMultiplos, valorOpcao];

      const deveEmitirArray = ehControlado
        ? Array.isArray(valor)
        : Array.isArray(valorInicial);

      emitirMudanca(deveEmitirArray ? proximaLista : proximaLista.join(", "));
    },
    [selecionadosMultiplos, ehControlado, valor, valorInicial, emitirMudanca],
  );

  const abrirOuAlternarPopover = () => {
    if (desabilitado || somenteLeitura) return;
    if (popoverAberto) {
      fecharPopover();
      return;
    }

    if (tipo === "data") {
      const refData = dataSelecionadaObj || new Date();
      definirMesVisivel({ ano: refData.getFullYear(), mes: refData.getMonth() });
      definirModoSeletorData("dias");
    }

    if (tipo === "selecao") {
      const idx = multiplo
        ? 0
        : opcoesSelect.findIndex(
            (op) => String(op.valor) === String(valorAtual),
          );
      definirIndiceDestaque(idx >= 0 ? idx : 0);
    }

    aoReceberFoco?.({
      target: { value: valorAtual, name: nome, id: atributos.id },
    });
    definirPopoverAberto(true);
  };

  useEffect(() => {
    if (!popoverAberto || tipo !== "horario") return;
    const [horaAtual = "08", minutoAtual = "00"] = String(
      valorAtual || "08:00",
    ).split(":");

    requestAnimationFrame(() => {
      listaHorasRef.current
        ?.querySelector(`[data-valor="${horaAtual}"]`)
        ?.scrollIntoView({ block: "center" });
      listaMinutosRef.current
        ?.querySelector(`[data-valor="${minutoAtual}"]`)
        ?.scrollIntoView({ block: "center" });
    });
  }, [popoverAberto, tipo, valorAtual]);

  const propriedades = {
    ...atributos,
    className:
      tipo === "senha" && mostrarSenha
        ? `${classeName || ""} acesso-senha-visivel`.trim()
        : classeName,
    name: nome,
    value: valor,
    defaultValue: valorInicial,
    onChange:
      tipo === "telefone"
        ? (evento) => {
            evento.target.value = formatarTelefone(evento.target.value);
            aoAlterar?.(evento);
          }
        : aoAlterar,
    onBlur: aoPerderFoco,
    onKeyDown: aoPressionarTecla,
    onFocus: aoReceberFoco,
    required: obrigatorio,
    disabled: desabilitado,
    readOnly: somenteLeitura,
    autoComplete: autocompletar,
    onClick: aoClicar,
    title: titulo,
  };

  if (tipo === "busca") {
    return (
      <label className={`bloom-busca ${classeName || ""}`}>
        <Icone icone={icone} rotulo="busca" tamanho={tamanhoDoIcone} />
        <input
          type="text"
          value={valor}
          placeholder={placeholder}
          readOnly={somenteLeitura ?? !aoAlterar}
          onChange={aoAlterar}
        />
      </label>
    );
  }

  const usaPopoverCustomizado =
    tipo === "selecao" || tipo === "data" || tipo === "horario";

  if (usaPopoverCustomizado) {
    let textoExibido = "";
    let ehPlaceholder = false;

    if (tipo === "selecao" && multiplo) {
      if (selecionadosMultiplos.length > 0) {
        textoExibido = selecionadosMultiplos
          .map(
            (val) =>
              opcoesSelect.find((op) => op.valor === val)?.rotulo || val,
          )
          .join(", ");
      } else {
        textoExibido =
          placeholder || placeholderDaOpcao || "Selecione uma ou mais opções";
        ehPlaceholder = true;
      }
    } else if (tipo === "selecao") {
      const selecionada = opcoesSelect.find(
        (op) => String(op.valor) === String(valorAtual),
      );
      if (selecionada) {
        textoExibido = selecionada.rotulo;
      } else {
        textoExibido =
          placeholder || placeholderDaOpcao || "Selecione uma opção";
        ehPlaceholder = true;
      }
    } else if (tipo === "data") {
      const formatada = formatarDataExibicao(String(valorAtual));
      if (formatada) {
        textoExibido = formatada;
      } else {
        textoExibido = placeholder || "dd/mm/aaaa";
        ehPlaceholder = true;
      }
    } else if (tipo === "horario") {
      if (valorAtual) {
        textoExibido = String(valorAtual).slice(0, 5);
      } else {
        textoExibido = placeholder || "--:--";
        ehPlaceholder = true;
      }
    }

    const valorOculto =
      tipo === "selecao" && multiplo
        ? selecionadosMultiplos.join(", ")
        : String(valorAtual);

    const lidarTecladoGatilho = (evento) => {
      aoPressionarTecla?.(evento);
      if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
        evento.preventDefault();
        if (!popoverAberto) {
          abrirOuAlternarPopover();
          return;
        }
        if (tipo === "selecao" && opcoesFiltradas.length > 0) {
          definirIndiceDestaque((prev) => {
            const delta = evento.key === "ArrowDown" ? 1 : -1;
            return (
              (prev + delta + opcoesFiltradas.length) % opcoesFiltradas.length
            );
          });
        }
      } else if (evento.key === "Enter" || evento.key === " ") {
        if (popoverAberto && tipo === "selecao" && indiceDestaque >= 0) {
          evento.preventDefault();
          const alvo = opcoesFiltradas[indiceDestaque];
          if (alvo && !alvo.desabilitada) {
            if (multiplo) {
              alternarOpcaoMultipla(alvo.valor);
            } else {
              emitirMudanca(alvo.valor);
              fecharPopover();
            }
          }
        }
      }
    };

    const renderConteudoPopover = () => {
      if (tipo === "selecao") {
        const mostrarBusca = opcoesSelect.length > 6;
        return (
          <div
            className="bloom-popover-selecao"
            role="listbox"
            aria-multiselectable={multiplo ? "true" : undefined}
            aria-label={rotulo || placeholder || "Opções"}
          >
            {mostrarBusca && (
              <div className="bloom-popover-busca-wrap">
                <input
                  type="text"
                  className="bloom-popover-busca"
                  placeholder="Filtrar opções..."
                  value={buscaOpcao}
                  onChange={(e) => {
                    definirBuscaOpcao(e.target.value);
                    definirIndiceDestaque(0);
                  }}
                  autoFocus
                />
              </div>
            )}

            <div className="bloom-popover-lista">
              {opcoesFiltradas.length === 0 ? (
                <p className="bloom-popover-vazio">Nenhuma opção encontrada.</p>
              ) : (
                opcoesFiltradas.map((opcao, idx) => {
                  const selecionada = multiplo
                    ? selecionadosMultiplos.includes(opcao.valor)
                    : String(opcao.valor) === String(valorAtual);
                  const destacada = idx === indiceDestaque;

                  return (
                    <button
                      key={`${opcao.grupo}-${opcao.valor}-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={selecionada}
                      disabled={opcao.desabilitada}
                      className={`bloom-popover-opcao ${
                        selecionada ? "bloom-popover-opcao--selecionada" : ""
                      } ${destacada ? "bloom-popover-opcao--destaque" : ""}`}
                      onMouseEnter={() => definirIndiceDestaque(idx)}
                      onClick={() => {
                        if (opcao.desabilitada) return;
                        if (multiplo) {
                          alternarOpcaoMultipla(opcao.valor);
                        } else {
                          emitirMudanca(opcao.valor);
                          fecharPopover();
                        }
                      }}
                    >
                      {multiplo && (
                        <span
                          className={`bloom-popover-checkbox${
                            selecionada
                              ? " bloom-popover-checkbox--marcado"
                              : ""
                          }`}
                          aria-hidden="true"
                        >
                          {selecionada && <IconeCheck />}
                        </span>
                      )}
                      <span className="bloom-popover-opcao-texto">
                        {opcao.rotulo}
                      </span>
                      {!multiplo && selecionada && (
                        <span className="bloom-popover-opcao-check">
                          <IconeCheck />
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {multiplo && (
              <div className="bloom-popover-rodape bloom-popover-rodape--multi">
                <button
                  type="button"
                  className="bloom-popover-acao-suave"
                  disabled={selecionadosMultiplos.length === 0}
                  onClick={() => {
                    const deveEmitirArray = ehControlado
                      ? Array.isArray(valor)
                      : Array.isArray(valorInicial);
                    emitirMudanca(deveEmitirArray ? [] : "");
                  }}
                >
                  Limpar
                </button>
                <button
                  type="button"
                  className="bloom-popover-acao-principal"
                  onClick={fecharPopover}
                >
                  Concluir
                </button>
              </div>
            )}
          </div>
        );
      }

      if (tipo === "data") {
        const celulas = montarGradeDias(mesVisivel.ano, mesVisivel.mes);
        const minISO = typeof minimo === "string" ? minimo : "";
        const maxISO = typeof maximo === "string" ? maximo : "";

        const mudarMes = (delta) => {
          definirMesVisivel((prev) => {
            const d = new Date(prev.ano, prev.mes + delta, 1);
            return { ano: d.getFullYear(), mes: d.getMonth() };
          });
        };

        return (
          <div
            className="bloom-popover-data"
            role="dialog"
            aria-label="Selecionar data"
          >
            <div className="bloom-cal-cabecalho">
              <button
                type="button"
                className="bloom-cal-nav"
                aria-label={
                  modoSeletorData === "meses" ? "Ano anterior" : "Mês anterior"
                }
                onClick={() =>
                  modoSeletorData === "meses"
                    ? definirMesVisivel((p) => ({ ...p, ano: p.ano - 1 }))
                    : mudarMes(-1)
                }
              >
                ‹
              </button>

              <button
                type="button"
                className="bloom-cal-titulo"
                onClick={() =>
                  definirModoSeletorData((m) =>
                    m === "dias" ? "meses" : "dias",
                  )
                }
              >
                {modoSeletorData === "dias"
                  ? `${MESES_PT[mesVisivel.mes]} ${mesVisivel.ano}`
                  : `${mesVisivel.ano}`}
              </button>

              <button
                type="button"
                className="bloom-cal-nav"
                aria-label={
                  modoSeletorData === "meses" ? "Próximo ano" : "Próximo mês"
                }
                onClick={() =>
                  modoSeletorData === "meses"
                    ? definirMesVisivel((p) => ({ ...p, ano: p.ano + 1 }))
                    : mudarMes(1)
                }
              >
                ›
              </button>
            </div>

            {modoSeletorData === "meses" ? (
              <div className="bloom-cal-meses-grid">
                {MESES_CURTOS.map((nomeMes, idxMes) => (
                  <button
                    key={nomeMes}
                    type="button"
                    className={`bloom-cal-mes-btn ${
                      idxMes === mesVisivel.mes ? "bloom-cal-mes-btn--ativo" : ""
                    }`}
                    onClick={() => {
                      definirMesVisivel((p) => ({ ...p, mes: idxMes }));
                      definirModoSeletorData("dias");
                    }}
                  >
                    {nomeMes}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="bloom-cal-semana">
                  {DIAS_SEMANA.map((diaNome) => (
                    <span key={diaNome}>{diaNome}</span>
                  ))}
                </div>

                <div className="bloom-cal-dias">
                  {celulas.map((celula) => {
                    const selecionada = String(valorAtual) === celula.iso;
                    const ehHoje = celula.iso === hojeISO;
                    const foraLimite =
                      (minISO && celula.iso < minISO) ||
                      (maxISO && celula.iso > maxISO);

                    return (
                      <button
                        key={celula.iso}
                        type="button"
                        disabled={Boolean(foraLimite)}
                        className={`bloom-cal-dia ${
                          !celula.mesAtual ? "bloom-cal-dia--fora" : ""
                        } ${ehHoje ? "bloom-cal-dia--hoje" : ""} ${
                          selecionada ? "bloom-cal-dia--selecionado" : ""
                        }`}
                        onClick={() => {
                          emitirMudanca(celula.iso);
                          fecharPopover();
                        }}
                      >
                        {celula.dia}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div className="bloom-popover-rodape">
              <button
                type="button"
                className="bloom-popover-acao-texto"
                onClick={() => {
                  emitirMudanca(hojeISO);
                  fecharPopover();
                }}
              >
                Hoje
              </button>

              {!obrigatorio && valorAtual && (
                <button
                  type="button"
                  className="bloom-popover-acao-suave"
                  onClick={() => {
                    emitirMudanca("");
                    fecharPopover();
                  }}
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        );
      }

      const [horaSel = "08", minutoSel = "00"] = String(
        valorAtual || "08:00",
      ).split(":");

      const selecionarHora = (h) => {
        emitirMudanca(`${h}:${minutoSel}`);
      };

      const selecionarMinuto = (m) => {
        emitirMudanca(`${horaSel}:${m}`);
      };

      return (
        <div
          className="bloom-popover-horario"
          role="dialog"
          aria-label="Selecionar horário"
        >
          <div className="bloom-hora-visor">
            <span>{horaSel}</span>
            <span className="bloom-hora-dois-pontos">:</span>
            <span>{minutoSel}</span>
          </div>

          <div className="bloom-hora-colunas">
            <div className="bloom-hora-coluna">
              <span className="bloom-hora-coluna-titulo">Horas</span>
              <div className="bloom-hora-lista" ref={listaHorasRef}>
                {HORAS_LISTA.map((h) => (
                  <button
                    key={h}
                    type="button"
                    data-valor={h}
                    className={`bloom-hora-item ${
                      h === horaSel ? "bloom-hora-item--selecionado" : ""
                    }`}
                    onClick={() => selecionarHora(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="bloom-hora-coluna">
              <span className="bloom-hora-coluna-titulo">Minutos</span>
              <div className="bloom-hora-lista" ref={listaMinutosRef}>
                {MINUTOS_LISTA.map((m) => (
                  <button
                    key={m}
                    type="button"
                    data-valor={m}
                    className={`bloom-hora-item ${
                      m === minutoSel ? "bloom-hora-item--selecionado" : ""
                    }`}
                    onClick={() => selecionarMinuto(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bloom-popover-rodape">
            <button
              type="button"
              className="bloom-popover-acao-texto"
              onClick={() => {
                const agora = new Date();
                const horaAgora = `${String(agora.getHours()).padStart(
                  2,
                  "0",
                )}:${String(agora.getMinutes()).padStart(2, "0")}`;
                emitirMudanca(horaAgora);
                fecharPopover();
              }}
            >
              Agora
            </button>

            <button
              type="button"
              className="bloom-popover-acao-principal"
              onClick={fecharPopover}
            >
              Concluir
            </button>
          </div>
        </div>
      );
    };

    const iconeDireita =
      tipo === "selecao" ? (
        <img
          className={`acesso-icone-seta bloom-popover-seta ${
            popoverAberto ? "bloom-popover-seta--aberta" : ""
          }`}
          src={iconeSetaBaixo}
          alt=""
        />
      ) : iconeEsquerda ? null : tipo === "data" ? (
        <span className="bloom-icone-direita-svg">
          <IconeCalendarioSvg />
        </span>
      ) : (
        <span className="bloom-icone-direita-svg">
          <IconeRelogioSvg />
        </span>
      );

    const gatilhoInterno = (
      <>
        <input
          type="text"
          className="bloom-input-oculto-validacao"
          tabIndex={-1}
          aria-hidden="true"
          name={nome}
          value={valorOculto}
          required={obrigatorio}
          disabled={desabilitado}
          onChange={() => {}}
        />
        {!imagemAcesso && iconeEsquerda && (
          <span className="bloom-icone-esquerda-wrap" aria-hidden="true">
            {iconeEsquerda}
          </span>
        )}
        <button
          id={atributos.id}
          type="button"
          className={`acesso-entrada-gatilho ${
            ehPlaceholder ? "acesso-entrada-gatilho--placeholder" : ""
          } ${classeName || ""}`.trim()}
          disabled={desabilitado}
          title={titulo || (!ehPlaceholder ? textoExibido : undefined)}
          aria-haspopup={tipo === "selecao" ? "listbox" : "dialog"}
          aria-expanded={popoverAberto}
          onClick={(e) => {
            aoClicar?.(e);
            abrirOuAlternarPopover();
          }}
          onKeyDown={lidarTecladoGatilho}
        >
          <span className="acesso-entrada-gatilho-texto">{textoExibido}</span>
        </button>
        {iconeDireita}
      </>
    );

    const popoverPortal = (
      <PopoverFlutuante
        aberto={popoverAberto}
        ancoraRef={ancoraRef}
        aoFechar={fecharPopover}
        larguraFixa={
          tipo === "data" ? 304 : tipo === "horario" ? 248 : undefined
        }
        alturaEstimada={tipo === "data" ? 330 : tipo === "horario" ? 290 : 260}
        classeExtra={`bloom-popover--${tipo}`}
      >
        {renderConteudoPopover()}
      </PopoverFlutuante>
    );

    if (imagemAcesso) {
      return (
        <div className={`acesso-campo ${classeCampo}`.trim()}>
          <label className="acesso-campo-rotulo" htmlFor={atributos.id}>
            {rotulo}
          </label>
          <span
            ref={ancoraRef}
            className={`acesso-entrada-area ${
              popoverAberto ? "acesso-entrada-area--aberta" : ""
            }`}
          >
            <img
              className="acesso-entrada-icone"
              src={imagensDosIcones[imagemAcesso]}
              alt=""
            />
            {gatilhoInterno}
          </span>
          {rodape}
          {popoverPortal}
        </div>
      );
    }

    return (
      <>
        <span
          ref={ancoraRef}
          className={`bloom-campo-popover ${
            popoverAberto ? "bloom-campo-popover--aberto" : ""
          } ${
            iconeEsquerda ? "bloom-campo-popover--com-icone-esq" : ""
          } ${
            !iconeDireita ? "bloom-campo-popover--sem-icone-dir" : ""
          } ${classeCampo}`.trim()}
        >
          {gatilhoInterno}
        </span>
        {popoverPortal}
      </>
    );
  }

  let campo;
  if (tipo === "textoLongo") {
    campo = (
      <textarea
        {...propriedades}
        rows={linhas}
        placeholder={placeholder}
        minLength={comprimentoMinimo}
        maxLength={comprimentoMaximo}
      />
    );
  } else {
    campo = (
      <input
        {...propriedades}
        type={
          tipo === "senha" && mostrarSenha
            ? "text"
            : tiposNativos[tipo] || tipo
        }
        placeholder={placeholder}
        checked={marcado}
        defaultChecked={marcadoInicial}
        min={minimo}
        max={maximo}
        minLength={comprimentoMinimo}
        maxLength={comprimentoMaximo}
        multiple={multiplo}
        accept={aceitar}
        step={passo}
        pattern={padrao}
      />
    );
  }

  if (imagemAcesso) {
    return (
      <div className={`acesso-campo ${classeCampo}`.trim()}>
        <label className="acesso-campo-rotulo" htmlFor={atributos.id}>
          {rotulo}
        </label>
        <span className="acesso-entrada-area">
          <img
            className="acesso-entrada-icone"
            src={imagensDosIcones[imagemAcesso]}
            alt=""
          />
          {campo}
          {tipo === "senha" && (
            <button
              type="button"
              className="acesso-senha-alternancia"
              aria-label={`${mostrarSenha ? "Ocultar" : "Mostrar"} ${
                rotulo === "Confirmar senha" ? "confirmação da senha" : "senha"
              }`}
              aria-pressed={mostrarSenha}
              onClick={() => definirMostrarSenha((visivel) => !visivel)}
            >
              <span className="acesso-senha-olho-wrap">
                <img src={iconeOlho} alt="" />
                <svg
                  className="acesso-senha-risco"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <motion.line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    stroke="var(--acesso-input-bg, #f3f2ea)"
                    strokeWidth="4.4"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                      pathLength: mostrarSenha ? 1 : 0,
                      opacity: mostrarSenha ? 1 : 0,
                    }}
                    transition={{
                      pathLength: { duration: 0.24, ease: CURVA_SUAVE },
                      opacity: { duration: 0.14 },
                    }}
                  />
                  <motion.line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    stroke="#526460"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                      pathLength: mostrarSenha ? 1 : 0,
                      opacity: mostrarSenha ? 1 : 0,
                    }}
                    transition={{
                      pathLength: { duration: 0.24, ease: CURVA_SUAVE },
                      opacity: { duration: 0.14 },
                    }}
                  />
                </svg>
              </span>
            </button>
          )}
        </span>
        {rodape}
      </div>
    );
  }

  return campo;
}

export default Input;