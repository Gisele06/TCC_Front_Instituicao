import { atualizarDenuncia } from "../../../js/Rotas_ACOLHIMENTO/rotas_ACOLHIMENTO.js";
import iconeRelogio from "../../../img/icones/Acolhimento/relogio.png";
import iconeLocal from "../../../img/icones/Acolhimento/local.png";
import iconePessoas from "../../../img/icones/Acolhimento/pessoas.png";
import iconeChat from "../../../img/icones/Acolhimento/conversa.png";
import iconeConversa from "../../../img/icones/Acolhimento/balaoConversa.png";
import "./CardDetalheDenuncia.css";

const ANEXOS_PADRAO = [
  { id: "anexo-1", rotulo: "Prova 1" },
  { id: "anexo-2", rotulo: "Prova 2" },
  { id: "anexo-3", rotulo: "Prova 3" },
  { id: "anexo-4", rotulo: "Prova 4" },
];

function IconeExpandir({ expandido }) {
  return expandido ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function IconeClipe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function IconeInfoCirculo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <rect x="11" y="10.5" width="2" height="6.5" rx="1" fill="#f7f6ee" />
      <circle cx="12" cy="7.5" r="1.25" fill="#f7f6ee" />
    </svg>
  );
}

function IconeRelatoChat() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3v3.5L11.5 18H20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
      <rect x="6.5" y="8.5" width="11" height="1.7" rx="0.85" fill="#f7f6ee" />
      <rect x="6.5" y="12" width="7.5" height="1.7" rx="0.85" fill="#f7f6ee" />
    </svg>
  );
}

function IconeImagemPlaceholder() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="5" y="8" width="38" height="32" rx="4" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="16.5" cy="18.5" r="3.4" fill="currentColor" />
      <path d="M9 36l9.5-10.5 6.5 6.5 6-7 8 11H9Z" fill="currentColor" />
    </svg>
  );
}

function SeletorStatus({ denuncia }) {
  return (
    <label className="acolhimento-status-select">
      <select
        aria-label="Status da denúncia"
        value={denuncia.status}
        onChange={(e) =>
          atualizarDenuncia(denuncia.id, { status: e.target.value })
        }
      >
        <option value="Em andamento">Em andamento</option>
        <option value="Recebida">Recebida</option>
        <option value="Resolvida">Resolvida</option>
      </select>
    </label>
  );
}

