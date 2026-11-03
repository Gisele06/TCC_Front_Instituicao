import { useEffect, useState } from "react";
import { carregarEventos, type Evento } from "../Eventos/data/eventos";
import { fonteDisponivel } from "../../services/recursos";
import { carregarPainelHome, type PainelHome } from "../../services/indicadores";
import GraficoHome from "./components/GraficoHome";
import iconeSetaCima from "../../assets/icons/Geral/seta-cima.png";
import EstruturaInstitucional from "../../components/Geral/InstitutionFrame/InstitutionFrame";
import FaixaDeDestaque from "../../components/Geral/HeroBanner/HeroBanner";
import CartaoDeIndicador from "../../components/Geral/StatCard/StatCard";
import CartaoDeLista from "../../components/Geral/ListItemCard/ListItemCard";

import iconeSetaDireita from "../../assets/icons/Geral/chevron-right.png";
import iconeSorriso from "../../assets/icons/Geral/sorriso.png";
import iconePessoas from "../../assets/icons/Geral/pessoas.png";
import imagemDeMontanhas from "../../assets/images/Home/hero-mountains.png";
import iconeCoracao from "../../assets/icons/Geral/coracao.png";
import iconeBarras from "../../assets/icons/Home/barras.png";
import iconeCalendarioComPontos from "../../assets/icons/Home/calendario-pontos.png";
import iconeTituloCalendario from "../../assets/icons/Geral/calendario-titulo.png";
import iconeHistorico from "../../assets/icons/Home/historico.png";
import iconeMensagem from "../../assets/icons/Home/mensagem.png";
import iconeComunidade from "../../assets/icons/Home/comunidade.png";
import iconeNota from "../../assets/icons/Home/nota.png";
import iconeRaio from "../../assets/icons/Home/raio.png";

import "./Home.css";

function EtiquetaDeData({ dia, mes }: { dia: string; mes: string }) {
  return (
    <div className="inicio-data-selo">
      <span className="inicio-data-selo-dia">{dia}</span>
      <span className="inicio-data-selo-mes">{mes}</span>
    </div>
  );
}

function TituloDoPainel({ icone, texto }: { icone?: string; texto: string }) {
  return (
    <span className="inicio-painel-titulo">
      {icone && <img src={icone} alt="" />}
      {texto}
    </span>
  );
}

function IconeDeLocal() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s8-6.2 8-13a8 8 0 1 0-16 0c0 6.8 8 13 8 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

interface PropriedadesInicio {
  aoNavegar: (pagina: string) => void;
  aoCriarEvento: () => void;
}

