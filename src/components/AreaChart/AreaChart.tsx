import { useId } from "react";
import "./AreaChart.css";

export interface SerieDoGrafico {
  id: string;
  nome: string;
  cor: string;
  /** Valores de 0 a 100, igualmente espaçados da esquerda para a direita. */
  valores: number[];
}

interface PropriedadesGraficoDeArea {
  series: SerieDoGrafico[];
  /** Datas (ou nomes) mostrados embaixo do gráfico. */
  rotulosDoEixoX: string[];
  /** Mostra uma bolinha no começo e no fim de cada linha. */
  pontas?: boolean;
  /** Força da cor do preenchimento embaixo de cada linha, de 0 a 1. */
  opacidadeDoPreenchimento?: number;
  className?: string;
}

const largura = 1000;
const altura = 100;
const marcasDoEixoY = [100, 75, 50, 25, 0];

type Ponto = [number, number];

// Transforma os pontos numa curva suave (Catmull-Rom convertida em Bézier).
function criarCurva(pontos: Ponto[]) {
  let caminho = `M${pontos[0][0]},${pontos[0][1]}`;

  for (let i = 0; i < pontos.length - 1; i += 1) {
    const anterior = pontos[i - 1] ?? pontos[i];
    const atual = pontos[i];
    const proximo = pontos[i + 1];
    const seguinte = pontos[i + 2] ?? proximo;

    const c1x = atual[0] + (proximo[0] - anterior[0]) / 6;
    const c1y = atual[1] + (proximo[1] - anterior[1]) / 6;
    const c2x = proximo[0] - (seguinte[0] - atual[0]) / 6;
    const c2y = proximo[1] - (seguinte[1] - atual[1]) / 6;

    caminho += ` C${c1x},${c1y} ${c2x},${c2y} ${proximo[0]},${proximo[1]}`;
  }

  return caminho;
}

function GraficoDeArea({
  series,
  rotulosDoEixoX,
  pontas = false,
  opacidadeDoPreenchimento = 0.28,
  className = "",
}: PropriedadesGraficoDeArea) {
  const idBase = useId().replace(/:/g, "");

  const desenhos = series.map((serie) => {
    const passo = largura / Math.max(1, serie.valores.length - 1);
    const pontos: Ponto[] = serie.valores.map((valor, indice) => [indice * passo, altura - valor]);
    const linha = criarCurva(pontos);
    const area = `${linha} L${largura},${altura} L0,${altura} Z`;
    return { serie, linha, area, primeiro: serie.valores[0], ultimo: serie.valores[serie.valores.length - 1] };
  });

  return (
    <div className={"bloom-grafico " + className}>
      <div className="bloom-grafico-corpo">
        <div className="bloom-grafico-eixo-y" aria-hidden="true">
          {marcasDoEixoY.map((marca) => (
            <span key={marca} style={{ top: `${100 - marca}%` }}>
              {marca}
            </span>
          ))}
        </div>

        <div className="bloom-grafico-area">
          {marcasDoEixoY.map((marca) => (
            <span key={marca} className="bloom-grafico-grade" style={{ top: `${100 - marca}%` }} aria-hidden="true" />
          ))}

          <svg viewBox={`0 0 ${largura} ${altura}`} preserveAspectRatio="none" role="img" aria-label="Gráfico de evolução">
            <defs>
              {desenhos.map(({ serie }) => (
                <linearGradient key={serie.id} id={`${idBase}-${serie.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={serie.cor} stopOpacity={opacidadeDoPreenchimento} />
                  <stop offset="100%" stopColor={serie.cor} stopOpacity={opacidadeDoPreenchimento * 0.14} />
                </linearGradient>
              ))}
            </defs>

            {desenhos.map(({ serie, area }) => (
              <path key={`${serie.id}-area`} d={area} fill={`url(#${idBase}-${serie.id})`} />
            ))}
            {desenhos.map(({ serie, linha }) => (
              <path key={`${serie.id}-linha`} className="bloom-grafico-linha" d={linha} stroke={serie.cor} />
            ))}
          </svg>

          {pontas &&
            desenhos.map(({ serie, primeiro, ultimo }) => (
              <span key={`${serie.id}-pontas`}>
                <span
                  className="bloom-grafico-ponta bloom-grafico-ponta-inicio"
                  style={{ top: `${100 - primeiro}%`, background: serie.cor }}
                  aria-hidden="true"
                />
                <span
                  className="bloom-grafico-ponta bloom-grafico-ponta-fim"
                  style={{ top: `${100 - ultimo}%`, background: serie.cor }}
                  aria-hidden="true"
                />
              </span>
            ))}
        </div>
      </div>

      <div className="bloom-grafico-eixo-x">
        {rotulosDoEixoX.map((rotulo) => (
          <span key={rotulo}>{rotulo}</span>
        ))}
      </div>
    </div>
  );
}

export default GraficoDeArea;
