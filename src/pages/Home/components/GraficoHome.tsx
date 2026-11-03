import type { PainelHome } from "../../../services/indicadores";

interface Props {
  dados: PainelHome["grafico"];
}

export default function GraficoHome({ dados }: Props) {
  const pontos = (valores: number[]) => valores.map((valor, indice) => ({
    x: 44 + indice * (552 / Math.max(1, valores.length - 1)),
    y: 155 - Math.max(0, Math.min(100, valor)) * 1.4,
  }));

  function caminho(valores: number[]) {
    const lista = pontos(valores);
    return lista.map((ponto, indice) => `${indice ? "L" : "M"}${ponto.x},${ponto.y}`).join(" ");
  }

  return (
    <svg className="inicio-grafico-vetor" viewBox="0 0 600 180" preserveAspectRatio="none" role="img" aria-label="Evolução demonstrativa dos indicadores">
      <defs>
        {dados.series.map((serie) => (
          <linearGradient key={serie.id} id={`inicio-gradiente-${serie.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={serie.cor} stopOpacity=".20" />
            <stop offset="100%" stopColor={serie.cor} stopOpacity=".02" />
          </linearGradient>
        ))}
      </defs>
      <g className="inicio-grafico-grade">
        <path d="M44 15H596 M44 50H596 M44 85H596 M44 120H596 M44 155H596" />
      </g>
      <g className="inicio-grafico-eixo-rotulo">
        <text x="15" y="19">100</text><text x="24" y="54">75</text>
        <text x="24" y="89">50</text><text x="24" y="124">25</text><text x="30" y="159">0</text>
      </g>
      {dados.series.map((serie) => {
        const linha = caminho(serie.valores);
        return (
          <g key={serie.id}>
            <path d={`${linha} L596,155 L44,155 Z`} fill={`url(#inicio-gradiente-${serie.id})`} />
            <path d={linha} stroke={serie.cor} fill="none" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}
