import "./CardDistribuicao.css";
import BarraSegmentada from "./BarraSegmentada/BarraSegmentada.jsx";
import Painel from "../Painel/Painel.jsx";
import { iconesBemEstar } from "../../../js/Rotas_BEM_ESTAR/iconesBemEstar.js";

function CardDistribuicao({ distribuicao }) {
  return (
    <Painel
      className="panorama-painel-distribuicao"
      titulo="Distribuição de bem-estar"
      icone={<img src={iconesBemEstar.graficoDePizza} alt="" />}
    >
      <BarraSegmentada segmentos={distribuicao} />
    </Painel>
  );
}

export default CardDistribuicao;
