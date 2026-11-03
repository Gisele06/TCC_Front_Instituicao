import { useEffect, useState, type FormEvent } from "react";
import lock from "../../../../assets/icons/Geral/cadeado.png";
import peopleChat from "../../../../assets/icons/Acolhimento/people_chat.svg";
import sent from "../../../../assets/icons/Acolhimento/sent.png";
import person from "../../../../assets/icons/Acolhimento/person.svg";
import type { MensagemDenunciaRegistro } from "../../../../types/banco";
import { fonteDisponivel, listarRegistros, salvarRegistro } from "../../../../services/recursos";
import { rotasApi } from "../../../../services/rotasApi";
import "./AnonymousChat.css";

interface Mensagem {
  id: number;
  autor: "voce" | "aluno";
  texto: string;
  horario: string;
}
interface Props {
  aberto: boolean;
  aoFechar: () => void;
  denunciaId: number;
}
export default function AnonymousChat({ aberto, aoFechar, denunciaId }: Props) {
  const [texto, definirTexto] = useState("");
  const [mensagens, definirMensagens] = useState<Mensagem[]>([]);
  const [erro, definirErro] = useState("");
  const [enviando, definirEnviando] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    let ativo = true;
    const fecharAoEscapar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", fecharAoEscapar);

    listarRegistros<MensagemDenunciaRegistro>(rotasApi.mensagensDenuncia(denunciaId))
      .then((lista) => {
        if (!ativo) return;
        definirMensagens(lista.map((mensagem) => ({
          id: mensagem.id,
          texto: mensagem.texto,
          autor: mensagem.enviada_pela_instituicao ? "voce" : "aluno",
          horario: mensagem.data_hora.replace("T", " ").slice(11, 16),
        })));
      })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar as mensagens.");
      });
    return () => {
      ativo = false;
      window.removeEventListener("keydown", fecharAoEscapar);
    };
  }, [aberto, denunciaId, aoFechar]);

  if (!aberto) return null;

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const mensagem = texto.trim();
    if (!mensagem || !fonteDisponivel()) return;
    definirEnviando(true);
    definirErro("");
    try {
      // O backend deve identificar o chat da denúncia e validar a permissão de envio.
      const resposta = await salvarRegistro<MensagemDenunciaRegistro>(
        rotasApi.mensagensDenuncia(denunciaId),
        { texto: mensagem },
      );
      definirMensagens((atual) => [...atual, {
        id: resposta.id,
        autor: "voce",
        texto: resposta.texto,
        horario: resposta.data_hora.replace("T", " ").slice(11, 16),
      }]);
      definirTexto("");
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : "Não foi possível enviar a mensagem.");
    } finally {
      definirEnviando(false);
    }
  }

  return (
    <div className="chat-sobreposicao" onMouseDown={(evento) => {
      if (evento.target === evento.currentTarget) aoFechar();
    }}>
      <section className="chat-anonimo" role="dialog" aria-modal="true" aria-label={`Chat da denúncia ${denunciaId}`}>
        <button className="chat-voltar" onClick={aoFechar} type="button"><span aria-hidden="true">‹</span> Voltar</button>
        <h2>Chat anônimo</h2>
        <p className="chat-protecao">
          <img src={lock} alt="" /> O acesso e o sigilo devem ser protegidos pelo backend.
        </p>
        <div className="chat-mensagens" aria-live="polite">
          {mensagens.map((mensagem) => (
            <div key={mensagem.id} className={`chat-linha ${mensagem.autor}`}>
              {mensagem.autor === "aluno" && <div className="chat-avatar aluno"><img src={person} alt="Aluno" /></div>}
              <div className="chat-balao">
                <small>{mensagem.autor === "voce" ? "Você" : "Aluno"} — {mensagem.horario}</small>
                <p>{mensagem.texto}</p>
              </div>
              {mensagem.autor === "voce" && <div className="chat-avatar"><img src={peopleChat} alt="Você" /></div>}
            </div>
          ))}
          {mensagens.length === 0 && <p>Nenhuma mensagem disponível.</p>}
          {erro && <p role="alert">{erro}</p>}
        </div>
        <form className="chat-formulario" onSubmit={enviar}>
          <input aria-label="Escrever mensagem" value={texto}
            onChange={(evento) => definirTexto(evento.target.value)}
            placeholder={fonteDisponivel() ? "Escrever mensagem" : "Aguardando integração com a API"}
            disabled={!fonteDisponivel() || enviando} />
          <button type="submit" aria-label="Enviar mensagem" disabled={!texto.trim() || !fonteDisponivel() || enviando}>
            <img src={sent} alt="" />
          </button>
        </form>
      </section>
    </div>
  );
}
