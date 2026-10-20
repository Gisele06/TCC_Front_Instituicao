import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import "./ListItemCard.css";

interface PropriedadesCartaoDeLista {
  iconeInicial?: ReactNode;
  tamanhoDoIconeInicial?: number | string;
  titulo: string;
  subtitulo?: string;
  detalhe?: ReactNode;
  conteudoFinal?: ReactNode;
  aoClicar?: () => void;
}

function CartaoDeLista({ iconeInicial, tamanhoDoIconeInicial = 24, titulo, subtitulo, detalhe, conteudoFinal, aoClicar }: PropriedadesCartaoDeLista) {
  return (
    <div className={aoClicar ? "bloom-lista-item estado-clicavel" : "bloom-lista-item"} onClick={aoClicar}>
      <AreaIcone icone={iconeInicial} tamanho={tamanhoDoIconeInicial} className="bloom-lista-item-icone" />

      <div className="bloom-lista-item-corpo">
        <span className="bloom-lista-item-titulo">{titulo}</span>
        {subtitulo && <span className="bloom-lista-item-subtitulo">{subtitulo}</span>}
      </div>

      {detalhe && <div className="bloom-lista-item-detalhe">{detalhe}</div>}
      {conteudoFinal && <div className="bloom-lista-item-final">{conteudoFinal}</div>}
    </div>
  );
}

export default CartaoDeLista;
