import Icone from "../Icone/Icone.jsx";
import "./CalendarioBase.css";

const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function CalendarioBase({
  className = "",
  titulo = "Calendário",
  iconeDoTitulo,
  tamanhoDoIconeDoTitulo = 28,
  mesExibido,
  semanas,
  diaDeHoje,
  diaSelecionado,
  diasComEvento = [],
  aoSelecionarDia,
  aoVoltarMes,
  aoAvancarMes,
  iconeAnterior,
  iconeProximo,
  tituloDosEventos = "Eventos do dia",
  dataDosEventos,
  eventos = [],
}) {
  return (
    <div className={`bloom-pequeno-calendario ${className}`}>
      <div className="bloom-pequeno-calendario-titulo">
        <Icone icone={iconeDoTitulo} rotulo="calendario" tamanho={tamanhoDoIconeDoTitulo} />
        <h2>{titulo}</h2>
      </div>

      <div className="bloom-pequeno-calendario-navegacao">
        <button type="button" className="bloom-pequeno-calendario-anterior" onClick={aoVoltarMes} disabled={!aoVoltarMes}>
          <Icone icone={iconeAnterior ? iconeAnterior : iconeProximo} rotulo=">" tamanho={14} />
        </button>
        <span>{mesExibido}</span>
        <button type="button" onClick={aoAvancarMes} disabled={!aoAvancarMes}>
          <Icone icone={iconeProximo} rotulo=">" tamanho={14} />
        </button>
      </div>

      <div className="bloom-pequeno-calendario-grade">
        {diasDaSemana.map((diaDaSemana) => (
          <span key={diaDaSemana} className="bloom-pequeno-calendario-dia-semana">
            {diaDaSemana}
          </span>
        ))}

        {semanas.map((semana, indiceDaSemana) =>
          semana.map((item, indiceDoDia) => {
            let classesDoDia = "bloom-pequeno-calendario-dia";
            if (item.outroMes) classesDoDia += " estado-outro-mes";
            if (!item.outroMes && item.dia === diaDeHoje) classesDoDia += " estado-hoje";
            if (!item.outroMes && item.dia === diaSelecionado) classesDoDia += " estado-selecionado";
            const temEvento = !item.outroMes && diasComEvento.includes(item.dia);

            return (
              <button
                key={indiceDaSemana + "-" + indiceDoDia}
                type="button"
                className={classesDoDia}
                onClick={() => aoSelecionarDia && aoSelecionarDia(item.dia)}
                disabled={!aoSelecionarDia || item.outroMes}
              >
                {String(item.dia).padStart(2, "0")}
                {temEvento && <span className="bloom-pequeno-calendario-ponto"></span>}
              </button>
            );
          })
        )}
      </div>

      <div className="bloom-pequeno-calendario-eventos">
        <div className="bloom-pequeno-calendario-eventos-cabecalho">
          <h3>{tituloDosEventos}</h3>
          <span>{dataDosEventos}</span>
        </div>

        {eventos.map((evento) => (
          <div key={evento.id} className="bloom-pequeno-calendario-evento">
            <span className="bloom-pequeno-calendario-evento-horario">{evento.horario}</span>
            <div className="bloom-pequeno-calendario-evento-corpo">
              <span>{evento.titulo}</span>
              <div className="bloom-pequeno-calendario-evento-detalhe">
                <span className="bloom-pequeno-calendario-evento-categoria">{evento.categoria}</span>
                {evento.local && <span className="bloom-pequeno-calendario-evento-local">{evento.local}</span>}
              </div>
            </div>
            <Icone icone={iconeProximo} rotulo=">" tamanho={14} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarioBase;
