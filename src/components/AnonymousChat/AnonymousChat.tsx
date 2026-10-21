import { useEffect, useState } from "react";
import lock from "../../assets/icons/cadeado.png";
import people from "../../assets/icons/Acolhimento/people.png";
import sent from "../../assets/icons/Acolhimento/sent.png";
import "./AnonymousChat.css";

type Mensagem = {
  id: number;
  autor: "voce" | "aluno";
  texto: string;
  horario: string;
};
interface Props {
  aberto: boolean;
  aoFechar: () => void;
  denunciaId: number;
}
export default function AnonymousChat({ aberto, aoFechar, denunciaId }: Props) {
  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      autor: "voce",
      horario: "10:42",
      texto: "Olá, gostaríamos de entender melhor o que aconteceu?",
    },
    {
      id: 2,
      autor: "aluno",
      horario: "10:50",
      texto:
        "Estou muito triste com o que vem acontecendo todos os dias comigo me sinto triste, e vazio....",
    },
  ]);
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoFechar]);
  if (!aberto) return null;
  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setMensagens((atual) => [
      ...atual,
      {
        id: Date.now(),
        autor: "voce",
        texto: texto.trim(),
        horario: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setTexto("");
  };
  return (
    <div
      className="chat-sobreposicao"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
    >
      <section
        className="chat-anonimo"
        role="dialog"
        aria-modal="true"
        aria-label={`Chat anônimo da denúncia ${denunciaId}`}
      >
        <button className="chat-voltar" onClick={aoFechar} type="button">
          <span aria-hidden="true">‹</span> Voltar
        </button>
        <h2>Chat anônimo</h2>
        <p className="chat-protecao">
          <img src={lock} alt="" /> Sua identidade permanece protegida
        </p>
        <div className="chat-mensagens" aria-live="polite">
          {mensagens.map((mensagem) => (
            <div key={mensagem.id} className={`chat-linha ${mensagem.autor}`}>
              {mensagem.autor === "aluno" && (
                <div className="chat-avatar aluno" aria-label="Aluno"></div>
              )}
              <div className="chat-balao">
                <small>
                  {mensagem.autor === "voce" ? "Você" : "Aluno"} - Hoje,{" "}
                  {mensagem.horario}
                </small>
                <p>{mensagem.texto}</p>
              </div>
              {mensagem.autor === "voce" && (
                <div className="chat-avatar">
                  <img src={people} alt="Você" />
                </div>
              )}
            </div>
          ))}
        </div>
        <form className="chat-formulario" onSubmit={enviar}>
          <input
            aria-label="Escrever mensagem"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escrever mensagem"
          />
          <button
            type="submit"
            aria-label="Enviar mensagem"
            disabled={!texto.trim()}
          >
            <img src={sent} alt="" />
          </button>
        </form>
      </section>
    </div>
  );
}
