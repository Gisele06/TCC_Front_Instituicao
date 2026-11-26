import Icone from "../../../Gerais/Icone/Icone.jsx";
import Selo from "../../../BemEstar/Selo/Selo.jsx";
import "./CardIndicador.css";

function renderizarVariacao(texto) {
  const correspondencia = String(texto).match(/^([+-]?\d+(?:[.,]\d+)?%?)(.*)$/);
  if (!correspondencia) return <span>{texto}</span>;

  return (
    <span className="bloom-indicador-cartao-variacao-texto">
      <strong className="bloom-indicador-cartao-variacao-destaque">
        {correspondencia[1]}
      </strong>
      {correspondencia[2]}
    </span>
  );
}

function CardIndicador({
  icone,
  rotulo,
  textoDoSelo,
  estiloDoSelo = "bom",
  valor,
  iconeDaVariacao,
  textoDaVariacao,
  iconeSeta,
  aoClicar,
}) {
  return (
    <div
      className={`bloom-indicador-cartao${aoClicar ? " bloom-indicador-cartao--clicavel" : ""}`}
      onClick={aoClicar}
    >
      <div className="bloom-indicador-cartao-cabecalho">
        <Icone
          icone={icone}
          tamanho="clamp(28px, 2.3vw, 36px)"
          className="bloom-indicador-cartao-icone"
        />
        <span className="bloom-indicador-cartao-rotulo">{rotulo}</span>
        {textoDoSelo && <Selo estilo={estiloDoSelo}>{textoDoSelo}</Selo>}
      </div>

      <div className="bloom-indicador-cartao-valor">{valor}</div>

      <div className="bloom-indicador-cartao-rodape">
        {textoDaVariacao && (
          <span className="bloom-indicador-cartao-variacao">
            <Icone
              icone={iconeDaVariacao}
              rotulo="^"
              tamanho="clamp(15px, 1.2vw, 19px)"
            />
            {renderizarVariacao(textoDaVariacao)}
          </span>
        )}
        {iconeSeta && (
          <Icone
            icone={iconeSeta}
            rotulo=">"
            tamanho="clamp(15px, 1.25vw, 19px)"
            className="bloom-indicador-cartao-seta"
          />
        )}
      </div>
    </div>
  );
}

export default CardIndicador;