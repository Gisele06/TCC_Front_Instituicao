import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { obterResumoGeral } from "../../../js/Rotas_BEM_ESTAR/rotas_BEM_ESTAR.js";
import Abas from "../../Gerais/Abas/Abas.jsx";
import AnelDeProgresso from "../AnelDeProgresso/AnelDeProgresso.jsx";
import Painel from "../Painel/Painel.jsx";
import Selo from "../Selo/Selo.jsx";
import { IconeSetaVariacao } from "../../Gerais/Icone/Icone.jsx";
import { iconesBemEstar } from "../../../js/Rotas_BEM_ESTAR/iconesBemEstar.js";
import "./CardPanoramaGeral.css";

const SERIES_BEM_ESTAR = [
  {
    id: "bem",
    rotulo: "Bem",
    cor: "#299d70",
    gradienteId: "pan-area-bem",
    opacidadeTopo: 0.24,
  },
  {
    id: "atencao",
    rotulo: "Atenção",
    cor: "#f4b41a",
    gradienteId: "pan-area-atencao",
    opacidadeTopo: 0.22,
  },
  {
    id: "regular",
    rotulo: "Regular",
    cor: "#e57116",
    gradienteId: "pan-area-regular",
    opacidadeTopo: 0.22,
  },
  {
    id: "alerta",
    rotulo: "Alerta",
    cor: "#c93820",
    gradienteId: "pan-area-alerta",
    opacidadeTopo: 0.22,
  },
];

const PERIODOS = [
  { id: "7d", rotulo: "Últimos 7 dias" },
  { id: "30d", rotulo: "Últimos 30 dias" },
  { id: "90d", rotulo: "Últimos 90 dias" },
];

const DADOS_POR_PERIODO = {
  "7d": [
    { data: "28/07", bem: 84, atencao: 71, regular: 44, alerta: 22 },
    { data: "29/07", bem: 86, atencao: 72, regular: 46, alerta: 24 },
    { data: "30/07", bem: 88, atencao: 70, regular: 45, alerta: 25 },
    { data: "31/07", bem: 89, atencao: 73, regular: 47, alerta: 26 },
    { data: "01/08", bem: 90, atencao: 74, regular: 46, alerta: 25 },
    { data: "02/08", bem: 88, atencao: 75, regular: 47, alerta: 27 },
    { data: "03/08", bem: 91, atencao: 78, regular: 49, alerta: 29 },
  ],
  "30d": [
    { data: "15/06", bem: 62, atencao: 43, regular: 29, alerta: 13 },
    { data: "22/06", bem: 74, atencao: 55, regular: 38, alerta: 24 },
    { data: "29/06", bem: 82, atencao: 65, regular: 32, alerta: 18 },
    { data: "06/07", bem: 71, atencao: 68, regular: 46, alerta: 27 },
    { data: "13/07", bem: 65, atencao: 82, regular: 51, alerta: 29 },
    { data: "20/07", bem: 76, atencao: 72, regular: 37, alerta: 18 },
    { data: "27/07", bem: 91, atencao: 72, regular: 47, alerta: 26 },
    { data: "03/08", bem: 91, atencao: 78, regular: 49, alerta: 29 },
  ],
  "90d": [
    { data: "05/05", bem: 54, atencao: 48, regular: 34, alerta: 19 },
    { data: "19/05", bem: 60, atencao: 52, regular: 36, alerta: 21 },
    { data: "02/06", bem: 66, atencao: 58, regular: 33, alerta: 17 },
    { data: "16/06", bem: 70, atencao: 63, regular: 40, alerta: 22 },
    { data: "30/06", bem: 78, atencao: 69, regular: 42, alerta: 24 },
    { data: "14/07", bem: 74, atencao: 77, regular: 48, alerta: 27 },
    { data: "28/07", bem: 86, atencao: 73, regular: 45, alerta: 25 },
    { data: "03/08", bem: 91, atencao: 78, regular: 49, alerta: 29 },
  ],
};

const MARCAS_Y = [100, 75, 50, 25, 0];

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

