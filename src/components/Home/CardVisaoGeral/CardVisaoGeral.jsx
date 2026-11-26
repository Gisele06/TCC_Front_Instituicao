import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TituloDoPainel from "../TituloDoPainel/TituloDoPainel.jsx";
import iconeBarras from "../../../img/icones/barras.png";
import "./CardVisaoGeral.css";

const SERIES_CONFIG = [
  {
    chave: "bemEstar",
    rotulo: "Bem estar",
    cor: "#4d9f85",
    gradienteId: "vg-area-verde",
    opacidadeTopo: 0.25,
    sufixo: "%",
  },
  {
    chave: "participacao",
    rotulo: "Participação",
    cor: "#2e73b0",
    gradienteId: "vg-area-azul",
    opacidadeTopo: 0.22,
    sufixo: "%",
  },
  {
    chave: "atencao",
    rotulo: "Turmas em atenção",
    cor: "#9a78c4",
    gradienteId: "vg-area-roxa",
    opacidadeTopo: 0.22,
    sufixo: "%",
  },
];

const PERIODOS = [
  { id: "7d", rotulo: "Últimos 7 dias" },
  { id: "30d", rotulo: "Últimos 30 dias" },
  { id: "90d", rotulo: "Últimos 90 dias" },
];

const DADOS_POR_PERIODO = {
  "7d": [
    { data: "21/07", bemEstar: 68, participacao: 84, atencao: 36 },
    { data: "22/07", bemEstar: 70, participacao: 86, atencao: 34 },
    { data: "23/07", bemEstar: 69, participacao: 88, atencao: 38 },
    { data: "24/07", bemEstar: 72, participacao: 87, atencao: 35 },
    { data: "25/07", bemEstar: 71, participacao: 90, atencao: 39 },
    { data: "26/07", bemEstar: 73, participacao: 89, atencao: 41 },
    { data: "27/07", bemEstar: 75, participacao: 91, atencao: 42 },
  ],
  "30d": [
    { data: "15/06", bemEstar: 33, participacao: 55, atencao: 18 },
    { data: "22/06", bemEstar: 46, participacao: 68, atencao: 27 },
    { data: "29/06", bemEstar: 58, participacao: 77, atencao: 22 },
    { data: "06/07", bemEstar: 74, participacao: 60, atencao: 44 },
    { data: "13/07", bemEstar: 72, participacao: 65, atencao: 29 },
    { data: "20/07", bemEstar: 67, participacao: 91, atencao: 39 },
    { data: "27/07", bemEstar: 75, participacao: 90, atencao: 43 },
  ],
  "90d": [
    { data: "01/05", bemEstar: 42, participacao: 58, atencao: 31 },
    { data: "15/05", bemEstar: 49, participacao: 64, atencao: 28 },
    { data: "01/06", bemEstar: 54, participacao: 70, atencao: 25 },
    { data: "15/06", bemEstar: 61, participacao: 74, atencao: 30 },
    { data: "01/07", bemEstar: 69, participacao: 79, atencao: 35 },
    { data: "15/07", bemEstar: 72, participacao: 86, atencao: 38 },
    { data: "27/07", bemEstar: 75, participacao: 90, atencao: 43 },
  ],
};

const MARCAS_Y = [100, 75, 50, 25, 0];

/**
 * Gera uma curva cúbica monótona (Fritsch-Carlson) suave sem ultrapassar [0, 100].
 */
