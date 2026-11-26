import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import RedesApoio from "./REDES_APOIO/RedesApoio.jsx";
import CardDetalheDenuncia from "../../components/Acolhimento/CardDetalheDenuncia/CardDetalheDenuncia.jsx";
import CardListaDenuncias from "../../components/Acolhimento/CardListaDenuncias/CardListaDenuncias.jsx";
import CardEstatisticas from "../../components/Acolhimento/CardEstatisticas/CardEstatisticas.jsx";
import ChatDenuncia from "../../components/Acolhimento/ChatDenuncia/ChatDenuncia.jsx";
import TituloSecao from "../../components/Gerais/Cabecalho/TituloSecao/TituloSecao.jsx";
import Abas, { ConteudoAba } from "../../components/Gerais/Abas/Abas.jsx";
import { obterDenuncias, marcarDenunciaVista } from "../../js/Rotas_ACOLHIMENTO/rotas_ACOLHIMENTO.js";
import iconeDenuncia from "../../img/icones/Acolhimento/denuncia.png";
import iconeRedesApoio from "../../img/icones/Acolhimento/redesApoio.png";
import "./Denuncias.css";

const CURVA_SUAVE = [0.22, 1, 0.36, 1];

const abas = [
  {
    valor: "denuncias",
    rotulo: "Denúncias",
    icone: <img src={iconeDenuncia} alt="" />,
  },
  {
    valor: "redesApoio",
    rotulo: "Redes de apoio",
    icone: <img src={iconeRedesApoio} alt="" />,
  },
];

function Acolhimento() {
  const denuncias = obterDenuncias();
  const reduzirMovimento = useReducedMotion();

  const [parametros] = useSearchParams();
  const [visao, definirVisao] = useState(
    parametros.get("aba") === "redesApoio" ? "redesApoio" : "denuncias"
  );
  const [buscaTexto, definirBuscaTexto] = useState("");
  const [selecionada, definirSelecionada] = useState(null);
  const [chatAberto, definirChatAberto] = useState(false);
  const [expandido, definirExpandido] = useState(false);
  const [painelExpandido, definirPainelExpandido] = useState(false);

  const denuncia =
    denuncias.find((item) => item.id === selecionada) ?? denuncias[0];

  useEffect(()=>{if(visao==="denuncias"&&denuncia?.id!=null)marcarDenunciaVista(denuncia.id);},[visao,denuncia?.id,denuncia?.mensagens]);

  function aoMudarAba(valor) {
    definirVisao(valor);
    definirPainelExpandido(false);
    definirChatAberto(false);
  }

  return (
    <main className="bem-estar-pagina acolhimento-pagina">
      <TituloSecao
        className="acolhimento-cabecalho"
        titulo="Acolhimento"
        subtitulo="Acompanhe o bem-estar dos estudantes"
      />

      <Abas
        className="bem-estar-abas"
        itens={abas}
        valor={visao}
        aoMudar={aoMudarAba}
      />

      <ConteudoAba chave={visao} className="acolhimento-aba-conteudo">
        {visao === "denuncias" ? (
          <div className="acolhimento-denuncias-bloco">
            <CardEstatisticas />

            <div
              className={`acolhimento-colunas${
                painelExpandido ? " acolhimento-colunas--expandida" : ""
              }`}
            >
              <motion.div
                className="acolhimento-coluna-lista"
                animate={
                  painelExpandido
                    ? { opacity: 0, x: reduzirMovimento ? 0 : -16 }
                    : { opacity: 1, x: 0 }
                }
                transition={{
                  duration: reduzirMovimento ? 0 : 0.28,
                  ease: CURVA_SUAVE,
                }}
                style={{ pointerEvents: painelExpandido ? "none" : "auto" }}
                aria-hidden={painelExpandido}
              >
                <CardListaDenuncias
                  buscaTexto={buscaTexto}
                  definirBuscaTexto={definirBuscaTexto}
                  denuncias={denuncias}
                  definirSelecionada={(id) => {
                    definirSelecionada(id);
                    definirExpandido(false);
                  }}
                />
              </motion.div>

              <motion.div
                className="acolhimento-coluna-painel"
                initial={false}
                animate={{ width: painelExpandido ? "100%" : "31%" }}
                transition={{
                  duration: reduzirMovimento ? 0 : 0.42,
                  ease: CURVA_SUAVE,
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {chatAberto && denuncia ? (
                    <motion.div
                      key={`chat-${denuncia.id}`}
                      className="acolhimento-painel-transicao"
                      initial={reduzirMovimento ? false : { opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.26, ease: CURVA_SUAVE },
                      }}
                      exit={
                        reduzirMovimento
                          ? undefined
                          : {
                              opacity: 0,
                              transition: { duration: 0.18, ease: "easeInOut" },
                            }
                      }
                    >
                      <ChatDenuncia
                        denuncia={denuncia}
                        denunciaId={denuncia.id}
                        aoFechar={() => definirChatAberto(false)}
                        painelExpandido={painelExpandido}
                        aoAlternarPainelExpandido={() =>
                          definirPainelExpandido((atual) => !atual)
                        }
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`detalhe-${denuncia?.id ?? "vazio"}-${
                        painelExpandido ? "exp" : "comp"
                      }`}
                      className="acolhimento-painel-transicao"
                      initial={reduzirMovimento ? false : { opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.26, ease: CURVA_SUAVE },
                      }}
                      exit={
                        reduzirMovimento
                          ? undefined
                          : {
                              opacity: 0,
                              transition: { duration: 0.16, ease: "easeInOut" },
                            }
                      }
                    >
                      <CardDetalheDenuncia
                        denuncia={denuncia}
                        expandido={expandido}
                        definirExpandido={definirExpandido}
                        painelExpandido={painelExpandido}
                        aoAlternarPainelExpandido={() =>
                          definirPainelExpandido((atual) => !atual)
                        }
                        definirChatAberto={definirChatAberto}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        ) : (
          <RedesApoio />
        )}
      </ConteudoAba>
    </main>
  );
}

export default Acolhimento;