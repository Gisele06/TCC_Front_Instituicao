import "./CardEstatisticas.css";
import { obterEstatisticas } from "../../../js/Rotas_ACOLHIMENTO/rotas_ACOLHIMENTO.js";
import CardInformacao from "./CardInformacao/CardInformacao.jsx";
import repeat from "../../../img/icones/Acolhimento/repetir.png";
import check from "../../../img/icones/Acolhimento/marcacao.png";
import clipboard from "../../../img/icones/prancheta.png";

const icones = { clipboard, repeat, check };

function CardEstatisticas() {
  const estatisticas = obterEstatisticas();
  return (
    <div className="acolhimento-estatisticas">
      <div className="cards-informacao">
        {estatisticas.map(({ icone, valor, rotulo }) => (
          <CardInformacao key={rotulo} icone={icones[icone]} valor={valor} rotulo={rotulo} />
        ))}
      </div>
    </div>
  );
}

export default CardEstatisticas;