function gerarCaminhoMonotono(pontos) {
  const n = pontos.length;
  if (n === 0) return "";
  if (n === 1) return `M ${pontos[0].x} ${pontos[0].y}`;
  if (n === 2) {
    return `M ${pontos[0].x} ${pontos[0].y} L ${pontos[1].x} ${pontos[1].y}`;
  }

  const dx = [];
  const dy = [];
  const inclinacoes = [];

  for (let i = 0; i < n - 1; i++) {
    dx[i] = pontos[i + 1].x - pontos[i].x;
    dy[i] = pontos[i + 1].y - pontos[i].y;
    inclinacoes[i] = dx[i] === 0 ? 0 : dy[i] / dx[i];
  }

  const tangentes = new Array(n);
  tangentes[0] = inclinacoes[0];
  tangentes[n - 1] = inclinacoes[n - 2];

  for (let i = 1; i < n - 1; i++) {
    if (inclinacoes[i - 1] * inclinacoes[i] <= 0) {
      tangentes[i] = 0;
    } else {
      tangentes[i] = (inclinacoes[i - 1] + inclinacoes[i]) / 2;
    }
  }

  for (let i = 0; i < n - 1; i++) {
    if (inclinacoes[i] === 0) {
      tangentes[i] = 0;
      tangentes[i + 1] = 0;
    } else {
      const a = tangentes[i] / inclinacoes[i];
      const b = tangentes[i + 1] / inclinacoes[i];
      const soma = a * a + b * b;
      if (soma > 9) {
        const fator = 3 / Math.sqrt(soma);
        tangentes[i] = fator * a * inclinacoes[i];
        tangentes[i + 1] = fator * b * inclinacoes[i];
      }
    }
  }

  let caminho = `M ${pontos[0].x.toFixed(2)} ${pontos[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const passo = dx[i] / 3;
    const cp1x = pontos[i].x + passo;
    const cp1y = pontos[i].y + tangentes[i] * passo;
    const cp2x = pontos[i + 1].x - passo;
    const cp2y = pontos[i + 1].y - tangentes[i + 1] * passo;

    caminho += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${pontos[i + 1].x.toFixed(2)} ${pontos[i + 1].y.toFixed(2)}`;
  }

  return caminho;
}

