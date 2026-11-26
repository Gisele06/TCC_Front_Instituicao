import "./CardDadosRecentes.css";
import TituloDoPainel from "../TituloDoPainel/TituloDoPainel.jsx";
import CardItemDado from "./CardItemDado/CardItemDado.jsx";
import iconeTituloCalendario from "../../../img/icones/calendario-titulo.png";

function CardDadosRecentes({ dadosRecentes }) {
  return (
    <div className="inicio-painel inicio-dados-recentes">
      <div className="inicio-painel-cabecalho">
        <TituloDoPainel icone={iconeTituloCalendario} texto="Dados recentes" />
      </div>
      <div className="inicio-painel-lista">
        {dadosRecentes.map((dado) => (
          <CardItemDado
            key={dado.rotulo}
            iconeInicial={dado.icone && <img src={dado.icone} alt="" />}
            tamanhoDoIconeInicial="clamp(34px, 2.85vw, 42px)"
            titulo={dado.rotulo}
            conteudoFinal={<span>{dado.valor}</span>}
          />
        ))}
      </div>
    </div>
  );
}

export default CardDadosRecentes;