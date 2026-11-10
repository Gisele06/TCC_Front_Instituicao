import { fonteDisponivel } from "../../services/recursos";
import { useEffect, useMemo, useState } from "react";
import EstruturaInstitucional from "../../components/Geral/InstitutionFrame/InstitutionFrame";
import CalendarioPequeno from "../../components/Geral/MiniCalendar/MiniCalendar";
import { carregarEventos, type Evento } from "./data/eventos";
import CabecalhoDePagina from "../../components/Geral/PageHeader/PageHeader";
import AbasSegmentadas from "../../components/Geral/SegmentedTabs/SegmentedTabs";

import iconeCalendarioEscuro from "../../assets/icons/Geral/calendario.png";
import iconeCalendarioDaLista from "../../assets/icons/Geral/calendario-evento.png";
import iconeRelogio from "../../assets/icons/Geral/relogio-evento.png";
import iconeLocalDoEvento from "../../assets/icons/Eventos/local-evento.png";
import iconeOcultarEvento from "../../assets/icons/Geral/ocultar-evento.png";
import iconeReenviarEvento from "../../assets/icons/Geral/reenviar-evento.png";
import iconeSetaDoEvento from "../../assets/icons/Geral/chevron-evento.png";
import iconeBusca from "../../assets/icons/Geral/busca.png";

import "./Eventos.css";