function Inicio({ aoNavegar, aoCriarEvento }: PropriedadesInicio) {
  const acoesRapidas = [
    { rotulo: "Avaliações do dia", icone: iconeHistorico },
    { rotulo: "Enviar mensagem", icone: iconeMensagem },
    { rotulo: "Locais de acolhimento", icone: iconeComunidade },
    { rotulo: "Criar evento", icone: iconeCalendarioComPontos },
    { rotulo: "Criar turma", icone: iconeNota },
  ];

  const [eventos, definirEventos] = useState<Evento[]>([]);
  const [painel, definirPainel] = useState<PainelHome | null>(null);

  useEffect(() => {
    let ativo = true;
    carregarPainelHome()
      .then((dados) => { if (ativo) definirPainel(dados); })
      .catch(() => { if (ativo) definirPainel(null); });
    return () => { ativo = false; };
  }, []);

  const [erro, definirErro] = useState("");
  const [carregando, definirCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    carregarEventos()
      .then((lista) => { if (ativo) definirEventos(lista); })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar eventos.");
      })
      .finally(() => { if (ativo) definirCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const hoje = new Date();
  const eventosDoMes = eventos.filter((evento) => {
    const [ano, mes] = evento.data.split("-").map(Number);
    return ano === hoje.getFullYear() && mes === hoje.getMonth() + 1;
  }).length;
  const eventosRecentes = [...eventos]
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3)
    .map((evento) => {
      const [, mes, dia] = evento.data.split("-");
      const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
      return {
        id: evento.id,
        dia,
        mes: meses[Number(mes) - 1] ?? "—",
        titulo: evento.titulo,
        informacao: `${evento.horaInicio} - ${evento.horaFim}`,
        local: evento.local,
      };
    });

  const dadosRecentes = [
    { rotulo: "Total de alunos", valor: painel ? String(painel.totais.alunos) : "—", icone: iconeHistorico },
    { rotulo: "Avaliações realizadas", valor: painel ? String(painel.totais.avaliacoes) : "—", icone: iconeNota },
    { rotulo: "Eventos neste mês", valor: fonteDisponivel() && !erro && !carregando ? String(eventosDoMes) : "—", icone: iconeCalendarioComPontos },
    { rotulo: "Mensagens enviadas", valor: painel ? String(painel.totais.mensagens) : "—", icone: iconeMensagem },
  ];

  return (
    <EstruturaInstitucional paginaAtiva="inicio" aoNavegar={aoNavegar}>
      <div className="inicio-conteudo">
        <div className="inicio-superior-secao">
          <div className="inicio-superior-esquerdo">
            <FaixaDeDestaque
              textoAcimaDoTitulo="Bem-vindo de volta,"
              tituloDeBoasVindas="Olá! Bem-vindo ao Bloom"
              textoDeBoasVindas="Acompanhe as atividades da sua instituição."
              imagemDeFundo={<img src={imagemDeMontanhas} alt="" />}
            />

            <div className="inicio-indicadores">
              <CartaoDeIndicador
                icone={<img src={iconeSorriso} alt="" />}
                rotulo="Índice bem-estar"
                textoDoSelo={painel?.bemEstar.selo ?? "Sem dados"}
                estiloDoSelo={painel ? "bom" : "neutro"}
                valor={painel?.bemEstar.valor ?? "—"}
                textoDaVariacao={painel?.bemEstar.variacao ?? "Aguardando métricas da API"}
                iconeDaVariacao={painel ? <img src={iconeSetaCima} alt="" /> : undefined}
                iconeSeta={<img src={iconeSetaDireita} alt="" />}
              />
              <CartaoDeIndicador
                icone={<img src={iconePessoas} alt="" />}
                rotulo="Participação"
                textoDoSelo={painel?.participacao.selo ?? "Sem dados"}
                estiloDoSelo={painel ? "bom" : "neutro"}
                valor={painel?.participacao.valor ?? "—"}
                textoDaVariacao={painel?.participacao.variacao ?? "Aguardando métricas da API"}
                iconeDaVariacao={painel ? <img src={iconeSetaCima} alt="" /> : undefined}
                iconeSeta={<img src={iconeSetaDireita} alt="" />}
              />
              <CartaoDeIndicador
                icone={<img src={iconeCoracao} alt="" />}
                rotulo="Turmas em atenção"
                textoDoSelo={painel?.turmasEmAtencao.selo ?? "Sem dados"}
                estiloDoSelo={painel ? "aviso" : "neutro"}
                valor={painel?.turmasEmAtencao.valor ?? "—"}
                textoDaVariacao={painel?.turmasEmAtencao.variacao ?? "Aguardando métricas da API"}
                iconeSeta={<img src={iconeSetaDireita} alt="" />}
              />
            </div>
          </div>

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
                  {acao.rotulo === "Criar evento" ? (
                    <button
                      className="inicio-rapida-acao-botao"
                      type="button"
                      onClick={aoCriarEvento}
                    >
                      <span>{acao.rotulo}</span>
                      <img src={iconeSetaDireita} alt="" />
                    </button>
                  ) : (
                    <div className="inicio-rapida-acao-botao">
                      <span>{acao.rotulo}</span>
                      <img src={iconeSetaDireita} alt="" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="inicio-inferior">
          <div className="inicio-painel inicio-grafico-cartao">
            <div className="inicio-painel-cabecalho">
              <TituloDoPainel icone={iconeBarras} texto="Visão geral" />
              <span className="inicio-grafico-periodo">Últimos 30 dias <span aria-hidden="true">⌄</span></span>
            </div>

            {painel ? (
              <GraficoHome dados={painel.grafico} />
            ) : (
              <div className="inicio-grafico-sem-dados" role="status">
                O gráfico será exibido quando o backend disponibilizar os indicadores.
              </div>
            )}

            <div className="inicio-grafico-legenda">
              <span className="inicio-grafico-legenda-item">
                <span className="inicio-grafico-ponto inicio-grafico-ponto-verde"></span>
                Bem-estar
              </span>
              <span className="inicio-grafico-legenda-item">
                <span className="inicio-grafico-ponto inicio-grafico-ponto-azul"></span>
                Participação
              </span>
              <span className="inicio-grafico-legenda-item">
                <span className="inicio-grafico-ponto inicio-grafico-ponto-roxo"></span>
                Turmas em atenção
              </span>
            </div>
          </div>

          <div className="inicio-painel inicio-eventos-cartao">
            <div className="inicio-painel-cabecalho">
              <TituloDoPainel
                icone={iconeCalendarioComPontos}
                texto="Eventos"
              />
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
              {eventosRecentes.map((evento) => (
                <div className="inicio-evento-linha" key={evento.id}>
                  <EtiquetaDeData dia={evento.dia} mes={evento.mes} />
                  <div className="inicio-evento-detalhes">
                    <span className="inicio-evento-titulo">
                      {evento.titulo}
                    </span>
                    <span className="inicio-evento-informacao">
                      {evento.informacao}
                    </span>
                    <span className="inicio-evento-local">
                      <IconeDeLocal />
                      {evento.local}
                    </span>
                  </div>
                  <img
                    className="inicio-evento-seta"
                    src={iconeSetaDireita}
                    alt=""
                  />
                </div>
              ))}
              {carregando && <p>Carregando eventos...</p>}
              {erro && <p role="alert">{erro}</p>}
              {!carregando && !erro && eventosRecentes.length === 0 && <p>Nenhum evento cadastrado.</p>}
            </div>
          </div>

          <div className="inicio-painel inicio-dados-recentes">
            <div className="inicio-painel-cabecalho">
              <TituloDoPainel
                icone={iconeTituloCalendario}
                texto="Dados recentes"
              />
            </div>
            <div className="inicio-painel-lista">
              {dadosRecentes.map((dado) => (
                <CartaoDeLista
                  key={dado.rotulo}
                  iconeInicial={dado.icone && <img src={dado.icone} alt="" />}
                  tamanhoDoIconeInicial={32}
                  titulo={dado.rotulo}
                  conteudoFinal={<span>{dado.valor}</span>}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </EstruturaInstitucional>
  );
}

export default Inicio;