function CardPanoramaGeral({
  filtrosDeSituacao,
  situacao,
  definirSituacao,
  dadosPorPeriodo = DADOS_POR_PERIODO,
  contagemReal = false,
}) {
  const resumo = obterResumoGeral();
  const [periodo, definirPeriodo] = useState("30d");
  const [menuPeriodoAberto, definirMenuPeriodoAberto] = useState(false);
  const [indiceHover, definirIndiceHover] = useState(null);
  const [dimensoes, definirDimensoes] = useState({ largura: 0, altura: 0 });

  const areaRef = useRef(null);
  const periodoRef = useRef(null);

  const dados = dadosPorPeriodo[periodo] || [];
  const teto = contagemReal ? Math.max(4,Math.ceil(Math.max(0,...dados.flatMap(d=>SERIES_BEM_ESTAR.map(s=>d[s.id]||0)))/4)*4) : 100;
  const marcas = contagemReal ? [teto,teto*0.75,teto*0.5,teto*0.25,0] : MARCAS_Y;
  const periodoAtual =
    PERIODOS.find((item) => item.id === periodo) || PERIODOS[1];

  const seriesAtivas = useMemo(
    () =>
      situacao === "geral"
        ? SERIES_BEM_ESTAR
        : SERIES_BEM_ESTAR.filter((serie) => serie.id === situacao),
    [situacao]
  );

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

  const margem = { topo: 10, direita: 10, baixo: 28, esquerda: 38 };
  const larguraPlot = Math.max(
    0,
    dimensoes.largura - margem.esquerda - margem.direita
  );
  const alturaPlot = Math.max(
    0,
    dimensoes.altura - margem.topo - margem.baixo
  );

  const geometria = useMemo(() => {
    if (!dados.length || larguraPlot <= 0 || alturaPlot <= 0) {
      return { pontosX: [], curvas: [] };
    }

    const passoX = dados.length > 1 ? larguraPlot / (dados.length - 1) : 0;
    const pontosX = dados.map((_, i) => margem.esquerda + i * passoX);

    const converterY = (valor) =>
      margem.topo +
      alturaPlot -
      (Math.max(0, Math.min(teto, valor)) / teto) * alturaPlot;

    const baseY = margem.topo + alturaPlot;

    const curvas = seriesAtivas.map((serie) => {
      const pontos = dados.map((item, i) => ({
        x: pontosX[i],
        y: converterY(item[serie.id]),
        valor: item[serie.id],
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
  }, [dados, seriesAtivas, larguraPlot, alturaPlot,teto]);

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

  if (resumo.valor == null) {
    return (
      <Painel>
        <p>Ainda não há avaliações de bem-estar nesta conta.</p>
      </Painel>
    );
  }

  const itemHover = indiceHover !== null ? dados[indiceHover] : null;
  const xHover = indiceHover !== null ? geometria.pontosX[indiceHover] : null;
  const tooltipNaEsquerda =
    indiceHover !== null && indiceHover >= Math.max(1, dados.length - 2);

  return (
    <Painel className="panorama-painel-geral">
      <Abas
        className="panorama-filtros"
        itens={filtrosDeSituacao}
        valor={situacao}
        aoMudar={(valor) => {
          definirSituacao(valor);
          definirIndiceHover(null);
        }}
      />

      <div className="panorama-geral-corpo">
        <section className="panorama-resumo">
          <h2 className="panorama-subtitulo panorama-subtitulo-resumo">
            <img src={iconesBemEstar.rindo} alt="" />
            Bem-estar geral
          </h2>

          <div className="panorama-resumo-anel">
            <AnelDeProgresso
              valor={resumo.valor}
              tamanho={180}
              tamanhoDaFonte={46}
            />
          </div>

          <div className="panorama-resumo-variacao">
            <strong>
              <IconeSetaVariacao sentido={resumo.sentido} />
              {resumo.variacao}
            </strong>
            <Selo estilo="destaque">{resumo.situacao}</Selo>
          </div>
          <p className="panorama-resumo-legenda">{contagemReal ? `${resumo.total||0} avaliações registradas` : "Em relação ao mês anterior"}</p>
        </section>

        <section className="panorama-visao">
          <header className="panorama-visao-cabecalho">
            <h2 className="panorama-subtitulo">
              <img src={iconesBemEstar.graficoDeBarras} alt="" />
              {contagemReal ? "Avaliações por período" : "Visão geral"}
            </h2>

            <div className="panorama-periodo-caixa" ref={periodoRef}>
              <button
                type="button"
                className="panorama-periodo-botao"
                aria-haspopup="listbox"
                aria-expanded={menuPeriodoAberto}
                onClick={() => definirMenuPeriodoAberto((aberto) => !aberto)}
              >
                <span>{periodoAtual.rotulo}</span>
                <svg
                  className={`panorama-periodo-seta${
                    menuPeriodoAberto ? " panorama-periodo-seta--aberta" : ""
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
                    className="panorama-periodo-menu"
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
                        className={`panorama-periodo-opcao${
                          item.id === periodo
                            ? " panorama-periodo-opcao--ativa"
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
          </header>

          <div
            className="panorama-grafico-area"
            ref={areaRef}
            onMouseMove={aoMoverMouse}
            onMouseLeave={() => definirIndiceHover(null)}
          >
            {dimensoes.largura > 0 && dimensoes.altura > 0 && (
              <svg
                width={dimensoes.largura}
                height={dimensoes.altura}
                viewBox={`0 0 ${dimensoes.largura} ${dimensoes.altura}`}
                className="panorama-grafico-vetor"
                role="img"
                aria-label="Gráfico de evolução do bem-estar por faixa"
              >
                <defs>
                  {SERIES_BEM_ESTAR.map((serie) => (
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

                <rect
                  x={margem.esquerda}
                  y={margem.topo}
                  width={larguraPlot}
                  height={alturaPlot}
                  rx="4"
                  className="panorama-grafico-fundo-plot"
                />

                {marcas.map((marca) => {
                  const y =
                    margem.topo + alturaPlot - (marca / teto) * alturaPlot;
                  return (
                    <g key={marca}>
                      <line
                        x1={margem.esquerda}
                        x2={margem.esquerda + larguraPlot}
                        y1={y}
                        y2={y}
                        className="panorama-grafico-grade"
                      />
                      <text
                        x={margem.esquerda - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="panorama-grafico-eixo-y"
                      >
                        {marca}
                      </text>
                    </g>
                  );
                })}

                {geometria.curvas.map((curva) => (
                  <g key={curva.id}>
                    <path
                      d={curva.caminhoArea}
                      fill={`url(#${curva.gradienteId})`}
                    />
                    <path
                      d={curva.caminhoLinha}
                      fill="none"
                      stroke={curva.cor}
                      className="panorama-grafico-linha"
                    />
                  </g>
                ))}

                {xHover !== null && (
                  <line
                    x1={xHover}
                    x2={xHover}
                    y1={margem.topo}
                    y2={margem.topo + alturaPlot}
                    className="panorama-grafico-guia"
                  />
                )}

                {geometria.curvas.map((curva) =>
                  curva.pontos.map((ponto, idx) => {
                    const ehAtivo = idx === indiceHover;
                    const ehExtremidade =
                      idx === 0 || idx === curva.pontos.length - 1;
                    return (
                      <circle
                        key={`${curva.id}-${idx}`}
                        cx={ponto.x}
                        cy={ponto.y}
                        r={ehAtivo ? 4.8 : ehExtremidade ? 2.6 : 0}
                        fill={curva.cor}
                        stroke={ehAtivo ? "#faf9f2" : "none"}
                        strokeWidth={ehAtivo ? 2.2 : 0}
                        className="panorama-grafico-marcador"
                      />
                    );
                  })
                )}

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
                    className={`panorama-grafico-eixo-x${
                      i === indiceHover ? " panorama-grafico-eixo-x--ativo" : ""
                    }`}
                  >
                    {item.data}
                  </text>
                ))}
              </svg>
            )}

            <AnimatePresence>
              {itemHover && xHover !== null && (
                <motion.div
                  className="panorama-grafico-tooltip"
                  style={{
                    left: tooltipNaEsquerda
                      ? Math.max(margem.esquerda, xHover - 166)
                      : Math.min(dimensoes.largura - 162, xHover + 14),
                    top: margem.topo + 6,
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="panorama-grafico-tooltip-data">
                    {itemHover.data}
                  </span>
                  <div className="panorama-grafico-tooltip-lista">
                    {seriesAtivas.map((serie) => (
                      <div
                        key={serie.id}
                        className="panorama-grafico-tooltip-linha"
                      >
                        <span
                          className="panorama-grafico-tooltip-bolinha"
                          style={{ backgroundColor: serie.cor }}
                        />
                        <span className="panorama-grafico-tooltip-nome">
                          {serie.rotulo}
                        </span>
                        <strong className="panorama-grafico-tooltip-valor">
                          {itemHover[serie.id]}{contagemReal?"":"%"}
                        </strong>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </Painel>
  );
}

export default CardPanoramaGeral;