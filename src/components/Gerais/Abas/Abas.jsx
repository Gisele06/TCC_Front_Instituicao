import { useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import "./Abas.css";

const MOLA_ABA = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.82,
};

const CURVA_FADE = [0.22, 1, 0.36, 1];

function Abas({ itens, valor, aoMudar, tamanho = "padrao", className = "" }) {
  const idGrupo = useId();
  const reduzirMovimento = useReducedMotion();
  const indiceAtivo = itens.findIndex((item) => item.valor === valor);

  const classes = [
    "bloom-abas-segmentadas",
    tamanho === "compacto" ? "abas-compactas" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="tablist">
      {itens.map((item, indice) => {
        const ativo = item.valor === valor;
        const esconderDivisoria =
          indice === 0 || ativo || indice - 1 === indiceAtivo;

        return (
          <button
            key={item.valor}
            type="button"
            role="tab"
            aria-selected={ativo}
            className={`bloom-aba-segmentada${
              ativo ? " estado-ativo" : ""
            }${esconderDivisoria ? " sem-divisoria" : ""}`}
            onClick={() => aoMudar(item.valor)}
          >
            {ativo && (
              <motion.span
                layoutId={`bloom-aba-pilula-${idGrupo}`}
                className="bloom-aba-segmentada-fundo"
                aria-hidden="true"
                transition={reduzirMovimento ? { duration: 0 } : MOLA_ABA}
              />
            )}

            <span className="bloom-aba-segmentada-conteudo">
              {item.marcador && (
                <i
                  className="bloom-aba-segmentada-marcador"
                  style={{ background: item.marcador }}
                />
              )}
              {item.icone && (
                <span className="bloom-aba-segmentada-icone">{item.icone}</span>
              )}
              <span>{item.rotulo}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ConteudoAba({ chave, children, className = "" }) {
  const reduzirMovimento = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={chave}
        className={`bloom-aba-conteudo${className ? ` ${className}` : ""}`}
        initial={reduzirMovimento ? false : { opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.32, ease: CURVA_FADE },
        }}
        exit={
          reduzirMovimento
            ? undefined
            : {
                opacity: 0,
                transition: { duration: 0.22, ease: "easeInOut" },
              }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default Abas;