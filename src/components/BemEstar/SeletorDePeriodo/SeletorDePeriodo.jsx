import iconeSetaBaixo from "../../../img/icones/setaBaixoCabecalho.png";
import "./SeletorDePeriodo.css";

function SeletorDePeriodo({ rotulo = "Últimos 30 dias", aoClicar, className = "" }) {
  return (
    <button type="button" className={"bloom-seletor-periodo " + className} onClick={aoClicar}>
      <span>{rotulo}</span>
      <img src={iconeSetaBaixo} alt="" />
    </button>
  );
}

export default SeletorDePeriodo;
