import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Icone from "../../Icone/Icone.jsx";
import "./NavBarBotao.css";

const MOLA_ENTRADA = {
  type: "spring",
  stiffness: 360,
  damping: 26,
  mass: 0.8,
};

function NavBarBotao({ item, idAtivo, ehPaginaAtual, aoSelecionar }) {
  const ativo = item.id === idAtivo;
  const reduzirMovimento = useReducedMotion();

  const iconeAtual =
    item.id === "inicio"
      ? ativo
        ? item.icone
        : item.iconeAlternativo
      : ativo
        ? item.iconeAlternativo
        : item.icone;

  return (
    <button
      type="button"
      title={item.rotulo}
      aria-label={item.rotulo}
      aria-current={ehPaginaAtual ? "page" : undefined}
      className={`bloom-menu-lateral-item${
        item.id === "inicio" ? " estado-inicio" : ""
      }${ativo ? " estado-ativo" : ""}`}
      onClick={() => aoSelecionar(item.id)}
    >
      <AnimatePresence initial={false}>
        {ativo && (
          <motion.span
            className="bloom-menu-lateral-pilula"
            aria-hidden="true"
            initial={reduzirMovimento ? false : { scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: reduzirMovimento ? { duration: 0 } : MOLA_ENTRADA,
            }}
            exit={
              reduzirMovimento
                ? undefined
                : {
                    scale: 0,
                    opacity: 0,
                    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
                  }
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ativo ? "ativo" : "inativo"}
          className="bloom-menu-lateral-icone-wrap"
          initial={reduzirMovimento ? false : { opacity: 0.25, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduzirMovimento ? undefined : { opacity: 0.25, scale: 0.9 }}
          transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <Icone
            icone={<img src={iconeAtual} alt="" />}
            rotulo={item.rotulo}
            tamanho="clamp(24px, 2vw, 30px)"
          />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default NavBarBotao;