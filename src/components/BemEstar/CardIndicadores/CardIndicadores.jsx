import "./CardIndicadores.css";
import LinhaDeIndicador from "./LinhaDeIndicador/LinhaDeIndicador.jsx";
import Painel from "../Painel/Painel.jsx";
import { iconesBemEstar } from "../../../js/Rotas_BEM_ESTAR/iconesBemEstar.js";

function CardIndicadores({ indicadores }) {
  return (
    <Painel
      className="panorama-painel-indicadores"
      titulo="Indicadores de bem estar"
      icone={<img src={iconesBemEstar.estatisticas} alt="" />}
    >
      <div className="panorama-indicadores-lista">
        {indicadores.map((indicador) => (
          <LinhaDeIndicador
            key={indicador.id}
            icone={indicador.icone}
            titulo={indicador.titulo}
            descricao={indicador.descricao}
            valor={indicador.valor}
            variacao={indicador.variacao}
            sentido={indicador.sentido}
            tom={indicador.tom}
          />
        ))}
      </div>
    </Painel>
  );
}

export default CardIndicadores;
