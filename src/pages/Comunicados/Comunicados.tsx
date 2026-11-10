import { useEffect, useMemo, useState } from "react";
import { fonteDisponivel } from "../../services/recursos";
import EstruturaInstitucional from "../../components/Geral/InstitutionFrame/InstitutionFrame";
import CalendarioPequeno from "../../components/Geral/MiniCalendar/MiniCalendar";
import CabecalhoDePagina from "../../components/Geral/PageHeader/PageHeader";
import AbasSegmentadas from "../../components/Geral/SegmentedTabs/SegmentedTabs";

import iconeCalendario from "../../assets/icons/Geral/calendario.png";
import iconeCalendarioDaLista from "../../assets/icons/Geral/calendario-evento.png";
import iconeRelogio from "../../assets/icons/Geral/relogio-evento.png";
import iconeOcultar from "../../assets/icons/Geral/ocultar-evento.png";
import iconeReenviar from "../../assets/icons/Geral/reenviar-evento.png";
import iconeSeta from "../../assets/icons/Geral/chevron-evento.png";
import iconeBusca from "../../assets/icons/Geral/busca.png";

import { carregarComunicados, type Comunicado } from "./data/comunicados";
import "./Comunicados.css";

interface PropriedadesComunicados {
  aoNavegar: (pagina: string) => void;
  aoCriarComunicado: () => void;
}

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const categorias = ["Todos", "Comunicado", "Evento"];
const abasCategorias = categorias.map((categoria) => ({ valor: categoria, rotulo: categoria }));

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

function Comunicados({ aoNavegar, aoCriarComunicado }: PropriedadesComunicados) {
  const [comunicados, definirComunicados] = useState<Comunicado[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");
  const [categoriaAtiva, definirCategoriaAtiva] = useState("Todos");
  const [busca, definirBusca] = useState("");
  const [ocultos, definirOcultos] = useState<number[]>([]);
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
    carregarComunicados()
      .then((lista) => { if (ativo) definirComunicados(lista); })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar comunicados.");
      })
      .finally(() => { if (ativo) definirCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const comunicadosFiltrados = useMemo(() => comunicados.filter((item) => {
    const categoriaCorresponde = categoriaAtiva === "Todos" || item.categoria === categoriaAtiva;
    const buscaCorresponde = `${item.titulo} ${item.descricao}`.toLocaleLowerCase("pt-BR")
      .includes(busca.trim().toLocaleLowerCase("pt-BR"));
    return categoriaCorresponde && buscaCorresponde && !ocultos.includes(item.id);
  }), [comunicados, categoriaAtiva, busca, ocultos]);

  const hoje = new Date();
  const ano = mesVisivel.getFullYear();
  const mes = mesVisivel.getMonth();
  const diaSelecionado = dataSelecionada.getDate();

  function mudarMes(direcao: number) {
    const novoMes = new Date(ano, mes + direcao, 1);
    definirMesVisivel(novoMes);
    definirDataSelecionada(new Date(novoMes.getFullYear(), novoMes.getMonth(), 1));
  }

  // Os dados atuais de comunicados não fornecem uma data normalizada para montar a agenda.
  const comunicadosDoDia: { id: string; horario: string; titulo: string; categoria: string }[] = [];

  return (
    <EstruturaInstitucional paginaAtiva="comunicados" aoNavegar={aoNavegar}>
      <main className="comunicados-pagina">
        <CabecalhoDePagina
          className="comunicados-titulo-principal"
          titulo="Comunicados"
          subtitulo="Acompanhe os comunicados publicados pela instituição."
        />

        <div className="comunicados-area">
          <section className="comunicados-lista-painel" aria-label="Lista de comunicados">
            <AbasSegmentadas
              className="comunicados-categoria-abas"
              itens={abasCategorias}
              valor={categoriaAtiva}
              aoMudar={definirCategoriaAtiva}
            />

            <div className="comunicados-lista-ferramentas">
              <label className="comunicados-busca">
                <img src={iconeBusca} alt="" />
                <input type="search" value={busca} onChange={(evento) => definirBusca(evento.target.value)} placeholder="Buscar comunicado" />
              </label>
              <button type="button" className="comunicados-principal-botao" onClick={aoCriarComunicado}>
                Novo comunicado
              </button>
            </div>

            <div className="comunicados-lista">
              {!fonteDisponivel() && <p className="comunicados-vazio">Configure VITE_API_BASE_URL no modo API para consultar comunicados.</p>}
              {carregando && <p className="comunicados-vazio">Carregando comunicados...</p>}
              {erro && <p role="alert" className="comunicados-vazio">{erro}</p>}
              {comunicadosFiltrados.map((comunicado) => (
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
                  <span className="comunicados-situacao">Sem status</span>
                  <div className="comunicados-lista-acoes">
                    <button type="button" className="comunicados-acao-botao" onClick={() => definirOcultos((lista) => [...lista, comunicado.id])}>
                      <img src={iconeOcultar} alt="" /> Ocultar
                    </button>
                    <button type="button" className="comunicados-acao-botao" disabled title="Aguardando integração com o backend">
                      <img src={iconeReenviar} alt="" /> Reenviar
                    </button>
                  </div>
                  <img className="comunicados-item-seta" src={iconeSeta} alt="" />
                </article>
              ))}
              {!carregando && !erro && fonteDisponivel() && comunicadosFiltrados.length === 0 && (
                <p className="comunicados-vazio">Nenhum comunicado cadastrado ou encontrado.</p>
              )}
            </div>
          </section>

          <aside className="comunicados-calendario-painel">
            <CalendarioPequeno
              className="comunicados-pequeno-calendario"
              titulo="Calendário"
              iconeDoTitulo={<img src={iconeCalendario} alt="" />}
              tamanhoDoIconeDoTitulo={36}
              mesExibido={`${meses[mes]} ${ano}`}
              semanas={criarSemanas(ano, mes)}
              diaSelecionado={diaSelecionado}
              diaDeHoje={hoje.getMonth() === mes && hoje.getFullYear() === ano ? hoje.getDate() : undefined}
              diasComEvento={[]}
              aoSelecionarDia={(dia) => definirDataSelecionada(new Date(ano, mes, dia))}
              aoVoltarMes={() => mudarMes(-1)}
              aoAvancarMes={() => mudarMes(1)}
              iconeAnterior={<img src={iconeSeta} alt="" />}
              iconeProximo={<img src={iconeSeta} alt="" />}
              tituloDosEventos="Comunicados do dia"
              dataDosEventos={`${diaSelecionado} de ${meses[mes].toLowerCase()} de ${ano}`}
              eventos={comunicadosDoDia}
              mensagemSemEventos={carregando ? "Carregando comunicados..." : erro || "Nenhum comunicado nesta data."}
            />
          </aside>
        </div>
      </main>
    </EstruturaInstitucional>
  );
}

export default Comunicados;
