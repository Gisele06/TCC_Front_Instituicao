import { motion, useReducedMotion } from "framer-motion";
import "./AnelDeProgresso.css";

// Raio e espessura no desenho de 100x100: o anel ocupa de 0 a 100 e a faixa tem 14 de largura.
const espessura = 14;
const raio = 50 - espessura / 2;
const circunferencia = 2 * Math.PI * raio;
const CURVA_ANEL = [0.22, 1, 0.36, 1];

function AnelDeProgresso({
  valor,
  tamanho = 180,
  tamanhoDaFonte = 46,
  children,
  rotulo,
  className = "",
}) {
  const reduzirMovimento = useReducedMotion();
  const valorLimitado = Math.min(100, Math.max(0, Number(valor) || 0));
  const deslocamentoFinal = circunferencia * (1 - valorLimitado / 100);

  const estilo = {
    width: `calc(${tamanho} * var(--un))`,
    height: `calc(${tamanho} * var(--un))`,
    fontSize: `calc(${tamanhoDaFonte} * var(--un))`,
  };

  return (
    <div
      className={`bloom-anel${className ? ` ${className}` : ""}`}
      style={estilo}
      role="img"
      aria-label={rotulo ?? `${valorLimitado}%`}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle
          className="bloom-anel-trilho"
          cx="50"
          cy="50"
          r={raio}
          strokeWidth={espessura}
        />

        {valorLimitado > 0 && (
          <motion.circle
            className="bloom-anel-progresso"
            cx="50"
            cy="50"
            r={raio}
            strokeWidth={espessura}
            strokeLinecap="round"
            strokeDasharray={circunferencia}
            initial={
              reduzirMovimento
                ? { strokeDashoffset: deslocamentoFinal }
                : { strokeDashoffset: circunferencia }
            }
            animate={{ strokeDashoffset: deslocamentoFinal }}
            transition={{
              duration: reduzirMovimento ? 0 : 0.75,
              ease: CURVA_ANEL,
            }}
            transform="rotate(-90 50 50)"
          />
        )}
      </svg>

      <span className="bloom-anel-conteudo">
        {children ?? `${valorLimitado}%`}
      </span>
    </div>
  );
}

export default AnelDeProgresso;