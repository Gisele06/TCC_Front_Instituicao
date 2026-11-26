import { IconeSetaVariacao } from "../../../Gerais/Icone/Icone.jsx";
import "./LinhaDeIndicador.css";

function LinhaDeIndicador({ icone, titulo, descricao, valor, variacao, sentido, tom }) {
  return (
    <div className="bloom-linha-indicador">
      <span className="bloom-linha-indicador-icone">{icone}</span>

      <div className="bloom-linha-indicador-texto">
        <strong>{titulo}</strong>
        <span>{descricao}</span>
      </div>

      <div className="bloom-linha-indicador-valor">
        <strong>{valor}</strong>
        <span className={`bloom-linha-indicador-variacao tom-${tom}`}>
          <IconeSetaVariacao sentido={sentido} />
          {variacao}
        </span>
      </div>
    </div>
  );
}

export default LinhaDeIndicador;
