import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";
import CalendarioPequeno from "../../components/MiniCalendar/MiniCalendar";
import type { Evento } from "../../types/Evento";

import iconeCalendarioEscuro from "../../assets/icons/calendario.png";
import iconeCalendarioDaLista from "../../assets/icons/calendario-evento.png";
import iconeRelogio from "../../assets/icons/relogio-evento.png";
import iconeLocalDoEvento from "../../assets/icons/local-evento.png";
import iconeOcultarEvento from "../../assets/icons/ocultar-evento.png";
import iconeReenviarEvento from "../../assets/icons/reenviar-evento.png";
import iconeSetaDoEvento from "../../assets/icons/chevron-evento.png";
import iconeBusca from "../../assets/icons/busca.png";

import "./Eventos.css";

interface PropriedadesEventos {
  aoNavegar: (pagina: string) => void;
  aoCriarEvento: () => void;
}

const categorias = ["Todos", "Palestras", "Oficinas", "Campanhas", "Festas", "Reuniões"];

const eventosDeExemplo: Evento[] = [
  {
    id: "evento-pizza",
    categoria: "Festa",
    titulo: "Vai uma pizza aí?",
    descricao: "Pensando no bem-estar dos alunos hoje nossa escola.",
    data: "2026-07-06",
    horaInicio: "14:00",
    horaFim: "16:00",
    local: "Refeitório",
    recorrencia: "Não se repete",
    turmas: "Todas as salas",
  },
  {
    id: "evento-palestra-1",
    categoria: "Palestra",
    titulo: "Prevenção Setembro amarelo",
    descricao: "Palestra com um psicólogo sobre saúde mental e cuidado no dia a dia.",
    data: "2026-07-10",
    horaInicio: "14:30",
    horaFim: "15:30",
    local: "Auditório",
    recorrencia: "Não se repete",
    turmas: "Todas as salas",
  },
  {
    id: "evento-palestra-2",
    categoria: "Palestra",
    titulo: "Prevenção Setembro amarelo",
    descricao: "Palestra com um psicólogo sobre saúde mental e cuidado no dia a dia.",
    data: "2026-07-10",
    horaInicio: "14:30",
    horaFim: "15:30",
    local: "Auditório",
    recorrencia: "Não se repete",
    turmas: "Todas as salas",
  },
];

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function criarSemanas(ano: number, mes: number) {
  // O calendário sempre começa no domingo, por isso usamos getDay() para achar a primeira coluna.
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasNoMesAnterior = new Date(ano, mes, 0).getDate();
  // Soma os espaços vazios do início aos dias do mês para saber quantas semanas mostrar.
  const quantidadeDeSemanas = Math.ceil((primeiroDia + diasNoMes) / 7);
  const semanas = [];
  let diaAtual = 1;
  let diaDoProximoMes = 1;

  for (let semana = 0; semana < quantidadeDeSemanas; semana += 1) {
    const dias = [];

    for (let coluna = 0; coluna < 7; coluna += 1) {
      const posicao = semana * 7 + coluna;

      if (posicao < primeiroDia) {
        dias.push({ dia: diasNoMesAnterior - primeiroDia + posicao + 1, outroMes: true });
      } else if (diaAtual <= diasNoMes) {
        dias.push({ dia: diaAtual });
        diaAtual += 1;
      } else {
        dias.push({ dia: diaDoProximoMes, outroMes: true });
        diaDoProximoMes += 1;
      }
    }

    semanas.push(dias);
  }

  return semanas;
}

