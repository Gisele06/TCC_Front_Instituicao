import type { ReactNode } from "react";
import "./HeroBanner.css";

interface PropriedadesFaixaDeDestaque {
  textoAcimaDoTitulo?: string;
  tituloDeBoasVindas: string;
  textoDeBoasVindas?: string;
  imagemDeFundo?: ReactNode;
}

function FaixaDeDestaque({ textoAcimaDoTitulo, tituloDeBoasVindas, textoDeBoasVindas, imagemDeFundo }: PropriedadesFaixaDeDestaque) {
  return (
    <div className="bloom-destaque-faixa">
      <div className="bloom-destaque-faixa-imagem">{imagemDeFundo}</div>
      <div className="bloom-destaque-faixa-conteudo">
        {textoAcimaDoTitulo && <span className="bloom-destaque-faixa-microtitulo">{textoAcimaDoTitulo}</span>}
        <h2>{tituloDeBoasVindas}</h2>
        {textoDeBoasVindas && <p>{textoDeBoasVindas}</p>}
        <span className="bloom-destaque-faixa-detalhe" aria-hidden="true" />
      </div>
    </div>
  );
}

export default FaixaDeDestaque;
