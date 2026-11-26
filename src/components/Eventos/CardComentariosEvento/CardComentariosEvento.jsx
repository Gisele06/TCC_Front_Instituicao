import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Abas, { ConteudoAba } from "../../Gerais/Abas/Abas.jsx";
import Input from "../../Gerais/Input/Input.jsx";
import iconeBusca from "../../../img/icones/busca.png";
import "./CardComentariosEvento.css";

const FILTROS_COMENTARIOS = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "maisCurtidos", rotulo: "Mais curtidos" },
  { valor: "respondidos", rotulo: "Respondidos" },
  { valor: "semResposta", rotulo: "Sem resposta" },
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

function IconeCoracao() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

function IconeBalao() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CardComentariosEvento({
  permitirComentarios,
  aoAlternarPermitir,
  comentarios = [],
  aoResponderComentario,
  aoRemoverComentario,
  aoRemoverResposta,
}) {
  const [filtroAtivo, definirFiltroAtivo] = useState("todos");
  const [busca, definirBusca] = useState("");
  const [respondendoId, definirRespondendoId] = useState(null);
  const [textoResposta, definirTextoResposta] = useState("");

  const totalCurtidas = comentarios.reduce(
    (soma, item) => soma + (Number(item.curtidas) || 0),
    0,
  );
  const totalRespondidos = comentarios.filter(
    (item) => Array.isArray(item.respostas) && item.respostas.length > 0,
  ).length;

  const comentariosFiltrados = useMemo(() => {
    const termo = normalizarTexto(busca.trim());

    const base = comentarios.filter((item) => {
      const temResposta =
        Array.isArray(item.respostas) && item.respostas.length > 0;

      if (filtroAtivo === "respondidos" && !temResposta) return false;
      if (filtroAtivo === "semResposta" && temResposta) return false;

      if (!termo) return true;
      const alvo = normalizarTexto(
        `${item.autorNome || ""} ${item.apelido || ""} ${item.texto || ""}`,
      );
      return alvo.includes(termo);
    });

    if (filtroAtivo === "maisCurtidos") {
      return [...base].sort(
        (a, b) => (Number(b.curtidas) || 0) - (Number(a.curtidas) || 0),
      );
    }

    return base;
  }, [comentarios, filtroAtivo, busca]);

  function abrirResposta(comentarioId) {
    if (respondendoId === comentarioId) {
      definirRespondendoId(null);
      definirTextoResposta("");
      return;
    }
    definirRespondendoId(comentarioId);
    definirTextoResposta("");
  }

  function enviarResposta(comentarioId) {
    const limpo = textoResposta.trim();
    if (!limpo) return;
    aoResponderComentario(comentarioId, limpo);
    definirRespondendoId(null);
    definirTextoResposta("");
  }

  return (
    <section
      className="evento-comentarios-painel"
      aria-label="Comentários na publicação do evento"
    >
      <div className="evento-comentarios-topo">
        <div className="evento-comentarios-topo-texto">
          <h2>Comentários da publicação</h2>
          <p>
            Acompanhe a interação dos estudantes na publicação do evento,
            responda dúvidas ou remova comentários inadequados.
          </p>
        </div>

        <div className="evento-comentarios-status-caixa">
          <div className="evento-comentarios-contadores">
            <span className="evento-comentarios-pill">
              <strong>{comentarios.length}</strong>{" "}
              {comentarios.length === 1 ? "Comentário" : "Comentários"}
            </span>
            <span className="evento-comentarios-pill">
              <strong>{totalCurtidas}</strong> Curtidas
            </span>
            <span className="evento-comentarios-pill evento-comentarios-pill--verde">
              <strong>{totalRespondidos}</strong> Respondidos
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={permitirComentarios}
            className={`evento-comentarios-switch-btn${
              permitirComentarios ? " evento-comentarios-switch-btn--ativo" : ""
            }`}
            onClick={() => aoAlternarPermitir(!permitirComentarios)}
          >
            <span>
              {permitirComentarios
                ? "Comentários abertos"
                : "Comentários desativados"}
            </span>
            <span className="evento-switch-trilho" aria-hidden="true">
              <span className="evento-switch-bolinha" />
            </span>
          </button>
        </div>
      </div>

      {!permitirComentarios && (
        <div className="evento-comentarios-aviso" role="status">
          <span className="evento-comentarios-aviso-icone" aria-hidden="true">
            !
          </span>
          <p>
            Novos comentários estão desativados na publicação deste evento. Você
            ainda pode visualizar e moderar os comentários anteriores.
          </p>
          <button
            type="button"
            className="evento-comentarios-aviso-btn"
            onClick={() => aoAlternarPermitir(true)}
          >
            Ativar comentários
          </button>
        </div>
      )}

      <div className="evento-comentarios-ferramentas">
        <div className="evento-comentarios-filtros-wrap">
          <Abas
            className="evento-comentarios-abas"
            tamanho="compacto"
            itens={FILTROS_COMENTARIOS}
            valor={filtroAtivo}
            aoMudar={definirFiltroAtivo}
          />
        </div>

        <Input
          tipo="busca"
          classeName="evento-comentarios-busca"
          placeholder="Buscar comentário ou estudante"
          valor={busca}
          aoAlterar={(e) => definirBusca(e.target.value)}
          icone={<img src={iconeBusca} alt="" />}
          tamanhoDoIcone="18px"
        />
      </div>

      <ConteudoAba
        chave={filtroAtivo}
        className="evento-comentarios-lista-wrap"
      >
        <div className="evento-comentarios-lista">
          {comentariosFiltrados.length === 0 ? (
            <div className="evento-comentarios-vazio">
              <span className="evento-comentarios-vazio-icone">
                <IconeBalao />
              </span>
              <strong>
                {comentarios.length === 0
                  ? "Nenhum comentário nesta publicação ainda"
                  : "Nenhum comentário encontrado para esse filtro"}
              </strong>
              <p>
                {comentarios.length === 0
                  ? "Quando os estudantes comentarem na página do evento, as mensagens aparecerão aqui."
                  : "Tente limpar a pesquisa ou selecionar outro filtro."}
              </p>
            </div>
          ) : (
            comentariosFiltrados.map((comentario) => {
              const abertoResposta = respondendoId === comentario.id;
              const respostas = Array.isArray(comentario.respostas)
                ? comentario.respostas
                : [];

              return (
                <article key={comentario.id} className="evento-comentario-card">
                  <aside className="evento-comentario-perfil">
                    <div
                      className="evento-comentario-avatar"
                      aria-hidden="true"
                    >
                      {comentario.autorFoto ? (
                        <img src={comentario.autorFoto} alt="" />
                      ) : (
                        <span>{obterIniciais(comentario.autorNome)}</span>
                      )}
                    </div>

                    <strong className="evento-comentario-nome">
                      {comentario.autorNome || "Estudante"}
                    </strong>

                    {comentario.apelido && (
                      <span className="evento-comentario-apelido">
                        “{comentario.apelido}”
                      </span>
                    )}

                    <dl className="evento-comentario-stats">
                      {comentario.registro && (
                        <div>
                          <dt>Registro:</dt>
                          <dd>{comentario.registro}</dd>
                        </div>
                      )}
                      {comentario.mensagens != null && (
                        <div>
                          <dt>Mensagens:</dt>
                          <dd>{comentario.mensagens}</dd>
                        </div>
                      )}
                    </dl>
                  </aside>

                  <div className="evento-comentario-conteudo">
                    <header className="evento-comentario-cabecalho">
                      <span className="evento-comentario-data">
                        {comentario.data}
                      </span>

                      <button
                        type="button"
                        className="evento-comentario-remover"
                        aria-label={`Remover comentário de ${comentario.autorNome || "estudante"}`}
                        title="Remover comentário"
                        onClick={() => aoRemoverComentario(comentario.id)}
                      >
                        <IconeLixeira />
                        <span>Remover</span>
                      </button>
                    </header>

                    <p className="evento-comentario-texto">
                      {comentario.texto}
                    </p>

                    {respostas.length > 0 && (
                      <div className="evento-comentario-respostas">
                        {respostas.map((resp) => (
                          <div
                            key={resp.id}
                            className="evento-comentario-resposta-item"
                          >
                            <div className="evento-comentario-resposta-topo">
                              <span className="evento-comentario-resposta-autor">
                                {resp.autor || "Coordenação"}
                              </span>
                              <span className="evento-comentario-resposta-data">
                                {resp.data}
                              </span>
                              {aoRemoverResposta && (
                                <button
                                  type="button"
                                  className="evento-comentario-resposta-excluir"
                                  onClick={() =>
                                    aoRemoverResposta(comentario.id, resp.id)
                                  }
                                >
                                  Excluir
                                </button>
                              )}
                            </div>
                            <p>{resp.texto}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <AnimatePresence initial={false}>
                      {abertoResposta && (
                        <motion.div
                          className="evento-comentario-responder-box"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.2,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <textarea
                            rows={2}
                            placeholder="Escreva uma resposta oficial da instituição..."
                            value={textoResposta}
                            onChange={(e) =>
                              definirTextoResposta(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                enviarResposta(comentario.id);
                              }
                            }}
                          />
                          <div className="evento-comentario-responder-acoes">
                            <button
                              type="button"
                              className="evento-comentario-btn-cancelar"
                              onClick={() => abrirResposta(comentario.id)}
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              className="evento-comentario-btn-enviar"
                              disabled={!textoResposta.trim()}
                              onClick={() => enviarResposta(comentario.id)}
                            >
                              Enviar resposta
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <footer className="evento-comentario-rodape">
                      <button
                        type="button"
                        className="evento-comentario-responder-link"
                        onClick={() => abrirResposta(comentario.id)}
                      >
                        {abertoResposta ? "Fechar resposta" : "Responder"}
                      </button>

                      <span className="evento-comentario-curtidas">
                        <IconeCoracao />
                        <span>Gostei ({comentario.curtidas ?? 0})</span>
                      </span>
                    </footer>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </ConteudoAba>
    </section>
  );
}

export default CardComentariosEvento;