import iconePessoas from "../../../img/icones/pessoas.png";
import "./Resumo.css";

function Resumo({ valor, rotulo, icone }) {
  return (
    <div className="academico-resumo">
      {icone === "grafico" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="16" rx="3" />
          <path d="m6 13 3.5-3.5 3 2 5-5.5" />
          <path d="M5 22h14" className="academico-grafico-base" />
        </svg>
      ) : icone === "pausado" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="3" width="6" height="18" rx="2" />
          <rect x="14" y="3" width="6" height="18" rx="2" />
        </svg>
      ) : (
        <img src={iconePessoas} alt="" />
      )}
      <div className="academico-resumo-conteudo">
        <strong>{valor}</strong>
        <span>{rotulo}</span>
      </div>
    </div>
  );
}

export default Resumo;