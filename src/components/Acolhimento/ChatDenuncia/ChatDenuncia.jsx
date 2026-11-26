import { useEffect, useRef, useState } from "react";
import Input from "../../Gerais/Input/Input.jsx";
import {
  obterMensagens,
  enviarMensagem,
} from "../../../js/Rotas_ACOLHIMENTO/rotas_ACOLHIMENTO.js";
import iconeCadeado from "../../../img/icones/cadeado.png";
import iconePessoasConversa from "../../../img/icones/Acolhimento/pessoasConversa.svg";
import iconeEnviar from "../../../img/icones/Acolhimento/enviar.png";
import iconePessoa from "../../../img/icones/Acolhimento/pessoa.svg";
import "./ChatDenuncia.css";

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

export default function ChatDenuncia({
  aoFechar,
  denuncia,
  denunciaId,
  painelExpandido,
  aoAlternarPainelExpandido,
}) {
  const [texto, definirTexto] = useState("");
  const mensagens = obterMensagens(denunciaId);
  const fimListaRef = useRef(null);

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aoFechar]);

  useEffect(() => {
    fimListaRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensagens.length, denunciaId]);

  if (denunciaId == null) return null;

  const enviar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    try {
      enviarMensagem(denunciaId, texto.trim());
    } catch (erro) {
      window.alert(erro.message);
      return;
    }
    definirTexto("");
  };

  return (
    <section
      className={`chat-anonimo${painelExpandido ? " chat-anonimo--expandido" : ""}`}
      aria-label={`Chat anônimo da denúncia ${denunciaId}`}
    >
      <header className="chat-cabecalho-barra">
        <button className="chat-voltar" onClick={aoFechar} type="button">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar
        </button>

        <button
          type="button"
          className="acolhimento-botao-expandir"
          aria-label={painelExpandido ? "Recolher chat" : "Expandir chat"}
          title={painelExpandido ? "Recolher" : "Expandir"}
          onClick={aoAlternarPainelExpandido}
        >
          <IconeExpandir expandido={painelExpandido} />
        </button>
      </header>

      <div className="chat-titulo-bloco">
        <div className="chat-titulo-linha">
          <h2>Chat anônimo</h2>
          {denuncia && (
            <span className="chat-denuncia-tag">#{denuncia.id}</span>
          )}
        </div>
        <p className="chat-protecao">
          <img src={iconeCadeado} alt="" />
          Sua identidade permanece protegida
        </p>
      </div>

      <div className="chat-mensagens" aria-live="polite">
        {mensagens.length === 0 ? (
          <p className="chat-mensagens-vazio">
            Nenhuma mensagem ainda. Inicie a conversa com o estudante abaixo.
          </p>
        ) : (
          mensagens.map((mensagem) => (
            <div key={mensagem.id} className={`chat-linha ${mensagem.autor}`}>
              {mensagem.autor === "aluno" && (
                <div className="chat-avatar aluno" aria-label="Aluno">
                  <img src={iconePessoa} alt="Aluno" />
                </div>
              )}

              <div className="chat-balao">
                <small>
                  {mensagem.autor === "voce" ? "Você" : "Aluno"} -{" "}
                  {mensagem.data
                    ? new Date(mensagem.data).toLocaleDateString("pt-BR")
                    : "Hoje"}
                  {mensagem.horario ? `, ${mensagem.horario}` : ""}
                </small>
                <p>{mensagem.texto}</p>
              </div>

              {mensagem.autor === "voce" && (
                <div className="chat-avatar" aria-label="Você">
                  <img src={iconePessoasConversa} alt="Você" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={fimListaRef} />
      </div>

      <form className="chat-formulario" onSubmit={enviar}>
        <div className="chat-entrada-wrap">
          <Input
            tipo="texto"
            aria-label="Escrever mensagem"
            valor={texto}
            aoAlterar={(e) => definirTexto(e.target.value)}
            placeholder="Escrever mensagem"
          />
        </div>
        <button
          type="submit"
          className="chat-enviar-botao"
          aria-label="Enviar mensagem"
          disabled={!texto.trim()}
        >
          <img src={iconeEnviar} alt="" />
        </button>
      </form>
    </section>
  );
}