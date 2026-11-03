import type { Denuncia } from "../data/denuncias";
import bolha from "../../../assets/icons/Acolhimento/chat-bubble.png";
import seta from "../../../assets/icons/Geral/chevron-right.png";

interface Props {
  denuncia: Denuncia;
  selecionada: boolean;
  aoSelecionar: () => void;
}

export default function CartaoDenuncia({ denuncia, selecionada, aoSelecionar }: Props) {
  return (
    <button
      type="button"
      className={`acolhimento-item ${selecionada ? "selecionado" : ""}`}
      onClick={aoSelecionar}
    >
      <div className="acolhimento-item-texto">
        <h3>#{denuncia.id} <span>{denuncia.categoria}</span></h3>
        <p>“{denuncia.resumo}”</p>
        <small><img src={bolha} alt="" /> {denuncia.mensagens == null ? "Mensagens não informadas" : `${denuncia.mensagens} mensagens`}</small>
      </div>
      <div className="acolhimento-item-lado">
        <small>{denuncia.data}</small>
        <span>{denuncia.status}</span>
      </div>
      <img className="acolhimento-chevron" src={seta} alt="" />
    </button>
  );
}
