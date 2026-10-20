import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";
import CalendarioPequeno from "../../components/MiniCalendar/MiniCalendar";

import iconeAviso from "../../assets/icons/comunicado-aviso.png";
import iconeOrientacao from "../../assets/icons/comunicado-orientacao.png";
import iconeComunicadoEvento from "../../assets/icons/comunicado-evento.png";
import iconeCalendario from "../../assets/icons/calendario.png";
import iconeCalendarioDaLista from "../../assets/icons/calendario-evento.png";
import iconeRelogio from "../../assets/icons/relogio-evento.png";
import iconeOcultar from "../../assets/icons/ocultar-evento.png";
import iconeReenviar from "../../assets/icons/reenviar-evento.png";
import iconeSeta from "../../assets/icons/chevron-evento.png";
import iconeBusca from "../../assets/icons/busca.png";

import "./Comunicados.css";

interface PropriedadesComunicados {
  aoNavegar: (pagina: string) => void;
}

const categorias = ["Todos", "Avisos", "Informativos", "Orientações", "Eventos"];

const comunicadosDeExemplo = [
  {
    id: "comunicado-aviso",
    categoria: "Aviso",
    titulo: "Porque me sinto triste?",
    descricao: "Você já se sentiu triste? Isso é comum e pode acontecer por vários motivos.",
    data: "6 jul, 2026",
    hora: "14:00 - 16:00",
    icone: iconeAviso,
  },
  {
    id: "comunicado-orientacao",
    categoria: "Orientação",
    titulo: "Porque me sinto triste?",
    descricao: "Você já se sentiu triste? Isso é comum e pode acontecer por vários motivos.",
    data: "6 jul, 2026",
    hora: "14:00 - 16:00",
    icone: iconeOrientacao,
  },
  {
    id: "comunicado-evento",
    categoria: "Evento",
    titulo: "Porque me sinto triste?",
    descricao: "Você já se sentiu triste? Isso é comum e pode acontecer por vários motivos.",
    data: "6 jul, 2026",
    hora: "14:00 - 16:00",
    icone: iconeComunicadoEvento,
  },
];

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function criarSemanas(ano: number, mes: number) {
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasNoMesAnterior = new Date(ano, mes, 0).getDate();
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

function Comunicados({ aoNavegar }: PropriedadesComunicados) {
  const mes = 6;
  const ano = 2026;
  const diaSelecionado = 6;

  const comunicadosDoDia = [
    { id: "aviso-do-dia", horario: "14:00", titulo: "Porque me sinto triste?", categoria: "Aviso" },
    { id: "evento-do-dia", horario: "16:00", titulo: "Porque me sinto triste?", categoria: "Evento" },
  ];

  return (
    <EstruturaInstitucional paginaAtiva="comunicados" aoNavegar={aoNavegar}>
      <main className="comunicados-pagina">
        <header className="comunicados-titulo-principal">
          <div>
            <h1>Comunicados</h1>
            <p>Acompanhe os comunicados publicados pela instituição.</p>
          </div>
        </header>

        <div className="comunicados-area">
          <section className="comunicados-lista-painel" aria-label="Lista de comunicados">
            <div className="comunicados-categoria-abas" aria-label="Categorias de comunicados">
              {categorias.map((categoria) => (
                <span
                  key={categoria}
                  className={categoria === "Todos" ? "estado-selecionado" : ""}
                >
                  {categoria}
                </span>
              ))}
            </div>

            <div className="comunicados-lista-ferramentas">
              <div className="comunicados-busca">
                <img src={iconeBusca} alt="" />
                <span>Buscar comunicado</span>
              </div>
              <button type="button" className="comunicados-principal-botao">
                Novo comunicado
              </button>
            </div>

            <div className="comunicados-lista">
              {comunicadosDeExemplo.map((comunicado) => (
                <article className="comunicados-lista-item" key={comunicado.id}>
                  <div className="comunicados-lista-icone" aria-hidden="true">
                    <img src={comunicado.icone} alt="" />
                  </div>

                  <div className="comunicados-lista-descricao">
                    <span className="comunicados-categoria-rotulo">{comunicado.categoria}</span>
                    <h2>{comunicado.titulo}</h2>
                    <p>{comunicado.descricao}</p>
                  </div>

                  <div className="comunicados-lista-detalhes">
                    <span><img src={iconeCalendarioDaLista} alt="" />{comunicado.data}</span>
                    <span><img src={iconeRelogio} alt="" />{comunicado.hora}</span>
                  </div>

                  <span className="comunicados-situacao">Em breve</span>

                  <div className="comunicados-lista-acoes">
                    <span className="comunicados-acao-botao">
                      <img src={iconeOcultar} alt="" /> Ocultar
                    </span>
                    <span className="comunicados-acao-botao">
                      <img src={iconeReenviar} alt="" /> Reenviar
                    </span>
                  </div>

                  <img className="comunicados-item-seta" src={iconeSeta} alt="" />
                </article>
              ))}
            </div>
          </section>

          <aside className="comunicados-calendario-painel">
            <CalendarioPequeno
              className="comunicados-pequeno-calendario"
              titulo="Calendário"
              iconeDoTitulo={<img src={iconeCalendario} alt="" />}
              tamanhoDoIconeDoTitulo={22}
              mesExibido={`${meses[mes]} ${ano}`}
              semanas={criarSemanas(ano, mes)}
              diaSelecionado={diaSelecionado}
              diaDeHoje={10}
              diasComEvento={[diaSelecionado]}
              iconeAnterior={<img src={iconeSeta} alt="" />}
              iconeProximo={<img src={iconeSeta} alt="" />}
              tituloDosEventos="Comunicados do dia"
              dataDosEventos={`${diaSelecionado} de ${meses[mes].toLowerCase()} de ${ano}`}
              eventos={comunicadosDoDia}
            />
          </aside>
        </div>
      </main>
    </EstruturaInstitucional>
  );
}

export default Comunicados;