interface PropriedadesEventos {
  aoNavegar: (pagina: string) => void;
  aoCriarEvento: () => void;
}

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
  const [eventos, definirEventos] = useState<Evento[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");
  const [mesVisivel, definirMesVisivel] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [dataSelecionada, definirDataSelecionada] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  });

  useEffect(() => {
    let ativo = true;
    carregarEventos()
      .then((lista) => {
        if (!ativo) return;
        definirEventos(lista);

        const hoje = new Date();
        const inicioDeHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const dataAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
        const proximo = lista
          .filter((evento) => evento.data >= dataAtual && evento.data.startsWith(dataAtual.slice(0, 7)))
          .sort((a, b) => a.data.localeCompare(b.data))[0];

        if (proximo) {
          definirDataSelecionada((anterior) =>
            anterior.getTime() === inicioDeHoje.getTime()
              ? new Date(hoje.getFullYear(), hoje.getMonth(), Number(proximo.data.split("-")[2]))
              : anterior
          );
        }
      })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Não foi possível buscar eventos.");
      })
      .finally(() => { if (ativo) definirCarregando(false); });
    return () => { ativo = false; };
  }, []);
  const categorias = ["Todos", ...new Set(eventos.map((evento) => evento.categoria))];

  const abasCategorias = categorias.map((categoria) => ({
    valor: categoria,
    rotulo: categoria,
  }));


  const [categoriaAtiva, definirCategoriaAtiva] = useState("Todos");
  const [busca, definirBusca] = useState("");
  const [ocultos, definirOcultos] = useState<number[]>([]);

  const eventosFiltrados = useMemo(() => eventos.filter((evento) => {
    const correspondeCategoria = categoriaAtiva === "Todos" || evento.categoria === categoriaAtiva;
    return correspondeCategoria &&
      !ocultos.includes(evento.id) &&
      `${evento.titulo} ${evento.descricao}`.toLocaleLowerCase("pt-BR")
        .includes(busca.trim().toLocaleLowerCase("pt-BR"));
  }), [eventos, categoriaAtiva, busca, ocultos]);


  const hoje = new Date();
  const mes = mesVisivel.getMonth();
  const ano = mesVisivel.getFullYear();
  const diaSelecionado = dataSelecionada.getDate();
  const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
  const dataSelecionadaTexto = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(diaSelecionado).padStart(2, "0")}`;
  const mesTexto = `${ano}-${String(mes + 1).padStart(2, "0")}`;

  const eventosDoDia = eventos
    .filter((evento) => evento.data === dataSelecionadaTexto)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
    .map((evento) => ({
      id: String(evento.id),
      horario: evento.horaInicio,
      titulo: evento.titulo,
      categoria: evento.categoria,
      local: evento.local,
    }));

  const diasComEvento = eventos
    .filter((evento) => evento.data.startsWith(mesTexto))
    .map((evento) => Number(evento.data.split("-")[2]));

  function mudarMes(direcao: number) {
    const novoMes = new Date(ano, mes + direcao, 1);
    definirMesVisivel(novoMes);
    const prefixo = `${novoMes.getFullYear()}-${String(novoMes.getMonth() + 1).padStart(2, "0")}`;
    const primeiroEvento = eventos
      .filter((evento) => evento.data.startsWith(prefixo))
      .sort((a, b) => a.data.localeCompare(b.data))[0];
    const dia = primeiroEvento ? Number(primeiroEvento.data.split("-")[2]) : 1;
    definirDataSelecionada(new Date(novoMes.getFullYear(), novoMes.getMonth(), dia));
  }

  return (
    <EstruturaInstitucional paginaAtiva="eventos" aoNavegar={aoNavegar}>
      <main className="eventos-pagina">
        <CabecalhoDePagina
          className="eventos-titulo-principal"
          titulo="Eventos"
          subtitulo="Acompanhe os eventos da instituição e mantenha seus alunos informados."
        />

        <div className="eventos-area">
          <section className="eventos-lista-painel" aria-label="Lista de eventos">
            
            <AbasSegmentadas
              className="eventos-categoria-abas"
              itens={abasCategorias}
              valor={categoriaAtiva}
              aoMudar={definirCategoriaAtiva}
            />


            <div className="eventos-lista-ferramentas">
              <label className="eventos-busca">
                <img src={iconeBusca} alt="" />
                <input type="search" value={busca} onChange={(evento) => definirBusca(evento.target.value)} placeholder="Buscar evento" />
              </label>
              <button type="button" className="eventos-principal-botao" onClick={aoCriarEvento}>
                Novo evento
              </button>
            </div>

            <div className="eventos-lista">
              {!fonteDisponivel() && <p className="eventos-vazio">Configure VITE_API_BASE_URL no modo API para consultar eventos.</p>}
              {carregando && <p className="eventos-vazio">Carregando eventos...</p>}
              {erro && <p className="eventos-vazio" role="alert">{erro}</p>}
              {eventosFiltrados.map((evento) => (
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

                  <span className="eventos-situacao">
                    {evento.data < dataHoje ? "Data passada" : evento.data === dataHoje ? "Hoje" : "Agendado"}
                  </span>

                  <div className="eventos-lista-acoes">
                    <button type="button" className="eventos-acao-botao" onClick={() => definirOcultos((itens) => [...itens, evento.id])}>
                      <img src={iconeOcultarEvento} alt="" /> Ocultar
                    </button>
                    <button type="button" className="eventos-acao-botao" title="Aguardando integração com o backend" disabled>
                      <img src={iconeReenviarEvento} alt="" /> Reenviar
                    </button>
                  </div>

                  <img className="eventos-item-seta" src={iconeSetaDoEvento} alt="" />
                </article>
              ))}
              {!carregando && !erro && fonteDisponivel() && eventosFiltrados.length === 0 && <p className="eventos-vazio">Nenhum evento cadastrado ou encontrado.</p>}
            </div>
          </section>

          <aside className="eventos-calendario-painel">
          <CalendarioPequeno
            className="eventos-pequeno-calendario"
            titulo="Calendário"
            iconeDoTitulo={<img src={iconeCalendarioEscuro} alt="" />}
            tamanhoDoIconeDoTitulo={36}
            mesExibido={`${meses[mes]} ${ano}`}
            semanas={criarSemanas(ano, mes)}
            diaSelecionado={diaSelecionado}
            diaDeHoje={hoje.getMonth() === mes && hoje.getFullYear() === ano ? hoje.getDate() : undefined}
            diasComEvento={diasComEvento}
            aoSelecionarDia={(dia) => definirDataSelecionada(new Date(ano, mes, dia))}
            aoVoltarMes={() => mudarMes(-1)}
            aoAvancarMes={() => mudarMes(1)}
            iconeAnterior={<img src={iconeSetaDoEvento} alt="" />}
            iconeProximo={<img src={iconeSetaDoEvento} alt="" />}
            dataDosEventos={`${diaSelecionado} de ${meses[mes].toLowerCase()} de ${ano}`}
            eventos={eventosDoDia}
            mensagemSemEventos={carregando ? "Carregando eventos..." : erro || "Nenhum evento nesta data."}
          />
          </aside>
          
        </div>
      </main>
    </EstruturaInstitucional>
  );
}

export default Eventos;
