import { dadosReais, periodosHome } from "../../js/integracao/avaliacoes.js";
import { useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { obterUsuarioLogado } from "../../js/Rotas_LOGIN/rotas_LOGIN.js";
import CardIndicadores from "../../components/Home/CardIndicadores/CardIndicadores.jsx";
import CardDadosRecentes from "../../components/Home/CardDadosRecentes/CardDadosRecentes.jsx";
import CardProximosEventos from "../../components/Home/CardProximosEventos/CardProximosEventos.jsx";
import CardVisaoGeral from "../../components/Home/CardVisaoGeral/CardVisaoGeral.jsx";
import CardAcoesRapidas from "../../components/Home/CardAcoesRapidas/CardAcoesRapidas.jsx";

import {
  obterEventos,
  obterDadosRecentes,
} from "../../js/Rotas_HOME/rotas_HOME.js";
import CardBoasVindas from "../../components/Home/CardBoasVindas/CardBoasVindas.jsx";

import imagemDeMontanhas from "../../img/sistema/montanhasDestaque.png";

import iconeCalendarioComPontos from "../../img/icones/calendario-pontos.png";

import iconeHistorico from "../../img/icones/historico.png";
import iconeMensagem from "../../img/icones/mensagem.png";
import iconeComunidade from "../../img/icones/comunidade.png";
import iconeNota from "../../img/icones/nota.png";

import "./Home.css";

function Inicio({ aoNavegar, aoCriarEvento }) {
  const [veioDoLogin] = useState(
    () => sessionStorage.getItem("bloom-transicao-entrada") === "1",
  );
  const [mostrarCamada, definirMostrarCamada] = useState(veioDoLogin);
  const reduzirMovimento = useReducedMotion();
  useLayoutEffect(() => {
    if (veioDoLogin) sessionStorage.removeItem("bloom-transicao-entrada");
  }, [veioDoLogin]);

  const acoesRapidas = [
    {
      rotulo: "Avaliações do dia",
      icone: iconeHistorico,
      acao: () => aoNavegar("bem-estar"),
    },
    {
      rotulo: "Enviar mensagem",
      icone: iconeMensagem,
      acao: () => aoNavegar("acolhimento"),
    },
    {
      rotulo: "Locais de acolhimento",
      icone: iconeComunidade,
      acao: () => aoNavegar("acolhimento?aba=redesApoio"),
    },
    { rotulo: "Criar evento", icone: iconeCalendarioComPontos },
    {
      rotulo: "Criar turma",
      icone: iconeNota,
      acao: () => aoNavegar("academico?novo=turmas"),
    },
  ];

  const eventos = obterEventos();

  const dadosRecentes = obterDadosRecentes().map((item) => ({
    ...item,
    icone: {
      iconeHistorico,
      iconeNota,
      iconeCalendarioComPontos,
      iconeMensagem,
    }[item.icone],
  }));

  return (
    <>
      <div className={`inicio-conteudo${veioDoLogin ? " inicio-entrada" : ""}`}>
        <div className="inicio-superior-secao">
          <div className="inicio-superior-esquerdo">
            <CardBoasVindas
              textoAcimaDoTitulo="Bem-vindo de volta,"
              tituloDeBoasVindas={`Olá, ${obterUsuarioLogado().nome.split(" ")[0]}!`}
              textoDeBoasVindas={
                obterUsuarioLogado().instituicao || "Acompanhe sua instituição."
              }
              imagemDeFundo={<img src={imagemDeMontanhas} alt="" />}
            />

            <CardIndicadores />
          </div>

          <CardAcoesRapidas
            acoesRapidas={acoesRapidas}
            aoCriarEvento={aoCriarEvento}
          />
        </div>

        <div className="inicio-inferior">
          <CardVisaoGeral
            dadosPorPeriodo={dadosReais() ? periodosHome() : undefined}
          />

          <CardProximosEventos
            aoNavegar={aoNavegar}
            eventos={eventos}
            aoAbrirEvento={(eventoOuId) => {
              const id =
                typeof eventoOuId === "object" ? eventoOuId?.id : eventoOuId;
              if (id == null) {
                aoNavegar("eventos");
                return;
              }
              if (aoAbrirEvento) aoAbrirEvento(id);
              else aoNavegar(`home/evento/${encodeURIComponent(id)}`);
            }}
          />

          <CardDadosRecentes dadosRecentes={dadosRecentes} />
        </div>
      </div>
      {mostrarCamada &&
        createPortal(
          <motion.div
            className="bloom-transicao-home"
            aria-hidden="true"
            initial={{ clipPath: "inset(0)" }}
            animate={{ clipPath: "inset(0 100% 0 0)" }}
            transition={{
              duration: reduzirMovimento ? 0 : 0.48,
              ease: [0.16, 1, 0.3, 1],
            }}
            onAnimationComplete={() => definirMostrarCamada(false)}
          />,
          document.body,
        )}
    </>
  );
}

export default Inicio;
