import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Abas, { ConteudoAba } from "../../Gerais/Abas/Abas.jsx";
import AnelDeProgresso from "../AnelDeProgresso/AnelDeProgresso.jsx";
import Painel from "../Painel/Painel.jsx";
import Selo from "../Selo/Selo.jsx";
import { IconeSetaVariacao } from "../../Gerais/Icone/Icone.jsx";
import "./CardMetricaTurmas.css";

const PERIODOS = [
  { id: "7d", rotulo: "Últimos 7 dias" },
  { id: "30d", rotulo: "Últimos 30 dias" },
  { id: "90d", rotulo: "Últimos 90 dias" },
];

const MARCAS_Y = [100, 75, 50, 25, 0];
const COR_CURVA = "#df3525";

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

function formatarDiaMes(data) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

function gerarDatasParaQuantidade(
  quantidade,
  totalDias,
  dataFinal = new Date(2026, 7, 3)
) {
  if (quantidade <= 1) return [formatarDiaMes(dataFinal)];
  const passo = totalDias / (quantidade - 1);
  return Array.from({ length: quantidade }, (_, i) => {
    const diasAtras = Math.round((quantidade - 1 - i) * passo);
    const d = new Date(dataFinal);
    d.setDate(d.getDate() - diasAtras);
    return formatarDiaMes(d);
  });
}

function montarPontosPorPeriodo(valoresBase = [], datasBase = [], periodo) {
  const valores = valoresBase.length
    ? valoresBase
    : [27, 38, 29, 43, 44, 30, 40, 42];

  if (periodo === "7d") {
    const ultimos = valores.slice(-7);
    const datas = gerarDatasParaQuantidade(ultimos.length, 6);
    return ultimos.map((valor, i) => ({
      data: datas[i],
      valor: Math.max(0, Math.min(100, Math.round(valor))),
    }));
  }

  if (periodo === "90d") {
    const datas = gerarDatasParaQuantidade(valores.length, 89);
    return valores.map((valor, i) => ({
      data: datas[i],
      valor: Math.max(
        0,
        Math.min(100, Math.round(valor * (0.86 + (i % 3) * 0.08)))
      ),
    }));
  }

  const datas =
    datasBase.length === valores.length
      ? datasBase
      : gerarDatasParaQuantidade(valores.length, 29);

  return valores.map((valor, i) => ({
    data: datas[i],
    valor: Math.max(0, Math.min(100, Number(valor) || 0)),
  }));
}

