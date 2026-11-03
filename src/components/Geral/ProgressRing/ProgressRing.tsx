import type { CSSProperties, ReactNode } from "react";
import "./ProgressRing.css";

interface PropriedadesAnelDeProgresso {
  /** Valor de 0 a 100. O trecho escuro começa no topo e segue no sentido horário. */
  valor: number;
  /** Largura e altura do anel, em "un" (1 un = 1px no layout de 1920x1080). */
  tamanho?: number;
  /** Tamanho da letra do número do meio, em "un". */
  tamanhoDaFonte?: number;
  /** Texto do meio. Se não vier nada, mostra o valor com "%". */
  children?: ReactNode;
  rotulo?: string;
  className?: string;
}

// Raio e espessura no desenho de 100x100: o anel ocupa de 0 a 100 e a faixa tem 14 de largura.
const espessura = 14;
const raio = 50 - espessura / 2;
const circunferencia = 2 * Math.PI * raio;

function AnelDeProgresso({
  valor,
  tamanho = 180,
  tamanhoDaFonte = 46,
  children,
  rotulo,
  className = "",
}: PropriedadesAnelDeProgresso) {
  const valorLimitado = Math.min(100, Math.max(0, valor));
  const estilo: CSSProperties = {
    width: `calc(${tamanho} * var(--un))`,
    height: `calc(${tamanho} * var(--un))`,
    fontSize: `calc(${tamanhoDaFonte} * var(--un))`,
  };

  return (
    <div className={"bloom-anel " + className} style={estilo} role="img" aria-label={rotulo ?? `${valorLimitado}%`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="bloom-anel-trilho" cx="50" cy="50" r={raio} strokeWidth={espessura} />
        <circle
          className="bloom-anel-progresso"
          cx="50"
          cy="50"
          r={raio}
          strokeWidth={espessura}
          strokeDasharray={`${(circunferencia * valorLimitado) / 100} ${circunferencia}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="bloom-anel-conteudo">{children ?? `${valorLimitado}%`}</span>
    </div>
  );
}

export default AnelDeProgresso;
