import "./TituloSecao.css";

function TituloSecao({ titulo, subtitulo, acoes, className = "" }) {
  return (
    <div
      className={`bloom-pagina-cabecalho${className ? ` ${className}` : ""}`}
    >
      <div className="bloom-pagina-cabecalho-texto">
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {acoes && <div className="bloom-pagina-cabecalho-acoes">{acoes}</div>}
    </div>
  );
}

export default TituloSecao;