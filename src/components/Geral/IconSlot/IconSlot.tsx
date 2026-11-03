import type { ReactNode } from "react";
import "./IconSlot.css";

interface PropriedadesAreaIcone {
  icone?: ReactNode;
  rotulo?: string;
  tamanho?: number | string;
  className?: string;
}

function AreaIcone({ icone, rotulo = "ícone", tamanho = "1.2vw", className = "" }: PropriedadesAreaIcone) {
  return (
    <span className={"icone-espaco " + className} style={{ width: tamanho, height: tamanho }}>
      {icone ? icone : <span className="icone-espaco-dica">{rotulo}</span>}
    </span>
  );
}

export default AreaIcone;