function formatarData(data: string) {
  const partesDaData = data.split("-");
  const ano = Number(partesDaData[0]);
  const mes = Number(partesDaData[1]);
  const dia = Number(partesDaData[2]);
  const nomesDosMeses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${dia} ${nomesDosMeses[mes - 1]} ${ano}`;
}

function Eventos({ aoNavegar, aoCriarEvento }: PropriedadesEventos) {
  const mes = 6;
  const ano = 2026;
  const diaSelecionado = 10;

  const eventosDoDia = eventosDeExemplo
    .filter((evento) => {
      const [anoDoEvento, mesDoEvento, diaDoEvento] = evento.data.split("-").map(Number);
      return anoDoEvento === ano && mesDoEvento === mes + 1 && diaDoEvento === diaSelecionado;
    })
    .map((evento) => ({
      id: evento.id,
      horario: evento.horaInicio,
      titulo: evento.titulo,
      categoria: evento.categoria,
      local: evento.local,
    }));

  const diasComEvento = eventosDeExemplo
    .filter((evento) => {
      const [anoDoEvento, mesDoEvento] = evento.data.split("-").map(Number);
      return anoDoEvento === ano && mesDoEvento === mes + 1;
    })
    .map((evento) => Number(evento.data.split("-")[2]));

  return (
    <EstruturaInstitucional paginaAtiva="eventos" aoNavegar={aoNavegar}>
      <main className="eventos-pagina">
        <header className="eventos-titulo-principal">
          <div>
            <h1>Eventos</h1>
            <p>Acompanhe os eventos da instituição e mantenha seus alunos informados.</p>
          </div>
        </header>

        <div className="eventos-area">
          <section className="eventos-lista-painel" aria-label="Lista de eventos">
            <div className="eventos-categoria-abas" aria-label="Filtrar por categoria">
              {categorias.map((categoria) => (
                <span
                  key={categoria}
                  className={categoria === "Todos" ? "estado-selecionado" : ""}
                >
                  {categoria}
                </span>
              ))}
            </div>

            <div className="eventos-lista-ferramentas">
              <div className="eventos-busca">
                <img src={iconeBusca} alt="" />
                <span>Buscar evento</span>
              </div>
              <button type="button" className="eventos-principal-botao" onClick={aoCriarEvento}>
                Novo evento
              </button>
            </div>

            <div className="eventos-lista">
              {eventosDeExemplo.map((evento) => (
                <article className="eventos-lista-item" key={evento.id}>
                  <div className="eventos-lista-foto" aria-hidden="true"></div>

                  <div className="eventos-lista-descricao">
                    <span className="eventos-categoria-rotulo">{evento.categoria}</span>
                    <h2>{evento.titulo}</h2>
                    <p>{evento.descricao}</p>
                  </div>

                  <div className="eventos-lista-detalhes">
                    <span><img src={iconeCalendarioDaLista} alt="" />{formatarData(evento.data)}</span>
                    <span><img src={iconeRelogio} alt="" />{evento.horaInicio} - {evento.horaFim}</span>
                    <span className="eventos-local"><img src={iconeLocalDoEvento} alt="" />{evento.local}</span>
                  </div>

                  <span className="eventos-situacao">Em breve</span>

                  <div className="eventos-lista-acoes">
                    <span className="eventos-acao-botao">
                      <img src={iconeOcultarEvento} alt="" /> Ocultar
                    </span>
                    <span className="eventos-acao-botao">
                      <img src={iconeReenviarEvento} alt="" /> Reenviar
                    </span>
                  </div>

                  <img className="eventos-item-seta" src={iconeSetaDoEvento} alt="" />
                </article>
              ))}
            </div>
          </section>

          <aside className="eventos-calendario-painel">
            <CalendarioPequeno
              className="eventos-pequeno-calendario"
              titulo="Calendário"
              iconeDoTitulo={<img src={iconeCalendarioEscuro} alt="" />}
              tamanhoDoIconeDoTitulo={22}
              mesExibido={`${meses[mes]} ${ano}`}
              semanas={criarSemanas(ano, mes)}
              diaSelecionado={diaSelecionado}
              diaDeHoje={mes === 6 && ano === 2026 ? 10 : undefined}
              diasComEvento={diasComEvento}
              iconeAnterior={<img src={iconeSetaDoEvento} alt="" />}
              iconeProximo={<img src={iconeSetaDoEvento} alt="" />}
              dataDosEventos={`${diaSelecionado} de ${meses[mes].toLowerCase()} de ${ano}`}
              eventos={eventosDoDia}
            />
          </aside>
        </div>
      </main>
    </EstruturaInstitucional>
  );
}

export default Eventos;
