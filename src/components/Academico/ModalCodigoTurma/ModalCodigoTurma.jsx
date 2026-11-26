import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  DURACAO_CONVITE_MS,
  criarNovoConviteDaTurma,
  formatarTempoRestante,
  obterOuCriarConviteDaTurma,
} from "../../../js/Rotas_ACADEMICO/codigoConviteTurma.js";
import "./ModalCodigoTurma.css";

const CURVA_SUAVE = [0.22, 1, 0.36, 1];

function IconeCopiar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2.5" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconeCheck() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconeAtualizar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  );
}

function IconeTelaCheia({ expandido }) {
  if (expandido) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="4 14 10 14 10 20" />
        <polyline points="20 10 14 10 14 4" />
        <line x1="14" y1="10" x2="21" y2="3" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function IconeRelogio() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

function ModalCodigoTurma({ turma, aoFechar }) {
  const aberto = Boolean(turma);
  const [convite, definirConvite] = useState(null);
  const [agora, definirAgora] = useState(() => Date.now());
  const [copiado, definirCopiado] = useState(false);
  const [telaCheia, definirTelaCheia] = useState(false);

  useEffect(() => {
    if (!turma) {
      definirTelaCheia(false);
      definirCopiado(false);
      return;
    }
    definirConvite(obterOuCriarConviteDaTurma(turma.id));
    definirAgora(Date.now());
    definirCopiado(false);
  }, [turma?.id]);

  useEffect(() => {
    if (!aberto) return;
    const intervalo = setInterval(() => {
      definirAgora(Date.now());
    }, 1000);
    return () => clearInterval(intervalo);
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    function aoTeclar(evento) {
      if (evento.key !== "Escape") return;
      if (telaCheia) {
        definirTelaCheia(false);
      } else {
        aoFechar?.();
      }
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, telaCheia, aoFechar]);

  if (typeof document === "undefined") return null;

  const restanteMs = convite ? Math.max(0, convite.expiraEm - agora) : 0;
  const expirado = Boolean(convite) && restanteMs <= 0;
  const alertaTempo = !expirado && restanteMs <= 3 * 60 * 1000;
  const percentual = Math.min(
    100,
    Math.max(0, (restanteMs / DURACAO_CONVITE_MS) * 100),
  );

  const [parte1 = "----", parte2 = "----"] = String(
    convite?.codigo || "-----",
  ).split("-");

  function gerarNovo() {
    if (!turma) return;
    definirConvite(criarNovoConviteDaTurma(turma.id));
    definirAgora(Date.now());
    definirCopiado(false);
  }

  async function copiarCodigo() {
    if (!convite?.codigo || expirado) return;
    try {
      await navigator.clipboard.writeText(convite.codigo);
    } catch {
      const aux = document.createElement("textarea");
      aux.value = convite.codigo;
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
    }
    definirCopiado(true);
    setTimeout(() => definirCopiado(false), 2500);
  }

  return createPortal(
    <AnimatePresence>
      {aberto && (
        <motion.div
          className={`modal-codigo-backdrop${
            telaCheia ? " modal-codigo-backdrop--tela-cheia" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => {
            if (!telaCheia) aoFechar?.();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-codigo-titulo"
            className={`modal-codigo-cartao${
              telaCheia ? " modal-codigo-cartao--tela-cheia" : ""
            }`}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: CURVA_SUAVE }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-codigo-cabecalho">
              <div className="modal-codigo-cabecalho-texto">
                <span className="modal-codigo-selo">Código de convite</span>
                <h2 id="modal-codigo-titulo">{turma.nome}</h2>
                <p>
                  Compartilhe o código ou peça para os estudantes escanearem o
                  QR Code.
                </p>
              </div>

              <div className="modal-codigo-topo-acoes">
                <button
                  type="button"
                  className="modal-codigo-btn-icone"
                  title={
                    telaCheia
                      ? "Sair da tela cheia"
                      : "Ampliar para projetar na tela"
                  }
                  aria-label={
                    telaCheia ? "Sair da tela cheia" : "Ampliar na tela"
                  }
                  onClick={() => definirTelaCheia((atual) => !atual)}
                >
                  <IconeTelaCheia expandido={telaCheia} />
                </button>

                <button
                  type="button"
                  className="modal-codigo-btn-icone"
                  aria-label="Fechar janela de código"
                  title="Fechar"
                  onClick={aoFechar}
                >
                  ×
                </button>
              </div>
            </header>

            <div
              className={`modal-codigo-visor${
                expirado ? " modal-codigo-visor--expirado" : ""
              }`}
              aria-live="polite"
            >
              <div className="modal-codigo-visor-conteudo">
                <div className="modal-codigo-qr-bloco">
                  <div className="modal-codigo-qr-moldura">
                    {convite?.codigo && (
                      <QRCodeSVG
                        value={convite.codigo}
                        size={telaCheia ? 380 : 230}
                        bgColor="#ffffff"
                        fgColor="#153532"
                        level="M"
                        className="modal-codigo-qr-svg"
                      />
                    )}
                    {expirado && (
                      <span className="modal-codigo-qr-bloqueio">Expirado</span>
                    )}
                  </div>
                  <span className="modal-codigo-qr-legenda">
                    Aponte a câmera para copiar
                  </span>
                </div>

                <div className="modal-codigo-texto-bloco">
                  <span className="modal-codigo-texto-rotulo">
                    Código da turma
                  </span>
                  <div
                    className="modal-codigo-texto"
                    aria-label={convite?.codigo}
                  >
                    <span>{parte1}</span>
                    <span className="modal-codigo-hifen" aria-hidden="true">
                      -
                    </span>
                    <span>{parte2}</span>
                  </div>

                  {expirado && (
                    <span className="modal-codigo-aviso-expirado">
                      Código expirado — gere um novo para continuar
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contador regressivo + barra de validade */}
            <div className="modal-codigo-validade">
              <div className="modal-codigo-validade-topo">
                <span
                  className={`modal-codigo-timer${
                    expirado
                      ? " modal-codigo-timer--expirado"
                      : alertaTempo
                        ? " modal-codigo-timer--alerta"
                        : ""
                  }`}
                >
                  <IconeRelogio />
                  {expirado
                    ? "Validade encerrada"
                    : `Expira em ${formatarTempoRestante(restanteMs)}`}
                </span>
                <span className="modal-codigo-duracao-info">
                  Validade de 15 minutos
                </span>
              </div>

              <div className="modal-codigo-barra" aria-hidden="true">
                <div
                  className={`modal-codigo-barra-progresso${
                    expirado
                      ? " modal-codigo-barra-progresso--expirado"
                      : alertaTempo
                        ? " modal-codigo-barra-progresso--alerta"
                        : ""
                  }`}
                  style={{ width: `${percentual}%` }}
                />
              </div>
            </div>

            {/* Ações */}
            <footer className="modal-codigo-rodape">
              <button
                type="button"
                className="modal-codigo-btn modal-codigo-btn--secundario"
                onClick={gerarNovo}
              >
                <IconeAtualizar />
                <span>Gerar novo código</span>
              </button>

              <button
                type="button"
                className="modal-codigo-btn modal-codigo-btn--secundario"
                onClick={() => definirTelaCheia((atual) => !atual)}
              >
                <IconeTelaCheia expandido={telaCheia} />
                <span>{telaCheia ? "Reduzir tela" : "Projetar grande"}</span>
              </button>

              <button
                type="button"
                className={`modal-codigo-btn modal-codigo-btn--principal${
                  copiado ? " modal-codigo-btn--copiado" : ""
                }`}
                disabled={expirado}
                onClick={copiarCodigo}
              >
                {copiado ? <IconeCheck /> : <IconeCopiar />}
                <span>{copiado ? "Código copiado!" : "Copiar código"}</span>
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ModalCodigoTurma;
