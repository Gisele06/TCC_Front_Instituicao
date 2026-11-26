import "./CardInformacao.css";

export default function CardInformacao({
  icone,
  valor,
  rotulo,
}) {
  return (
    <div className="card-informacao">
      <img
        className="card-informacao-icone"
        src={icone}
        alt=""
      />

      <div className="card-informacao-conteudo">
        <strong>{valor}</strong>
        <span>{rotulo}</span>
      </div>
    </div>
  );
}
