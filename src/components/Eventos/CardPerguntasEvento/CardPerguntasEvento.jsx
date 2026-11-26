import { useMemo, useState } from "react";
import Input from "../../Gerais/Input/Input.jsx";
import iconeBusca from "../../../img/icones/busca.png";
import Abas, { ConteudoAba } from "../../Gerais/Abas/Abas.jsx";
import "./CardPerguntasEvento.css";

const FILTROS_PERGUNTAS = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "identificadas", rotulo: "Identificadas" },
  { valor: "anonimas", rotulo: "Anônimas" },
  { valor: "respondidas", rotulo: "Respondidas" },
];

function obterIniciais(nome = "") {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "E";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

function normalizarTexto(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function IconeInterrogacao({ tamanho = 20 }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.6-2.4 2.1-2.4 3.5"
        stroke="#f7f6ee"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17.1" r="1.1" fill="#f7f6ee" />
    </svg>
  );
}

function IconeUsuario() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0H4.5Z" />
    </svg>
  );
}

function IconeCheckCirculo() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

function CardPerguntasEvento({
  permitirPerguntas,
  aoAlternarPermitir,
  perguntas = [],
  aoAlternarRespondida,
  aoRemoverPergunta,
}) {
  const [filtroAtivo, definirFiltroAtivo] = useState("todas");
  const [busca, definirBusca] = useState("");

  const totalAnonimas = perguntas.filter((p) => p.anonima).length;
  const totalIdentificadas = perguntas.length - totalAnonimas;
  const totalRespondidas = perguntas.filter((p) => p.respondida).length;

  const perguntasFiltradas = useMemo(() => {
    const termo = normalizarTexto(busca.trim());

    return perguntas.filter((item) => {
      if (filtroAtivo === "anonimas" && !item.anonima) return false;
      if (filtroAtivo === "identificadas" && item.anonima) return false;
      if (filtroAtivo === "respondidas" && !item.respondida) return false;

      if (!termo) return true;
      const alvo = normalizarTexto(
        `${item.texto} ${item.anonima ? "anonima" : `${item.autorNome || ""} ${item.turma || ""}`}`,
      );
      return alvo.includes(termo);
    });
  }, [perguntas, filtroAtivo, busca]);

  return (
    <section
      className="evento-perguntas-painel"
      aria-label="Perguntas enviadas pelos estudantes"
    >
      <div className="evento-perguntas-topo">
        <div className="evento-perguntas-topo-texto">
          <h2>Perguntas dos estudantes</h2>
          <p>
            Acompanhe as dúvidas enviadas pela área estudantil e organize o que
            será respondido durante o evento.
          </p>
        </div>

        <div className="evento-perguntas-status-caixa">
          <div className="evento-perguntas-contadores">
            <span className="evento-perguntas-pill">
              <strong>{perguntas.length}</strong>{" "}
              {perguntas.length === 1 ? "Total" : "Totais"}
            </span>
            <span className="evento-perguntas-pill">
              <strong>{totalIdentificadas}</strong> Identificadas
            </span>
            <span className="evento-perguntas-pill">
              <strong>{totalAnonimas}</strong> Anônimas
            </span>
            <span className="evento-perguntas-pill evento-perguntas-pill--verde">
              <strong>{totalRespondidas}</strong> Respondidas
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={permitirPerguntas}
            className={`evento-perguntas-switch-btn${
              permitirPerguntas ? " evento-perguntas-switch-btn--ativo" : ""
            }`}
            onClick={() => aoAlternarPermitir(!permitirPerguntas)}
          >
            <span>
              {permitirPerguntas
                ? "Perguntas abertas"
                : "Perguntas desativadas"}
            </span>
            <span className="evento-switch-trilho" aria-hidden="true">
              <span className="evento-switch-bolinha" />
            </span>
          </button>
        </div>
      </div>

      {!permitirPerguntas && (
        <div className="evento-perguntas-aviso" role="status">
          <span className="evento-perguntas-aviso-icone" aria-hidden="true">
            !
          </span>
          <p>
            O envio de perguntas está desativado para este evento. Os estudantes
            não verão o formulário até que você ative esta opção.
          </p>
          <button
            type="button"
            className="evento-perguntas-aviso-btn"
            onClick={() => aoAlternarPermitir(true)}
          >
            Permitir perguntas
          </button>
        </div>
      )}

      <div className="evento-perguntas-ferramentas">
        <div className="evento-perguntas-filtros-wrap">
          <Abas
            className="evento-perguntas-abas"
            tamanho="compacto"
            itens={FILTROS_PERGUNTAS}
            valor={filtroAtivo}
            aoMudar={definirFiltroAtivo}
          />
        </div>

        <Input
          tipo="busca"
          classeName="evento-perguntas-busca"
          placeholder="Buscar pergunta ou estudante"
          valor={busca}
          aoAlterar={(e) => definirBusca(e.target.value)}
          icone={<img src={iconeBusca} alt="" />}
          tamanhoDoIcone="18px"
        />
      </div>

      <ConteudoAba chave={filtroAtivo} className="evento-perguntas-lista-wrap">
        <div className="evento-perguntas-lista">
          {perguntasFiltradas.length === 0 ? (
            <div className="evento-perguntas-vazio">
              <span className="evento-perguntas-vazio-icone">
                <IconeInterrogacao tamanho={34} />
              </span>
              <strong>
                {perguntas.length === 0
                  ? "Nenhuma pergunta recebida ainda"
                  : "Nenhuma pergunta encontrada para esse filtro"}
              </strong>
              <p>
                {perguntas.length === 0
                  ? "Assim que o evento for publicado com perguntas ativadas, as dúvidas enviadas pelos estudantes aparecerão aqui."
                  : "Tente limpar a busca ou selecionar outra categoria de filtro."}
              </p>
            </div>
          ) : (
            perguntasFiltradas.map((pergunta) => (
              <article
                key={pergunta.id}
                className={`evento-pergunta-card${
                  pergunta.respondida ? " evento-pergunta-card--respondida" : ""
                }`}
              >
                <div
                  className={`evento-pergunta-avatar${
                    pergunta.anonima ? " evento-pergunta-avatar--anonimo" : ""
                  }`}
                  aria-hidden="true"
                >
                  {pergunta.anonima ? (
                    <IconeInterrogacao tamanho={26} />
                  ) : pergunta.autorFoto ? (
                    <img src={pergunta.autorFoto} alt="" />
                  ) : (
                    <span>{obterIniciais(pergunta.autorNome)}</span>
                  )}
                </div>

                <div className="evento-pergunta-corpo">
                  <div className="evento-pergunta-meta">
                    <strong className="evento-pergunta-autor">
                      {pergunta.anonima
                        ? "Estudante anônimo"
                        : pergunta.autorNome || "Estudante"}
                    </strong>

                    {!pergunta.anonima && pergunta.turma && (
                      <span className="evento-pergunta-turma">
                        {pergunta.turma}
                      </span>
                    )}

                    <span className="evento-pergunta-data">
                      {pergunta.data}
                    </span>

                    <span
                      className={`evento-pergunta-selo${
                        pergunta.anonima
                          ? " evento-pergunta-selo--anonima"
                          : " evento-pergunta-selo--identificada"
                      }`}
                    >
                      {pergunta.anonima ? (
                        <>
                          <IconeInterrogacao tamanho={14} />
                          Pergunta anônima
                        </>
                      ) : (
                        <>
                          <IconeUsuario />
                          Identificada
                        </>
                      )}
                    </span>

                    {pergunta.respondida && (
                      <span className="evento-pergunta-selo evento-pergunta-selo--respondida">
                        <IconeCheckCirculo />
                        Respondida
                      </span>
                    )}
                  </div>

                  <p className="evento-pergunta-texto">{pergunta.texto}</p>
                </div>

                <div className="evento-pergunta-acoes">
                  <button
                    type="button"
                    className={`evento-pergunta-acao${
                      pergunta.respondida ? " evento-pergunta-acao--ativa" : ""
                    }`}
                    onClick={() => aoAlternarRespondida(pergunta.id)}
                  >
                    <IconeCheckCirculo />
                    <span>
                      {pergunta.respondida ? "Respondida" : "Marcar respondida"}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="evento-pergunta-remover"
                    aria-label="Remover pergunta"
                    title="Remover pergunta"
                    onClick={() => aoRemoverPergunta(pergunta.id)}
                  >
                    <IconeLixeira />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </ConteudoAba>
    </section>
  );
}

export default CardPerguntasEvento;
