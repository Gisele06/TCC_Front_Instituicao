import Icone from "../Icone/Icone.jsx";
import "./Botao.css";

function Botao({ estilo = "principal", icone, children, aoClicar, tipo = "button" }) {
  return (
    <button type={tipo} className={"bloom-botao bloom-botao-" + estilo} onClick={aoClicar}>
      {icone && <Icone icone={icone} tamanho={16} />}
      {children}
    </button>
  );
}

export default Botao;