function CardMetricaTurmas({
  metricas,
  metricaAtiva,
  definirMetricaAtiva,
  metrica,
  datasDoGrafico,
}) {
  const [periodo, definirPeriodo] = useState("30d");
  const [menuPeriodoAberto, definirMenuPeriodoAberto] = useState(false);
  const [indiceHover, definirIndiceHover] = useState(null);
  const [dimensoes, definirDimensoes] = useState({ largura: 0, altura: 0 });
  const [areaElemento, definirAreaElemento] = useState(null);

  const periodoRef = useRef(null);

  const dados = useMemo(
    () => metrica?.periodos?.[periodo] || montarPontosPorPeriodo(metrica?.valores, datasDoGrafico, periodo),
    [metrica, datasDoGrafico, periodo]
  );

  const periodoAtual =
    PERIODOS.find((item) => item.id === periodo) || PERIODOS[1];

  useEffect(() => {
    if (!areaElemento) return;

    function atualizarTamanho(retangulo) {
      const largura = Math.round(retangulo.width);
      const altura = Math.round(retangulo.height);
      if (largura > 0 && altura > 0) {
        definirDimensoes((atual) =>
          atual.largura === largura && atual.altura === altura
            ? atual
            : { largura, altura }
        );
      }
    }

    atualizarTamanho(areaElemento.getBoundingClientRect());

    const observador = new ResizeObserver((entradas) => {
      const retangulo = entradas[0]?.contentRect;
      if (retangulo) atualizarTamanho(retangulo);
    });

    observador.observe(areaElemento);
    return () => observador.disconnect();
  }, [areaElemento]);

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

  const margem = { topo: 10, direita: 10, baixo: 26, esquerda: 36 };
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
      return { pontos: [], caminhoLinha: "", caminhoArea: "" };
    }

    const passoX = dados.length > 1 ? larguraPlot / (dados.length - 1) : 0;
    const baseY = margem.topo + alturaPlot;

    const pontos = dados.map((item, i) => ({
      x: margem.esquerda + i * passoX,
      y:
        margem.topo +
        alturaPlot -
        (Math.max(0, Math.min(100, item.valor)) / 100) * alturaPlot,
      valor: item.valor,
      data: item.data,
    }));

    const caminhoLinha = gerarCaminhoMonotono(pontos);
    const caminhoArea =
      pontos.length > 1
        ? `${caminhoLinha} L ${pontos[pontos.length - 1].x.toFixed(2)} ${baseY.toFixed(2)} L ${pontos[0].x.toFixed(2)} ${baseY.toFixed(2)} Z`
        : "";

    return { pontos, caminhoLinha, caminhoArea };
  }, [dados, larguraPlot, alturaPlot]);

  const indicesRotuloX = useMemo(() => {
    const total = geometria.pontos.length;
    if (total === 0) return [];
    const maxRotulos = Math.max(2, Math.min(7, Math.floor(larguraPlot / 76)));
    if (total <= maxRotulos) {
      return Array.from({ length: total }, (_, i) => i);
    }

    const indices = new Set([0, total - 1]);
    const passo = (total - 1) / (maxRotulos - 1);
    for (let k = 1; k < maxRotulos - 1; k++) {
      indices.add(Math.round(k * passo));
    }
    return Array.from(indices).sort((a, b) => a - b);
  }, [geometria.pontos.length, larguraPlot]);

  function aoMoverMouse(evento) {
    if (!geometria.pontos.length || !areaElemento) return;
    const ret = areaElemento.getBoundingClientRect();
    const mouseX = evento.clientX - ret.left;

    let maisProximo = 0;
    let menorDistancia = Infinity;

    geometria.pontos.forEach((ponto, i) => {
      const dist = Math.abs(mouseX - ponto.x);
      if (dist < menorDistancia) {
        menorDistancia = dist;
        maisProximo = i;
      }
    });

    definirIndiceHover(maisProximo);
  }

  const pontoHover = indiceHover !== null ? geometria.pontos[indiceHover] : null;
  const tooltipNaEsquerda =
    indiceHover !== null && indiceHover >= Math.max(1, dados.length - 2);
  const gradienteId = `turmas-area-${metrica.valor}`;

  return (
    <Painel className="turmas-painel-principal">
      <div className="turmas-abas-faixa">
        <Abas
          className="turmas-abas"
          itens={metricas.map((item) => ({
            valor: item.valor,
            rotulo: item.rotulo,
            icone: <img src={item.icone} alt="" />,
          }))}
          valor={metricaAtiva}
          aoMudar={(valor) => {
            definirMetricaAtiva(valor);
            definirIndiceHover(null);
          }}
        />
      </div>

      <ConteudoAba chave={metrica.valor} className="turmas-metrica-corpo">
        <header className="turmas-metrica-cabecalho">
          <div className="turmas-metrica-texto">
            <h2>
              <img src={metrica.icone} alt="" />
              <span>{metrica.titulo}</span>
            </h2>
            <p>{metrica.descricao}</p>
          </div>
          <Selo estilo="destaque">{metrica.situacao}</Selo>
        </header>

        <div className="turmas-metrica-cartao">
          <section className="turmas-resumo">
            <div className="turmas-resumo-anel">
              <AnelDeProgresso
                valor={metrica.percentual}
                tamanho={176}
                tamanhoDaFonte={46}
              />
            </div>
            <div className="turmas-resumo-rodape">
              <strong className="turmas-resumo-variacao">
                <IconeSetaVariacao sentido={metrica.sentido || "cima"} />
                {metrica.variacao}
              </strong>
              <p>Em relação ao mês anterior</p>
            </div>
          </section>

          <section className="turmas-grafico">
            <div className="turmas-periodo-caixa" ref={periodoRef}>
              <button
                type="button"
                className="turmas-periodo-botao"
                aria-haspopup="listbox"
                aria-expanded={menuPeriodoAberto}
                onClick={() => definirMenuPeriodoAberto((aberto) => !aberto)}
              >
                <span>{periodoAtual.rotulo}</span>
                <svg
                  className={`turmas-periodo-seta${
                    menuPeriodoAberto ? " turmas-periodo-seta--aberta" : ""
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
                    className="turmas-periodo-menu"
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
                        className={`turmas-periodo-opcao${
                          item.id === periodo
                            ? " turmas-periodo-opcao--ativa"
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

            <div
              className="turmas-grafico-area"
              ref={definirAreaElemento}
              onMouseMove={aoMoverMouse}
              onMouseLeave={() => definirIndiceHover(null)}
            >
              {dimensoes.largura > 0 && dimensoes.altura > 0 && (
                <svg
                  width={dimensoes.largura}
                  height={dimensoes.altura}
                  viewBox={`0 0 ${dimensoes.largura} ${dimensoes.altura}`}
                  className="turmas-grafico-vetor"
                  role="img"
                  aria-label={`Gráfico de evolução de ${metrica.titulo}`}
                >
                  <defs>
                    <linearGradient id={gradienteId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COR_CURVA} stopOpacity="0.24" />
                      <stop offset="100%" stopColor={COR_CURVA} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <rect
                    x={margem.esquerda}
                    y={margem.topo}
                    width={larguraPlot}
                    height={alturaPlot}
                    rx="4"
                    className="turmas-grafico-fundo-plot"
                  />

                  {MARCAS_Y.map((marca) => {
                    const y =
                      margem.topo + alturaPlot - (marca / 100) * alturaPlot;
                    return (
                      <g key={marca}>
                        <line
                          x1={margem.esquerda}
                          x2={margem.esquerda + larguraPlot}
                          y1={y}
                          y2={y}
                          className="turmas-grafico-grade"
                        />
                        <text
                          x={margem.esquerda - 10}
                          y={y + 4}
                          textAnchor="end"
                          className="turmas-grafico-eixo-y"
                        >
                          {marca}
                        </text>
                      </g>
                    );
                  })}

                  <path
                    d={geometria.caminhoArea}
                    fill={`url(#${gradienteId})`}
                  />
                  <path
                    d={geometria.caminhoLinha}
                    fill="none"
                    stroke={COR_CURVA}
                    className="turmas-grafico-linha"
                  />

                  {pontoHover && (
                    <line
                      x1={pontoHover.x}
                      x2={pontoHover.x}
                      y1={margem.topo}
                      y2={margem.topo + alturaPlot}
                      className="turmas-grafico-guia"
                    />
                  )}

                  {geometria.pontos.map((ponto, idx) => {
                    const ehAtivo = idx === indiceHover;
                    const ehExtremidade =
                      idx === 0 || idx === geometria.pontos.length - 1;
                    return (
                      <circle
                        key={`${metrica.valor}-${idx}`}
                        cx={ponto.x}
                        cy={ponto.y}
                        r={ehAtivo ? 4.8 : ehExtremidade ? 2.6 : 0}
                        fill={COR_CURVA}
                        stroke={ehAtivo ? "#faf9f2" : "none"}
                        strokeWidth={ehAtivo ? 2.2 : 0}
                        className="turmas-grafico-marcador"
                      />
                    );
                  })}

                  {indicesRotuloX.map((i) => {
                    const ponto = geometria.pontos[i];
                    if (!ponto) return null;
                    return (
                      <text
                        key={`${periodo}-${ponto.data}-${i}`}
                        x={ponto.x}
                        y={dimensoes.altura - 6}
                        textAnchor={
                          i === 0
                            ? "start"
                            : i === geometria.pontos.length - 1
                              ? "end"
                              : "middle"
                        }
                        className={`turmas-grafico-eixo-x${
                          i === indiceHover ? " turmas-grafico-eixo-x--ativo" : ""
                        }`}
                      >
                        {ponto.data}
                      </text>
                    );
                  })}
                </svg>
              )}

              <AnimatePresence>
                {pontoHover && (
                  <motion.div
                    className="turmas-grafico-tooltip"
                    style={{
                      left: tooltipNaEsquerda
                        ? Math.max(margem.esquerda, pontoHover.x - 154)
                        : Math.min(dimensoes.largura - 150, pontoHover.x + 14),
                      top: margem.topo + 6,
                    }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="turmas-grafico-tooltip-data">
                      {pontoHover.data}
                    </span>
                    <div className="turmas-grafico-tooltip-linha">
                      <span
                        className="turmas-grafico-tooltip-bolinha"
                        style={{ backgroundColor: COR_CURVA }}
                      />
                      <span className="turmas-grafico-tooltip-nome">
                        {metrica.rotulo}
                      </span>
                      <strong className="turmas-grafico-tooltip-valor">
                        {pontoHover.valor}%
                      </strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </ConteudoAba>
    </Painel>
  );
}

export default CardMetricaTurmas;