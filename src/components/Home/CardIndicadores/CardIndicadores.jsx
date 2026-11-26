import "./CardIndicadores.css";
import { obterIndicadoresHome } from "../../../js/Rotas_HOME/rotas_HOME.js";
import CardIndicador from "./CardIndicador/CardIndicador.jsx";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import iconeSorriso from "../../../img/icones/sorriso.png";
import iconePessoas from "../../../img/icones/pessoas.png";
import iconeSetaCima from "../../../img/icones/seta-cima.png";
import iconeCoracao from "../../../img/icones/coracao.png";

const icones = { sorriso: iconeSorriso, pessoas: iconePessoas, coracao: iconeCoracao };

function CardIndicadores() {
  const indicadores = obterIndicadoresHome();
  return (
    <div className="inicio-indicadores">
      {!indicadores.length && <p>Sem indicadores disponíveis.</p>}
      {indicadores.map(({ icone, ...indicador }) => (
        <CardIndicador
          key={indicador.rotulo}
          icone={<img src={icones[icone]} alt="" />}
          {...indicador}
          iconeDaVariacao={<img src={iconeSetaCima} alt="" />}
          iconeSeta={<img src={iconeSetaDireita} alt="" />}
        />
      ))}
    </div>
  );
}

export default CardIndicadores;
