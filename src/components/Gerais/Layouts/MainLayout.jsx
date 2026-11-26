import { cloneElement, useSyncExternalStore } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { escutarDadosOffline, obterVersao } from "../../../js/_cache/storage.js";
import NavBar from "../NavBar/NavBar.jsx";
import Cabecalho from "../Cabecalho/Cabecalho.jsx";
import "./MainLayout.css";

const CURVA_ROTA = [0.22, 1, 0.36, 1];

const MAPA_PAGINAS = {
  home: "inicio",
  "bem-estar": "bem-estar",
  acolhimento: "acolhimento",
  eventos: "eventos",
  comunicados: "comunicados",
  academico: "academico",
};

function MainLayout() {
  useSyncExternalStore(escutarDadosOffline, obterVersao);
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const reduzirMovimento = useReducedMotion();

  const paginaAtiva = MAPA_PAGINAS[pathname.split("/")[1]] ?? "inicio";

  return (
    <div className="inicio">
      <NavBar idAtivo={paginaAtiva} />
      <div className="fundo">
        <div
          className={`fundo-principal${
            paginaAtiva !== "inicio" ? " fundo-principal-compacto" : ""
          }`}
        >
          <Cabecalho paginaAtiva={paginaAtiva} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              className="bloom-transicao-pagina"
              initial={reduzirMovimento ? false : { opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.32, ease: CURVA_ROTA },
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
              {outlet ? cloneElement(outlet, { key: pathname }) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;