function CardDetalheDenuncia({
  denuncia,
  expandido,
  definirExpandido,
  painelExpandido,
  aoAlternarPainelExpandido,
  definirChatAberto,
}) {
  if (!denuncia) {
    return (
      <aside className="acolhimento-detalhe acolhimento-detalhe--vazio">
        <p>Nenhuma denúncia selecionada.</p>
      </aside>
    );
  }

  const anexos =
    Array.isArray(denuncia.anexos) && denuncia.anexos.length > 0
      ? denuncia.anexos
      : ANEXOS_PADRAO;

  const totalMensagens = denuncia.mensagens ?? 0;

  if (painelExpandido) {
    return (
      <aside className="acolhimento-detalhe acolhimento-detalhe--expandido">
        <header className="acolhimento-exp-cabecalho">
          <div className="acolhimento-exp-titulo-bloco">
            <div className="acolhimento-exp-titulo-linha">
              <h2>Denúncia #{denuncia.id}</h2>
              <span className="acolhimento-exp-pilula">
                {denuncia.categoria}
              </span>
              <SeletorStatus denuncia={denuncia} />
            </div>

            <div className="acolhimento-detalhe-meta">
              <span>Recebida em {denuncia.data}</span>
              <span className="acolhimento-detalhe-separador" aria-hidden="true">|</span>
              <span className="acolhimento-detalhe-mensagens">
                <img src={iconeConversa} alt="" /> {totalMensagens}{" "}
                {totalMensagens === 1 ? "Mensagem" : "Mensagens"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="acolhimento-botao-expandir"
            aria-label="Recolher detalhes da denúncia"
            title="Recolher"
            onClick={aoAlternarPainelExpandido}
          >
            <IconeExpandir expandido />
          </button>
        </header>

        <div className="acolhimento-exp-corpo">
          <div className="acolhimento-exp-esquerda">
            <section className="acolhimento-exp-box acolhimento-exp-box-relato">
              <h3 className="acolhimento-exp-box-titulo">
                <IconeRelatoChat /> Relato
              </h3>
              <p className="acolhimento-exp-relato-texto">
                “{denuncia.relato}”
              </p>
            </section>

            <section className="acolhimento-exp-box acolhimento-exp-box-info">
              <h3 className="acolhimento-exp-box-titulo">
                <IconeInfoCirculo /> Informações
              </h3>

              <div className="acolhimento-info-lista">
                <div className="acolhimento-info">
                  <span>
                    <img src={iconeRelogio} alt="" /> Quando:
                  </span>
                  <small>{denuncia.data}</small>
                </div>
                <div className="acolhimento-info">
                  <span>
                    <img src={iconeLocal} alt="" /> Onde:
                  </span>
                  <small>{denuncia.local || "Não informado"}</small>
                </div>
                <div className="acolhimento-info">
                  <span>
                    <img src={iconePessoas} alt="" /> Envolvidos
                  </span>
                  <small>{denuncia.envolvidos || "Não informado"}</small>
                </div>
              </div>
            </section>
          </div>

          <section className="acolhimento-exp-anexos">
            <h3 className="acolhimento-exp-anexos-titulo">
              <IconeClipe /> Anexos ({anexos.length})
            </h3>

            <div className="acolhimento-anexos-grade">
              {anexos.map((anexo, indice) => {
                const url = typeof anexo === "string" ? anexo : anexo.url;
                const rotulo =
                  typeof anexo === "string"
                    ? `Anexo ${indice + 1}`
                    : anexo.rotulo || `Anexo ${indice + 1}`;

                return (
                  <div
                    key={anexo.id ?? indice}
                    className="acolhimento-anexo-item"
                    title={rotulo}
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={rotulo}
                        className="acolhimento-anexo-foto"
                      />
                    ) : (
                      <span className="acolhimento-anexo-placeholder">
                        <IconeImagemPlaceholder />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="acolhimento-abrir-chat"
              onClick={() => definirChatAberto(true)}
            >
              <img src={iconeChat} alt="" /> Abrir chat
            </button>
          </section>
        </div>
      </aside>
    );
  }

  return (
    <aside className="acolhimento-detalhe">
      <div className="acolhimento-detalhe-cabecalho">
        <h2>Denúncia #{denuncia.id}</h2>
        <button
          type="button"
          className="acolhimento-botao-expandir"
          aria-label="Expandir detalhes da denúncia"
          title="Expandir"
          onClick={aoAlternarPainelExpandido}
        >
          <IconeExpandir expandido={false} />
        </button>
      </div>

      <div className="acolhimento-detalhe-topo">
        <strong>{denuncia.categoria}</strong>
        <SeletorStatus denuncia={denuncia} />
      </div>

      <div className="acolhimento-detalhe-meta">
        <span>Recebida em {denuncia.data}</span>
        <span className="acolhimento-detalhe-mensagens">
          <img src={iconeConversa} alt="" /> {totalMensagens}{" "}
          {totalMensagens === 1 ? "Mensagem" : "Mensagens"}
        </span>
      </div>

      <div className="acolhimento-detalhe-secao">
        <h3>Relato</h3>
        <p className={`acolhimento-relato${expandido ? " expandido" : ""}`}>
          “{denuncia.relato}”
        </p>
        <button
          className="acolhimento-vermais"
          type="button"
          onClick={() => definirExpandido(!expandido)}
        >
          <svg
            className={expandido ? "virada" : ""}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3.5 6L8 10.5L12.5 6" />
          </svg>
          {expandido ? "Ver menos" : "Ver mais"}
        </button>
      </div>

      <div className="acolhimento-detalhe-secao">
        <h3>Informações</h3>
        <div className="acolhimento-info-lista">
          <div className="acolhimento-info">
            <span>
              <img src={iconeRelogio} alt="" /> Quando:
            </span>
            <small>{denuncia.data}</small>
          </div>
          <div className="acolhimento-info">
            <span>
              <img src={iconeLocal} alt="" /> Onde:
            </span>
            <small>{denuncia.local || "Não informado"}</small>
          </div>
          <div className="acolhimento-info">
            <span>
              <img src={iconePessoas} alt="" /> Envolvidos
            </span>
            <small>{denuncia.envolvidos || "Não informado"}</small>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="acolhimento-abrir-chat"
        onClick={() => definirChatAberto(true)}
      >
        <img src={iconeChat} alt="" /> Abrir chat
      </button>
    </aside>
  );
}

export default CardDetalheDenuncia;