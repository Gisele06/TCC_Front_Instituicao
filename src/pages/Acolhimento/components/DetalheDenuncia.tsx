import { useState } from "react";
import type { Denuncia } from "../data/denuncias";
import relogio from "../../../assets/icons/Acolhimento/clock.png";
import local from "../../../assets/icons/Acolhimento/visit.png";
import pessoas from "../../../assets/icons/Acolhimento/people.png";
import chat from "../../../assets/icons/Acolhimento/chat.png";

interface Props {
  denuncia: Denuncia;
  aoAbrirChat: () => void;
}

export default function DetalheDenuncia({ denuncia, aoAbrirChat }: Props) {
  const [expandido, definirExpandido] = useState(false);

  return (
    <aside className="acolhimento-detalhe">
      <h2>Denúncia #{denuncia.id}</h2>
      <div className="acolhimento-detalhe-topo">
        <div>
          <strong>{denuncia.categoria}</strong>
          <small>Recebida em {denuncia.data}</small>
        </div>
        <span>{denuncia.status}</span>
      </div>

      <h3>Relato</h3>
      <p className={`acolhimento-relato ${expandido ? "expandido" : ""}`}>
        “{denuncia.relato}”
      </p>
      <button type="button" className="acolhimento-vermais" onClick={() => definirExpandido((valor) => !valor)}>
        {expandido ? "⌃ Ver menos" : "⌄ Ver mais"}
      </button>

      <h3>Informações</h3>
      <div className="acolhimento-info"><span><img src={relogio} alt="" /> Quando:</span><small>{denuncia.data}</small></div>
      <div className="acolhimento-info"><span><img src={local} alt="" /> Onde:</span><small>{denuncia.local}</small></div>
      <div className="acolhimento-info"><span><img src={pessoas} alt="" /> Envolvidos:</span><small>{denuncia.envolvidos}</small></div>
      <button type="button" className="acolhimento-abrir-chat" onClick={aoAbrirChat}>
        <img src={chat} alt="" /> Abrir chat
      </button>
    </aside>
  );
}
