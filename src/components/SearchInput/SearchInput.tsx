import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import "./SearchInput.css";

interface PropriedadesCampoDeBusca {
  textoDeAjuda?: string;
  valor?: string;
  aoMudar?: (valor: string) => void;
  icone?: ReactNode;
  tamanhoDoIcone?: number | string;
  className?: string;
}

function CampoDeBusca({ textoDeAjuda, valor, aoMudar, icone, tamanhoDoIcone = "clamp(14px, 1.6vw, 18px)", className = "" }: PropriedadesCampoDeBusca) {
  return (
    <label className={"bloom-busca " + className}>
      <AreaIcone icone={icone} rotulo="busca" tamanho={tamanhoDoIcone} />
      <input
        type="text"
        placeholder={textoDeAjuda}
        value={valor}
        readOnly={!aoMudar}
        onChange={(evento) => aoMudar && aoMudar(evento.target.value)}
      />
    </label>
  );
}

export default CampoDeBusca;
