import Icone from "../../../Gerais/Icone/Icone.jsx";
import "./CardItemDado.css";

function CardItemDado({ iconeInicial, tamanhoDoIconeInicial = 24, titulo, subtitulo, detalhe, conteudoFinal, aoClicar }) {
  return (
    <div className={aoClicar ? "bloom-lista-item estado-clicavel" : "bloom-lista-item"} onClick={aoClicar}>
      <Icone icone={iconeInicial} tamanho={tamanhoDoIconeInicial} className="bloom-lista-item-icone" />

      <div className="bloom-lista-item-corpo">
        <span className="bloom-lista-item-titulo">{titulo}</span>
        {subtitulo && <span className="bloom-lista-item-subtitulo">{subtitulo}</span>}
      </div>

      {detalhe && <div className="bloom-lista-item-detalhe">{detalhe}</div>}
      {conteudoFinal && <div className="bloom-lista-item-final">{conteudoFinal}</div>}
    </div>
  );
}

export default CardItemDado;
