import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import "./MiniCalendar.css";

interface DiaDoCalendario {
  dia: number;
  outroMes?: boolean;
}

interface EventoDoCalendario {
  id: string;
  horario: string;
  titulo: string;
  categoria: string;
  local?: string;
}

interface PropriedadesCalendarioPequeno {
  className?: string;
  titulo?: string;
  iconeDoTitulo?: ReactNode;
  tamanhoDoIconeDoTitulo?: number | string;
  mesExibido: string;
  semanas: DiaDoCalendario[][];
  diaDeHoje?: number;
  diaSelecionado?: number;
  diasComEvento?: number[];
  aoSelecionarDia?: (dia: number) => void;
  aoVoltarMes?: () => void;
  aoAvancarMes?: () => void;
  iconeAnterior?: ReactNode;
  iconeProximo?: ReactNode;
  tituloDosEventos?: string;
  dataDosEventos?: string;
  eventos?: EventoDoCalendario[];
}

const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function CalendarioPequeno({
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
}: PropriedadesCalendarioPequeno) {
  return (
    <div className={`bloom-pequeno-calendario ${className}`}>
      <div className="bloom-pequeno-calendario-titulo">
        <AreaIcone icone={iconeDoTitulo} rotulo="calendario" tamanho={tamanhoDoIconeDoTitulo} />
        <h2>{titulo}</h2>
      </div>

      <div className="bloom-pequeno-calendario-navegacao">
        <button type="button" className="bloom-pequeno-calendario-anterior" onClick={aoVoltarMes} disabled={!aoVoltarMes}>
          <AreaIcone icone={iconeAnterior ? iconeAnterior : iconeProximo} rotulo=">" tamanho={14} />
        </button>
        <span>{mesExibido}</span>
        <button type="button" onClick={aoAvancarMes} disabled={!aoAvancarMes}>
          <AreaIcone icone={iconeProximo} rotulo=">" tamanho={14} />
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
                disabled={!aoSelecionarDia}
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
            <AreaIcone icone={iconeProximo} rotulo=">" tamanho={14} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarioPequeno;
