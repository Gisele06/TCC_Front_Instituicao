import "./Chat.css"
import { useState } from "react"

interface Mensagem {
    id: string;
    texto: string;
    remetente: string
}

export function ChatModal() {
  const [aberto, definirAberto] = useState(false);
  const [mensagens, definirMensagens] = useState<Mensagem[]>([
    { id: "1", texto: "Olá! gostaríamos de entender melhor o que aconteceu?", remetente: "suporte" }
  ]);
  
  const [textoInput, definirTextoInput] = useState("");

  const enviarMensagem = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!textoInput.trim()) return;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      texto: textoInput,
      remetente: "aluno"
    };

    definirMensagens((prev) => [...prev, novaMensagem]);
    definirTextoInput("");
  };

  return (
    <>
      <button 
        className="chat-trigger-btn" 
        onClick={() => definirAberto(true)}
      >
         Abrir Chat
      </button>

      {aberto && (
        <div className="chat-overlay" onClick={() => definirAberto(false)}>
          <div className="chat-modal-window" onClick={(e) => e.stopPropagation()}>
            <header className="chat-header">
              <h3>Suporte</h3>
              <button className="chat-close-btn" onClick={() => definirAberto(false)}>✕</button>
            </header>

            <div className="chat-messages">
              {mensagens.map((msg) => (
                <div key={msg.id} className={`mensagem ${msg.remetente}`}>
                  {msg.texto}
                </div>
              ))}
            </div>

            <form onSubmit={enviarMensagem} className="chat-input-area">
              <input
                type="text"
                value={textoInput}
                onChange={(e) => definirTextoInput(e.target.value)}
                placeholder="Digite sua mensagem..."
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}