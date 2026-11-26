import iconeCheck from "../../../img/icones/marcacao.png";
import "./EtapasAcesso.css";

function EtapasAcesso({ etapas, etapaAtual }) {
  return (
    <ol
      className="acesso-etapas"
      aria-label={`Etapa ${etapaAtual} de ${etapas.length}`}
    >
      {etapas.map((rotulo, indice) => {
        const numero = indice + 1;
        const concluida = numero < etapaAtual;
        const atual = numero === etapaAtual;

        return (
          <li
            className="acesso-etapa"
            key={rotulo}
            aria-current={atual ? "step" : undefined}
          >
            {numero <= etapaAtual && (
              <span
                className={`acesso-etapa-marcador${concluida ? " acesso-etapa-marcador-concluida" : ""}`}
                aria-label={concluida ? "Concluída" : `Etapa ${numero}`}
              >
                {concluida ? <img src={iconeCheck} alt="" /> : numero}
              </span>
            )}
            <span className="acesso-etapa-rotulo">{rotulo}</span>
            {indice < etapas.length - 1 && (
              <span className="acesso-etapa-linha" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default EtapasAcesso;
