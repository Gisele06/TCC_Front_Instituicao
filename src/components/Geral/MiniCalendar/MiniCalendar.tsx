import { useEffect, useState, type ReactNode } from "react";
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
  diaSelecionado?: number;
  diaDeHoje?: number;
  diasComEvento?: number[];
  aoSelecionarDia?: (dia: number) => void;
  aoVoltarMes?: () => void;
  aoAvancarMes?: () => void;
  iconeAnterior?: ReactNode;
  iconeProximo?: ReactNode;
  tituloDosEventos?: string;
  dataDosEventos?: string;
  eventos?: EventoDoCalendario[];
  mensagemSemEventos?: string;
}

const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function obterMes(texto: string): Date {
  const [nome, anoTexto] = texto.trim().split(/\s+/);
  const mes = meses.findIndex((item) => item.toLowerCase() === nome?.toLowerCase());
  const ano = Number(anoTexto);
  if (mes === -1 || !Number.isInteger(ano) || ano < 1) {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  }
  return new Date(ano, mes, 1);
}

function criarSemanas(ano: number, mes: number): DiaDoCalendario[][] {
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const ultimoAnterior = new Date(ano, mes, 0).getDate();
  const quantidade = Math.ceil((primeiroDia + ultimoDia) / 7) * 7;
  const dias = Array.from({ length: quantidade }, (_, i): DiaDoCalendario => {
    const dia = i - primeiroDia + 1;
    if (dia <= 0) return { dia: ultimoAnterior + dia, outroMes: true };
    if (dia > ultimoDia) return { dia: dia - ultimoDia, outroMes: true };
    return { dia };
  });
  const semanas: DiaDoCalendario[][] = [];
  for (let i = 0; i < dias.length; i += 7) semanas.push(dias.slice(i, i + 7));
  return semanas;
}

function CalendarioPequeno({
  className = "",
  titulo = "Calendário",
  iconeDoTitulo,
  tamanhoDoIconeDoTitulo = 32,
  mesExibido,
  semanas,
  diaSelecionado,
  diaDeHoje,
  diasComEvento = [],
  aoSelecionarDia,
  aoVoltarMes,
  aoAvancarMes,
  iconeAnterior,
  iconeProximo,
  tituloDosEventos = "Eventos do dia",
  dataDosEventos,
  eventos = [],
  mensagemSemEventos,
}: PropriedadesCalendarioPequeno) {
  const [mesVisivel, definirMesVisivel] = useState(() => obterMes(mesExibido));
  const [selecaoInterna, definirSelecaoInterna] = useState(diaSelecionado);

  useEffect(() => {
    definirMesVisivel(obterMes(mesExibido));
  }, [mesExibido]);

  useEffect(() => {
    definirSelecaoInterna(diaSelecionado);
  }, [diaSelecionado]);

  const mesRecebido = obterMes(mesExibido);
  const mesmoMes = mesVisivel.getMonth() === mesRecebido.getMonth()
    && mesVisivel.getFullYear() === mesRecebido.getFullYear();
  const ano = mesVisivel.getFullYear();
  const mes = mesVisivel.getMonth();
  const dias = mesmoMes ? semanas : criarSemanas(ano, mes);
  const selecionado = selecaoInterna;
  const dataSelecionada = selecionado
    ? `${selecionado} de ${meses[mes].toLowerCase()} de ${ano}`
    : "Selecione um dia";
  const dataExibida = mesmoMes && selecionado === diaSelecionado && dataDosEventos
    ? dataDosEventos
    : dataSelecionada;
  const eventosExibidos = mesmoMes && selecionado === diaSelecionado ? eventos : [];

  function navegar(direcao: number) {
    const acaoExterna = direcao < 0 ? aoVoltarMes : aoAvancarMes;
    if (acaoExterna) {
      acaoExterna();
      return;
    }
    definirMesVisivel(new Date(ano, mes + direcao, 1));
    definirSelecaoInterna(undefined);
  }

  function selecionar(dia: number) {
    definirSelecaoInterna(dia);
    aoSelecionarDia?.(dia);
  }

  return (
    <div className={`bloom-pequeno-calendario ${className}`}>
      <div className="bloom-pequeno-calendario-titulo">
        {iconeDoTitulo && (
          <span className="bloom-pequeno-calendario-icone" style={{ width: tamanhoDoIconeDoTitulo, height: tamanhoDoIconeDoTitulo }}>
            {iconeDoTitulo}
          </span>
        )}
        <h2>{titulo}</h2>
      </div>

      <div className="bloom-pequeno-calendario-navegacao">
        <button type="button" aria-label="Mês anterior" onClick={() => navegar(-1)}>
          <span className="bloom-pequeno-calendario-seta-anterior">{iconeAnterior ?? "‹"}</span>
        </button>
        <span>{meses[mes]} {ano}</span>
        <button type="button" aria-label="Próximo mês" onClick={() => navegar(1)}>
          <span className="bloom-pequeno-calendario-seta-proxima">{iconeProximo ?? "›"}</span>
        </button>
      </div>

      <div className="bloom-pequeno-calendario-grade">
        {diasDaSemana.map((dia) => (
          <span className="bloom-pequeno-calendario-dia-semana" key={dia}>{dia}</span>
        ))}
        {dias.flatMap((semana, i) => semana.map((item, j) => {
          const selecionadoNesteDia = !item.outroMes && item.dia === selecionado;
          const hojeNesteDia = mesmoMes && !item.outroMes && item.dia === diaDeHoje;
          const temEvento = mesmoMes && !item.outroMes && diasComEvento.includes(item.dia);
          return (
            <button
              key={`${i}-${j}`}
              type="button"
              disabled={item.outroMes}
              aria-pressed={selecionadoNesteDia}
              aria-label={`${item.dia} de ${meses[mes]} de ${ano}${temEvento ? ", com evento" : ""}`}
              className={[
                "bloom-pequeno-calendario-dia",
                item.outroMes && "estado-outro-mes",
                hojeNesteDia && "estado-hoje",
                selecionadoNesteDia && "estado-selecionado",
              ].filter(Boolean).join(" ")}
              onClick={() => selecionar(item.dia)}
            >
              {String(item.dia).padStart(2, "0")}
              {temEvento && <span className="bloom-pequeno-calendario-ponto" />}
            </button>
          );
        }))}
      </div>

      <div className="bloom-pequeno-calendario-eventos">
        <div className="bloom-pequeno-calendario-eventos-cabecalho">
          <h3>{tituloDosEventos}</h3>
          <span>{dataExibida}</span>
        </div>
        {mensagemSemEventos && eventosExibidos.length === 0 && (
          <p className="bloom-pequeno-calendario-sem-eventos">{mensagemSemEventos}</p>
        )}
        {eventosExibidos.map((evento) => (
          <div className="bloom-pequeno-calendario-evento" key={evento.id}>
            <span className="bloom-pequeno-calendario-evento-horario">{evento.horario}</span>
            <div className="bloom-pequeno-calendario-evento-corpo">
              <span className="bloom-pequeno-calendario-evento-titulo">{evento.titulo}</span>
              <div className="bloom-pequeno-calendario-evento-detalhe">
                <span className="bloom-pequeno-calendario-evento-categoria">{evento.categoria}</span>
                {evento.local && <span className="bloom-pequeno-calendario-evento-local">{evento.local}</span>}
              </div>
            </div>
            <span className="bloom-pequeno-calendario-evento-seta" aria-hidden="true">
              {iconeProximo ?? "›"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarioPequeno;
