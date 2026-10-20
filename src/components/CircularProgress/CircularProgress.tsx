import type { ReactNode } from "react";
import "./CircularProgress.css";

interface PropriedadesAnelDeProgresso {
  // Valor de 0 a 100.
  valor: number;
  // Diâmetro do anel (px ou qualquer unidade CSS).
  tamanho?: number | string;
  // Espessura do traço, na mesma escala do viewBox (0-100).
  espessura?: number;
  // Cor do progresso e da trilha de fundo.
  cor?: string;
  corTrilha?: string;
  // Conteúdo central. Se vazio mostra "{valor}%".
  children?: ReactNode;
  className?: string;
}

const RAIO = 45;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function AnelDeProgresso({
  valor,
  tamanho = "clamp(120px, 9vw, 170px)",
  espessura = 9,
  cor = "#4f9a63",
  corTrilha = "#e8ead9",
  children,
  className = "",
}: PropriedadesAnelDeProgresso) {
  const limitado = Math.max(0, Math.min(100, valor));
  const deslocamento = CIRCUNFERENCIA * (1 - limitado / 100);

  return (
    <div
      className={"bloom-anel " + className}
      style={{ width: tamanho, height: tamanho }}
    >
      <svg viewBox="0 0 100 100" className="bloom-anel-svg">
        <circle
          className="bloom-anel-trilha"
          cx="50"
          cy="50"
          r={RAIO}
          fill="none"
          stroke={corTrilha}
          strokeWidth={espessura}
        />
        <circle
          className="bloom-anel-valor"
          cx="50"
          cy="50"
          r={RAIO}
          fill="none"
          stroke={cor}
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={deslocamento}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="bloom-anel-centro">
        {children ?? <span className="bloom-anel-numero">{limitado}%</span>}
      </div>
    </div>
  );
}

export default AnelDeProgresso;
