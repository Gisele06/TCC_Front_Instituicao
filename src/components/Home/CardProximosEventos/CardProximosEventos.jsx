import { useNavigate } from "react-router-dom";
import "./CardProximosEventos.css";
import EtiquetaDeData from "./EtiquetaDeData/EtiquetaDeData.jsx";
import TituloDoPainel from "../TituloDoPainel/TituloDoPainel.jsx";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import iconeCalendarioComPontos from "../../../img/icones/calendario-pontos.png";

function CardProximosEventos({ aoNavegar, eventos, aoAbrirEvento }) {
  const navegar = useNavigate();

  function abrirEdicao(evento) {
    navegar(`/eventos/cadastrarEvento?id=${encodeURIComponent(evento.id)}`, {
      state: { evento, modoEdicao: true, voltarPara: "/home" },
    });
  }

  return (
    <div className="inicio-painel inicio-eventos-cartao">
      <div className="inicio-painel-cabecalho">
        <TituloDoPainel icone={iconeCalendarioComPontos} texto="Eventos" />
        <button
          type="button"
          className="inicio-eventos-atalho"
          onClick={() => aoNavegar("eventos")}
        >
          Ver todos
          <img src={iconeSetaDireita} alt="" />
        </button>
      </div>
      <div className="inicio-evento-lista">
        {!eventos.length && <p>Nenhum evento cadastrado.</p>}
        {eventos.map((evento) => (
          <button
            type="button"
            className="inicio-evento-linha"
            key={evento.id}
            onClick={() => abrirEdicao(evento)}
            aria-label={`Editar ${evento.titulo}`}
          >
            <EtiquetaDeData dia={evento.dia} mes={evento.mes} />
            <div className="inicio-evento-detalhes">
              <span className="inicio-evento-titulo">{evento.titulo}</span>
              <span className="inicio-evento-informacao">
                {evento.informacao}
              </span>
              <span className="inicio-evento-local">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 22s8-6.2 8-13a8 8 0 1 0-16 0c0 6.8 8 13 8 13Z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                {evento.local}
              </span>
            </div>
            <img className="inicio-evento-seta" src={iconeSetaDireita} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default CardProximosEventos;
