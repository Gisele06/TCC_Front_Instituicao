import "./CardBoasVindas.css";

function CardBoasVindas({ textoAcimaDoTitulo, tituloDeBoasVindas, textoDeBoasVindas, imagemDeFundo }) {
  return (
    <div className="bloom-destaque-faixa">
      <div className="bloom-destaque-faixa-imagem">{imagemDeFundo}</div>
      <div className="bloom-destaque-faixa-conteudo">
        {textoAcimaDoTitulo && <span className="bloom-destaque-faixa-microtitulo">{textoAcimaDoTitulo}</span>}
        <h2>{tituloDeBoasVindas}</h2>
        {textoDeBoasVindas && <p>Trabalhando muito hoje?</p>}
        <span className="bloom-destaque-faixa-detalhe" aria-hidden="true" />
      </div>
    </div>
  );
}

export default CardBoasVindas;
