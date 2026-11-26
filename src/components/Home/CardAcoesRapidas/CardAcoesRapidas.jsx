import "./CardAcoesRapidas.css";
import TituloDoPainel from "../TituloDoPainel/TituloDoPainel.jsx";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import iconeRaio from "../../../img/icones/raio.png";

function CardAcoesRapidas({ acoesRapidas, aoCriarEvento }) {
  return (
    <div className="inicio-painel inicio-rapida-acoes">
      <div className="inicio-painel-cabecalho">
        <TituloDoPainel icone={iconeRaio} texto="Ações rápidas" />
      </div>
      <div className="inicio-rapida-acao-lista">
        {acoesRapidas.map((acao) => (
          <div className="inicio-rapida-acao-linha" key={acao.rotulo}>
            <span className="inicio-rapida-acao-icone">
              <img src={acao.icone} alt="" />
            </span>
            <button
              className="inicio-rapida-acao-botao"
              type="button"
              onClick={acao.rotulo === "Criar evento" ? aoCriarEvento : acao.acao}
            >
              <span>{acao.rotulo}</span>
              <img src={iconeSetaDireita} alt="" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardAcoesRapidas;