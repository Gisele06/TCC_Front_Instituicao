import iconeSetaBaixo from "../../assets/icons/chevron-down-topbar.png";
import "./PeriodSelect.css";

interface PropriedadesSeletorDePeriodo {
  rotulo?: string;
  aoClicar?: () => void;
  className?: string;
}

function SeletorDePeriodo({ rotulo = "Últimos 30 dias", aoClicar, className = "" }: PropriedadesSeletorDePeriodo) {
  return (
    <button type="button" className={"bloom-seletor-periodo " + className} onClick={aoClicar}>
      <span>{rotulo}</span>
      <img src={iconeSetaBaixo} alt="" />
    </button>
  );
}

export default SeletorDePeriodo;
