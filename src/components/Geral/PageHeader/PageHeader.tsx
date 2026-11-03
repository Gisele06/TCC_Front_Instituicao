import type { ReactNode } from "react";
import "./PageHeader.css";

interface PropriedadesCabecalhoDePagina {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
  className?: string;
}

function CabecalhoDePagina({ titulo, subtitulo, acoes, className = "" }: PropriedadesCabecalhoDePagina) {
  return (
    <div className={"bloom-pagina-cabecalho " + className}>
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {acoes && <div className="bloom-pagina-cabecalho-acoes">{acoes}</div>}
    </div>
  );
}

export default CabecalhoDePagina;