function CardVisaoGeral({ dadosPorPeriodo = DADOS_POR_PERIODO }) {
  const [periodo, definirPeriodo] = useState("30d");
  const [menuPeriodoAberto, definirMenuPeriodoAberto] = useState(false);
  const [indiceHover, definirIndiceHover] = useState(null);
  const [seriesAtivas, definirSeriesAtivas] = useState({
    bemEstar: true,
    participacao: true,
    atencao: true,
  });
  const [dimensoes, definirDimensoes] = useState({ largura: 0, altura: 0 });

  const areaRef = useRef(null);
  const periodoRef = useRef(null);

  const dados = dadosPorPeriodo[periodo] || [];
  const periodoAtual =
    PERIODOS.find((item) => item.id === periodo) || PERIODOS[1];

  useEffect(() => {
    const elemento = areaRef.current;
    if (!elemento) return;

    const observador = new ResizeObserver((entradas) => {
      const retangulo = entradas[0]?.contentRect;
      if (!retangulo) return;
      definirDimensoes({
        largura: Math.round(retangulo.width),
        altura: Math.round(retangulo.height),
      });
    });

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!menuPeriodoAberto) return;

    function aoClicarFora(evento) {
      if (!periodoRef.current?.contains(evento.target)) {
        definirMenuPeriodoAberto(false);
      }
    }

    function aoPressionarEsc(evento) {
      if (evento.key === "Escape") definirMenuPeriodoAberto(false);
    }

    document.addEventListener("mousedown", aoClicarFora);
    window.addEventListener("keydown", aoPressionarEsc);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      window.removeEventListener("keydown", aoPressionarEsc);
    };
  }, [menuPeriodoAberto]);

  function alternarSerie(chave) {
    definirSeriesAtivas((atual) => {
      const totalAtivas = Object.values(atual).filter(Boolean).length;
      if (atual[chave] && totalAtivas === 1) return atual;
      return { ...atual, [chave]: !atual[chave] };
    });
  }

  const margem = { topo: 10, direita: 10, baixo: 28, esquerda: 38 };
  const larguraPlot = Math.max(0, dimensoes.largura - margem.esquerda - margem.direita);
  const alturaPlot = Math.max(0, dimensoes.altura - margem.topo - margem.baixo);

  const geometria = useMemo(() => {
    if (!dados.length || larguraPlot <= 0 || alturaPlot <= 0) {
      return { pontosX: [], curvas: [] };
    }

    const passoX = dados.length > 1 ? larguraPlot / (dados.length - 1) : 0;
    const pontosX = dados.map((_, i) => margem.esquerda + i * passoX);

    const converterY = (valor) =>
      margem.topo + alturaPlot - (Math.max(0, Math.min(100, valor)) / 100) * alturaPlot;

    const baseY = margem.topo + alturaPlot;

    const curvas = SERIES_CONFIG.map((serie) => {
      const pontos = dados.map((item, i) => ({
        x: pontosX[i],
        y: converterY(item[serie.chave]),
        valor: item[serie.chave],
        data: item.data,
      }));

      const caminhoLinha = gerarCaminhoMonotono(pontos);
      const caminhoArea =
        pontos.length > 1
          ? `${caminhoLinha} L ${pontos[pontos.length - 1].x.toFixed(2)} ${baseY.toFixed(2)} L ${pontos[0].x.toFixed(2)} ${baseY.toFixed(2)} Z`
          : "";

      return { ...serie, pontos, caminhoLinha, caminhoArea };
    });

    return { pontosX, curvas };
  }, [dados, larguraPlot, alturaPlot]);

  function aoMoverMouse(evento) {
    if (!geometria.pontosX.length || !areaRef.current) return;
    const ret = areaRef.current.getBoundingClientRect();
    const mouseX = evento.clientX - ret.left;

    let maisProximo = 0;
    let menorDistancia = Infinity;

    geometria.pontosX.forEach((px, i) => {
      const dist = Math.abs(mouseX - px);
      if (dist < menorDistancia) {
        menorDistancia = dist;
        maisProximo = i;
      }
    });

    definirIndiceHover(maisProximo);
  }

  const itemHover = indiceHover !== null ? dados[indiceHover] : null;
  const xHover = indiceHover !== null ? geometria.pontosX[indiceHover] : null;
  const tooltipNaEsquerda =
    indiceHover !== null && indiceHover >= Math.max(1, dados.length - 2);

  return (
    <div className="inicio-painel inicio-grafico-cartao">
      <div className="inicio-painel-cabecalho">
        <TituloDoPainel icone={iconeBarras} texto="Visão geral" />

        <div className="inicio-grafico-periodo-caixa" ref={periodoRef}>
          <button
            type="button"
            className="inicio-grafico-periodo"
            aria-haspopup="listbox"
            aria-expanded={menuPeriodoAberto}
            onClick={() => definirMenuPeriodoAberto((aberto) => !aberto)}
          >
            <span>{periodoAtual.rotulo}</span>
            <svg
              className={`inicio-grafico-periodo-seta${
                menuPeriodoAberto ? " inicio-grafico-periodo-seta--aberta" : ""
              }`}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.5 6L8 10.5L12.5 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <AnimatePresence>
            {menuPeriodoAberto && (
              <motion.div
                className="inicio-grafico-periodo-menu"
                role="listbox"
                aria-label="Selecionar período do gráfico"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              >
                {PERIODOS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={item.id === periodo}
                    className={`inicio-grafico-periodo-opcao${
                      item.id === periodo
                        ? " inicio-grafico-periodo-opcao--ativa"
                        : ""
                    }`}
                    onClick={() => {
                      definirPeriodo(item.id);
                      definirMenuPeriodoAberto(false);
                      definirIndiceHover(null);
                    }}
                  >
                    {item.rotulo}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!dados.length ? (
        <p className="inicio-grafico-vazio">Sem dados de evolução disponíveis.</p>
      ) : (
        <div
          className="inicio-grafico-area"
          ref={areaRef}
          onMouseMove={aoMoverMouse}
          onMouseLeave={() => definirIndiceHover(null)}
        >
          {dimensoes.largura > 0 && dimensoes.altura > 0 && (
            <svg
              width={dimensoes.largura}
              height={dimensoes.altura}
              viewBox={`0 0 ${dimensoes.largura} ${dimensoes.altura}`}
              className="inicio-grafico-vetor"
              role="img"
              aria-label="Gráfico de evolução: bem-estar, participação e turmas em atenção"
            >
              <defs>
                {SERIES_CONFIG.map((serie) => (
                  <linearGradient
                    key={serie.gradienteId}
                    id={serie.gradienteId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={serie.cor}
                      stopOpacity={serie.opacidadeTopo}
                    />
                    <stop
                      offset="100%"
                      stopColor={serie.cor}
                      stopOpacity="0.02"
                    />
                  </linearGradient>
                ))}
              </defs>

              {/* Fundo suave do quadro do gráfico */}
              <rect
                x={margem.esquerda}
                y={margem.topo}
                width={larguraPlot}
                height={alturaPlot}
                rx="4"
                className="inicio-grafico-fundo-plot"
              />

              {/* Linhas horizontais de grade e rótulos do eixo Y */}
              {MARCAS_Y.map((marca) => {
                const y = margem.topo + alturaPlot - (marca / 100) * alturaPlot;
                return (
                  <g key={marca}>
                    <line
                      x1={margem.esquerda}
                      x2={margem.esquerda + larguraPlot}
                      y1={y}
                      y2={y}
                      className="inicio-grafico-grade"
                    />
                    <text
                      x={margem.esquerda - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="inicio-grafico-eixo-y"
                    >
                      {marca}
                    </text>
                  </g>
                );
              })}

              {/* Áreas e curvas */}
              {geometria.curvas.map((curva) =>
                seriesAtivas[curva.chave] ? (
                  <g key={curva.chave}>
                    <path
                      d={curva.caminhoArea}
                      fill={`url(#${curva.gradienteId})`}
                    />
                    <path
                      d={curva.caminhoLinha}
                      fill="none"
                      stroke={curva.cor}
                      className="inicio-linha"
                    />
                  </g>
                ) : null
              )}

              {/* Linha guia vertical no hover */}
              {xHover !== null && (
                <line
                  x1={xHover}
                  x2={xHover}
                  y1={margem.topo}
                  y2={margem.topo + alturaPlot}
                  className="inicio-grafico-guia"
                />
              )}

              {/* Pontos nas curvas (destaque no hover) */}
              {geometria.curvas.map((curva) =>
                seriesAtivas[curva.chave]
                  ? curva.pontos.map((ponto, idx) => {
                      const ehAtivo = idx === indiceHover;
                      const ehExtremidade =
                        idx === 0 || idx === curva.pontos.length - 1;
                      return (
                        <circle
                          key={`${curva.chave}-${idx}`}
                          cx={ponto.x}
                          cy={ponto.y}
                          r={ehAtivo ? 4.8 : ehExtremidade ? 2.6 : 1.9}
                          fill={curva.cor}
                          stroke={ehAtivo ? "#faf9f2" : "none"}
                          strokeWidth={ehAtivo ? 2.2 : 0}
                          className="inicio-grafico-marcador"
                        />
                      );
                    })
                  : null
              )}

              {/* Rótulos do eixo X */}
              {dados.map((item, i) => (
                <text
                  key={`${periodo}-${item.data}`}
                  x={geometria.pontosX[i]}
                  y={dimensoes.altura - 6}
                  textAnchor={
                    i === 0
                      ? "start"
                      : i === dados.length - 1
                        ? "end"
                        : "middle"
                  }
                  className={`inicio-grafico-eixo-x${
                    i === indiceHover ? " inicio-grafico-eixo-x--ativo" : ""
                  }`}
                >
                  {item.data}
                </text>
              ))}
            </svg>
          )}

          {/* Tooltip flutuante */}
          <AnimatePresence>
            {itemHover && xHover !== null && (
              <motion.div
                className="inicio-grafico-tooltip"
                style={{
                  left: tooltipNaEsquerda
                    ? Math.max(margem.esquerda, xHover - 178)
                    : Math.min(dimensoes.largura - 174, xHover + 14),
                  top: margem.topo + 6,
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inicio-grafico-tooltip-data">
                  {itemHover.data}
                </span>
                <div className="inicio-grafico-tooltip-lista">
                  {SERIES_CONFIG.filter((s) => seriesAtivas[s.chave]).map(
                    (serie) => (
                      <div
                        key={serie.chave}
                        className="inicio-grafico-tooltip-linha"
                      >
                        <span
                          className="inicio-grafico-tooltip-bolinha"
                          style={{ backgroundColor: serie.cor }}
                        />
                        <span className="inicio-grafico-tooltip-nome">
                          {serie.rotulo}
                        </span>
                        <strong className="inicio-grafico-tooltip-valor">
                          {itemHover[serie.chave]}
                          {serie.sufixo}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="inicio-grafico-legenda">
        {SERIES_CONFIG.map((serie) => {
          const ativa = seriesAtivas[serie.chave];
          return (
            <button
              key={serie.chave}
              type="button"
              className={`inicio-grafico-legenda-item${
                ativa ? "" : " inicio-grafico-legenda-item--inativa"
              }`}
              style={{
                color: serie.cor,
                WebkitTextStroke: `0.55px ${serie.cor}`,
              }}
              aria-pressed={ativa}
              onClick={() => alternarSerie(serie.chave)}
            >
              <span
                className="inicio-grafico-ponto"
                style={{ backgroundColor: serie.cor }}
              />
              {serie.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CardVisaoGeral;